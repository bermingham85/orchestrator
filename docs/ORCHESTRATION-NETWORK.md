# AI Platform Orchestration Network
## GitHub as Central Hub

---

## 1. CONNECTIVITY MATRIX

### Direct GitHub Access

| Platform | Read Repos | Write Files | Create Issues | Read Issues | Create PRs | Webhooks | Auth Method |
|----------|-----------|-------------|---------------|-------------|------------|----------|-------------|
| **Claude Desktop** | ✅ Direct | ✅ Direct | ✅ Direct | ✅ Direct | ✅ Direct | ❌ | MCP GitHub |
| **Claude Web** | ✅ Direct | ✅ Direct | ✅ Direct | ✅ Direct | ✅ Direct | ❌ | MCP GitHub |
| **Warp Agent** | ✅ Direct | ✅ Direct | ✅ Direct | ✅ Direct | ✅ Direct | ❌ | MCP + PAT |
| **ChatGPT Web** | ⚠️ Browser | ⚠️ Browser | ⚠️ Browser | ⚠️ Browser | ⚠️ Browser | ❌ | Session cookie |
| **n8n** | ✅ API | ✅ API | ✅ API | ✅ API | ✅ API | ✅ Receive | OAuth/PAT |

### Cross-Platform Communication Paths

| From → To | Direct | Via GitHub | Via n8n | Via Webhook | Via File |
|-----------|--------|------------|---------|-------------|----------|
| Claude Desktop → Warp | ❌ | ✅ Issues | ✅ HTTP | ❌ | ✅ Local |
| Claude Desktop → ChatGPT | ❌ | ✅ Issues | ✅ API | ❌ | ❌ |
| Claude Desktop → n8n | ❌ | ✅ Issues | ✅ HTTP | ✅ | ❌ |
| Warp → Claude Desktop | ❌ | ✅ Issues | ✅ HTTP | ❌ | ✅ Local |
| Warp → ChatGPT | ❌ | ✅ Issues | ✅ API | ❌ | ❌ |
| Warp → n8n | ✅ curl | ✅ Issues | ✅ HTTP | ✅ | ❌ |
| n8n → Claude Desktop | ❌ | ✅ Issues | N/A | ❌ | ❌ |
| n8n → Warp | ✅ webhook | ✅ Issues | N/A | ✅ | ❌ |
| n8n → ChatGPT | ✅ API | ✅ Issues | N/A | ❌ | ❌ |
| ChatGPT → Any | ❌ | ⚠️ Browser | ❌ | ❌ | ❌ |

---

## 2. TASK ROUTING MATRIX

| Task Type | Best Agent | Reason |
|-----------|------------|--------|
| GitHub Operations | Claude Desktop | Direct MCP, fastest |
| Code Execution | Warp | Local filesystem, shell |
| File Processing | Warp | Local access |
| Web Scraping | Warp (Playwright) | Browser automation |
| API Integrations | Claude Desktop | MCP connections |
| Content Generation | Claude Desktop | Quality + tools |
| Scheduled Tasks | n8n | Only persistent runner |
| Database Ops | Warp | PostgreSQL access |
| Design/Canva | Claude Desktop | Direct MCP |
| Email/Calendar | Claude Desktop | Gmail/Calendar MCP |

---

## 3. ACTIVATION METHODS

| Platform | Activation | Frequency | Automation |
|----------|-----------|-----------|------------|
| n8n | Cron/Webhook | Real-time/5min | Fully automatic |
| Claude Desktop | User/API | On demand | Manual/Semi-auto |
| Warp | User/Webhook | On demand | Manual/Semi-auto |
| ChatGPT | User only | On demand | Manual only |

---

## 4. RECOMMENDED FLOW

```
Orchestrator (n8n) polls GitHub issues
    ↓
Routes task to appropriate agent
    ↓
Agent executes and reports to GitHub
    ↓
n8n evaluates result
    ↓
Loop continues
```