# Claude Web (CW)

Platform: claude.ai web interface

---

## Capabilities

### Can Do Directly
- Web search (native tool)
- Fetch public URLs
- Read/write Google Sheets via API
- Read/write GitHub via API  
- Call webhooks (n8n, etc.)
- Create artifacts (HTML, React, code)
- Access memory API via tunnel (https://memory.bermech.com)
- Process uploaded files
- Generate code, documents, analysis

### Cannot Do
- Access localhost directly
- Run local Python/scripts
- Access local filesystem
- Communicate directly with Claude Desktop
- Communicate directly with ChatGPT
- Access private network resources

### Acts as Buddy For
- Web research (for platforms without web search)
- Artifact creation
- Document generation
- Complex reasoning tasks

### Needs Buddy For
- Local file operations → Ask Claude Desktop
- Local Python execution → Ask Claude Desktop
- Scheduled automation → Ask n8n
- Private API calls requiring localhost → Ask n8n

---

## Connection Methods

### To n8n
```javascript
// Direct webhook call
fetch('https://n8n.bermech.com/webhook/task-dispatcher', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ task_id, source: 'CW', target, payload })
});
```

### To Memory API
```javascript
// Via Cloudflare tunnel
fetch('https://memory.bermech.com/context')
fetch('https://memory.bermech.com/api/tasks', { method: 'POST', body: task })
```

### To GitHub
```javascript
// Read files
fetch('https://raw.githubusercontent.com/berminghammchl/orchestrator/main/context/memory.json')

// Create task (requires token in artifact)
// Better: Use n8n as proxy
```

### To Google Sheets
```javascript
// In artifact with Sheets API
// Or: Route through n8n webhook
```

### To Claude Desktop / ChatGPT
```markdown
## HANDOVER: CW → CD

**Task ID:** T{timestamp}
**Action Required:** [specific task]
**Context:** [minimal needed]
**Return Method:** 
- Commit to GitHub: orchestrator/tasks/completed/{task_id}.json
- Or: POST to https://memory.bermech.com/api/tasks/{task_id}/complete
```

---

## Startup Sequence

1. Check if memory API reachable:
   ```
   GET https://memory.bermech.com/context
   ```

2. If yes: Load memory + playbook from response

3. If no: Fetch from GitHub:
   ```
   GET https://raw.githubusercontent.com/berminghammchl/orchestrator/main/context/memory.json
   GET https://raw.githubusercontent.com/berminghammchl/orchestrator/main/context/playbook.json
   ```

4. Check for pending tasks:
   ```
   GET https://memory.bermech.com/api/tasks?target=CW
   ```

5. Or check GitHub: `tasks/pending/` for files containing `"target": "CW"`

---

## Session End Sequence

1. Save any new pathways discovered
2. Log session summary
3. If memory API available:
   ```
   POST https://memory.bermech.com/api/events
   ```
4. If not: Commit to `logs/sessions/` in GitHub via n8n proxy

---

## Shortcuts Available

When user types `[shortcut]`, read from:
`https://raw.githubusercontent.com/berminghammchl/orchestrator/main/context/shortcuts.json`

Or local: `C:\Users\bermi\Projects\MASTER_PROMPT_LIBRARY.md`

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Memory API down | Use GitHub as fallback |
| n8n unreachable | Queue task in Sheets |
| GitHub unreachable | Save locally, alert user |
| All bridges down | Document task for manual execution |
