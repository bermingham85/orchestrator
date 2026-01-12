# [scan] Shortcut

## Purpose
Before creating any new code, tool, or workflow, scan existing resources to avoid duplication. Checks memory → registry → local → GitHub in sequence.

## Trigger
User types `[scan]` or `[scan] <topic>`

## Execution Flow

### Phase 1: Memory Check (~200 tokens)
```
Action: Fetch memory API context
URL: http://localhost:8765/context (CD) or https://memory.bermech.com/context (CW)
Look for: Existing tools, workflows, solutions matching query
```

### Phase 2: Registry Check (~150 tokens)
```
Action: Check tool registries
Files:
- tools/REGISTRY.json (localhost tools)
- shortcuts/REGISTRY.json (existing shortcuts)
- routes/CHANNELS.json (communication channels)
Look for: Matching capabilities
```

### Phase 3: Local Filesystem (CD only) (~200 tokens)
```
Action: Search Projects folder
Path: C:/Users/bermi/Projects/
Search: *<topic>* in folder names and key files
Include: README.md, package.json, pyproject.toml
```

### Phase 4: GitHub Scan (~300 tokens)
```
Action: Search all repositories
Repos to check:
- bermingham85/* (38 repos)
- Focus: README files, workflow definitions
Tools: github:search_repositories, github:get_file_contents
```

### Phase 5: Report (~100 tokens)
```
Output format:
SCAN RESULTS: <topic>
Existing matches:
- [source] description → recommendation
Gaps identified:
- What needs to be created
Recommendation: USE_EXISTING | EXTEND | CREATE_NEW
```

## Platform Adaptations

### Claude Web (CW)
- Memory: HTTPS tunnel only
- Skip: Local filesystem phase
- GitHub: Use web_fetch for raw files

### Claude Desktop (CD)
- Full access to all phases
- Local: Use filesystem MCP
- Memory: localhost:8765

### Claude Code (CC)
- Skip: Memory API (no MCP)
- Local: Direct filesystem
- GitHub: git clone + grep

## Example Usage

User: `[scan] email triage`
```
SCAN RESULTS: email triage
Existing matches:
- [tools/REGISTRY] SmartInbox: Email triage with AI → USE THIS
- [github] smartinbox-15: Full implementation → Already complete
Gaps identified: None
Recommendation: USE_EXISTING (SmartInbox at localhost:8000)
```

User: `[scan] pdf splitter`
```
SCAN RESULTS: pdf splitter
Existing matches:
- [shortcuts] pdf.md: General PDF processing → Partial match
- [github] None found
Gaps identified: No dedicated PDF split tool
Recommendation: CREATE_NEW or EXTEND pdf shortcut
```

## Token Budget
Total: ~950 tokens (under 1,000 target)
