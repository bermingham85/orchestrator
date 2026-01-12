# Connectivity Diagram

## Mermaid Source

```mermaid
flowchart TB
    subgraph GITHUB["GITHUB (Central Hub)"]
        direction TB
        ISSUES["Issues - Task Queue"]
        FILES["Files - Knowledge + Results"]
        WEBHOOKS["Webhooks - Event Triggers"]
    end

    subgraph N8N["N8N (Orchestrator)"]
        direction TB
        CRON["Cron Poller"]
        ROUTER["Task Router"]
        APIS["API Calls"]
    end

    subgraph CLAUDE["CLAUDE"]
        direction TB
        CD["Desktop/Web MCP"]
        CAPI["API via n8n"]
    end

    subgraph WARP["WARP"]
        direction TB
        WARP_MCP["MCP + PAT"]
        WARP_LOCAL["Local Exec"]
    end

    subgraph CHATGPT["CHATGPT"]
        direction TB
        GPT_BROWSER["Browser"]
        GPT_API["API via n8n"]
    end

    ISSUES <-->|Read/Write| CD
    ISSUES <-->|Read/Write| WARP_MCP
    ISSUES <-->|Poll| CRON
    ISSUES -.->|Browser| GPT_BROWSER

    FILES <-->|Read/Write| CD
    FILES <-->|Read/Write| WARP_MCP
    FILES <-->|API| N8N

    WEBHOOKS -->|Push Events| N8N

    CRON --> ROUTER
    ROUTER -->|Claude Tasks| CAPI
    ROUTER -->|GPT Tasks| GPT_API
    ROUTER -->|Warp Tasks| WARP_LOCAL

    CAPI -->|Results| FILES
    GPT_API -->|Results| FILES
    WARP_LOCAL -->|curl| FILES

    CD <-.->|Local Files| WARP_LOCAL
    WARP_LOCAL -->|HTTP| N8N
```

## Connection Legend

| Symbol | Meaning |
|--------|--------|
| Solid line | Direct API/MCP |
| Dashed line | Indirect/Browser |
| Arrow | Data flow direction |

## Key Insight

**n8n is the only platform that:**
- Runs persistently (24/7)
- Receives webhooks
- Can orchestrate all other agents

**GitHub is the only platform that:**
- All agents can access
- Provides persistent state
- Acts as task queue + knowledge base