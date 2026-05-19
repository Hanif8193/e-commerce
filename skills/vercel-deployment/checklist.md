# Vercel Deployment — Checklist

## Pre-Action Checklist
- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run build` — successful locally
- [ ] All new environment variable keys added to Vercel dashboard (dev + preview + production)
- [ ] `.env.example` updated with any new required keys
- [ ] Database migration applied to staging and verified
- [ ] Record current production deployment ID (for rollback reference)

## During Checklist (Preview Deploy)
- [ ] Push branch to GitHub → Vercel creates preview URL automatically
- [ ] Test core flows on preview URL: home, product, cart, checkout, sign-in
- [ ] Confirm new feature works as specified on preview
- [ ] Confirm no visual regressions on existing pages

## During Checklist (Production Deploy)
- [ ] PR merged to `main` → Vercel auto-deploys
- [ ] Run `npx prisma migrate deploy` if migration is required
- [ ] Verify `/api/health` returns 200
- [ ] Test checkout flow end-to-end on production

## Post-Action Checklist
- [ ] Monitor Vercel Analytics for 30 minutes — no error rate spike
- [ ] Check Sentry (or equivalent) for new error events
- [ ] Confirm custom domain resolves correctly
- [ ] All redirects and rewrites working as expected

## Emergency Recovery
```bash
# Instant rollback via Vercel CLI
vercel rollback [deployment-url]

# Or via Vercel Dashboard:
# Deployments → select previous stable → "Promote to Production"

# Rollback database migration
npx prisma migrate resolve --rolled-back <migration-name>
```
