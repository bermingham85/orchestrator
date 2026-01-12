# [context] - Lazy-Load Context Retrieval

## Purpose
Load ONLY the context required for the current prompt. Executes AFTER first user prompt to minimize token burn.

## Critical Rule
**NEVER pre-load context before knowing what the user needs.**

Flow:
1. User sends first prompt
2. Analyze what context is actually needed
3. Fetch ONLY that context
4. Respond

## Trigger
Implicit on session start, or explicit: `[context] {topic}` or `[context] {session-id}`

## Execution

### Step 1: Analyze First Prompt
From user's first message, identify:
- **Domain**: Which project/system is this about?
- **Task type**: Creation, debugging, continuation, new work?
- **Entities mentioned**: Files, services, workflows, repos
- **Depth needed**: Surface overview or deep state?

### Step 2: Determine Minimum Context Set
Map prompt requirements to context sources:

| Need | Source | Tokens (approx) |
|------|--------|------------------|
| Project state | `context/sessions/{latest}.md` | 500-1000 |
| File contents | GitHub fetch specific file | varies |
| Service config | `SYSTEM-CONSTRAINTS.md` | 800 |
| Shortcut definition | `shortcuts/{name}.md` | 200-400 |
| Full memory | `PROJECT_MEMORY_BANK.json` | 3000+ (AVOID) |

**Rule**: Never load PROJECT_MEMORY_BANK.json unless explicitly continuing complex multi-session work.

### Step 3: Fetch Required Context Only

**From GitHub (primary)**:
```
GET: raw.githubusercontent.com/bermingham85/orchestrator/main/{path}
```

**From Memory API (if available)**:
```
GET: http://localhost:8765/context?scope={minimal_scope}
```

### Step 4: Integrate and Proceed
- Load fetched context silently
- Do NOT repeat context back to user
- Proceed directly with task

## Context Scopes

| Scope | What's Loaded | When to Use |
|-------|---------------|-------------|
| `minimal` | Last session handover only | Default |
| `project` | Project-specific state | `[context] taleweaver` |
| `system` | Infrastructure state | Debugging services |
| `full` | Everything (expensive) | Only if explicitly requested |

## Platform Implementations

### Claude
```
1. Receive first prompt
2. Parse for context needs
3. web_fetch from GitHub raw URLs
4. OR call memory MCP if available
5. Proceed with response
```

### Warp
```powershell
$scope = Analyze-PromptNeeds $prompt
$context = Get-MinimalContext -Scope $scope
```

### n8n
- Webhook receives prompt
- Code node analyzes needs
- Switch node routes to appropriate context fetch
- Merge node combines minimal context
- Continue workflow

## Anti-Patterns (DO NOT)
- Load full PROJECT_MEMORY_BANK.json on session start
- Fetch all recent sessions
- Pre-emptively load "just in case"
- Repeat loaded context back to user

## Correct Pattern
```
User: "Fix the webhook in the TikTok workflow"

[context] analyzes:
- Domain: n8n workflows
- Specific: TikTok workflow
- Need: workflow definition, recent errors

Fetches ONLY:
- context/sessions/latest-n8n.md (if exists)
- Workflow ID from registry

Does NOT fetch:
- All workflows
- PROJECT_MEMORY_BANK.json
- Unrelated project state
```

## Output
None visible. Context loaded silently, task proceeds immediately.
