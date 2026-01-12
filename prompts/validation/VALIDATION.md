# Task Validation Prompt

## Task ID: {task_id}

## Original Task
{task_description}

## Acceptance Criteria
{criteria_list}

## Submitted Result
{result}

## Evidence
{evidence_list}

## Validation Checklist
For each criterion:
- [ ] Criterion description
- [ ] Met? Yes/No
- [ ] Evidence confirms? Yes/No

## Verdict
```json
{
  "task_id": "",
  "verdict": "PASS|FAIL|PARTIAL",
  "criteria_met": 0,
  "criteria_total": 0,
  "missing": [],
  "recommendation": "accept|retry|escalate"
}
```

## Actions
- PASS: Move to completed, close issue
- PARTIAL: Note gaps, request completion
- FAIL: Move to failed, assign retry or escalate