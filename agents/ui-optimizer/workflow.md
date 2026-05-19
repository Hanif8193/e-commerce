# UI Optimizer — Workflow

## Step-by-Step Workflow

1. **Receive task** — Read the accessibility report, design review, or optimization request
2. **Audit scope** — Identify which components and pages are affected
3. **Baseline measurement** — Record current accessibility score, contrast ratios, and viewport behavior
4. **Prioritize issues** — Critical (keyboard trap, zero contrast) → High (contrast fail, missing ARIA) → Medium (inconsistent spacing) → Low (cosmetic)
5. **Fix critical issues first** — Address keyboard traps and invisible focus indicators before cosmetic changes
6. **Apply accessibility fixes** — Add ARIA labels, roles, `aria-live` regions, and focus management
7. **Fix contrast issues** — Update Tailwind color classes to meet the 4.5:1 ratio requirement
8. **Improve mobile layout** — Fix overflow, cramped tap targets (min 44x44px), and text size on small screens
9. **Optimize images** — Replace `<img>` tags with `next/image`; add `alt` text; set `width`/`height` or `fill`
10. **Consolidate Tailwind** — Extract repeated class patterns into reusable components or `@apply` in `styles/`
11. **Test keyboard navigation** — Tab through every interactive element; confirm focus ring is visible
12. **Cross-viewport test** — Test at 375px, 768px, 1280px
13. **Run build** — Execute `npm run build`; confirm no CSS purge issues
14. **Open PR** — Include before/after screenshots and accessibility score comparison

---

## Decision Points

| Situation | Action |
|---|---|
| Color fails contrast check | Replace with a Tailwind shade that meets 4.5:1 (use the contrast-checking tool) |
| Interactive element has no ARIA label | Add `aria-label` or associate a `<label>` element |
| Keyboard focus cannot reach an element | Fix tab order; ensure `tabIndex` is not set to -1 incorrectly |
| Image causes layout shift | Add explicit `width`/`height` to `next/image`; add `placeholder="blur"` if above the fold |
| Animation causes discomfort | Wrap in `@media (prefers-reduced-motion: no-preference)` |
| Mobile layout overflows at 375px | Find the element with a fixed pixel width; replace with responsive classes |
| New UI library is needed for accessibility | Stop; consult frontend-architect before introducing the dependency |
| Tailwind config change removes an existing token | Run global search; update all usages before removing the token |

---

## Handoff Instructions

**Handing off to frontend-architect:**
- Provide a list of components that need architectural changes (not just style fixes)
- Flag any component that requires a Server/Client Component boundary change for accessibility
- Note any new shared components extracted during optimization

**Handing off to performance-auditor:**
- Report any image changes that might affect LCP (Largest Contentful Paint)
- Flag lazy loading additions or removals
- Provide the CLS score before and after `next/image` changes

**Handing off to ecommerce-product-manager:**
- Report accessibility failures that require copy changes (button labels, headings)
- Flag any UI pattern that conflicts with the user experience requirements in the spec
