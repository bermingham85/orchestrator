# n8n (N8N)

Platform: n8n automation (self-hosted on QNAP)

---

## Role

**Universal routing hub.** n8n can reach everything and acts as proxy for platforms that can't.

---

## Capabilities

### Can Do
- Webhook triggers (instant)
- Scheduled execution (cron)
- HTTP requests to any URL
- Local network access (QNAP, Windows PC)
- Cloud API integrations (Google, GitHub, etc.)
- Database operations
- File operations on QNAP
- Email send/receive
- Transform and route data

### Acts as Buddy For
- **Everyone** - n8n is the universal proxy
- Localhost access for ChatGPT
- Scheduled tasks for all platforms
- API calls requiring secrets
- Multi-step automations

### Needs Buddy For
- Complex reasoning → Route to Claude/GPT
- Web search → Route to Claude Web
- Image generation → Route to ChatGPT

---

## Endpoints

| Endpoint | URL |
|----------|-----|
| Web UI | https://n8n.bermech.com |
| Local UI | http://192.168.50.246:5678 |
| Task Dispatcher | https://n8n.bermech.com/webhook/task-dispatcher |
| GitHub Proxy | https://n8n.bermech.com/webhook/github-commit |
| Sheets Proxy | https://n8n.bermech.com/webhook/sheets-update |
| Memory Proxy | https://n8n.bermech.com/webhook/memory-event |

---

## Core Workflows

### 1. Task Dispatcher
**Webhook:** `/webhook/task-dispatcher`

```
Input: { task_id, source, target, payload }
       ↓
   [Switch by target]
       ↓
   ┌─────┬─────┬─────┬─────┐
   CW    CD    GPT   MEM   OTHER
   ↓     ↓     ↓     ↓     ↓
 Queue  Queue Queue Direct Log+
 task   task  task  write  retry
```

### 2. GitHub Proxy
**Webhook:** `/webhook/github-commit`

```
Input: { repo, path, content, message }
       ↓
   [GitHub API]
       ↓
   Create/Update file
       ↓
   Return commit SHA
```

### 3. Sheets Proxy
**Webhook:** `/webhook/sheets-update`

```
Input: { sheet, tab, row, data }
       ↓
   [Google Sheets API]
       ↓
   Append/Update row
       ↓
   Return row number
```

### 4. Memory Event Logger
**Webhook:** `/webhook/memory-event`

```
Input: { event_type, source, data }
       ↓
   [POST to localhost:8765]
       ↓
   Log to memory API
       ↓
   Return confirmation
```

### 5. Scheduled Context Sync
**Trigger:** Every 5 minutes

```
   [Cron trigger]
       ↓
   Read memory.json from memory API
       ↓
   Commit to GitHub (if changed)
       ↓
   Update Sheets backup (if changed)
```

---

## Routing Logic

```javascript
// In Switch node
const target = $json.target.toUpperCase();

switch(target) {
  case 'CW':
    // Claude Web can't receive pushes - queue in memory API
    return { output: 0 }; // → Memory API queue
    
  case 'CD':
    // Claude Desktop polls memory API
    return { output: 0 }; // → Memory API queue
    
  case 'GPT':
    // ChatGPT polls memory API
    return { output: 0 }; // → Memory API queue
    
  case 'N8N':
    // Self - execute directly
    return { output: 1 }; // → Internal execution
    
  case 'MEMORY':
    // Direct write to memory API
    return { output: 2 }; // → Memory API direct
    
  case 'GITHUB':
    // Commit to repo
    return { output: 3 }; // → GitHub API
    
  case 'SHEETS':
    // Update spreadsheet
    return { output: 4 }; // → Sheets API
    
  default:
    // Unknown - log and queue for manual
    return { output: 5 }; // → Error handling
}
```

---

## Internal Network Access

n8n can reach these without tunnel:

| Service | Address |
|---------|---------|
| Memory API | http://192.168.50.100:8765 (Windows PC) |
| QNAP | http://192.168.50.246 |
| n8n itself | http://localhost:5678 |

---

## Credentials Stored

n8n manages API keys for:
- GitHub (PAT)
- Google (OAuth)
- OpenAI (optional)
- Cloudflare (optional)
- SMTP (email)

---

## Workflow Import

Workflows are stored in: `bridges/n8n-workflows/`

To import:
1. Open n8n UI
2. Settings → Import from file
3. Select workflow JSON

Key workflows:
- `task-dispatcher.json` - Main routing workflow
- `github-proxy.json` - Commit proxy
- `sheets-proxy.json` - Sheets proxy
- `context-sync.json` - Scheduled backup

---

## Error Handling

```javascript
// In Error Trigger node
const error = $json.error;
const task = $json.originalTask;

// Log to memory API
await $http.post('http://192.168.50.100:8765/api/errors', {
  task_id: task.task_id,
  error: error.message,
  timestamp: new Date().toISOString()
});

// Queue for retry with backoff
const retryCount = (task.retry_count || 0) + 1;
if (retryCount < 3) {
  // Re-queue with delay
  task.retry_count = retryCount;
  task.retry_after = Date.now() + (retryCount * 60000); // 1, 2, 3 min
  await $http.post('http://192.168.50.100:8765/api/tasks', task);
}
```

---

## Monitoring

Check n8n health:
```bash
curl https://n8n.bermech.com/healthz
```

Check execution history:
- n8n UI → Executions tab
- Filter by workflow, status, date

---

## Restart Procedure

If n8n becomes unresponsive:

1. SSH to QNAP or use Container Station
2. `docker restart n8n`
3. Verify: `curl http://192.168.50.246:5678/healthz`
4. Check tunnel: `curl https://n8n.bermech.com/healthz`
