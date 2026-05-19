# Performance Auditor — Rules

## Strict DO Rules
- **DO** measure Lighthouse scores before and after every performance change
- **DO** document the before/after delta for every optimization in the PR description
- **DO** use `next/image` with `priority` on all above-the-fold images
- **DO** add `<Suspense>` with a fallback around every `dynamic()` import
- **DO** run `npx @next/bundle-analyzer` when bundle size is suspected to be a problem
- **DO** use ISR (`revalidate`) for public content that changes infrequently
- **DO** keep `cache: 'no-store'` only for user-specific, personalized data
- **DO** set performance budgets: LCP < 2.5s, CLS < 0.1, INP < 200ms
- **DO** test performance changes with `npx next build && npx next start` locally
- **DO** monitor Vercel Analytics for 24 hours after caching strategy changes

## Strict DON'T Rules
- **DON'T** set `cache: 'no-store'` on product listing, category, or homepage routes
- **DON'T** add a third-party library over 50KB without a bundle impact analysis
- **DON'T** change business logic, API handlers, Prisma schema, or auth during a performance audit
- **DON'T** remove `<Suspense>` boundaries — they are required for lazy-loaded components
- **DON'T** set `revalidate: 0` on high-traffic pages (it is equivalent to `cache: 'no-store'`)
- **DON'T** cache session-dependent data (cart, orders, user profile)
- **DON'T** apply dynamic imports without verifying the component has a valid loading state
- **DON'T** use inline `style` to set image dimensions — use `next/image` props
- **DON'T** ship a performance change without a Lighthouse score comparison
- **DON'T** optimize individual components in isolation — measure the full page impact

## Recovery Steps
1. **LCP regression after deploy** — Roll back caching config change; identify if `priority` was removed from hero image; revert to previous `next.config.ts`
2. **CLS introduced by image change** — Restore explicit `width` and `height` on the affected `next/image`; use `fill` with a fixed-height container as an alternative
3. **Lazy-loaded component shows blank area** — Add a `<Suspense>` fallback that matches the component's dimensions; check that the dynamic import path is correct
4. **Bundle size regression** — Run `@next/bundle-analyzer`; identify the new chunk; add a `dynamic()` import; or remove the library if it is not essential
5. **Cache serving stale data beyond acceptable threshold** — Reduce `revalidate` interval; or add `revalidatePath()` call in the mutation that changes the data

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| API response time > 500ms consistently | backend-engineer |
| Full table scan in database confirmed | database-guardian |
| Image optimization causes accessibility regression | ui-optimizer |
| `next.config.ts` change affects deployment headers | deployment-engineer |
| Caching strategy conflicts with business data freshness requirements | ecommerce-product-manager |
| Performance regression after UI component added | frontend-architect |
