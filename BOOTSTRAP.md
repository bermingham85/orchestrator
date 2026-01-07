# BOOTSTRAP

Universal startup sequence. Every platform runs this on session start.

## Step 1: Identify Yourself

| Platform | Code | Config |
|----------|------|--------|
| Claude Web (claude.ai) | CW | platforms/claude-web.md |
| Claude Desktop App | CD | platforms/claude-desktop.md |
| ChatGPT | GPT | platforms/chatgpt.md |
| n8n | N8N | platforms/n8n.md |

## Step 2: Load Context

### Option A: Memory API Available
```
GET https://memory.bermech.com/context
```

### Option B: Memory API Unavailable
Read from this repo:
- `context/memory.json`
- `context/playbook.json`

## Step 3: Check Pending Tasks

```
GET https://memory.bermech.com/api/tasks?target={YOUR_CODE}
```

Or check: `tasks/pending/` for files with your code.

## Step 4: Execute or Delegate

### If you CAN do the task:
1. Execute
2. Log result
3. Update task status

### If you CANNOT:
1. Find buddy from platforms/capabilities.json
2. Create task in `tasks/pending/{task_id}.json`
3. Commit or POST to dispatch

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
Create task → BUDDY executes → Returns result
```

## Emergency Fallback

1. Write task to Google Sheet: ORCHESTRATOR_HQ → TASK_QUEUE
2. Or: Commit task JSON to `tasks/pending/`
3. GitHub Action will dispatch

**Nothing is ever lost. Every task eventually executes.**
