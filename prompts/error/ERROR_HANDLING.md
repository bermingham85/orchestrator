# Error Handling Prompt

## Task ID: {task_id}

## Error Details
- Type: {error_type}
- Message: {error_message}
- Platform: {platform}
- Failed Step: {failed_step}

## Recovery Options

### Option 1: Retry Same Platform
- Applicable when: Transient error, timeout
- Max retries: 3
- Backoff: Exponential

### Option 2: Fallback Platform
- Target: {alternative_platform}
- Applicable when: Capability gap

### Option 3: Partial Completion
- Return completed portion
- Flag remaining for manual

### Option 4: Abort
- Log failure
- Notify user
- Close task

## Decision Logic
```
IF error is transient (timeout, rate limit):
  → Retry up to 3 times

IF error is auth failure:
  → Notify user, abort

IF error is capability gap:
  → Route to fallback platform

IF error is fatal:
  → Abort with full report
```

## Output
```json
{
  "task_id": "",
  "error_type": "",
  "action_taken": "retry|fallback|partial|abort",
  "result": {},
  "requires_manual": false
}
```