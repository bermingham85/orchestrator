# [compact] - Save Memory & Context with Cross-Project Tagging

## Purpose
Compress and save current session's memory AND context. Automatically tag for cross-project relevance when applicable.

## Trigger
`[compact]` or `[compact] {tags}`

## What It Saves

| Component | Content | Storage |
|-----------|---------|----------|
| Memory | Decisions, learnings, preferences | Memory API + GitHub |
| Context | Current state, active work, blockers | GitHub sessions |
| Tags | Project relevance markers | Both |

## Execution

### Step 1: Extract Session Intelligence
From current conversation, extract:

**Memory (persistent learnings)**:
- New decisions made
- Patterns discovered
- User preferences expressed
- Tool configurations that worked
- Errors and their solutions

**Context (session state)**:
- Active task status
- Files modified
- Services in use
- Blockers encountered
- Next actions

### Step 2: Determine Project Relevance
Analyze content for cross-project applicability:

```
Current project: {detected from conversation}
Content mentions: {other projects, shared infrastructure, reusable patterns}
```

**Tagging Rules**:
| Content Type | Tag Strategy |
|--------------|---------------|
| Project-specific only | Tag: `[project:{name}]` |
| Shared infrastructure | Tag: `[infra]` + all affected projects |
| Reusable pattern | Tag: `[pattern]` + `[global]` |
| Cross-project decision | Tag: all relevant projects |

**Example**:
```
Working on: Taleweaver
Discovered: n8n webhook retry pattern
Tags: [taleweaver] [n8n] [pattern] [global]
-> Saved to both Taleweaver context AND global patterns
```

### Step 3: Generate Compact Document

```markdown
# Compact - {timestamp}

## Tags
{list of relevance tags}

## Memory Updates
### Decisions
- {decision}: {rationale}

### Learnings
- {what worked/failed}: {why}

### Patterns
- {reusable pattern}: {when to apply}

## Context Snapshot
### Active Work
- Project: {name}
- Task: {description}
- Status: {in-progress|blocked|complete}

### State
json
{
  "files": [],
  "services": [],
  "variables": {}
}


### Next Actions
1. {action}

## Cross-References
- Related sessions: {links}
- Affected projects: {list}
```

### Step 4: Save to Storage

**GitHub (always)**:
```
Path: context/compacts/{date}-{topic}.md
```

**Memory API (if available)**:
```
POST http://localhost:8765/api/memory
Body: {
  "type": "compact",
  "tags": [...],
  "memory": {...},
  "context": {...}
}
```

### Step 5: Update Indices

**Project index** (if project-specific):
```
context/projects/{project}/INDEX.md
```

**Global index** (if tagged [global] or [pattern]):
```
context/patterns/INDEX.md
```

**Tag index**:
```
context/TAGS.md - append new tag associations
```

## Tag Reference

| Tag | Meaning | Auto-applied When |
|-----|---------|-------------------|
| `[global]` | Applies everywhere | Infrastructure, shared tooling |
| `[pattern]` | Reusable solution | Solved problem elegantly |
| `[infra]` | Infrastructure related | n8n, APIs, services |
| `[project:{name}]` | Project specific | Working within project |
| `[urgent]` | Needs attention | Blockers, critical issues |

## Platform Implementations

### Claude
1. Analyze conversation for memory + context
2. Determine tags from content
3. Generate compact document
4. Push to GitHub via MCP
5. POST to memory API if reachable
6. Update indices

### Warp
```powershell
$compact = New-CompactDocument -Conversation $history
$tags = Get-RelevanceTags -Content $compact
Save-ToGitHub -Path "context/compacts/$filename.md" -Content $compact
Update-Indices -Tags $tags
```

### n8n
- Trigger: Webhook or schedule
- Code node: Extract and tag
- GitHub node: Save compact
- HTTP node: Update memory API
- Code node: Update indices

## Output
```
COMPACT SAVED
Tags: [taleweaver] [n8n] [pattern]
Memory: 3 decisions, 2 learnings, 1 pattern
Context: Task in-progress, 2 files modified
Stored: 
  - github.com/bermingham85/orchestrator/context/compacts/{file}.md
  - Memory API: synced
Cross-referenced in:
  - projects/taleweaver/INDEX.md
  - patterns/INDEX.md
```

## vs [handover]

| Aspect | [compact] | [handover] |
|--------|-----------|------------|
| Purpose | Save learnings + state | Prepare for session transfer |
| Focus | What was learned | What to do next |
| Tags | Cross-project relevance | Single session continuity |
| When | Anytime, especially after breakthroughs | End of session |
