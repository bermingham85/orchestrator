# ROUTING TABLE

How to get from A to B. Check this before attempting any cross-platform communication.

---

## Quick Lookup

| FROM | TO | Primary Route | Fallback 1 | Fallback 2 |
|------|-----|---------------|------------|------------|
| CW | CD | Memory API queue | Sheets task | GitHub commit |
| CW | GPT | Memory API queue | Sheets task | Handover doc |
| CW | N8N | Direct webhook | Sheets trigger | GitHub Action |
| CW | QNAP | Via n8n | Via CD | - |
| CD | CW | Memory API queue | Sheets task | Handover doc |
| CD | GPT | Memory API queue | Sheets task | Handover doc |
| CD | N8N | Direct local HTTP | MCP | Sheets |
| CD | QNAP | Direct SSH/MCP | Via n8n | - |
| GPT | CW | Memory API queue | Sheets task | Handover doc |
| GPT | CD | Memory API queue | Sheets task | GitHub commit |
| GPT | N8N | Webhook (tunnel) | MCP (tunnel) | Sheets |
| N8N | CW | Memory API queue | Sheets update | GitHub commit |
| N8N | CD | Memory API queue | Sheets update | GitHub commit |
| N8N | GPT | Memory API queue | Sheets update | GitHub commit |
| N8N | QNAP | Direct local | SSH | - |
| ANY | ANY | n8n hub | Sheets | GitHub |

---

## Route Details

### Claude Web → Claude Desktop

**Primary: Memory API Queue**
```javascript
// CW creates task
fetch('https://memory.bermech.com/api/tasks', {
  method: 'POST',
  body: JSON.stringify({
    task_id: `T${Date.now()}`,
    source: 'CW',
    target: 'CD',
    action: 'run_local_script',
    payload: { script: '...' }
  })
});
// CD polls memory API and picks up task
```

**Fallback 1: Google Sheets**
```
1. CW writes to ORCHESTRATOR_HQ → TASK_QUEUE tab
2. Apps Script triggers on edit
3. Apps Script calls n8n webhook
4. n8n queues for CD in memory API
5. CD polls and executes
```

**Fallback 2: GitHub**
```
1. CW asks n8n to commit task file
2. n8n commits to orchestrator/tasks/pending/
3. GitHub Action dispatches
4. CD pulls repo and finds task
```

---

### Claude Web → ChatGPT

**Primary: Memory API Queue**
```javascript
// CW creates task
fetch('https://memory.bermech.com/api/tasks', {
  method: 'POST',
  body: JSON.stringify({
    task_id: `T${Date.now()}`,
    source: 'CW',
    target: 'GPT',
    action: 'generate_image',
    payload: { prompt: '...' }
  })
});
// GPT polls https://memory.bermech.com/api/tasks?target=GPT
```

**Fallback: Handover Document**
```markdown
## HANDOVER: CW → GPT

**Task ID:** T1704628800000
**Action:** Generate image with DALL-E
**Prompt:** [description]
**Return:** POST result to https://memory.bermech.com/api/tasks/T1704628800000/complete
```

---

### Claude Web → n8n

**Primary: Direct Webhook**
```javascript
fetch('https://n8n.bermech.com/webhook/task-dispatcher', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task_id: `T${Date.now()}`,
    source: 'CW',
    target: 'N8N',
    action: 'execute_workflow',
    payload: { workflow: 'send-email', params: {...} }
  })
});
```

**Fallback: Sheets Trigger**
```
Write to ORCHESTRATOR_HQ with target=N8N
Apps Script detects and calls n8n webhook
```

---

### Claude Desktop → n8n

**Primary: Direct Local HTTP**
```python
import requests
requests.post('http://192.168.50.246:5678/webhook/task-dispatcher', json=task)
```

**Fallback: MCP**
```python
# Using MCP filesystem to write trigger file
# n8n watches directory
```

---

### ChatGPT → n8n

**Primary: Webhook via Tunnel**
```python
import requests
requests.post('https://n8n.bermech.com/webhook/task-dispatcher', json=task)
```

**Fallback: MCP (if configured)**
```
Use n8n MCP server at https://n8n.bermech.com/mcp
```

---

### n8n → Any AI Platform

**Method: Memory API Queue**
```javascript
// n8n HTTP Request node
POST http://192.168.50.100:8765/api/tasks
{
  "task_id": "T...",
  "source": "N8N",
  "target": "CW",  // or "CD" or "GPT"
  "action": "...",
  "payload": {...}
}
// AI platform polls and picks up
```

---

## Special Routes

### Anything → Local File Operation
```
Route: → n8n → CD
Reason: Only CD has local filesystem access
```

### Anything → Web Search
```
Route: → CW (or GPT)
Reason: Only these have native web search
```

### Anything → Image Generation
```
Route: → GPT
Reason: DALL-E only available in ChatGPT
```

### Anything → Scheduled Execution
```
Route: → n8n
Reason: Only n8n has cron scheduling
```

### Anything → Database Query (local)
```
Route: → CD or n8n
Reason: Need local network access
```

---

## Tunnel Requirements

These routes require Cloudflare tunnel to be working:

| Source | Target | Tunnel Needed |
|--------|--------|---------------|
| GPT | Memory API | memory.bermech.com |
| GPT | n8n | n8n.bermech.com |
| CW | Memory API | memory.bermech.com |
| External | Any local | *.bermech.com |

If tunnel is down:
1. ChatGPT loses direct access → Use Sheets/GitHub fallback
2. Claude Web uses GitHub as fallback for context

---

## Emergency Routes

When primary infrastructure is down:

**Memory API Down:**
- Read: GitHub raw files
- Write: Commit to GitHub via n8n or API

**n8n Down:**
- Route through Sheets → Apps Script → direct API calls
- Or manual execution

**All Bridges Down:**
- Save tasks locally
- Generate handover documents for manual transfer
- Resume when infrastructure recovers

---

## Route Health Check

Run periodically to verify routes:

```bash
# Memory API
curl -s https://memory.bermech.com/health

# n8n
curl -s https://n8n.bermech.com/healthz

# GitHub
curl -s https://api.github.com/repos/berminghammchl/orchestrator

# Sheets (via Apps Script web app)
curl -s "https://script.google.com/macros/s/.../exec?action=health"
```
