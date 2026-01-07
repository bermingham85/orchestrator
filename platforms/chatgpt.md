# ChatGPT (GPT)

## Capabilities
- MCP servers (public URLs via tunnel)
- DALL-E image generation
- Code Interpreter
- Web browsing

## Cannot Do
- Access localhost directly (needs Cloudflare tunnel)
- Direct communication with CW or CD

## Routes
| Target | Method | Endpoint |
|--------|--------|----------|
| n8n | MCP/HTTP | https://n8n.bermech.com |
| Memory API | HTTP | https://memory.bermech.com |
| GitHub | API | Direct |
| Sheets | API | Direct |
