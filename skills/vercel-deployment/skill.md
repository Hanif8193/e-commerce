# Skill: Vercel Deployment

## Description
Safe, repeatable deployment to Vercel for a production Next.js ecommerce app. Covers environment variable management, preview workflows, production promotion, rollback, and post-deploy monitoring.

## When To Use
- Before every production deployment
- When adding or changing environment variables
- When setting up a new Vercel project or domain
- When performing a rollback after a failed deployment

## Key Principles
- **Preview first**: every change gets a Vercel preview URL before production
- **CI gate**: production deploys only happen after all CI checks pass (lint, typecheck, build, test)
- **Secrets in Vercel only**: `DATABASE_URL`, `NEXTAUTH_SECRET`, payment keys never enter the repository
- **Rollback ready**: always record the last stable deployment ID before deploying
- **Monitor**: watch Vercel Analytics and error logs for 30 minutes after production deploy
- **Migrations before code**: run `npx prisma migrate deploy` on staging before deploying new code to production

## Dependencies
- Vercel CLI: `npm i -g vercel`
- GitHub repository connected to Vercel project
- All environment variables set in Vercel dashboard per environment (dev/preview/production)
- `.env.example` in repo with all required keys (no values)

## Pitfalls To Avoid
- **Missing env vars**: new feature requires a key that isn't set in Vercel → runtime crash
- **Skipping preview**: deploying directly to production without preview review
- **Deleting old deployments**: they are your rollback targets — keep the last 3+
- **Migrating production before staging**: always validate migrations on staging first
- **Not checking `NEXTAUTH_URL`**: must exactly match the production domain or auth breaks
