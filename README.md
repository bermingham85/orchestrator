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
```

## Platforms

| Code | Platform | Role | MCP |
|------|----------|------|-----|
| CW | Claude Web | AI + Web Search | ✓ |
| CD | Claude Desktop | AI + Local Access | ✓ |
| GPT | ChatGPT | AI + DALL-E | ✓ |
| N8N | n8n | Universal Hub | - |

## Buddy System

If you can't reach a target directly, ask a buddy:

| You Are | Can't Reach | Ask Buddy | How |
|---------|-------------|-----------|-----|
| Claude Web | localhost | n8n | POST to n8n webhook |
| ChatGPT | localhost | n8n (via tunnel) | MCP or webhook |
| Claude Desktop | ChatGPT | Sheets | Write task to TASK_QUEUE |
| Any | Any | GitHub | Commit to /tasks/pending/ |

## Endpoints

| Service | URL |
|---------|-----|
| Memory API | https://memory.bermech.com |
| n8n | https://n8n.bermech.com |
| n8n Webhook | https://n8n.bermech.com/webhook/task-dispatcher |

## Golden Rules

1. **Check before create** - Search this repo first
2. **Prefer existing routes** - Use proven paths
3. **Buddy if blocked** - Another platform can help
4. **Log everything** - Commit results for others to see
5. **Fail forward** - If route fails, try next in chain

---
*Last updated: 2025-01-07*
