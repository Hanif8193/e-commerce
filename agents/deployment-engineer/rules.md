# Deployment Engineer — Rules

## Strict DO Rules
- **DO** require all CI checks to pass before any production deployment
- **DO** always create a preview deployment and get review sign-off before promoting to production
- **DO** record the rollback deployment ID before every production deploy
- **DO** monitor Vercel Analytics for a minimum of 30 minutes after every production deployment
- **DO** verify `/api/health` returns 200 immediately after every deployment
- **DO** keep `.env.example` up to date with all required variable keys (no values)
- **DO** store all secrets exclusively in Vercel environment settings — never in the repository
- **DO** run `npx prisma migrate deploy` as part of the production deployment pipeline
- **DO** use GitHub branch protection: require PR review and passing CI before merge to main
- **DO** document every production deployment in the deployment log with timestamp, version, and deployer

## Strict DON'T Rules
- **DON'T** deploy to production without a passing CI build
- **DON'T** commit `.env.local`, `.env`, or any file with actual secret values
- **DON'T** delete previous successful Vercel deployments — they are needed for rollback
- **DON'T** modify application code, Prisma schema, or UI components during deployment operations
- **DON'T** deploy a payment or auth change without explicit sign-off from auth-security-guardian
- **DON'T** apply DB migrations to production without staging verification
- **DON'T** ignore a >1% error rate spike after deployment — trigger rollback immediately
- **DON'T** skip the post-deploy smoke test on checkout, login, and cart flows
- **DON'T** force-push to `main` or `production` branches
- **DON'T** deploy on Fridays or before public holidays unless it is a critical hotfix

## Recovery Steps
1. **Production deployment causes error rate spike** — Immediately trigger Vercel instant rollback to the recorded previous deployment; notify the responsible agent; document the incident
2. **CI build failing in GitHub Actions** — Reproduce locally with `npm run build`; identify the error; route to the agent responsible for the failing module
3. **Environment variable missing in production** — Add the variable to Vercel environment settings immediately; trigger a redeploy (no code change needed); verify
4. **DB migration fails in production pipeline** — Stop the deployment; assess database state with database-guardian; restore from pre-migration backup if data is corrupted; do not retry blindly
5. **Custom domain not resolving after DNS change** — Check DNS propagation with `dig` or `nslookup`; verify CNAME/A record is correctly set in the domain registrar; confirm Vercel project domain assignment

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| CI failing due to TypeScript or lint errors | frontend-architect or backend-engineer (whichever owns the file) |
| DB migration step failing | database-guardian immediately |
| Auth environment variables incorrect | auth-security-guardian |
| Production error rate elevated after deploy | bug-fixer (for diagnosis) + production-hardening-agent (for monitoring) |
| Security-sensitive change (payment, auth) going to production | auth-security-guardian (required sign-off) |
| Performance regression detected post-deploy | performance-auditor |
| Product team requires rollback approval discussion | ecommerce-product-manager |
