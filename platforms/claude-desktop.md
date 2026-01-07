# Claude Desktop (CD)

Platform: Claude Desktop application with MCP

---

## Capabilities

### Can Do Directly
- Full local filesystem access
- Run Python, Node, bash scripts locally
- MCP connections to local servers
- Access localhost:8765 (memory API)
- Access 192.168.50.246:5678 (n8n)
- SSH to QNAP NAS
- Git operations (commit, push, pull)
- Read/write local databases
- Process local files of any type

### Cannot Do
- Web search (no native tool)
- Communicate directly with Claude Web
- Communicate directly with ChatGPT
- Access cloud services without API keys in env

### Acts as Buddy For
- Local file operations
- Python/script execution
- Localhost access
- Git commits
- Database queries
- File processing (PDF, Excel, etc.)

### Needs Buddy For
- Web search → Ask Claude Web or use n8n
- Cloud API calls without local keys → Ask n8n
- Real-time web data → Ask Claude Web

---

## MCP Servers Available

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-filesystem", "/home", "/projects"]
  },
  "memory": {
    "url": "http://localhost:8765/mcp"
  },
  "n8n": {
    "url": "http://192.168.50.246:5678/mcp"
  }
}
```

---

## Connection Methods

### To Memory API (localhost)
```python
import requests
response = requests.get('http://localhost:8765/context')
memory = response.json()
```

### To n8n (local network)
```python
requests.post('http://192.168.50.246:5678/webhook/task-dispatcher', json=task)
```

### To GitHub
```bash
cd /path/to/orchestrator
git pull
# Make changes
git add .
git commit -m "Task completed"
git push
```

### To Google Sheets
```python
# Via n8n (preferred)
requests.post('http://192.168.50.246:5678/webhook/sheets-update', json=data)

# Or direct with gspread
import gspread
gc = gspread.service_account()
sheet = gc.open("ORCHESTRATOR_HQ").sheet1
```

### To Claude Web / ChatGPT
```markdown
## HANDOVER: CD → CW

**Task ID:** T{timestamp}
**Action Required:** Web search for [topic]
**Return Method:** 
- POST result to http://localhost:8765/api/tasks/{task_id}/complete
- Or: Commit to orchestrator/tasks/completed/
```

---

## Startup Sequence

1. Load context directly:
   ```python
   import requests
   ctx = requests.get('http://localhost:8765/context').json()
   memory = ctx['memory']
   playbook = ctx['playbook']
   ```

2. If memory API down, read local files:
   ```python
   import json
   with open('C:/Users/bermi/.ai_context/memory.json') as f:
       memory = json.load(f)
   ```

3. Check pending tasks:
   ```python
   tasks = requests.get('http://localhost:8765/api/tasks?target=CD').json()
   ```

4. Or check local repo:
   ```bash
   ls /path/to/orchestrator/tasks/pending/*.json | xargs grep '"target": "CD"'
   ```

---

## Session End Sequence

1. Save session:
   ```python
   requests.post('http://localhost:8765/api/events', json=session_summary)
   ```

2. Commit any changes:
   ```bash
   cd /path/to/orchestrator
   git add .
   git commit -m "Session: [summary]"
   git push
   ```

3. Update playbook if new patterns discovered:
   ```python
   requests.post('http://localhost:8765/api/playbook/pathway', json=new_pathway)
   ```

---

## Buddy Operations

When acting as buddy for Claude Web or ChatGPT:

1. Check `tasks/pending/` for tasks targeting CD
2. Execute the requested operation
3. Write result to `tasks/completed/{task_id}.json`:
   ```json
   {
     "task_id": "T1704628800000",
     "status": "COMPLETED",
     "result": { ... },
     "completed_at": "2025-01-07T12:30:00Z",
     "executed_by": "CD"
   }
   ```
4. POST to memory API so requester can poll for result

---

## Local Paths

| Resource | Path |
|----------|------|
| Projects | C:\Users\bermi\Projects |
| AI Context | C:\Users\bermi\.ai_context |
| Master Prompts | C:\Users\bermi\Projects\MASTER_PROMPT_LIBRARY.md |
| Orchestrator Repo | C:\Users\bermi\Projects\orchestrator |

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Memory API down | Read/write local JSON files |
| n8n unreachable | Use local scripts instead |
| Git push fails | Save locally, retry later |
| Task too complex | Break into subtasks, delegate parts |
