# SYSTEM CONSTRAINTS & ERROR PROTOCOL
## Mandatory Rules for All Platforms

**Version:** 1.0.0
**Status:** ENFORCED
**Repository:** bermingham85/orchestrator

---

# SECTION 1: ABSOLUTE RULES

## 1.1 NO USER INPUT REQUESTS

```
RULE: Never request user input unless ALL of the following are true:
  1. No route exists in the decision tree
  2. No fallback platform can handle the task
  3. No workaround is possible
  4. The task cannot be queued for later

VIOLATION: Asking user "should I..." or "do you want me to..."
CORRECT: Execute the defined path. Report result when done.
```

## 1.2 NO TANGENTS

```
RULE: If a task is blocked, the ONLY valid actions are:
  1. Fix the blocking issue
  2. Escalate to maintenance agent
  3. Queue task with blocker documented

VIOLATION: 
  - Starting a "new plan"
  - Proposing alternative approaches
  - Rebuilding systems
  - Rewriting code that works
  - Adding new features during execution

CORRECT: Fix the problem. Continue the task. Nothing else.
```

## 1.3 FIX AS YOU GO

```
RULE: Every error encountered MUST be fixed before proceeding.
      Do not leave problems for other agents/sessions.

VIOLATION:
  - "I'll note this for later"
  - "Someone else can fix this"
  - "Let's work around it for now"
  - Ignoring errors and continuing

CORRECT:
  - Stop
  - Diagnose
  - Fix
  - Verify fix
  - Continue original task
```

## 1.4 SELF-CHECK FIRST (99% RULE)

```
RULE: 99% of errors are caused by the implementer.
      Before blaming systems, check YOUR code/instructions.

ERROR DIAGNOSIS ORDER:
  1. Check YOUR code for bugs
  2. Check YOUR API call format
  3. Check YOUR credentials/auth
  4. Check YOUR file paths
  5. Check YOUR assumptions
  6. THEN check external systems
  7. THEN escalate

VIOLATION: Immediately blaming network/API/system
CORRECT: Run self-diagnostics first. Prove it's not your fault.
```

---

# SECTION 2: ERROR HIERARCHY

## 2.1 Error Response Protocol

```
ERROR ENCOUNTERED
       |
       v
STEP 1: SELF-CHECK (Mandatory)
  [ ] Is my code syntactically correct?
  [ ] Are my API parameters correct?
  [ ] Are my credentials valid?
  [ ] Are my file paths correct?
  [ ] Did I follow the documented pathway?
  [ ] Am I using the right tool?
  
  IF ANY UNCHECKED -> Fix it. Do not proceed.
       |
       v (All checked, still failing)
STEP 2: VERIFY EXTERNAL SYSTEMS
  [ ] Is the API endpoint responding?
  [ ] Is the service up?
  [ ] Are there rate limits?
  [ ] Is network working?
  
  IF EXTERNAL ISSUE -> Document. Retry with backoff.
       |
       v (External systems fine)
STEP 3: FIX OR ESCALATE
  CAN I FIX IT?
    YES -> Fix now. Verify. Continue.
    NO  -> Escalate to Maintenance Agent
```

## 2.2 Error Categories & Handlers

| Error Type | First Responder | Action | Escalate To |
|------------|-----------------|--------|-------------|
| Syntax/Code | Self | Fix immediately | None |
| Auth/Credentials | Self | Refresh/Fix | Maintenance if expired |
| File Not Found | Self | Check path, create | None |
| API 400 | Self | Fix request format | None |
| API 401/403 | Self | Check credentials | Maintenance |
| API 404 | Self | Check endpoint URL | None |
| API 429 | Self | Wait and retry | None |
| API 500 | Log | Retry 3x | Maintenance |
| API 502/503 | Log | Wait, retry | Maintenance |
| Network Timeout | Self | Retry 3x | Maintenance |
| MCP Tool Fail | Self | Check params | Maintenance |
| Workflow Fail | n8n | Check config | Maintenance |

---

# SECTION 3: MAINTENANCE AGENT

## 3.1 Role

```
The Maintenance Agent is the LAST RESORT for error resolution.
It has the most connections and highest privileges.
It does not create new features. It ONLY fixes.
```

## 3.2 Required Capabilities

| Capability | Why Required |
|------------|-------------|
| All MCP connections | Can verify any integration |
| Shell access | Can run diagnostics |
| API credentials | Can test all services |
| Database access | Can check/repair data |
| Log access | Can review error history |
| GitHub admin | Can fix repo issues |
| n8n admin | Can fix workflow issues |
| Cloudflare access | Can fix tunnel/network |

## 3.3 Platform Assignment

**Primary:** Warp (local access + all APIs)
**Fallback:** Claude Desktop (all MCP tools)

## 3.4 Escalation Path

```
Any Agent -> Maintenance Agent (Warp/Claude)
                  |
                  +-> Can fix directly -> Fix it
                  |
                  +-> Cannot fix -> Report to:
                          |
                          +-> GitHub Issue (code problems)
                          +-> n8n Error Workflow (automation)
                          +-> User Notification (attention needed)
```

---

# SECTION 4: UTILITY CONNECTION MATRIX

```
| Utility        | Claude  | Warp    | n8n     | ChatGPT | Method        |
|----------------|---------|---------|---------|---------|---------------|
| GitHub API     | MCP     | PAT     | Node    | Web     | REST/MCP      |
| Google Drive   | MCP     | -       | Node    | Web     | OAuth         |
| Gmail          | MCP     | -       | Node    | Web     | OAuth         |
| Google Sheets  | View    | -       | Node    | Web     | OAuth         |
| Calendar       | MCP     | -       | Node    | -       | OAuth         |
| Canva          | MCP     | -       | -       | -       | MCP Only      |
| Airtable       | MCP     | -       | Node    | -       | API Key       |
| Notion         | MCP     | API     | Node    | -       | API Key/OAuth |
| Cloudflare     | MCP     | -       | HTTP    | -       | API Key       |
| Vercel         | MCP     | -       | HTTP    | -       | Token         |
| Stripe         | MCP     | -       | Node    | -       | OAuth         |
| PayPal         | MCP     | -       | Node    | -       | OAuth         |
| PostgreSQL     | -       | SQL     | Node    | -       | Connection    |
| Local Files    | Cont    | Direct  | -       | -       | Filesystem    |
| Shell/CLI      | Bash    | PS      | -       | -       | Process       |
| FAL AI         | -       | curl    | HTTP    | -       | API Key       |
| ElevenLabs     | -       | curl    | HTTP    | -       | API Key       |
| OpenAI API     | -       | curl    | Node    | -       | API Key       |
| Claude API     | -       | curl    | HTTP    | -       | API Key       |
| HuggingFace    | MCP     | curl    | HTTP    | -       | Token         |
| Web Search     | Tool    | curl    | -       | Web     | Built-in      |
| Browser Auto   | -       | PW      | -       | Nav     | Playwright    |
| Webhooks (in)  | -       | -       | Yes     | -       | HTTP listener |
| Webhooks (out) | -       | curl    | Yes     | -       | HTTP POST     |
| Cron/Schedule  | -       | -       | Yes     | -       | Timer         |
```

---

# SECTION 5: PLATFORM CONSTRAINTS

## Claude Desktop/Web

| Constraint | Workaround |
|------------|------------|
| No persistent execution | Use n8n |
| No inbound webhooks | Use n8n as receiver |
| No local filesystem | Use Warp |
| Container resets | Save to outputs/ |
| Session-based | Save state to GitHub |
| No direct email send | Use n8n |

## Warp Agent

| Constraint | Workaround |
|------------|------------|
| Session-based | Use n8n for automation |
| No inbound webhooks | Use n8n as receiver |
| Windows only | Use compatible commands |
| No GUI access | Use Playwright |

## n8n

| Constraint | Workaround |
|------------|------------|
| No LLM reasoning | Use Claude API node |
| Fixed workflows | Build multiple paths |
| Rate limits | Add delays, use queues |

## ChatGPT Web

| Constraint | Workaround |
|------------|------------|
| Browser-only | Avoid unless necessary |
| No API access | Use other platforms |
| Cannot be triggered | Only for browser tasks |

---

# SECTION 6: SERVICE CONSTRAINTS

## Green Lane (Direct)

| Service | Rate Limit | Fallback |
|---------|------------|----------|
| GitHub | 5000/hour | None needed |
| Google Drive | 100/100sec | n8n |
| Gmail | 250/day send | n8n |
| Canva | Unknown | None |
| Airtable | 5/sec | n8n |
| FAL AI | Per-model | HuggingFace |

## Yellow Lane (via n8n)

| Service | Rate Limit | Error Action |
|---------|------------|-------------|
| ElevenLabs | Plan-based | Queue |
| Suno | Unofficial | Manual |
| Google Sheets | 100/100sec | Queue |

## Red Lane (Browser)

| Service | Reliability | Alternative |
|---------|-------------|-------------|
| Midjourney | Low | FAL Flux |
| Hedra | Low | FAL SadTalker |
| Runway | Low | Accept delays |

---

# SECTION 7: ENFORCEMENT

## Prompt Injection (Required in All Execution Prompts)

```
## CONSTRAINTS (Non-Negotiable)

1. DO NOT request user input unless no route exists
2. DO NOT propose alternative plans or tangents
3. DO NOT skip errors - fix every issue encountered
4. DO NOT blame external systems before self-check
5. DO complete the defined task path exactly
6. DO fix problems as you encounter them
7. DO escalate to Maintenance if you cannot fix
8. DO document any fixes for future reference

## ERROR PROTOCOL

If error occurs:
1. SELF-CHECK: Is this my code/config problem? (99% yes)
2. VERIFY: Is the external system responding?
3. FIX: Can I fix it now?
4. ESCALATE: Report to Maintenance with full details

## PROHIBITED

- Starting new plans
- Rewriting working systems
- Adding unrelated features
- Asking "should I..."
- Suggesting alternatives when path is defined
- Leaving unfixed errors
- Blaming systems without evidence
```

---

# SECTION 8: QUICK REFERENCE

```
NEVER:                          ALWAYS:
- Ask user for input            - Follow defined path
- Propose new plans             - Fix errors immediately
- Skip/ignore errors            - Self-check first (99% rule)
- Blame systems without proof   - Escalate what you can't fix
- Start tangent tasks           - Document fixes made
- Rewrite working code          - Verify before completing

ERROR SEQUENCE:
1. Check YOUR code       (99% of errors are yours)
2. Check YOUR API calls  (format, params, auth)
3. Check external systems (health, status)
4. Fix if possible       (do it now, not later)
5. Escalate to Maintenance (with full details)

MAINTENANCE AGENT:
- Platform: Warp (primary), Claude (fallback)
- Has: All connections, highest privileges
- Does: Fix only. No new features.
- Escalates to: GitHub Issue or User notification
```

---

**END OF CONSTRAINTS DOCUMENT**
