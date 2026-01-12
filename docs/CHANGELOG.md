# Changelog

All notable changes to the orchestrator system.

---

## [1.2.0] - 2026-01-12

### Added
- **[scan] shortcut** (shortcuts/scan.md)
  - Duplication prevention before creating new tools
  - 5-phase scan: memory → registry → local → GitHub → report
  - Platform-specific adaptations (CW, CD, CC)
  - ~950 token budget

- **[rules] shortcut** (shortcuts/rules.md)
  - Quick access to all governance documents
  - View and update modes
  - Automatic versioning on changes
  - ~350-600 token budget

### Changed
- **capabilities.json** (platforms/capabilities.json) v1.1.0
  - Added bidirectional routing info (routes_to, receives_from)
  - Added GPTD (ChatGPT Desktop) platform
  - Added WARP platform
  - Added GH (GitHub) as delivery hub
  
- **REGISTRY.json** (shortcuts/REGISTRY.json) v1.4.0
  - [scan] status: proposed → active
  - [rules] status: proposed → active
  - Stats: 34 active, 20 proposed

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
