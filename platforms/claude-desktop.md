# Claude Desktop (CD)

## ⚠️ MANDATORY GOVERNANCE REVIEW AT CONVERSATION START

**BEFORE ANY TASK EXECUTION:**
1. Review `C:\Users\bermi\Projects\ai-governance\GLOBAL_AI_RULES.md` (RULE 12-16)
2. Review `C:\Users\bermi\Projects\ai-governance\HANDOVER_PROTOCOL.md`
3. Confirm understanding of role separation, handover protocols, and error routing

**GOVERNANCE IS MANDATORY** unless user explicitly approves deviation with clear, simple reason.

**User Override Format:**
"Skip governance for [simple reason] because [clear benefit]"

Without explicit override, ALL governance processes apply.

---

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
