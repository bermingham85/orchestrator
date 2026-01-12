# [rules] Shortcut

## Purpose
Quick access to governance documents. View or update system rules, versioning standards, and operational procedures.

## Trigger
- `[rules]` - Show summary of all governance docs
- `[rules] <doc>` - Show specific document
- `[rules] update <doc>` - Edit specific document

## Governance Documents

### Core Documents
| Doc | Path | Purpose |
|-----|------|---------|
| DOC-CONTROL | docs/DOC-CONTROL.md | Versioning, change process |
| CHANNELS | routes/CHANNELS.json | Bidirectional routing |
| CAPABILITIES | platforms/capabilities.json | Platform abilities |
| REGISTRY | shortcuts/REGISTRY.json | Shortcut definitions |
| TOOLS | tools/REGISTRY.json | Localhost tool registry |

### Quick Reference URLs
```
GitHub Raw Base: https://raw.githubusercontent.com/bermingham85/orchestrator/main/
Local Mirror: C:/Users/bermi/Projects/orchestrator/
```

## Execution Flow

### View Mode (default)

Phase 1: Identify request (~50 tokens)
```
Parse: [rules] → show summary
Parse: [rules] channels → show CHANNELS.json
Parse: [rules] versioning → show DOC-CONTROL.md
```

Phase 2: Fetch document (~100 tokens)
```
CW: web_fetch(raw.githubusercontent.com/...)
CD: filesystem read or github MCP
CC: cat file or curl
```

Phase 3: Present (~200 tokens)
```
Output: Document summary or full content
Include: Current version, last updated, key sections
```

### Update Mode

Phase 1: Load current (~100 tokens)
```
Fetch current document version
Parse existing content
```

Phase 2: Apply changes (~200 tokens)
```
Merge requested changes
Validate format (JSON: parse test, MD: structure check)
Increment version per DOC-CONTROL rules
```

Phase 3: Commit (~100 tokens)
```
Push to GitHub with semantic commit message
Update CHANGELOG.md if major/minor change
Report new version to user
```

## Common Queries

### `[rules]` - Summary
```
GOVERNANCE SUMMARY (v1.1.0)
Documents:
- DOC-CONTROL v1.0.0: Versioning standards
- CHANNELS v1.0.0: 13 bidirectional routes
- CAPABILITIES v1.1.0: 8 platforms, full routing
- SHORTCUTS v1.3.0: 32 active, 22 proposed
- TOOLS v1.0.0: 15 localhost tools
Last updated: 2026-01-12
```

### `[rules] add platform`
```
Opens DOC-CONTROL.md for reference
Guides through: capability definition, routing setup, registry update
Commits all changes with proper versioning
```

### `[rules] versioning`
```
VERSIONING RULES (DOC-CONTROL v1.0.0)
- MAJOR: Breaking changes, structural rewrites
- MINOR: New features, new documents
- PATCH: Fixes, clarifications, typos
Commit format: <type>: <description>
Types: feat, fix, docs, chore
```

## Platform Adaptations

### Claude Web
- Read: web_fetch GitHub raw URLs
- Update: github:create_or_update_file

### Claude Desktop
- Read: Local filesystem preferred
- Update: GitHub MCP push

### Claude Code
- Read: cat, git show
- Update: git commit + push

## Token Budget
- View mode: ~350 tokens
- Update mode: ~600 tokens
