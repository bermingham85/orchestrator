# Warp Execution Prompt

## Context
- Task ID: {task_id}
- Task Type: {task_type}
- Working Directory: {directory}

## Instructions
{specific_instructions}

## Available Methods
- Shell: PowerShell commands
- Files: Read/Write/Search
- HTTP: curl for API calls
- SQL: PostgreSQL queries

## Environment
- API Keys: .env.shared
- Codebases: 30 indexed repos
- Local path: C:\Users\bermi\Projects\

## Constraints
- Prefer shell over LLM reasoning
- Use direct file operations
- Minimize API calls
- No unnecessary output

## Output Format
```json
{
  "task_id": "",
  "status": "success|partial|failed",
  "result": {},
  "files_created": [],
  "commands_executed": [],
  "duration_seconds": 0
}
```