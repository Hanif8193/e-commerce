# UI Optimizer — Rules

## Strict DO Rules
- **DO** test every UI change at 375px (mobile) before marking work complete
- **DO** verify color contrast ratio ≥ 4.5:1 for all normal text elements
- **DO** ensure all interactive elements are reachable via keyboard (Tab key)
- **DO** add visible focus rings to all interactive elements
- **DO** use `next/image` for all images with explicit `width`, `height`, or `fill`
- **DO** add meaningful `alt` text to all `next/image` instances (empty `alt=""` for decorative images)
- **DO** wrap animations in `@media (prefers-reduced-motion: no-preference)` checks
- **DO** run `npm run build` after any `tailwind.config.ts` change
- **DO** provide before/after screenshots for all visual changes in the PR
- **DO** follow WCAG 2.1 AA as the minimum compliance standard

## Strict DON'T Rules
- **DON'T** use `!important` in Tailwind classes or global styles
- **DON'T** remove ARIA attributes without providing an equivalent replacement
- **DON'T** introduce new UI component libraries without frontend-architect approval
- **DON'T** use arbitrary Tailwind values (`w-[347px]`) without a documented reason
- **DON'T** set `tabIndex="-1"` on focusable elements without a focus management plan
- **DON'T** touch API routes, Prisma schema, auth config, or business logic
- **DON'T** use `<img>` tags — always use `next/image`
- **DON'T** hardcode hex color values — use Tailwind design tokens
- **DON'T** set animation durations above 300ms without explicit design approval
- **DON'T** ship a PR for a customer-facing feature without mobile sign-off

## Recovery Steps
1. **Build fails after Tailwind config change** — Check which custom classes or tokens were removed; restore them; run `npm run build` again
2. **Contrast fix breaks design** — Use a slightly darker shade of the same hue; verify the fix passes the contrast check; consult the design spec if available
3. **Focus management breaks after refactor** — Map the tab order manually; use `tabIndex` only to correct the order, not to remove elements from the tab flow
4. **CLS regression after image change** — Ensure `width` and `height` match the rendered dimensions; use `fill` with a sized container for flexible images
5. **ARIA change breaks screen reader behavior** — Revert the ARIA change; test with a screen reader (NVDA/VoiceOver); re-implement with the correct semantic pattern

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| Accessibility fix requires component restructure | frontend-architect |
| Image optimization causes LCP regression | performance-auditor |
| ARIA or semantic HTML requires new backend data (e.g., live region for stock status) | backend-engineer |
| Copy changes needed for accessible button labels | ecommerce-product-manager |
| Design token change conflicts with brand guidelines | ecommerce-product-manager |
| Keyboard navigation broken by an auth redirect | auth-security-guardian |
