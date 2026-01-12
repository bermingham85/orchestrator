# [startup] - Session Bootstrap

## Purpose
Single command to get any conversation fully operational. Loads memory, bidirectional routing, tools registry, and governance. Ready to execute immediately after.

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

### Phase 2: Bidirectional Routing (3 seconds)
```
Load from GitHub (raw URLs for speed):

1. CHANNELS: routes/CHANNELS.json
   - ALL platform-to-platform bidirectional paths
   - Outbound AND inbound for each pair
   - Transport methods: HTTP, MCP, filesystem, sheets, github

2. Capabilities: platforms/capabilities.json v1.1.0
   - routes_to: How to send TO each platform
   - receives_from: How to receive FROM each platform
   - buddy assignments

3. Tools: tools/REGISTRY.json
   - Localhost tool locations and ports
   - API endpoints for each tool
   - Trigger methods by platform
```

### Phase 3: Governance Quick-Load (2 seconds)
```
Load essential rules (not full docs):

1. From docs/DOC-CONTROL.md:
   - Versioning rules
   - Change process

2. From docs/SYSTEM-CONSTRAINTS.md:
   - Section 1: Absolute Rules (NO user input, NO tangents, FIX as you go)
   - Section 2: Error hierarchy
   - Section 8: Quick reference
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
**Channels:** 13 bidirectional routes loaded
**Tools:** {count} localhost tools available
**Governance:** Active
**Project:** {name or "General"}
**Last session:** {date} - {topic}
**Pending:** {count} actions

What's the task?
```

## GitHub Raw URLs (Fast Load)
```
BASE: https://raw.githubusercontent.com/bermingham85/orchestrator/main/

routes/CHANNELS.json          <- BIDIRECTIONAL ROUTING
platforms/capabilities.json   <- PLATFORM ROUTES
tools/REGISTRY.json          <- LOCALHOST TOOLS
docs/DOC-CONTROL.md
docs/SYSTEM-CONSTRAINTS.md
context/INDEX.md
communications/handovers/
```

## Key Bidirectional Channels
```
CW↔CD:   GitHub handovers (both directions)
CW↔GPT:  Google Sheets AI_BRIDGE tabs
CW↔N8N:  HTTP webhook out, GitHub workaround in
CD↔GPT:  chatgpt-mcp-server (bidirectional MCP)
CD↔N8N:  HTTP out, filesystem in
CD↔WARP: filesystem warp-tasks/ and warp-outputs/
ALL→GH:  Delivery hub for all final outputs
```

## Localhost Tools (CD/WARP only)
```
prompt-engineer-agent:  file:///C:/Users/bermi/Projects/prompt-engineer-agent/index.html
SmartInbox:            localhost:8000 (backend), localhost:3000 (frontend)
asset-vault-app:       localhost:8000 (backend), localhost:5173 (frontend)
chatgpt-mcp-server:    localhost:3000 (MCP SSE at /sse)
memory-api:            localhost:8765 (tunnel: memory.bermech.com)
n8n-task-dispatcher:   localhost:5678/webhook/task-dispatcher
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

### Claude Web (CW)
- Use web_fetch for GitHub raw URLs
- Cannot reach localhost, use tunnel if needed
- Routes TO: CD (handover), GPT (sheets), N8N (webhook)
- Receives FROM: CD (handover), GPT (sheets), N8N (github)

### Claude Desktop (CD)
- Use filesystem MCP for local files
- Direct localhost access to all tools
- Full MCP + local tools available
- Routes TO/FROM: All platforms via multiple methods

### Warp
- Use curl for API calls
- Direct file access
- Load from C:\Users\bermi\Projects\ if GitHub unavailable

## Token Budget
```
Phase 1 (Memory):       ~200 tokens
Phase 2 (Routing):      ~400 tokens  
Phase 3 (Governance):   ~400 tokens
Phase 4 (Project):      ~200 tokens
Phase 5 (Output):       ~50 tokens
─────────────────────────────────
Total:                  ~1,250 tokens
```

## Anti-Patterns

❌ DO NOT load PROJECT_MEMORY_BANK.json (massive token burn)
❌ DO NOT load all handovers (only last 3 days)
❌ DO NOT load full governance docs (only quick reference sections)
❌ DO NOT output lengthy status reports
❌ DO NOT ask "what would you like to do" - wait for task
❌ DO NOT use old routes.json - use CHANNELS.json

## Success Criteria

After [startup]:
- [ ] Know bidirectional routes (how to send AND receive from any platform)
- [ ] Know localhost tool locations
- [ ] Know governance rules (no tangents, fix as you go, self-check first)
- [ ] Know transport methods (HTTP, MCP, filesystem, sheets, github)
- [ ] Know current project state (if specified)
- [ ] Ready for immediate task execution

## Example Output

```
## Ready
**Memory:** Connected (localhost:8765)
**Channels:** 13 bidirectional routes (CW↔CD↔N8N↔GPT)
**Tools:** 15 localhost tools (SmartInbox, asset-vault, chatgpt-mcp...)
**Governance:** Active (no input requests, fix as you go)
**Project:** General
**Last session:** 2026-01-12 - Bidirectional routing
**Pending:** 3 actions

What's the task?
```

## Quick Reference After Startup

```
Bidirectional Routing (Outbound | Inbound):
  CW↔CD:   github handover | github handover
  CW↔GPT:  sheets write | sheets read
  CW↔N8N:  http webhook | github fetch
  CD↔GPT:  mcp server | mcp server
  CD↔N8N:  http webhook | filesystem
  CD↔WARP: warp-tasks/ | warp-outputs/
  ALL→GH:  delivery hub (handovers/, tasks/, outputs/, docs/)

Transport Methods: HTTP | MCP | filesystem | sheets | github

Rules: No user input | No tangents | Fix immediately | Self-check first (99%)
```
