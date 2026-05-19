# Vercel Deployment — Examples

## Example 1: Deploy Preview Branch
```bash
# Vercel automatically deploys every push to a non-main branch
git push origin feature/product-filters
# → Vercel creates: https://my-store-feature-product-filters.vercel.app

# Or manually trigger a preview deploy
vercel --env preview
```

---

## Example 2: Add Environment Variable via CLI
```bash
# Add a new secret to production
vercel env add STRIPE_SECRET_KEY production

# Pull all env vars to local .env.local
vercel env pull .env.local

# List all env vars for an environment
vercel env ls production
```

---

## Example 3: Production Deploy Workflow
```bash
# 1. Ensure CI passes on GitHub (lint, typecheck, build)
# 2. Merge PR to main — Vercel auto-deploys

# 3. Apply DB migration (if needed)
npx prisma migrate deploy

# 4. Verify health check
curl https://yourstore.com/api/health
# Expected: { "status": "ok", "db": "connected" }

# 5. Monitor for 30 minutes via Vercel Dashboard → Analytics
```

---

## Recovery: Deployment Broke Production
```bash
# Step 1: Immediate rollback via Vercel dashboard
# Go to: Project → Deployments → previous stable → Promote to Production

# Step 2: Via CLI
vercel rollback https://my-store-abc123.vercel.app

# Step 3: Diagnose root cause
vercel logs --follow  # stream production logs

# Step 4: Fix on a branch → preview → verify → redeploy
```
