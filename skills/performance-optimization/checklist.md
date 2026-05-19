# Performance Optimization — Checklist

## Pre-Action Checklist
- [ ] Baseline Lighthouse scores recorded (LCP, CLS, INP, Performance score)
- [ ] Current bundle size noted from `npm run build` output
- [ ] Identified the specific bottleneck: LCP / CLS / INP / bundle / TTFB / query

## During Checklist
- [ ] LCP image uses `next/image` with `priority` prop
- [ ] All `next/image` components have explicit `width`, `height`, and `sizes`
- [ ] Public listing pages use `revalidate` — NOT `cache: 'no-store'`
- [ ] User-specific pages (cart, orders) are NOT cached with ISR/SSG
- [ ] Dynamic imports (`next/dynamic`) have `<Suspense>` boundaries with fallback
- [ ] No synchronous operations in event handlers (causing INP delay)
- [ ] Prisma queries use `select` — no full record fetches

## Post-Action Checklist
- [ ] Lighthouse rerun — improvement confirmed
- [ ] `npm run build` — bundle size delta reviewed
- [ ] No hydration errors in browser console
- [ ] Core Web Vitals verified in Vercel Analytics after deployment
- [ ] No `Suspense` boundaries missing their `fallback` prop

## Emergency Recovery
```bash
# Revert a bad caching change
git revert <commit-hash>
npm run build && npm run start  # verify locally

# Purge ISR cache for a specific path (via Vercel)
# Route Handler with res.revalidatePath('/products')
# Or: vercel --prod --force (triggers fresh deploy + cache clear)
```
