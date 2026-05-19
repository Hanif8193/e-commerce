# Skill: Performance Optimization

## Description
Systematic approach to improving Next.js ecommerce performance: Core Web Vitals, bundle size, caching strategy, and database query efficiency.

## When To Use
- When Lighthouse scores are below budget (LCP > 2.5s, CLS > 0.1, INP > 200ms)
- When `npm run build` shows unexpectedly large bundle chunks
- When product listing or checkout pages feel slow
- Before and after any significant caching strategy change

## Key Principles
- **Measure before optimizing**: always record baseline metrics before changing anything
- **Server-first**: move work to the server (RSC, Server Actions) to reduce client JS
- **Cache public data**: product listings, categories, and homepage should use ISR or SSG
- **Never cache user data**: cart, orders, and session-specific content must be dynamic
- **Lazy load below-fold**: heavy components below the fold should use `dynamic()` with `{ ssr: false }` only when needed
- **Image optimization**: `next/image` with correct `sizes`, `priority` on LCP image, WebP format

## Dependencies
- `@next/bundle-analyzer` for bundle inspection
- Lighthouse (Chrome DevTools) for Core Web Vitals
- Vercel Analytics for real-user metrics
- `npx next build` output for chunk size review

## Pitfalls To Avoid
- **`cache: 'no-store'` on public pages**: kills caching for listing pages — use `revalidate` instead
- **Missing `priority` on hero image**: LCP image must have `priority` prop on `next/image`
- **No Suspense boundary around lazy component**: causes waterfall loading or crash
- **Importing large libraries in RSC**: increases server response time — tree-shake or swap
- **Over-fetching in Prisma**: `findMany` with no `select` fetches entire rows — always select fields
