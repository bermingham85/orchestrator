# Canva Service Reference

## Lane: 🟢 GREEN (Direct MCP)
## Platform: Claude Desktop/Web

## Tools Available

| Tool | Purpose |
|------|--------|
| `Canva:generate-design` | AI-powered design creation |
| `Canva:create-design-from-candidate` | Convert AI design to editable |
| `Canva:export-design` | Export to PDF/PNG/PPTX/JPG |
| `Canva:search-designs` | Find existing designs |
| `Canva:get-design-content` | Read design text content |
| `Canva:list-brand-kits` | Get brand kit options |
| `Canva:resize-design` | Change design dimensions |

## Typical Workflow

```
1. Canva:generate-design
   - query: "description of design"
   - design_type: presentation|poster|instagram_post|etc
   
2. Canva:create-design-from-candidate
   - job_id: from step 1
   - candidate_id: from step 1
   
3. Canva:export-design
   - design_id: from step 2
   - format: {type: "pdf"} or {type: "png"}
```

## Design Types
- presentation
- poster
- instagram_post
- facebook_post
- flyer
- business_card
- logo
- youtube_thumbnail
- document
- infographic

## Notes
- Always ask user about brand kit before generating
- Use list-brand-kits to show options
- Export provides download URL