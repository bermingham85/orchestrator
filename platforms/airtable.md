# Airtable (AIR)

Platform: Airtable (structured database with views, automations)

---

## Role

**Visual database + automation triggers.** Good for structured data that humans also need to view/edit.

---

## Capabilities

### Can Do
- Structured data storage (tables, fields, views)
- Automations (triggers on record changes)
- Forms for data input
- Interface designer (custom UIs)
- Scripting (JavaScript automations)
- Webhooks on record changes
- API access (REST)

### MCP Available
Claude has native Airtable MCP access for:
- list_bases, list_tables
- list_records, search_records, get_record
- create_record, update_records, delete_records
- create_table, create_field

---

## Connection Methods

### From Claude (via MCP)
```
Use Airtable MCP tools directly:
- Airtable MCP Server:list_records
- Airtable MCP Server:create_record
- etc.
```

### From n8n
- Native Airtable node
- Full CRUD operations
- Trigger on new/updated records

### From Any Platform (API)
```javascript
fetch('https://api.airtable.com/v0/{baseId}/{tableName}', {
  headers: {
    'Authorization': `Bearer ${AIRTABLE_PAT}`,
    'Content-Type': 'application/json'
  }
})
```

---

## Orchestrator Tables

**Base: ORCHESTRATOR_HQ**

### Tasks Table
| Field | Type |
|-------|------|
| task_id | Single line text (Primary) |
| source | Single select (CW, CD, GPT, N8N...) |
| target | Single select |
| action | Single line text |
| payload | Long text (JSON) |
| status | Single select (PENDING, PROCESSING, COMPLETED, FAILED) |
| created | Created time |
| completed | Date time |
| result | Long text (JSON) |

### Sessions Table
| Field | Type |
|-------|------|
| session_id | Single line text (Primary) |
| platform | Single select |
| summary | Long text |
| events | Long text (JSON array) |
| created | Created time |

### Playbook Table
| Field | Type |
|-------|------|
| name | Single line text (Primary) |
| description | Long text |
| steps | Long text (JSON) |
| use_count | Number |
| last_used | Date time |

---

## Automations

### On New Task (target = specific platform)
```
Trigger: When record matches conditions (status = PENDING, target = N8N)
Action: Send webhook to https://n8n.bermech.com/webhook/airtable-task
```

### On Task Completed
```
Trigger: When record updated (status changed to COMPLETED)
Action: Send webhook to notify source platform
```

---

## Advantages Over Sheets

- Richer field types
- Built-in automations
- Better API
- Native n8n integration
- Interface designer for dashboards

## When to Use

- Human needs to view/edit tasks visually
- Need relational data (linked records)
- Want built-in automations without Apps Script
- Claude needs direct MCP access to task data
