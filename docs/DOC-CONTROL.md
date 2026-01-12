# Document Control System

## Version: 1.0.0
## Last Updated: 2026-01-12

---

## Versioning Standard

All orchestrator documents follow semantic versioning:
- **MAJOR.MINOR.PATCH**
- MAJOR: Breaking changes to routing/channels
- MINOR: New features/routes added
- PATCH: Fixes, clarifications

---

## Document Registry

| Document | Location | Version | Owner |
|----------|----------|---------|-------|
| CHANNELS.json | routes/ | 1.0.0 | System |
| routes.json | routes/ | 1.0.0 | System |
| fallbacks.json | routes/ | 1.0.0 | System |
| REGISTRY.json | tools/ | 1.0.0 | System |
| startup.md | shortcuts/ | 1.0.0 | System |
| SYSTEM-CONSTRAINTS.md | docs/ | 1.0.0 | System |
| PLATFORM-CAPABILITIES-REGISTRY.md | docs/ | 1.0.0 | System |

---

## Delivery Hub

**Primary Repository:** `github:bermingham85/orchestrator`

All platforms deliver final outputs to GitHub:
```
orchestrator/
├── communications/handovers/  # Session handovers
├── tasks/                      # Pending tasks
├── outputs/                    # Completed outputs
├── docs/                       # Documentation
└── tools/                      # Tool registry
```

---

## Change Process

1. **Propose**: Create issue or discuss in active session
2. **Draft**: Create changes in branch or direct commit
3. **Review**: Self-check against governance rules
4. **Deploy**: Push to main branch
5. **Notify**: Update version in relevant files

---

## Location Resolution

### GitHub (Source of Truth)
```
Base: https://github.com/bermingham85/orchestrator
Raw: https://raw.githubusercontent.com/bermingham85/orchestrator/main/
```

### Local Mirrors
```
Windows: C:\Users\bermi\Projects\orchestrator\
WSL: /mnt/c/Users/bermi/Projects/orchestrator/
```

### Access by Platform

| Platform | Primary Access | Fallback |
|----------|---------------|----------|
| Claude Web | web_fetch GitHub raw | - |
| Claude Desktop | filesystem MCP | GitHub API |
| Claude Code | git clone | GitHub API |
| ChatGPT Desktop | filesystem via MCP | - |
| n8n | HTTP to raw URLs | GitHub node |
| Warp | Local filesystem | git pull |

---

## File Naming Convention

- **ALL_CAPS.md** - System documents (governance, constraints)
- **kebab-case.md** - Regular documents
- **UPPERCASE.json** - Registry files (CHANNELS, REGISTRY)
- **lowercase.json** - Data files (routes, fallbacks)

---

## Changelog Location

Major changes logged in: `docs/CHANGELOG.md`

Format:
```markdown
## [1.0.0] - 2026-01-12
### Added
- Bidirectional channels (CHANNELS.json)
- Tools registry (REGISTRY.json)
- Doc control system
```

---

## Sync Status Check

To verify all platforms have current docs:

```bash
# Warp/CC
git -C ~/Projects/orchestrator log -1 --format="%H %ci"

# Compare with GitHub
curl -s https://api.github.com/repos/bermingham85/orchestrator/commits/main | jq '.sha, .commit.author.date'
```

---

## Emergency Override

If GitHub is down:
1. Use local filesystem copy
2. Document changes locally
3. Push to GitHub when available
4. Resolve any conflicts
