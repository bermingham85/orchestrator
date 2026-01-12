# PLATFORM CAPABILITIES REGISTRY
## Canonical Reference for Task Routing

**Version:** 1.0.0
**Last Updated:** 2026-01-12
**Repository:** bermingham85/orchestrator

---

# SECTION 1: PLATFORM CAPABILITY MATRIX

## 1.1 CLAUDE DESKTOP/WEB

### Native Capabilities

| Category | Capability | Method | Tokens | Speed |
|----------|-----------|--------|--------|-------|
| **Text Generation** | Long-form content | Native | Medium | Fast |
| **Text Generation** | Code generation | Native | Medium | Fast |
| **Text Generation** | Translation | Native | Low | Fast |
| **Text Generation** | Summarization | Native | Low | Fast |
| **Analysis** | Document analysis | Native | Medium | Fast |
| **Analysis** | Image analysis | Native | Low | Fast |
| **Analysis** | Data interpretation | Native | Medium | Fast |
| **Reasoning** | Multi-step logic | Native | High | Medium |
| **Reasoning** | Decision making | Native | Medium | Fast |
| **File Creation** | Markdown/Text | Container | Low | Fast |
| **File Creation** | Code files | Container | Low | Fast |
| **File Creation** | HTML/React artifacts | Container | Medium | Fast |
| **Execution** | Python/Node in container | Bash | Medium | Medium |
| **Execution** | Shell commands | Bash | Low | Fast |

### MCP Tool Capabilities

| Tool | Operations | Auth | Reliability | Tokens |
|------|-----------|------|-------------|--------|
| **GitHub** | Repos, Issues, PRs, Files, Branches, Commits, Search | OAuth | ★★★★★ | Low |
| **Google Drive** | Search, Fetch docs, Full-text query | OAuth | ★★★★★ | Medium |
| **Gmail** | Search, Read threads, Profile | OAuth | ★★★★★ | Medium |
| **Google Calendar** | Events, Free time, Create/Update | OAuth | ★★★★★ | Low |
| **Canva** | Create, Edit, Generate, Export, Brand kits | OAuth | ★★★★☆ | Medium |
| **Airtable** | Bases, Tables, Records CRUD, Search | API Key | ★★★★★ | Low |
| **Cloudflare** | Workers, D1, KV, R2, Hyperdrive | API Key | ★★★★☆ | Low |
| **Vercel** | Deploy, Domains, Build logs | Token | ★★★★☆ | Low |
| **n8n** | Workflows, Nodes, Templates, Execute | Bearer | ★★★★☆ | Medium |
| **Notion** | Pages, Databases, Search | OAuth | ★★★★☆ | Medium |
| **Stripe** | Payments, Customers, Subscriptions | OAuth | ★★★★☆ | Low |
| **PayPal** | Transactions, Invoices | OAuth | ★★★★☆ | Low |
| **Hugging Face** | Models, Datasets, Spaces, Image gen | Token | ★★★★☆ | High |
| **Context7** | Library documentation | None | ★★★★★ | Medium |
| **PDF Tools** | Fill, Extract, Analyze | None | ★★★★★ | Medium |

---

## 1.2 WARP AGENT

### Native Capabilities

| Category | Capability | Method | Tokens | Speed |
|----------|-----------|--------|--------|-------|
| **File System** | Read any file | Direct | Low | Instant |
| **File System** | Write/Create files | Direct | Low | Instant |
| **File System** | Search (grep/glob) | Direct | Low | Fast |
| **Execution** | PowerShell commands | Shell | Low | Fast |
| **Execution** | Python/Node scripts | Shell | Medium | Medium |
| **Database** | PostgreSQL queries | SQL | Low | Fast |
| **HTTP** | curl/wget requests | Shell | Low | Fast |

### Direct API Access (via .env.shared)

| Service | Available | Method |
|---------|----------|--------|
| Anthropic Claude | ✅ | HTTP API |
| OpenAI | ✅ | HTTP API |
| FAL AI | ✅ | HTTP API |
| GitHub | ✅ PAT | HTTP API |
| Notion | ✅ | HTTP API |

---

## 1.3 N8N (ORCHESTRATOR)

### Unique Capabilities

| Capability | Why Unique |
|-----------|------------|
| **Persistent execution** | Runs 24/7 on QNAP |
| **Scheduled triggers** | Cron jobs |
| **Webhook receiver** | Inbound HTTP |
| **Multi-step workflows** | Visual automation |
| **Error handling** | Retry, fallback |

---

## 1.4 CHATGPT WEB

| Capability | Method | Reliability |
|-----------|--------|-------------|
| **Web navigation** | Browser | ★★★☆☆ |
| **Form filling** | Click/Type | ★★★☆☆ |
| **Screenshot** | Browser | ★★★★☆ |

**Limitations:** No API, session-dependent, cannot be triggered externally

---

# SECTION 2: SERVICE PATHWAYS

## GREEN LANES (Direct Access)

| Service | Platform | Method |
|---------|----------|--------|
| **Canva** | Claude | MCP Direct |
| **GitHub** | Claude/Warp | MCP Direct |
| **Google Drive** | Claude | MCP Direct |
| **Gmail** | Claude | MCP Direct |
| **Calendar** | Claude | MCP Direct |
| **Airtable** | Claude | MCP Direct |
| **Cloudflare** | Claude | MCP Direct |
| **Vercel** | Claude | MCP Direct |
| **Hugging Face** | Claude | MCP Direct |
| **FAL AI** | Warp | HTTP API |
| **PostgreSQL** | Warp | Direct SQL |

## YELLOW LANES (Via n8n)

| Service | n8n Method |
|---------|------------|
| **ElevenLabs** | HTTP Request node |
| **Suno** | HTTP Request node |
| **Google Sheets** | Sheets node |
| **Slack** | Slack node |
| **Discord** | Discord node |
| **Email** | SMTP node |

## RED LANES (Browser Required)

| Service | Platform | Alternative |
|---------|----------|-------------|
| **Midjourney** | Warp Playwright | FAL Flux (GREEN) |
| **Hedra** | Warp Playwright | FAL SadTalker (GREEN) |
| **Runway** | Warp Playwright | - |

---

# SECTION 3: DECISION TREE

```
START: New Task
    │
    ├─► Scheduled/Recurring? → n8n
    ├─► Local files needed? → Warp
    ├─► Shell execution? → Warp
    ├─► Database access? → Warp
    ├─► MCP tool available? → Claude
    ├─► Browser automation? → Warp (Playwright)
    ├─► Content generation? → Claude
    ├─► Multi-service workflow? → n8n
    └─► Default → Claude
```

---

# SECTION 4: TASK ROUTING MATRIX

| Task Type | Primary | Fallback | Reason |
|-----------|---------|----------|--------|
| GitHub ops | Claude | Warp | MCP direct |
| Local files | Warp | - | Filesystem |
| Google Drive | Claude | n8n | MCP direct |
| Google Sheets | n8n | Claude | OAuth |
| Gmail read | Claude | n8n | MCP direct |
| Email send | n8n | - | SMTP |
| Canva design | Claude | - | MCP only |
| Image gen (Flux) | Warp | Claude | FAL API |
| Image gen (MJ) | Warp | ChatGPT | Browser |
| Audio TTS | n8n | Warp | ElevenLabs |
| Music gen | n8n | Warp | Suno |
| Video avatar | Warp | n8n | Hedra |
| Database | Warp | n8n | SQL |
| Web scraping | Warp | ChatGPT | Playwright |
| Research | Claude | ChatGPT | Web search |
| Content | Claude | ChatGPT | Quality |
| Scheduled | n8n | - | Only option |

---

# SECTION 5: TOKEN EFFICIENCY

| Platform | Tokens/Task | Best For |
|----------|------------|----------|
| **Warp** | Low (100-500) | File ops, shell, API |
| **n8n** | Zero | Automation |
| **Claude** | Medium (500-2000) | Content, MCP |
| **ChatGPT** | High (1000-3000) | Browser fallback |

**Rules:**
1. Prefer Warp for shell/file tasks
2. Prefer n8n for non-LLM automation
3. Use Claude for MCP direct paths
4. Avoid ChatGPT unless browser required

---

# SECTION 6: QUICK REFERENCE

```
"I need to..."              → USE THIS
───────────────────────────────────────
Create GitHub issue         → Claude
Read/write local files      → Warp
Execute shell commands      → Warp
Query PostgreSQL            → Warp
Search Google Drive         → Claude
Read Gmail                  → Claude
Create calendar event       → Claude
Design in Canva             → Claude
Generate image (Flux)       → Warp (FAL)
Generate image (Midjourney) → Warp (Playwright)
Generate audio (TTS)        → n8n (ElevenLabs)
Generate music              → n8n (Suno)
Generate video (avatar)     → Warp (Hedra)
Deploy to Vercel            → Claude
Deploy to Cloudflare        → Claude
Update Airtable             → Claude
Send Slack/email            → n8n
Schedule recurring task     → n8n
Web scraping                → Warp (Playwright)
Research                    → Claude
Write content               → Claude
```