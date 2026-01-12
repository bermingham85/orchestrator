# [shortcuts] - List Available Shortcuts

## Purpose
Display all registered shortcuts with status, platform, and description.

## Execution

### Step 1: Load Registry
```
Source: https://raw.githubusercontent.com/bermingham85/orchestrator/main/shortcuts/REGISTRY.json
```

### Step 2: Format Output
Group by category, show status:
- Active (prompt file exists)
- Proposed (no prompt file)

### Step 3: Display by Category

## Platform Implementation

### Claude
Fetch REGISTRY.json via web_fetch or cached memory.
Format as markdown table grouped by category.

### Warp
```powershell
$registry = Invoke-RestMethod "https://raw.githubusercontent.com/bermingham85/orchestrator/main/shortcuts/REGISTRY.json"
$registry.shortcuts.PSObject.Properties | Group-Object { $_.Value.category } | ForEach-Object {
    Write-Host "`n$($_.Name.ToUpper())"
    $_.Group | ForEach-Object {
        $status = if ($_.Value.status -eq "active") { "[x]" } else { "[ ]" }
        Write-Host "  $status [$($_.Name)] - $($_.Value.description)"
    }
}
```

### n8n
1. HTTP Request node: GET REGISTRY.json
2. Code node: Format output
3. Respond node: Return formatted list

## Output Format
```
ACTIVE: 28 | PROPOSED: 25 | TOTAL: 53

TEXT
  [x] [doc] - Create/edit Word documents
  [x] [sheet] - Create/edit spreadsheets
  ...

IMAGE
  [x] [poster] - Create static visual designs
  [ ] [characters] - Character reference sheets
  ...
```
