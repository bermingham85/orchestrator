# ChatGPT (GPT)

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
- MCP servers (public URLs via tunnel)
- DALL-E image generation
- Code Interpreter
- Web browsing

## Cannot Do
- Access localhost directly (needs Cloudflare tunnel)
- Direct communication with CW or CD

## Routes
| Target | Method | Endpoint |
|--------|--------|----------|
| n8n | MCP/HTTP | https://n8n.bermech.com |
| Memory API | HTTP | https://memory.bermech.com |
| GitHub | API | Direct |
| Sheets | API | Direct |
