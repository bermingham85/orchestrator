# Supabase (SUPA)

Platform: Supabase (PostgreSQL, Auth, Storage, Edge Functions)

---

## Role

**Persistent data layer.** Database, authentication, file storage, and serverless functions.

---

## Capabilities

### Can Do
- PostgreSQL database (read/write/query)
- User authentication (sign up, login, OAuth)
- File storage (upload/download/manage)
- Edge Functions (serverless TypeScript/Deno)
- Realtime subscriptions
- Row Level Security (RLS)
- Database webhooks (triggers)

### Endpoints
```
Project URL: https://{project-id}.supabase.co
API: https://{project-id}.supabase.co/rest/v1/
Auth: https://{project-id}.supabase.co/auth/v1/
Storage: https://{project-id}.supabase.co/storage/v1/
Functions: https://{project-id}.supabase.co/functions/v1/
```

### Acts as Buddy For
- Persistent storage for all platforms
- User authentication
- File hosting
- Scheduled tasks via pg_cron
- Webhook triggers on data changes

### Needs Buddy For
- Complex AI reasoning → Route to Claude/GPT
- External API calls without edge functions → Route to n8n

---

## Connection Methods

### From Any Platform (REST API)
```javascript
// Read data
fetch('https://{project}.supabase.co/rest/v1/tasks?status=eq.PENDING', {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  }
})

// Write data
fetch('https://{project}.supabase.co/rest/v1/tasks', {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ task_id, source, target, payload })
})
```

### From n8n
- Use Supabase node (native integration)
- Or HTTP Request node with API

### From Claude Desktop
```python
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
data = supabase.table('tasks').select('*').eq('target', 'CD').execute()
```

---

## Database Schema for Orchestrator

```sql
-- Tasks table (replaces/mirrors memory API)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  action TEXT,
  payload JSONB,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  result JSONB
);

-- Memory/context storage
CREATE TABLE memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session logs
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  platform TEXT,
  event_type TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playbook pathways
CREATE TABLE playbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  pathway JSONB NOT NULL,
  use_count INT DEFAULT 0,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for tasks
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

---

## Webhook Triggers

Supabase can call n8n when data changes:

```sql
-- Trigger function
CREATE OR REPLACE FUNCTION notify_task_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n.bermech.com/webhook/supabase-task',
    body := jsonb_build_object(
      'task_id', NEW.task_id,
      'source', NEW.source,
      'target', NEW.target
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER on_task_insert
  AFTER INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_created();
```

---

## Edge Functions

For custom logic without n8n:

```typescript
// supabase/functions/dispatch-task/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { task_id, target } = await req.json()
  
  // Route based on target
  const endpoints = {
    'N8N': 'https://n8n.bermech.com/webhook/task-dispatcher',
    'MEMORY': 'https://memory.bermech.com/api/tasks'
  }
  
  const response = await fetch(endpoints[target] || endpoints['N8N'], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id, target })
  })
  
  return new Response(JSON.stringify({ dispatched: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## As Alternative to Memory API

Supabase can replace localhost:8765 entirely:

| Memory API Endpoint | Supabase Equivalent |
|---------------------|---------------------|
| GET /context | SELECT * FROM memory |
| POST /api/tasks | INSERT INTO tasks |
| GET /api/tasks?target=X | SELECT * FROM tasks WHERE target='X' |
| POST /api/events | INSERT INTO session_logs |
| POST /api/playbook/pathway | INSERT INTO playbook |

**Advantage:** Always available (cloud), no tunnel needed, realtime subscriptions.

---

## Setup Checklist

- [ ] Create Supabase project
- [ ] Run schema SQL above
- [ ] Enable pg_net extension (for webhooks)
- [ ] Create edge functions if needed
- [ ] Store credentials in n8n
- [ ] Update routes.json with Supabase endpoints
