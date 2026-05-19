# Performance Auditor — Workflow

## Step-by-Step Workflow

1. **Receive task** — Read the performance complaint or audit request; identify the affected page or metric
2. **Baseline measurement** — Run Lighthouse in incognito on the production or preview URL; record LCP, CLS, INP, TTI, and bundle size
3. **Identify bottleneck** — Determine the primary cause: render-blocking resources, large images, unoptimized cache, heavy JS bundle, or slow API
4. **Bundle analysis** — If bundle is the issue, run `npx @next/bundle-analyzer`; identify the largest chunks
5. **Cache audit** — Review `fetch` calls in Server Components; confirm cache policies match data freshness requirements
6. **Image audit** — Check all images for `next/image` usage, explicit dimensions, `priority` flag on above-the-fold images
7. **Lazy loading** — Add `dynamic()` imports for heavy Client Components not needed on initial render
8. **Suspense boundaries** — Confirm all lazy-loaded components are wrapped in `<Suspense>` with a meaningful fallback
9. **Apply changes** — Make the smallest set of changes that addresses the bottleneck
10. **Measure improvement** — Re-run Lighthouse; confirm metric improved; record the delta
11. **Validate build** — Run `npm run build`; confirm no new errors or regressions
12. **Open PR** — Include before/after Lighthouse scores; describe the caching strategy chosen and why

---

## Decision Points

| Situation | Action |
|---|---|
| LCP > 2.5s on a product page | Check if the hero image uses `next/image` with `priority`; check TTFB from API |
| CLS > 0.1 detected | Find the shifting element; add explicit dimensions to images; reserve space for late-loading elements |
| INP > 200ms | Profile the event handler; move heavy computation to a Web Worker or to the server |
| Bundle chunk > 200KB | Identify the package causing the bloat; add `dynamic()` import; or replace with a lighter alternative |
| Product listing page using `cache: 'no-store'` | Switch to `revalidate: 60` to enable caching while keeping content fresh |
| Cart or order page caching data | Keep `cache: 'no-store'` for user-specific data — never cache personalized content |
| Third-party script blocking render | Move to `next/script` with `strategy="lazyOnload"`; consider removing if impact is minor |
| API response slow (>500ms) | Escalate to backend-engineer with the slow endpoint and Prisma query details |

---

## Handoff Instructions

**Handing off to backend-engineer:**
- Provide the specific API route URL and measured response time
- Share any Prisma query logs or slow query evidence
- Request the addition of proper `stale-while-revalidate` headers or DB query optimization

**Handing off to database-guardian:**
- Provide slow query evidence with `EXPLAIN ANALYZE` output if available
- Identify which Prisma queries are triggering full table scans
- Request index additions for the specific filter patterns

**Handing off to ui-optimizer:**
- Flag images that are correctly sized for performance but may need `alt` text updates
- Report Cumulative Layout Shift (CLS) issues caused by image dimensions

**Handing off to deployment-engineer:**
- Provide the list of `next.config.ts` changes for review
- Document any new caching headers or CDN cache-control directives added
