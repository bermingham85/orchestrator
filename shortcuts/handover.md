# [handover] - Session Context Preservation

## Purpose
Save current conversation context to external storage for seamless continuation in next session.

## Trigger
`[handover]` or `[handover] {next task description}`

## Execution

### Step 1: Extract Context
Analyze current conversation and extract:
- **Active task**: What we're working on right now
- **Decisions made**: Key choices and their rationale
- **Blockers**: Any issues preventing progress
- **Files modified**: Paths and purposes
- **State variables**: Ports, credentials, configurations in use
- **Next actions**: Immediate next steps required

### Step 2: Generate Handover Document
Create structured summary:

```markdown
# Session Handover - {timestamp}

## Active Task
{One sentence describing current objective}

## Progress
- Completed: {list}
- In progress: {list}
- Blocked: {list with reasons}

## Key Decisions
| Decision | Rationale | Impact |
|----------|-----------|--------|

## Modified Files
| File | Change | Status |
|------|--------|--------|

## State
json
{
  "ports": {},
  "paths": {},
  "credentials_refs": [],
  "active_services": []
}


## Next Actions
1. {Immediate next step}
2. {Following step}

## Context Required for Resume
- Files to load: {minimal list}
- APIs needed: {list}
- Prior knowledge: {brief}
```

### Step 3: Save to External Storage

**Primary: GitHub**
```
Repository: bermingham85/orchestrator
Path: context/sessions/{date}-{topic}.md
```

**Secondary: Memory MCP (if available)**
```
POST http://localhost:8765/api/context
Body: {handover_document}
```

### Step 4: Update Session Index
Append to `context/INDEX.md`:
```
| {date} | {topic} | {status} | sessions/{filename}.md |
```

### Step 5: Confirm
Output confirmation with:
- Storage location(s)
- Retrieval command for next session: `[context] {topic}`

## Platform Implementations

### Claude
1. Generate handover document from conversation
2. Push to GitHub via MCP
3. Optionally POST to memory API if reachable

### Warp
```powershell
$handover | Out-File "context/sessions/$filename.md"
git add . && git commit -m "Handover: $topic" && git push
```

### n8n
- Webhook trigger on [handover]
- Code node generates document
- GitHub node pushes file
- HTTP node POSTs to memory API

## Output Format
```
HANDOVER SAVED
Location: github.com/bermingham85/orchestrator/context/sessions/{filename}.md
Resume with: [context] {topic}
Next session start: Load context, then continue with: {next_action}
```
