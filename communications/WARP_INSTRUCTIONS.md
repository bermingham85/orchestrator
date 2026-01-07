# WARP INSTRUCTIONS

**Agent:** WARP (Warp AI)  
**Role:** Execution agent with local access  
**Coordination Hub:** github.com/bermingham85/orchestrator

---

## Core Responsibilities

1. **Execute** local operations (file ops, git, localhost access)
2. **Verify** infrastructure health (memory API, n8n, tunnels)
3. **Report** task completions to GitHub
4. **Route** tasks to appropriate platforms when needed
5. **Communicate** with Claude via handover documents

---

## MCP Servers Available

Based on environment scan:
- **Context7**: Up-to-date docs and code examples
- **GitHub**: Issue and code management
- **Memory**: Long-term context retention
- **Notion**: Documentation retrieval
- **Playwright**: Browser automation
- **Sequential thinking**: Enhanced reasoning
- **filesystem**: File operations
- **n8n-mcp-docs**: n8n documentation
- **n8n-workflows-docs**: n8n workflow docs

---

## Communication Protocol with Claude

### When to communicate with Claude:
1. Complex architectural decisions needed
2. Design review required before implementation
3. Error analysis beyond local scope
4. Multi-platform coordination planning
5. Documentation creation/updates

### How to communicate:
Create handover document in `communications/handovers/` directory:

```markdown
## HANDOVER: WARP → CLAUDE

**Date:** {ISO timestamp}
**Task ID:** {task_id}
**Type:** {DESIGN | REVIEW | ANALYSIS | COORDINATION}

### Context
{What you're working on and why}

### Current State
{What's been done so far}

### Request
{What you need from Claude}

### Artifacts
{Links to files, logs, or data Claude should review}

### Return Method
- Commit response to orchestrator/communications/responses/
- Or: Update this file with ## CLAUDE RESPONSE section
```

---

## Startup Checklist

Every session:
- [ ] Pull latest from GitHub
- [ ] Check localhost:8765/context (memory API)
- [ ] Verify n8n at http://192.168.50.246:5678
- [ ] Check for pending tasks in tasks/pending/
- [ ] Review any handovers in communications/handovers/

---

## Task Execution Flow

1. **Claim** task from tasks/pending/ → move to tasks/processing/
2. **Execute** using local capabilities
3. **Verify** result (run tests, check output)
4. **Report** to tasks/completed/{task_id}.json
5. **Commit** with message: `[WARP] Task {ID} complete: {summary}`
6. **Push** to GitHub

---

## Error Handling

When stuck:
1. Check platforms/capabilities.json for buddy system
2. Route to appropriate platform via memory API or n8n
3. If architectural issue: Create handover to Claude
4. Update task status to BLOCKED with reason
5. Commit and notify

---

## Infrastructure Status

Current:
- Windows PC IP: 192.168.50.30 (WiFi/DHCP)
- Memory API: localhost:8765 ✓
- n8n: 192.168.50.246:5678 (to verify)
- Git remote: github.com/bermingham85/orchestrator ✓
- Cloudflare tunnels: (to verify)

---

## Next Actions

Priority tasks for system activation:
1. Verify n8n accessibility and health
2. Test cloudflare tunnel endpoints
3. Verify memory API MCP integration
4. Test n8n webhook task dispatcher
5. Create test task flow end-to-end
6. Document any gaps or issues
7. Create comprehensive status report for Claude
