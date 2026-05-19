# Skill: Responsive UI

## Description
Mobile-first, accessible Tailwind CSS development patterns for the ecommerce platform. Covers breakpoints, accessibility, component patterns, and design system consistency.

## When To Use
- When building or modifying any customer-facing UI component
- When reviewing a component for mobile layout issues
- When conducting an accessibility audit
- When adding a new Tailwind utility or component pattern

## Key Principles
- **Mobile-first**: write base styles for mobile, then `md:` and `lg:` overrides
- **Design tokens**: use only colors and spacing defined in `tailwind.config.ts` — no arbitrary values unless unavoidable
- **Accessibility**: every interactive element needs keyboard focus, ARIA label, and visible focus ring
- **Images**: always `next/image` with explicit `width`, `height`, and `alt`
- **No layout shift**: reserve space for async content with skeleton loaders
- **Contrast**: body text contrast ratio ≥ 4.5:1; large text ≥ 3:1

## Dependencies
- Tailwind CSS configured with design tokens in `tailwind.config.ts`
- `next/image` for all images
- `next/font` for web fonts to prevent layout shift

## Pitfalls To Avoid
- **Arbitrary Tailwind values** (`w-[347px]`) — define a token instead
- **Missing focus styles** — never use `outline-none` without `focus-visible:ring`
- **Raw `<img>` tags** — always `next/image`
- **Hardcoded pixel breakpoints** — use Tailwind's responsive prefixes only
- **Nested flexbox without overflow control** — causes horizontal scroll on mobile
