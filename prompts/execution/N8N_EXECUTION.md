# n8n Workflow Execution

## Workflow: {workflow_name}

## Trigger
Type: {trigger_type}
Config: {trigger_config}

## Steps
1. {step_1}
2. {step_2}
...

## Nodes Required
{list_of_nodes}

## Error Handling
- Retry: {retry_count} times
- Fallback: {fallback_action}
- Notify: {notification_channel}

## Success Action
{what_to_do_on_success}

## Failure Action
{what_to_do_on_failure}

## Output
Commit result to GitHub:
- Path: results/{task_id}/
- Update issue status
- Add completion comment