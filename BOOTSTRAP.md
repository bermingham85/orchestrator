# BOOTSTRAP

Universal startup sequence. Every platform runs this on session start.

---

## Step 1: Identify Yourself

Which platform are you?

| Platform | Code | Read Your Config |
|----------|------|------------------|
| Claude Web (claude.ai) | CW | [platforms/claude-web.md](platforms/claude-web.md) |
| Claude Desktop App | CD | [platforms/claude-desktop.md](platforms/claude-desktop.md) |
| ChatGPT | GPT | [platforms/chatgpt.md](platforms/chatgpt.md) |
| n8n | N8N | [platforms/n8n.md](platforms/n8n.md) |
| Other | OTH | Use generic routes |

---

## Step 2: Load Context

### Option A: Memory API Available
```
GET https://memory.bermech.com/context
```
Returns: `{ memory: {...}, playbook: {...} }`

### Option B: Memory API Unavailable
Read from this repo:
- `context/memory.json`
- `context/playbook.json`

### Option C: Both Unavailable
Ask buddy (n8n or Sheets) to fetch for you.

---

## Step 3: Check Your Capabilities

Read `platforms/capabilities.json` and find your platform.

```json
{
  "CW": {
    "can_reach": ["n8n", "github", "sheets", "memory_api_tunnel"],
    "cannot_reach": ["localhost", "CD", "GPT_direct"],
    "buddy_for": ["fetch_web", "create_artifacts"],
    "needs_buddy_for": ["local_files", "run_python_local"]
  }
}
```

---

## Step 4: Check Pending Tasks

### Tasks assigned to you:
```
GET https://memory.bermech.com/api/tasks?target={YOUR_CODE}
```

Or check: `tasks/pending/` in this repo for files with your code.

### Tasks you can help with (buddy):
Check if any pending task needs a capability you have.

---

## Step 5: Check Routes

Before doing anything, check `routes/ROUTING_TABLE.md`:

1. Is there a direct route? → Use it
2. Is there a proven pathway in playbook? → Use it
3. Need to reach something you can't? → Find buddy

---

## Step 6: Execute or Delegate

### If you CAN do the task:
1. Execute
2. Log result to `logs/sessions/YYYY-MM-DD.json` or POST to memory API
3. Update task status

### If you CANNOT do the task:
1. Find buddy from capabilities.json
2. Create task in `tasks/pending/{task_id}.json`:
```json
{
  "task_id": "T1704628800000",
  "source": "CW",
  "target": "CD",
  "action": "run_local_python",
  "payload": { "script": "..." },
  "status": "PENDING",
  "created": "2025-01-07T12:00:00Z",
  "buddy_chain": ["CW", "N8N", "CD"]
}
```
3. Commit or POST to dispatch

---

## Step 7: Session End

Before closing:

1. **Save new discoveries** to `context/playbook.json`
2. **Log session** to `logs/sessions/`
3. **Update any task statuses**
4. **Commit changes** (if you can) or POST to memory API

---

## Buddy System Flow

```
YOU ──can't reach──► TARGET
 │
 ▼
Check capabilities.json: Who CAN reach target?
 │
 ▼
BUDDY found (e.g., n8n)
 │
 ▼
Create task: { source: YOU, target: BUDDY, final_target: TARGET }
 │
 ▼
BUDDY executes on your behalf
 │
 ▼
BUDDY returns result via:
  - Memory API (you poll)
  - GitHub commit (you read)
  - Sheets update (you read)
```

---

## Quick Buddy Reference

| Need To | Best Buddy | How to Ask |
|---------|------------|------------|
| Run local Python | Claude Desktop | Task via Sheets/GitHub |
| Fetch localhost | n8n | POST webhook |
| Search web | Claude Web | Handover doc |
| Access Google APIs | n8n | POST webhook |
| Read private files | Claude Desktop | Task via GitHub |
| Generate images | ChatGPT/CD | Task via Sheets |
| Automate workflow | n8n | POST workflow trigger |

---

## Emergency Fallback

If everything fails:

1. Write task to Google Sheet: ORCHESTRATOR_HQ → TASK_QUEUE tab
2. Human will see it and route manually
3. Or: Commit task JSON to this repo's `tasks/pending/`
4. GitHub Action will attempt dispatch

**Nothing is ever lost. Every task eventually executes.**

---

## Verification Checklist

Before proceeding with any task:

- [ ] I know which platform I am
- [ ] I've loaded context (memory + playbook)
- [ ] I've checked for pending tasks assigned to me
- [ ] I know my capabilities and limitations
- [ ] I know who my buddies are
- [ ] I have a fallback plan if primary route fails
