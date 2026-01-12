# Claude Execution Prompt

## Context
- Task ID: {task_id}
- Task Type: {task_type}
- Priority: {priority}
- Deadline: {deadline}

## Instructions
{specific_instructions}

## Available MCP Tools
{list_relevant_tools_only}

## Constraints
- Minimize token usage
- Use direct MCP calls when available
- Report progress at milestones
- Capture evidence (outputs/confirmations)

## Success Criteria
{acceptance_criteria}

## Output Format
```json
{
  "task_id": "",
  "status": "success|partial|failed",
  "result": {},
  "evidence": [],
  "tokens_used": 0,
  "duration_seconds": 0,
  "notes": ""
}
```

## Error Handling
If task fails:
1. Capture error message
2. Attempt recovery if possible
3. Report failure with diagnostics
4. Suggest fallback platform if applicable