# Frontend Architect — Rules

## Strict DO Rules
- **DO** use React Server Components by default; add `use client` only when required
- **DO** provide `loading.tsx` and `error.tsx` for every new route segment
- **DO** use `next/image` for all images with explicit `width`, `height`, or `fill`
- **DO** apply Tailwind classes mobile-first (base → `sm:` → `md:` → `lg:`)
- **DO** validate all component props with explicit TypeScript interfaces
- **DO** run `npm run build` and confirm it passes before every PR
- **DO** test at 375px, 768px, and 1280px before marking UI work complete
- **DO** co-locate related components, hooks, and types in the same feature folder
- **DO** use `<Suspense>` with a fallback around every dynamically imported Client Component
- **DO** add ARIA labels and roles to all interactive elements

## Strict DON'T Rules
- **DON'T** modify `prisma/`, `lib/auth.ts`, `app/api/`, or `.github/`
- **DON'T** use `any` type in component props or return types
- **DON'T** use `// @ts-ignore` or `// eslint-disable` as permanent solutions
- **DON'T** use `!important` in Tailwind or global CSS
- **DON'T** place `use client` at the root layout level
- **DON'T** fetch data inside `useEffect` when a Server Component can handle it
- **DON'T** import `prisma` client or `lib/db.ts` directly in components
- **DON'T** hardcode colors, spacing, or font sizes — use Tailwind tokens
- **DON'T** use `router.push()` inside component render — only in event handlers
- **DON'T** ship a PR without a Vercel preview URL for UI changes

## Recovery Steps
1. **Build failure after change** — Run `npm run build` locally; read the error output carefully; fix type errors one at a time; never suppress errors
2. **Hydration mismatch** — Identify the component causing the mismatch; move dynamic content (timestamps, random values) into `useEffect`; or convert to a Client Component
3. **Broken layout on mobile** — Open DevTools responsive mode at 375px; identify the element causing overflow; fix with `overflow-x-hidden` on the container or correct breakpoint classes
4. **Missing loading state causing blank screen** — Add `loading.tsx` to the route segment immediately; use a skeleton that matches the content shape
5. **Image causing layout shift (CLS)** — Ensure `width` and `height` are set on `next/image`; use `placeholder="blur"` for above-the-fold images

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| UI change requires new API endpoint or data shape | backend-engineer |
| Accessibility audit finds critical WCAG failures | ui-optimizer |
| Performance regression detected in Core Web Vitals | performance-auditor |
| New environment variable needed for UI feature | deployment-engineer |
| UI change involves displaying user role or session data | auth-security-guardian |
| Visual design conflicts with security requirements (e.g., showing sensitive data) | ecommerce-product-manager |
| Production UI regression detected post-deploy | bug-fixer + deployment-engineer |
