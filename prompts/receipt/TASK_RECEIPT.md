# Task Receipt Prompt

## Purpose
Parse incoming task into structured format for routing.

## Input
```
{task_description}
```

## Instructions
Parse the task and output structured JSON.

## Output Format
```json
{
  "task_id": "TASK-{timestamp}",
  "task_type": "code|content|api|file|browser|scheduled",
  "priority": "P0|P1|P2|P3",
  "required_capabilities": [],
  "estimated_tokens": "low|medium|high",
  "deadline": null,
  "routing_recommendation": "claude|warp|n8n|chatgpt"
}
```

## Task Types
- **code**: Programming, scripts, debugging
- **content**: Writing, generation, translation
- **api**: External service integration
- **file**: Local filesystem operations
- **browser**: Web automation required
- **scheduled**: Recurring/timed execution

## Priority Levels
- **P0**: Critical, immediate
- **P1**: High, today
- **P2**: Medium, this week
- **P3**: Low, whenever