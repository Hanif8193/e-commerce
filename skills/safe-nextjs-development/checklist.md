# Safe Next.js Development — Checklist

## Pre-Action Checklist
- [ ] Confirm the file is within scope (never touch unrelated files)
- [ ] Identify whether the component is RSC or Client Component before writing
- [ ] Check if a `loading.tsx` and `error.tsx` exist for the affected route segment
- [ ] Confirm TypeScript strict mode is on (`"strict": true` in `tsconfig.json`)

## During Checklist
- [ ] Server Components: no `useState`, no `useEffect`, no browser APIs
- [ ] Client Components: `"use client"` at top; keep them leaf-level
- [ ] Data fetching: done in Server Components or Server Actions — not `useEffect`
- [ ] All async functions are wrapped in `try/catch`
- [ ] No hardcoded secrets or environment values in component files
- [ ] Images use `next/image` with explicit `width` and `height`
- [ ] Links use `next/link` — no raw `<a href>`

## Post-Action Checklist
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run build` — successful
- [ ] Manual test at 375px (mobile) and 1280px (desktop)
- [ ] No `console.error` or hydration warnings in browser console
- [ ] `loading.tsx` shows correct skeleton
- [ ] `error.tsx` shows useful fallback — not a blank page

## Emergency Recovery
```bash
# Revert to last known good state
git stash
npm run build   # confirm clean build on stash pop target

# If build is broken after changes
git diff HEAD   # review what changed
git checkout -- <file>  # revert a single file

# If hydration errors appear
# 1. Add "use client" to the component
# 2. Or remove browser-only APIs from RSC
```
