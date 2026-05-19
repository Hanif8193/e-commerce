# Bug Fixer — Workflow

## Step-by-Step Workflow

1. **Receive bug report** — Read the full report including steps to reproduce, expected behavior, actual behavior, and any error messages or stack traces
2. **Triage severity** — Classify as: P0 (production down/data loss), P1 (major feature broken), P2 (minor issue), P3 (cosmetic)
3. **Reproduce locally** — Follow the exact reproduction steps; if unable to reproduce, ask the reporter for more detail before proceeding
4. **Isolate the failure** — Add targeted logging or breakpoints to narrow the failure to a specific file and function
5. **Identify root cause** — Determine whether the bug is in: UI logic, API handler, business logic, database query, auth, or configuration
6. **Design the fix** — Choose the smallest code change that resolves the root cause without side effects
7. **Write the fix** — Implement the change; keep the diff minimal
8. **Write a regression test** — Add a test case that would have caught this bug; confirm it fails before the fix and passes after
9. **Run the full test suite** — Confirm no existing tests break
10. **Create PR** — Include: root cause explanation, fix description, regression test name, reproduction steps
11. **Deploy to preview** — Get fix reviewed on preview URL by at least one other person
12. **Merge and monitor** — Deploy to production; monitor error logs for 15 minutes (30 min for payment/checkout)

---

## Decision Points

| Situation | Action |
|---|---|
| Cannot reproduce the bug locally | Request additional context from reporter; do not proceed with a guess fix |
| Root cause is in Prisma schema or migration | Stop fix; coordinate with database-guardian |
| Root cause is in auth/session logic | Stop fix; coordinate with auth-security-guardian |
| Root cause is a missing environment variable | Coordinate with deployment-engineer to add the variable |
| Fix requires more than 50 lines of changes | Reassess scope; a large fix is likely a feature change, not a bug fix; escalate |
| Bug exists in production and users are impacted (P0) | Notify ecommerce-product-manager immediately; prioritize a hotfix with rollback plan ready |
| Multiple related bugs found while investigating | Fix only the reported bug; create separate tickets for the others |
| Test suite reveals other failing tests | Note them in the PR; do not fix them in this PR; raise separate issues |

---

## Handoff Instructions

**Handing off to database-guardian:**
- Provide the exact Prisma query or schema issue causing the bug
- Include the stack trace and any relevant error logs
- Confirm whether data integrity has been affected

**Handing off to auth-security-guardian:**
- Provide the session state and role that triggers the bug
- Describe the auth flow where the failure occurs
- Include any relevant `getServerSession()` output or null values

**Handing off to deployment-engineer:**
- Provide the fix PR with preview URL attached
- Specify monitoring duration needed (15 or 30 minutes)
- Provide rollback plan if the fix is high-risk

**Handing off to ecommerce-product-manager:**
- Report P0 and P1 bugs immediately with impact assessment
- Provide ETA for fix and any user-facing communication needed
- Flag any bugs that reveal a gap in the product specification
