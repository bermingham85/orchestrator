# Claude Web (CW)

## Capabilities
- Web search via tool
- MCP server connections (public URLs only)
- Artifact creation (HTML, React, code)
- File creation (docx, pptx, xlsx, pdf)
- API calls to public endpoints

## Cannot Do
- Access localhost
- Read local filesystem
- Run local Python/scripts
- Direct git operations

## Routes
| Target | Method | Endpoint |
|--------|--------|----------|
| n8n | HTTP POST | https://n8n.bermech.com/webhook/* |
| Memory API | HTTP | https://memory.bermech.com |
| GitHub | API | Via MCP or web_fetch |
| Sheets | API | Via MCP |

## Buddy Requests
When you need local access, create task for CD:
```json
{"source": "CW", "target": "CD", "action": "...", "payload": {...}}
```
Route via: n8n webhook or GitHub commit
