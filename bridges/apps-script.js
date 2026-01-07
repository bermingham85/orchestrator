/**
 * ORCHESTRATOR_HQ - Google Apps Script
 * Universal bridge for cross-platform task routing
 * 
 * SETUP:
 * 1. Create Google Sheet with tabs: TASK_QUEUE, ROUTES, SESSION_LOG, CONFIG
 * 2. Extensions > Apps Script > Paste this code
 * 3. Set N8N_WEBHOOK in CONFIG tab or script properties
 * 4. Run setupTriggers() once to enable automation
 */

// ============ CONFIGURATION ============

function getConfig() {
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CONFIG');
  if (!configSheet) {
    return {
      N8N_WEBHOOK: 'https://n8n.bermech.com/webhook/task-dispatcher',
      MEMORY_API: 'https://memory.bermech.com',
      POLL_INTERVAL: 1, // minutes
      ENABLED: true
    };
  }
  
  const data = configSheet.getDataRange().getValues();
  const config = {};
  data.forEach(row => { if(row[0]) config[row[0]] = row[1]; });
  return config;
}

// ============ TRIGGERS ============

function setupTriggers() {
  // Remove existing triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  // On edit trigger (instant)
  ScriptApp.newTrigger('onTaskEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  
  // Time-based polling (backup)
  ScriptApp.newTrigger('pollPendingTasks')
    .timeBased()
    .everyMinutes(1)
    .create();
  
  Logger.log('Triggers configured');
}

// ============ TASK PROCESSING ============

function onTaskEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    if (sheet.getName() !== 'TASK_QUEUE') return;
    
    const row = e.range.getRow();
    if (row === 1) return; // Header row
    
    const status = sheet.getRange(row, 5).getValue();
    if (status === 'PENDING') {
      processTask(row);
    }
  } catch (err) {
    logError('onTaskEdit', err);
  }
}

function pollPendingTasks() {
  const config = getConfig();
  if (!config.ENABLED) return;
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TASK_QUEUE');
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === 'PENDING') {
      processTask(i + 1);
    }
  }
}

function processTask(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TASK_QUEUE');
  const config = getConfig();
  
  // Get task data
  // Columns: task_id, source, target, payload, status, created, claimed_by, completed, result
  const rowData = sheet.getRange(row, 1, 1, 9).getValues()[0];
  
  const task = {
    task_id: rowData[0],
    source: rowData[1],
    target: rowData[2],
    payload: rowData[3],
    status: rowData[4],
    created: rowData[5]
  };
  
  // Mark as DISPATCHING
  sheet.getRange(row, 5).setValue('DISPATCHING');
  
  try {
    // Route based on target
    const result = routeTask(task, config);
    
    // Update status
    sheet.getRange(row, 5).setValue('DISPATCHED');
    sheet.getRange(row, 9).setValue(JSON.stringify(result));
    
    logSession('DISPATCH_SUCCESS', task.task_id, task.target);
    
  } catch (err) {
    sheet.getRange(row, 5).setValue('FAILED');
    sheet.getRange(row, 9).setValue('ERROR: ' + err.message);
    logError('processTask', err, task.task_id);
  }
}

function routeTask(task, config) {
  const routes = getRoutes();
  const route = routes[task.target] || routes['DEFAULT'];
  
  switch (route.method) {
    case 'N8N_WEBHOOK':
      return callN8nWebhook(task, config);
    
    case 'MEMORY_API':
      return callMemoryApi(task, config);
    
    case 'DIRECT_HTTP':
      return callDirectHttp(task, route.url);
    
    case 'GITHUB_DISPATCH':
      return triggerGithubAction(task);
    
    default:
      throw new Error('Unknown route method: ' + route.method);
  }
}

// ============ ROUTING METHODS ============

function callN8nWebhook(task, config) {
  const response = UrlFetchApp.fetch(config.N8N_WEBHOOK, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(task),
    muteHttpExceptions: true
  });
  
  return {
    status: response.getResponseCode(),
    body: response.getContentText()
  };
}

function callMemoryApi(task, config) {
  const response = UrlFetchApp.fetch(config.MEMORY_API + '/api/tasks', {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(task),
    muteHttpExceptions: true
  });
  
  return {
    status: response.getResponseCode(),
    body: response.getContentText()
  };
}

function callDirectHttp(task, url) {
  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(task),
    muteHttpExceptions: true
  });
  
  return {
    status: response.getResponseCode(),
    body: response.getContentText()
  };
}

function triggerGithubAction(task) {
  // Requires GitHub token in script properties
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const repo = PropertiesService.getScriptProperties().getProperty('GITHUB_REPO') || 'berminghammchl/orchestrator';
  
  const response = UrlFetchApp.fetch(
    `https://api.github.com/repos/${repo}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json'
      },
      contentType: 'application/json',
      payload: JSON.stringify({
        event_type: 'task_dispatch',
        client_payload: task
      }),
      muteHttpExceptions: true
    }
  );
  
  return {
    status: response.getResponseCode(),
    body: response.getContentText()
  };
}

// ============ ROUTES CONFIGURATION ============

function getRoutes() {
  const routeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ROUTES');
  
  // Default routes if sheet doesn't exist
  const defaultRoutes = {
    'N8N': { method: 'N8N_WEBHOOK' },
    'GPT': { method: 'N8N_WEBHOOK' },  // Route through n8n
    'CW': { method: 'N8N_WEBHOOK' },   // Route through n8n
    'CD': { method: 'N8N_WEBHOOK' },   // Route through n8n
    'MEMORY': { method: 'MEMORY_API' },
    'GITHUB': { method: 'GITHUB_DISPATCH' },
    'DEFAULT': { method: 'N8N_WEBHOOK' }
  };
  
  if (!routeSheet) return defaultRoutes;
  
  // Parse routes from sheet
  const data = routeSheet.getDataRange().getValues();
  const routes = {};
  
  for (let i = 1; i < data.length; i++) {
    routes[data[i][0]] = {
      method: data[i][1],
      url: data[i][2] || null
    };
  }
  
  return { ...defaultRoutes, ...routes };
}

// ============ LOGGING ============

function logSession(action, taskId, details) {
  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SESSION_LOG');
  if (!logSheet) return;
  
  logSheet.appendRow([
    new Date(),
    action,
    taskId || '',
    details || ''
  ]);
}

function logError(func, error, context) {
  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SESSION_LOG');
  if (!logSheet) {
    Logger.log('ERROR in ' + func + ': ' + error.message);
    return;
  }
  
  logSheet.appendRow([
    new Date(),
    'ERROR',
    func,
    error.message + (context ? ' | Context: ' + context : '')
  ]);
}

// ============ UTILITY FUNCTIONS ============

function createTask(source, target, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TASK_QUEUE');
  const taskId = 'T' + Date.now();
  
  sheet.appendRow([
    taskId,
    source,
    target,
    typeof payload === 'object' ? JSON.stringify(payload) : payload,
    'PENDING',
    new Date(),
    '',
    '',
    ''
  ]);
  
  return taskId;
}

// Web app endpoint for external task creation
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const taskId = createTask(data.source, data.target, data.payload);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      task_id: taskId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'status') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TASK_QUEUE');
    const taskId = e.parameter.task_id;
    
    const data = sheet.getDataRange().getValues();
    const task = data.find(row => row[0] === taskId);
    
    if (task) {
      return ContentService.createTextOutput(JSON.stringify({
        task_id: task[0],
        status: task[4],
        result: task[8]
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    error: 'Unknown action or task not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============ INITIALIZATION ============

function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // TASK_QUEUE
  let sheet = ss.getSheetByName('TASK_QUEUE');
  if (!sheet) {
    sheet = ss.insertSheet('TASK_QUEUE');
    sheet.appendRow(['task_id', 'source', 'target', 'payload', 'status', 'created', 'claimed_by', 'completed', 'result']);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }
  
  // ROUTES
  sheet = ss.getSheetByName('ROUTES');
  if (!sheet) {
    sheet = ss.insertSheet('ROUTES');
    sheet.appendRow(['target', 'method', 'url']);
    sheet.appendRow(['N8N', 'N8N_WEBHOOK', '']);
    sheet.appendRow(['MEMORY', 'MEMORY_API', '']);
    sheet.appendRow(['DEFAULT', 'N8N_WEBHOOK', '']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  
  // SESSION_LOG
  sheet = ss.getSheetByName('SESSION_LOG');
  if (!sheet) {
    sheet = ss.insertSheet('SESSION_LOG');
    sheet.appendRow(['timestamp', 'action', 'task_id', 'details']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  
  // CONFIG
  sheet = ss.getSheetByName('CONFIG');
  if (!sheet) {
    sheet = ss.insertSheet('CONFIG');
    sheet.appendRow(['N8N_WEBHOOK', 'https://n8n.bermech.com/webhook/task-dispatcher']);
    sheet.appendRow(['MEMORY_API', 'https://memory.bermech.com']);
    sheet.appendRow(['POLL_INTERVAL', '1']);
    sheet.appendRow(['ENABLED', 'TRUE']);
  }
  
  Logger.log('Sheet initialized');
}
