# Frontend Architect — Workflow

## Step-by-Step Workflow

1. **Receive task** — Read spec or feature request; confirm scope is UI-only
2. **Review design** — Check Figma, wireframes, or written requirements for layout and interaction details
3. **Plan route structure** — Map user flows to App Router segments (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`)
4. **Identify RSC boundaries** — Decide which components are Server Components and which require `use client`
5. **Scaffold files** — Create route segments and component stubs with correct TypeScript interfaces
6. **Implement layout** — Build the layout shell with responsive Tailwind classes (mobile-first)
7. **Implement components** — Build individual UI components; keep each component single-responsibility
8. **Add loading states** — Implement `loading.tsx` with skeleton loaders for every async route
9. **Add error states** — Implement `error.tsx` with user-friendly fallback and retry option
10. **Integrate data** — Wire up server-side data fetching using `fetch` with appropriate cache directives
11. **Accessibility pass** — Add ARIA labels, keyboard navigation, and focus management
12. **Cross-viewport test** — Manually test at 375px, 768px, 1280px
13. **Build validation** — Run `npm run build`; fix all TypeScript and lint errors
14. **Open PR** — Include Vercel preview URL, screenshot before/after if visual change

---

## Decision Points

| Situation | Action |
|---|---|
| Component needs user interaction (onClick, useState) | Add `use client` directive; keep it as far down the tree as possible |
| Data must be fresh on every request | Use `fetch(url, { cache: 'no-store' })` in Server Component |
| Data can be cached and revalidated | Use `fetch(url, { next: { revalidate: 60 } })` |
| UI change touches auth or session display | Notify auth-security-guardian before merging |
| New page requires DB data | Coordinate with backend-engineer for Server Action or API route |
| Image source is user-generated | Use `next/image` with `unoptimized` only if domain whitelisting is pending |
| Build fails with TypeScript error | Fix the error — never use `// @ts-ignore` as a permanent solution |
| Hydration mismatch detected | Move state initialization to `useEffect` or convert to Client Component |

---

## Handoff Instructions

**Handing off to ui-optimizer:**
- Provide component names and file paths for accessibility review
- Note any color or contrast decisions that need validation
- Flag components using arbitrary Tailwind values

**Handing off to backend-engineer:**
- Specify the exact data shape the UI expects
- Provide the route path and HTTP method needed
- Share TypeScript interface for the expected response

**Handing off to performance-auditor:**
- List all dynamic imports and lazy-loaded components added
- Note any large images or third-party scripts introduced
- Share Core Web Vitals baseline if available

**Handing off to deployment-engineer:**
- Confirm `npm run build` passes
- List any new environment variables the UI reads from `process.env.NEXT_PUBLIC_*`
- Attach Vercel preview URL for final review
