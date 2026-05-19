# Responsive UI — Checklist

## Pre-Action Checklist
- [ ] Design tokens for colors and spacing exist in `tailwind.config.ts`
- [ ] Component has a defined mobile layout before desktop is designed
- [ ] Existing similar components reviewed to avoid duplication

## During Checklist
- [ ] Base styles are mobile (no prefix); tablet uses `md:`; desktop uses `lg:`
- [ ] All interactive elements: button, link, input have visible `focus-visible:ring`
- [ ] All `<img>` replaced with `next/image` + `alt`, `width`, `height`
- [ ] All icons have `aria-label` or `aria-hidden="true"` with adjacent text
- [ ] Form inputs have associated `<label>` elements (not just placeholders)
- [ ] Loading state defined: skeleton or spinner shown during async operations
- [ ] Empty state defined: meaningful message shown when list is empty
- [ ] No `!important` in Tailwind classes

## Post-Action Checklist
- [ ] Manual test at 375px (mobile) — no horizontal scroll, no overflow
- [ ] Manual test at 768px (tablet)
- [ ] Manual test at 1280px (desktop)
- [ ] Keyboard navigation: Tab moves through all interactive elements in logical order
- [ ] Color contrast checked: ≥ 4.5:1 for body text
- [ ] `npm run build` — no CSS purge errors

## Emergency Recovery
```bash
# If Tailwind purges styles in production (classes not in HTML at build time)
# Add to tailwind.config.ts safelist:
safelist: ["text-red-500", "bg-green-100"]  # only if dynamically generated

# If layout breaks on mobile
# Test in Chrome DevTools → Toggle device toolbar → iPhone SE (375px)
# Use browser inspector to identify the overflowing element
```
