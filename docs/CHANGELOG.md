# Changelog

All notable changes to the orchestrator system.

---

## [1.1.0] - 2026-01-12

### Added
- **Bidirectional Channels** (routes/CHANNELS.json)
  - All platform-to-platform routes now documented both directions
  - Specific subproduct support (CW, CD, CC, CI, GPT, GPTD, GPTI)
  - Transport methods documented (HTTP, MCP, filesystem, sheets, github)
  
- **Tools Registry** (tools/REGISTRY.json)
  - All recent tools with localhost locations
  - Usage instructions per tool
  - Trigger methods by platform
  - API endpoints documented
  
- **Doc Control System** (docs/DOC-CONTROL.md)
  - Versioning standard
  - Document registry
  - Location resolution by platform
  - Change process

- **New Platforms Documented**
  - Claude Code (CC)
  - Claude iOS (CI)
  - ChatGPT Desktop (GPTD)
  - ChatGPT iOS (GPTI)

### Changed
- Routing philosophy: Claude-outbound → Full bidirectional
- GitHub as delivery hub for all outputs

---

## [1.0.0] - 2026-01-12

### Added
- Initial orchestrator structure
- Basic routes.json (CW, CD, GPT, N8N)
- Platform capability docs
- Shortcut system (32 active shortcuts)
- [startup] shortcut for session bootstrap
