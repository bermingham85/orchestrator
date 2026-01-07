# Claude Desktop (CD)

## Capabilities
- Full local filesystem access
- MCP servers (local and remote)
- Run Python, Node, bash locally
- Git operations
- Access localhost services

## Cannot Do
- Web search (no tool)
- Direct communication with CW or GPT

## Routes
| Target | Method | Endpoint |
|--------|--------|----------|
| n8n | HTTP/MCP | http://192.168.50.246:5678 or https://n8n.bermech.com |
| Memory API | HTTP | http://localhost:8765 |
| GitHub | git CLI | gh repo, git push |
| Sheets | API | Via MCP |

## Buddy Requests
When you need web search, create task for CW via Sheets or GitHub.
