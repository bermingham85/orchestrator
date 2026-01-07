# Cloudflare (CF)

Platform: Cloudflare Developer Platform

---

## Role

**Edge infrastructure.** Tunnels, Workers, D1 database, R2 storage, KV store.

---

## Capabilities

### Tunnels
- Expose localhost to public URLs
- Current: bermech.com tunnel
- Hostnames: n8n.bermech.com, memory.bermech.com (pending)

### Workers
- Serverless edge functions
- Global deployment
- Can act as API proxy

### D1 Database
- SQLite at the edge
- Good for lightweight data

### R2 Storage
- S3-compatible object storage
- No egress fees

### KV Store
- Key-value storage
- Low latency reads

---

## MCP Available

Claude has Cloudflare MCP tools:
- accounts_list
- d1_database_create, d1_database_query
- kv_namespace_create, kv_namespaces_list
- r2_bucket_create, r2_buckets_list
- workers_list, workers_get_worker
- search_cloudflare_documentation

---

## Connection Methods

### From Claude (via MCP)
```
Direct MCP tool access for all Cloudflare operations
```

### From n8n
- HTTP Request to Cloudflare API
- Or use Cloudflare node if available

### From Any Platform
```javascript
fetch('https://api.cloudflare.com/client/v4/...', {
  headers: {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
})
```

---

## Orchestrator Use Cases

### Tunnel Management
```
Add hostname: memory.bermech.com → localhost:8765
Add hostname: n8n.bermech.com → 192.168.50.246:5678
```

### D1 as Fallback Database
```sql
-- Could replace Supabase for simple cases
CREATE TABLE tasks (
  task_id TEXT PRIMARY KEY,
  source TEXT,
  target TEXT,
  payload TEXT,
  status TEXT DEFAULT 'PENDING'
);
```

### Workers as API Proxy
```javascript
// Worker that routes tasks
export default {
  async fetch(request) {
    const { target, payload } = await request.json();
    // Route to appropriate backend
  }
}
```

### R2 for File Storage
- Store task results
- Archive completed tasks
- Backup context files

---

## Current Infrastructure

| Resource | Status |
|----------|--------|
| Tunnel (bermech.com) | Active |
| n8n.bermech.com | Active |
| memory.bermech.com | Pending setup |
| D1 databases | Available to create |
| KV namespaces | Available to create |
| R2 buckets | Available to create |

---

## Setup Tasks

- [ ] Add memory.bermech.com hostname to tunnel
- [ ] Consider D1 for lightweight task queue
- [ ] Consider R2 for file storage
- [ ] Consider Worker for task routing
