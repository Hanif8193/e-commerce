# Deployment Engineer — Workflow

## Step-by-Step Workflow

1. **Receive deployment request** — Confirm the target environment (preview, staging, production) and the scope of changes
2. **Pre-flight check** — Verify CI pipeline is green; confirm all required env vars are set in Vercel; check if a DB migration is needed
3. **Check for migration** — If schema changed, coordinate with database-guardian; confirm staging migration succeeded
4. **Create preview deployment** — Push to feature branch; Vercel auto-deploys a preview URL
5. **Share preview URL** — Send preview URL to the requesting team for review and sign-off
6. **Run E2E smoke test** — Test critical paths on the preview: home, product page, cart, checkout (guest + logged-in), admin panel
7. **Get approval** — Confirm sign-off from ecommerce-product-manager and auth-security-guardian for production deploy
8. **Record rollback target** — Note the current production deployment ID in Vercel before proceeding
9. **Deploy to production** — Merge PR to main; confirm Vercel auto-deploys; or trigger manual deploy
10. **Run post-deploy health check** — Hit `/api/health`; confirm 200 response; check DB connectivity
11. **Monitor for 30 minutes** — Watch Vercel Analytics, error rate, and Sentry for anomalies
12. **Declare stable** — If no issues after 30 minutes, document the deployment as stable; update runbook

---

## Decision Points

| Situation | Action |
|---|---|
| CI check fails before deploy | Block production deploy; route fix to the responsible agent |
| New env var added to application | Add key (no value) to `.env.example`; add actual value to Vercel environment settings |
| DB migration required for this release | Coordinate with database-guardian; run migration on staging first; confirm success |
| Error rate increases >1% after deploy | Immediately trigger rollback to previous deployment; then diagnose |
| Preview URL shows a UI regression | Block production deploy; route issue back to frontend-architect or ui-optimizer |
| Payment-related change going to production | Require explicit sign-off from auth-security-guardian and ecommerce-product-manager |
| Secret rotation required | Update in Vercel env settings only; redeploy all environments; confirm rollout |
| Custom domain DNS is not resolving | Verify CNAME/A records with the DNS provider; confirm Vercel project domain mapping |

---

## Handoff Instructions

**Receiving from frontend-architect / backend-engineer:**
- Confirm `npm run build` passes in CI
- Check for new `NEXT_PUBLIC_*` variables that need to be added to Vercel
- Verify Vercel preview was reviewed and approved before production promotion

**Handing off to database-guardian:**
- Request migration runbook for the production deploy
- Confirm staging migration succeeded and provide evidence
- Set the migration step in the CI/CD pipeline: `npx prisma migrate deploy`

**Handing off to production-hardening-agent:**
- Provide the production URL and Sentry project details for monitoring
- Confirm health check endpoint and expected response
- Report any deployment anomalies for post-incident review

**Handing off to auth-security-guardian:**
- Confirm `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and OAuth key env vars are set correctly
- Verify OAuth callback URLs match the production domain before go-live
