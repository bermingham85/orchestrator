const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const DATA_DIR = path.join(__dirname, '..', '..', 'context');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Initialize files if they don't exist
const initFile = (name, defaultContent) => {
  const filePath = path.join(DATA_DIR, name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  }
};

initFile('memory.json', { projects: [], credentials: {}, recent_work: [] });
initFile('playbook.json', { pathways: {}, proven_commands: {} });
initFile('tasks.json', []);
initFile('events.json', []);

const readJSON = (name) => {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8')); }
  catch { return null; }
};

const writeJSON = (name, data) => {
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (req.method === 'GET' && pathname === '/context') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      memory: readJSON('memory.json'),
      playbook: readJSON('playbook.json'),
      instructions: 'Use playbook pathways before creating new solutions'
    }));
  }

  if (req.method === 'GET' && pathname === '/api/tasks') {
    const target = url.searchParams.get('target');
    let tasks = readJSON('tasks.json') || [];
    if (target) tasks = tasks.filter(t => t.target === target && t.status === 'PENDING');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(tasks));
  }

  if (req.method === 'POST' && pathname === '/api/tasks') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const task = JSON.parse(body);
        task.task_id = task.task_id || `T${Date.now()}`;
        task.status = task.status || 'PENDING';
        task.created = task.created || new Date().toISOString();
        const tasks = readJSON('tasks.json') || [];
        tasks.push(task);
        writeJSON('tasks.json', tasks);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, task_id: task.task_id }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname.match(/^\/api\/tasks\/[^/]+\/complete$/)) {
    const taskId = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const tasks = readJSON('tasks.json') || [];
      const task = tasks.find(t => t.task_id === taskId);
      if (task) {
        task.status = 'COMPLETED';
        task.completed = new Date().toISOString();
        try { task.result = JSON.parse(body); } catch { task.result = body; }
        writeJSON('tasks.json', tasks);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Task not found' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/memory/events') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        event.received = new Date().toISOString();
        const events = readJSON('events.json') || [];
        events.push(event);
        writeJSON('events.json', events);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/playbook/pathway') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, pathway, source } = JSON.parse(body);
        const playbook = readJSON('playbook.json') || { pathways: {}, proven_commands: {} };
        playbook.pathways[name] = { ...pathway, source, updated: new Date().toISOString() };
        writeJSON('playbook.json', playbook);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, name }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => console.log(`Memory API running on http://localhost:${PORT}`));
