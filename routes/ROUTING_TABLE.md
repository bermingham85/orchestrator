# ROUTING TABLE

## Direct Routes

| From | To | Method | Endpoint |
|------|-----|--------|----------|
| CW | n8n | HTTP | https://n8n.bermech.com/webhook/* |
| CW | Memory | HTTP | https://memory.bermech.com |
| CD | n8n | HTTP | http://192.168.50.246:5678 |
| CD | Memory | HTTP | http://localhost:8765 |
| GPT | n8n | HTTP | https://n8n.bermech.com |
| GPT | Memory | HTTP | https://memory.bermech.com |
| n8n | ALL | HTTP | Direct |

## Buddy Routes

| From | To | Via | Method |
|------|-----|-----|--------|
| CW | CD | n8n or Sheets | Task queue |
| CW | GPT | Sheets | Task queue |
| CD | CW | Sheets | Task queue |
| CD | GPT | Sheets | Task queue |
| GPT | CW | Sheets | Task queue |
| GPT | CD | n8n | Webhook |

## Fallback Chain

1. Direct route
2. n8n webhook
3. Google Sheets TASK_QUEUE
4. GitHub commit to tasks/pending/
