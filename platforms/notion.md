# Notion (NOT)

Platform: Notion (docs, databases, wikis)

---

## Role

**Documentation hub + lightweight database.** Best for docs that need rich formatting and human editing.

---

## Capabilities

### Can Do
- Rich documents (pages, subpages)
- Databases (tables, boards, calendars, galleries)
- Wikis and knowledge bases
- Comments and mentions
- API access
- Automations (limited)

### MCP Available
Claude has native Notion MCP access via connector.

---

## Connection Methods

### From Claude (via MCP)
```
Use Notion MCP tools directly for:
- Reading pages and databases
- Creating/updating content
- Searching
```

### From n8n
- Native Notion node
- Full CRUD on pages and databases
- Trigger on database changes

### From Any Platform (API)
```javascript
fetch('https://api.notion.com/v1/pages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(pageData)
})
```

---

## Orchestrator Use Cases

### Documentation Hub
- Platform configs (mirror of GitHub /platforms/)
- Runbooks and procedures
- Meeting notes and decisions
- Project documentation

### Lightweight Task Board
- Kanban view of tasks
- Good for visual overview
- Not as robust as Airtable for automation

---

## Best For

- Long-form documentation
- Knowledge bases
- Project wikis
- Content that humans edit frequently

## Not Best For

- High-frequency task routing (use Airtable or Supabase)
- Automation triggers (limited)
- Structured data with complex relations
