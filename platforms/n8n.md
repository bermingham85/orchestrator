# n8n (N8N)

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
- Universal routing hub
- Webhook endpoints
- HTTP requests to any endpoint
- Scheduled automation
- Database connections
- All API integrations

## Routes
Can reach ALL platforms directly or via webhook chains.

## Key Webhooks
| Purpose | Endpoint |
|---------|----------|
| Task Dispatcher | /webhook/task-dispatcher |
| Memory Sync | /webhook/memory-sync |

## As Buddy
n8n is the default buddy for routing between platforms that can't reach each other directly.
