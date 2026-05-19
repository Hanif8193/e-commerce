# Skill: Safe Next.js Development

## Description
Safe patterns for Next.js App Router development. Covers RSC/Client Component boundaries, error handling with `error.tsx`, loading states with `loading.tsx`, build validation, and avoiding common hydration and runtime pitfalls.

## When To Use
- Starting a new route or page in the App Router
- Adding a new React component and deciding its rendering boundary
- Implementing data fetching in Server Components
- Adding error handling or loading states to a route segment
- Before running `npm run build` to catch issues early
- When investigating a hydration mismatch or white screen of death

## Key Principles
- **RSC by default** — All components are Server Components unless `use client` is explicitly required
- **Boundary isolation** — Push `use client` as far down the component tree as possible; keep Server Components at the top
- **Error containment** — Every route segment must have `error.tsx`; never allow unhandled errors to crash the full page
- **Loading feedback** — Every async route must have `loading.tsx`; users must always see progress feedback
- **Build gate** — `npm run build` must pass with zero errors before any PR is raised
- **Type safety** — No `any` types; all component props must have explicit TypeScript interfaces
- **Immutable rendering** — Avoid side effects in Server Components; data fetching only, no mutations

## Dependencies
- Next.js 14+ with App Router enabled
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)
- ESLint with `eslint-config-next`
- `npm run build` script configured in `package.json`

## Pitfalls To Avoid
- Adding `use client` to a layout or top-level component — it forces all children to be client-rendered
- Importing a server-only module (e.g., `prisma`, `lib/auth.ts`) inside a Client Component
- Forgetting `error.tsx` on new route segments — unhandled errors show blank pages
- Using `Math.random()` or `Date.now()` in Server Components — causes hydration mismatches
- Setting `cache: 'no-store'` on public listing pages — destroys caching and slows the site
- Using `useEffect` to fetch data that a Server Component could fetch at build/request time
- Missing `<Suspense>` around `dynamic()` imports — causes layout shift or runtime errors
