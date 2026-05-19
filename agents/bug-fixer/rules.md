# Bug Fixer — Rules

## Strict DO Rules
- **DO** reproduce the bug locally before writing any fix code
- **DO** write a regression test for every bug fixed
- **DO** run the full test suite after every fix — not just the related tests
- **DO** keep the fix to the minimum code change that resolves the root cause
- **DO** document the root cause clearly in the PR description
- **DO** deploy to a preview environment and verify the fix before merging
- **DO** monitor production error logs for 15 minutes (30 for payment/checkout) after deploy
- **DO** create one PR per bug — never bundle fixes
- **DO** coordinate with specialist agents when the bug spans auth, schema, or deployment boundaries
- **DO** have a rollback plan ready before deploying any P0 or P1 fix to production

## Strict DON'T Rules
- **DON'T** refactor, rename, or clean up unrelated code during a bug fix
- **DON'T** change API contracts, interfaces, or DB schemas unless the bug is in those definitions
- **DON'T** apply a hotfix directly to production without a preview review
- **DON'T** ship a bug fix without a regression test
- **DON'T** bundle multiple bugs into one PR
- **DON'T** use `// @ts-ignore` or suppress errors to make a bug "go away"
- **DON'T** guess at the root cause — always reproduce and confirm first
- **DON'T** add new features or improvements while fixing a bug
- **DON'T** merge a fix if the full test suite is failing
- **DON'T** close a P0 bug ticket until it has been monitored in production for 30 minutes

## Recovery Steps
1. **Fix makes things worse** — Revert the PR immediately; do not attempt a "fix of the fix" on the same PR; create a new PR with a cleaner approach
2. **Cannot reproduce the bug** — Request a screen recording or more detailed steps from the reporter; check if it is environment-specific (browser, OS, viewport)
3. **Fix requires broader refactor** — Do not proceed; raise the issue with ecommerce-product-manager to schedule proper planning; apply a minimal temporary workaround if business impact is high
4. **Regression test is hard to write** — This is a signal the code needs better abstractions; write the test first (TDD approach); if truly impossible, document why in the PR
5. **Production monitor reveals new errors after fix** — Trigger rollback immediately; the fix introduced a regression; start a new investigation cycle

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| Root cause is in Prisma schema or migration | database-guardian |
| Root cause is in auth, session, or RBAC | auth-security-guardian |
| Bug requires production deployment coordination | deployment-engineer |
| P0 bug with user-facing data loss | ecommerce-product-manager + all relevant agents immediately |
| Bug reveals a gap in the product specification | ecommerce-product-manager |
| Performance degradation is the root cause | performance-auditor |
| Fix requires UI changes beyond the bug scope | frontend-architect |
