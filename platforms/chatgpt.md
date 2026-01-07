# ChatGPT (GPT)

Platform: ChatGPT (Plus/Pro/Business/Enterprise)

---

## Capabilities

### Can Do Directly
- Web browsing (native)
- DALL-E image generation
- Code Interpreter (Python in sandbox)
- MCP connections (requires public URLs)
- File uploads and processing
- Advanced reasoning

### Can Do Via Tunnel
- Access memory API: https://memory.bermech.com
- Access n8n: https://n8n.bermech.com
- Any service exposed via Cloudflare tunnel

### Cannot Do
- Access localhost (must use tunnel)
- Direct communication with Claude Web/Desktop
- Access private network resources without tunnel
- Persistent memory across sessions (use memory API)

### Acts as Buddy For
- Image generation (DALL-E)
- Code execution in sandbox
- Alternative reasoning perspective
- Plugins/GPT integrations

### Needs Buddy For
- Local file operations → Ask n8n or Claude Desktop
- Private network access → Ask n8n
- Persistent storage → Use memory API via tunnel

---

## MCP Configuration

In ChatGPT: Settings → Apps & Connectors → Developer Mode

Add MCP servers:
```
Name: Memory API
URL: https://memory.bermech.com/mcp

Name: n8n
URL: https://n8n.bermech.com/mcp
```

**Note:** MCP servers must be publicly accessible (use Cloudflare tunnel).

---

## Connection Methods

### To Memory API
```python
# Via tunnel
import requests
response = requests.get('https://memory.bermech.com/context')
```

Or use MCP tools if configured.

### To n8n
```python
# Direct webhook
requests.post('https://n8n.bermech.com/webhook/task-dispatcher', json=task)
```

Or use MCP tools if configured.

### To GitHub
```python
# Read public files
requests.get('https://raw.githubusercontent.com/berminghammchl/orchestrator/main/context/memory.json')

# For writes, use n8n as proxy
requests.post('https://n8n.bermech.com/webhook/github-commit', json={
    'repo': 'orchestrator',
    'path': 'tasks/completed/T123.json',
    'content': result_json
})
```

### To Google Sheets
```python
# Via n8n webhook
requests.post('https://n8n.bermech.com/webhook/sheets-update', json=data)
```

### To Claude Web / Claude Desktop
```markdown
## HANDOVER: GPT → CW

**Task ID:** T{timestamp}  
**Action Required:** [specific task]
**Context:** [minimal needed]
**Return Method:** 
- POST to https://memory.bermech.com/api/tasks/{task_id}/complete
- Or: User copy/paste this handover doc
```

---

## Startup Sequence

1. Check if MCP available:
   - If MCP tools show in interface → Use them

2. Otherwise fetch via HTTP:
   ```python
   ctx = requests.get('https://memory.bermech.com/context').json()
   ```

3. If tunnel down, read from GitHub:
   ```python
   memory = requests.get('https://raw.githubusercontent.com/berminghammchl/orchestrator/main/context/memory.json').json()
   ```

4. Check pending tasks:
   ```python
   tasks = requests.get('https://memory.bermech.com/api/tasks?target=GPT').json()
   ```

---

## Session End Sequence

1. Save session via tunnel:
   ```python
   requests.post('https://memory.bermech.com/api/events', json=session_summary)
   ```

2. If tunnel down, route through n8n:
   ```python
   requests.post('https://n8n.bermech.com/webhook/memory-event', json=session_summary)
   ```

3. Last resort: Ask user to save manually or commit to GitHub

---

## Buddy Operations

When asked to help Claude Web or Desktop:

1. Receive task via:
   - Memory API poll
   - Handover document from user
   - GitHub task file

2. Execute using ChatGPT capabilities:
   - DALL-E for images
   - Code Interpreter for Python
   - Web browse for research

3. Return result via:
   ```python
   requests.post('https://memory.bermech.com/api/tasks/{task_id}/complete', json=result)
   ```

---

## Tunnel Requirements

ChatGPT cannot access localhost. These services need Cloudflare tunnel:

| Service | Tunnel URL | Local Address |
|---------|------------|---------------|
| Memory API | memory.bermech.com | localhost:8765 |
| n8n | n8n.bermech.com | 192.168.50.246:5678 |

Setup: Add public hostname in Cloudflare Zero Trust → Tunnels

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Tunnel down | Read-only from GitHub, queue tasks |
| MCP not working | Fall back to HTTP requests |
| n8n unreachable | Queue in Sheets via Apps Script web app |
| All bridges down | Generate handover doc for user |

---

## Limitations to Remember

1. **No persistent memory** - Always load from memory API at start
2. **Sandbox only** - Code Interpreter can't access real filesystem
3. **Public URLs only** - Everything needs to go through tunnel
4. **Session isolation** - Each conversation starts fresh
