# ORCHESTRATOR

Universal cross-platform coordination system. Every AI platform reads this repo first.

## Quick Start (For Any Platform)

```
1. Read this README
2. Check /platforms/{your-platform}.md for your capabilities
3. Check /routes/ROUTING_TABLE.md for how to reach other platforms
4. Execute task using best available route
5. Log result to /logs/ or POST to memory API
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GITHUB (This Repo)                      │
│                   Single Source of Truth                     │
└─────────────────────────────────────────────────────────────┘
                              │
    ┌──────────┬──────────┬───┴───┬──────────┬──────────┐
    ▼          ▼          ▼       ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌─────────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Claude │ │Claude │ │   n8n   │ │ChatGPT│ │Supabase│ │Airtable│
│  Web  │ │Desktop│ │  (Hub)  │ │       │ │  (DB)  │ │ (Data) │
└───────┘ └───────┘ └─────────┘ └───────┘ └───────┘ └───────┘
    │          │          │         │          │          │
    └──────────┴──────────┴────┬────┴──────────┴──────────┘
                               ▼
              ┌────────────────────────────────┐
              │  Cloudflare Tunnel + Memory    │
              │  memory.bermech.com            │
              └────────────────────────────────┘
```

## Platforms

| Code | Platform | Role | MCP |
|------|----------|------|-----|
| CW | Claude Web | AI + Web Search | ✓ |
| CD | Claude Desktop | AI + Local Access | ✓ |
| GPT | ChatGPT | AI + DALL-E | ✓ |
| N8N | n8n | Universal Hub | - |
| SUPA | Supabase | Database + Auth | - |
| AIR | Airtable | Visual Database | ✓ |
| NOT | Notion | Documentation | ✓ |
| CF | Cloudflare | Infrastructure | ✓ |
| SHEETS | Google Sheets | Fallback Bridge | - |
| GITHUB | GitHub | Source of Truth | - |

## Buddy System

If you can't reach a target directly, ask a buddy:

| You Are | Can't Reach | Ask Buddy | How |
|---------|-------------|-----------|-----|
| Claude Web | localhost | n8n | POST to n8n webhook |
| ChatGPT | localhost | n8n (via tunnel) | MCP or webhook |
| Claude Desktop | ChatGPT | Sheets | Write task to TASK_QUEUE |
| Any | Any | GitHub | Commit to /tasks/pending/ |

## Directory Structure

```
orchestrator/
├── README.md                 # You are here
├── BOOTSTRAP.md              # Universal startup sequence
├── platforms/                # Platform-specific configs
│   ├── claude-web.md
│   ├── claude-desktop.md
│   ├── chatgpt.md
│   ├── n8n.md
│   └── capabilities.json     # Machine-readable capabilities
├── routes/
│   ├── ROUTING_TABLE.md      # Human-readable routes
│   ├── routes.json           # Machine-readable routes
│   └── fallbacks.json        # Fallback chains
├── tasks/
│   ├── pending/              # Tasks waiting for dispatch
│   ├── processing/           # Tasks being worked
│   └── completed/            # Finished tasks
├── context/
│   ├── memory.json           # Shared memory state
│   ├── playbook.json         # Proven workflows
│   └── shortcuts.json        # Quick triggers
├── bridges/
│   ├── apps-script.js        # Google Sheets automation
│   ├── n8n-workflows/        # n8n workflow JSONs
│   └── cloudflare/           # Tunnel configs
├── logs/
│   └── sessions/             # Session logs by date
└── .github/
    └── workflows/
        └── task-dispatcher.yml
```

## Endpoints

| Service | URL | Auth |
|---------|-----|------|
| Memory API | https://memory.bermech.com | None |
| n8n | https://n8n.bermech.com | Basic |
| n8n Webhook | https://n8n.bermech.com/webhook/task-dispatcher | None |
| This Repo | https://github.com/berminghammchl/orchestrator | None |

## Golden Rules

1. **Check before create** - Search this repo first
2. **Prefer existing routes** - Use proven paths
3. **Buddy if blocked** - Another platform can help
4. **Log everything** - Commit results for others to see
5. **Fail forward** - If route fails, try next in chain

## Status

- [ ] Cloudflare tunnel: memory.bermech.com
- [ ] Google Sheets: ORCHESTRATOR_HQ
- [ ] n8n workflow: task-dispatcher
- [ ] GitHub Actions: task-dispatcher.yml
- [x] This repo: Created

---

*Last updated: 2025-01-07*
