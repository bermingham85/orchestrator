# Task Handoff Prompt

## Task ID: {task_id}

## Source Platform
- Platform: {source_platform}
- Completed Steps: {completed_steps}
- Current State: {current_state}

## Target Platform
- Platform: {target_platform}
- Remaining Steps: {remaining_steps}

## Context Transfer
{all_relevant_context}

## Files/Artifacts
| File | Location | Purpose |
|------|----------|--------|
{file_list}

## Instructions for Target
{specific_continuation_instructions}

## Expected Outcome
{what_success_looks_like}

## Handoff Confirmation
```json
{
  "task_id": "",
  "from": "",
  "to": "",
  "context_transferred": true,
  "files_accessible": true,
  "ready_to_continue": true
}
```