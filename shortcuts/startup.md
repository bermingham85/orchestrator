# [startup] - Session Bootstrap

## Purpose
Single command to get any conversation fully operational. Loads memory, navigation, orchestration, and governance. Ready to execute immediately after.

## Trigger
`[startup]` or `[startup] {project-name}`

## Execution Sequence

### Phase 1: Memory Revision (2 seconds)
```
1. Check memory API: POST http://localhost:8765/api/memory/status
   - If available: Load current memory state
   - If unavailable: Note limitation, continue

2. Scan for recent handovers:
   - GitHub: communications/handovers/ (last 3 days)
   - Identify most recent relevant session

3. Load user memory edits (Claude native)
   - Apply any stored preferences/rules
```

### Phase 2: Navigation & Orchestration (3 seconds)
```
Load from GitHub (raw URLs for speed):

1. Routes: routes/routes.json
   - Platform-to-platform communication paths
   - Know how to reach any system

2. Fallbacks: routes/fallbacks.json  
   - Backup pathways when primary fails
   - n8n_webhook → sheets_task → github_commit

3. Capabilities: platforms/capabilities.json
   - What each platform can/cannot do
   - Buddy assignments
```

### Phase 3: Governance Quick-Load (2 seconds)
```
Load essential rules (not full docs):

1. From docs/SYSTEM-CONSTRAINTS.md:
   - Section 1: Absolute Rules (NO user input, NO tangents, FIX as you go)
   - Section 2: Error hierarchy
   - Section 8: Quick reference

2. From docs/PLATFORM-CAPABILITIES-REGISTRY.md:
   - Section 4: Task Routing Matrix (Primary + Fallback)
   - Section 6: Quick Reference
```

### Phase 4: Project Context (if specified)
```
If [startup] {project-name}:
  - Load context/projects/{project}/INDEX.md
  - Load most recent compact for that project
  - Identify active tasks/blockers

If [startup] alone:
  - Load context/INDEX.md (master index)
  - Identify cross-project priorities
```

### Phase 5: Ready State
```
Output (compact, no fluff):

## Ready
**Memory:** {status}
**Routes:** Loaded (CW↔CD↔n8n↔GPT)
**Governance:** Active
**Project:** {name or "General"}
**Last session:** {date} - {topic}
**Pending:** {count} actions

What's the task?
```

## GitHub Raw URLs (Fast Load)
```
BASE: https://raw.githubusercontent.com/bermingham85/orchestrator/main/

routes/routes.json
routes/fallbacks.json
platforms/capabilities.json
docs/SYSTEM-CONSTRAINTS.md
docs/PLATFORM-CAPABILITIES-REGISTRY.md
context/INDEX.md
communications/handovers/
```

## Memory API Endpoints
```
Local: http://localhost:8765
Tunnel: https://memory.bermech.com

GET  /api/memory/status    - Check connection
GET  /api/context          - Full context
GET  /api/playbook         - Decision pathways
POST /api/memory/revision  - Trigger memory update
```

## Platform-Specific Behavior

### Claude Web
- Use web_fetch for GitHub raw URLs
- Cannot reach localhost, use tunnel if needed
- Full MCP tools available after startup

### Claude Desktop  
- Use filesystem MCP for local files
- Direct localhost access
- Full MCP + local tools available

### Warp
- Use curl for API calls
- Direct file access
- Load from C:\Users\bermi\Projects\ if GitHub unavailable

## Token Budget
```
Phase 1 (Memory):       ~200 tokens
Phase 2 (Navigation):   ~300 tokens  
Phase 3 (Governance):   ~500 tokens
Phase 4 (Project):      ~200 tokens
Phase 5 (Output):       ~50 tokens
─────────────────────────────────
Total:                  ~1,250 tokens

Compare to full context load: 15,000+ tokens
Savings: 90%+
```

## Anti-Patterns

❌ DO NOT load PROJECT_MEMORY_BANK.json (massive token burn)
❌ DO NOT load all handovers (only last 3 days)
❌ DO NOT load full governance docs (only quick reference sections)
❌ DO NOT output lengthy status reports
❌ DO NOT ask "what would you like to do" - wait for task

## Success Criteria

After [startup]:
- [ ] Know how to route to any platform
- [ ] Know fallback paths
- [ ] Know governance rules (no tangents, fix as you go, self-check first)
- [ ] Know best performer for each task type
- [ ] Know current project state (if specified)
- [ ] Ready for immediate task execution

## Example Output

```
## Ready
**Memory:** Connected (localhost:8765)
**Routes:** CW↔CD via n8n, GPT via sheets
**Governance:** Active (no input requests, fix as you go)
**Project:** General
**Last session:** 2026-01-12 - Shortcut system
**Pending:** 4 actions (scan, rules, align, test)

What's the task?
```

## Quick Reference After Startup

```
Task Routing (Primary → Fallback):
  GitHub      → Claude → Warp
  Local files → Warp → -
  Database    → Warp → n8n
  Google      → Claude → n8n  
  Canva       → Claude → -
  Image gen   → Warp(FAL) → Claude
  Audio       → n8n → Warp
  Scheduled   → n8n → -
  Research    → Claude → ChatGPT
  Content     → Claude → ChatGPT

Fallback Chain: direct → n8n → sheets → github

Rules: No user input | No tangents | Fix immediately | Self-check first (99%)
```
