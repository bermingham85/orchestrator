# Hugging Face Service Reference

## Lane: 🟢 GREEN (Direct MCP)
## Platform: Claude Desktop/Web

## Tools Available

| Tool | Purpose |
|------|--------|
| `Hugging Face:model_search` | Find ML models |
| `Hugging Face:dataset_search` | Find datasets |
| `Hugging Face:space_search` | Find Spaces/apps |
| `Hugging Face:paper_search` | Find research papers |
| `Hugging Face:hub_repo_details` | Get repo info |
| `Hugging Face:hf_doc_search` | Search documentation |
| `Hugging Face:gr1_z_image_turbo_generate` | Generate images |

## Image Generation

```javascript
Hugging Face:gr1_z_image_turbo_generate({
  prompt: "A beautiful sunset over mountains",
  resolution: "1024x1024 ( 1:1 )",
  steps: 8,
  random_seed: true
})
```

### Resolutions Available
- 1024x1024 ( 1:1 )
- 1152x896 ( 9:7 )
- 1280x720 ( 16:9 )
- 1344x576 ( 21:9 )
- And portrait variants

## Model Search Example
```javascript
Hugging Face:model_search({
  query: "text generation",
  task: "text-generation",
  limit: 10
})
```

## Notes
- Z-Image is fast (8 steps default)
- Good alternative to FAL for image gen
- Paper search useful for research tasks