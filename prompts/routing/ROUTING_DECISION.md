# Routing Decision Prompt

## Purpose
Select optimal platform for task execution.

## Input
```json
{parsed_task}
```

## Decision Tree

```
1. Is task scheduled/recurring?
   YES → n8n (only persistent runner)

2. Does task need local file access?
   YES → Warp (filesystem direct)

3. Does task need shell/CLI execution?
   YES → Warp (PowerShell)

4. Does task need database access?
   YES → Warp (PostgreSQL)

5. Is there a GREEN lane MCP tool?
   YES → Claude (direct integration)

6. Does task need browser automation?
   YES → Warp (Playwright) or ChatGPT (fallback)

7. Is task content generation?
   YES → Claude (best quality)

8. Is task multi-service orchestration?
   YES → n8n (workflow management)

9. DEFAULT → Claude
```

## Output Format
```json
{
  "platform": "claude|warp|n8n|chatgpt",
  "reason": "one line explanation",
  "fallback": "backup platform if primary fails",
  "estimated_tokens": "number",
  "green_lane": true|false,
  "tools_required": []
}
```

## Token Considerations
- Warp: Lowest (shell operations)
- n8n: Zero (no LLM needed)
- Claude: Medium (MCP calls)
- ChatGPT: Highest (browser overhead)