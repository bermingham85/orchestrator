# [createshortcut] - Create and Distribute New Shortcut

## Purpose
Create a new shortcut, generate prompt file, push to GitHub, notify all platforms.

## Input Required
```
name: single word (lowercase)
description: what it does
platform: claude/warp/n8n/any
category: text/image/video/audio/automation/system/dev
steps: numbered execution steps
requires: [dependencies]
outputs: [file types]
```

## Execution Flow

### Step 1: Validate
- Name not in REGISTRY.json
- Format: ^[a-z][a-z0-9]*$ (max 20 chars)
- Valid platform and category

### Step 2: Generate Prompt File
Create `shortcuts/{name}.md`:
```markdown
# [{name}] - {description}

## Purpose
{description}

## Execution Flow
{steps}

## Platform Implementation
### Claude
{instructions}
### Warp
{powershell}
### n8n
{workflow nodes}

## Output
{expected output}
```

### Step 3: Update REGISTRY.json
Add entry with status: "active"

### Step 4: Push to GitHub
```
Repo: bermingham85/orchestrator
Branch: main
Files: shortcuts/{name}.md, shortcuts/REGISTRY.json
```

### Step 5: Create Sync Task
```json
{
  "task": "sync_shortcut",
  "shortcut": "{name}",
  "source": "{requesting_platform}",
  "action": "all_platforms_pull"
}
```

## Platform-Specific Creation

### Claude Creates
1. Generate prompt markdown
2. Push via GitHub MCP
3. Other platforms pull on next sync

### Warp Creates
1. Generate locally
2. Push via git CLI
3. Trigger n8n webhook

### n8n Creates
1. Generate via Code node
2. Push via GitHub node
3. Webhook notify others

## Sync Mechanism
- Claude: Check on session start
- Warp: git pull on session start
- n8n: Hourly hash check of REGISTRY.json

## Example
```
[createshortcut]
name: storyboard
description: Generate visual storyboard from script
platform: warp
category: image
steps:
  1. Parse script into scenes
  2. Generate prompt per scene
  3. Submit to FAL
  4. Arrange in grid
  5. Export PDF
requires: fal_api
outputs: pdf, png
```

## Validation Errors
| Error | Action |
|-------|--------|
| Name exists | Suggest alternative |
| Invalid format | Show rules, retry |
| GitHub fails | Save local, queue retry |
