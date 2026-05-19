# Prisma Safety — Checklist

## Pre-Action Checklist
- [ ] Using the singleton `db` from `lib/db.ts` — not `new PrismaClient()`
- [ ] Query uses `select` to limit fetched fields
- [ ] Multi-step writes are wrapped in `$transaction`
- [ ] All schema changes are captured in a new migration (never manual SQL on prod)
- [ ] Migration name is descriptive: `add_product_slug`, not `migration1`

## During Checklist
- [ ] Every `db.*` call is inside `try/catch`
- [ ] `PrismaClientKnownRequestError` is handled (P2002 = unique constraint, P2025 = not found)
- [ ] No `include` depth greater than 2 levels without explicit justification
- [ ] No Prisma calls inside a loop — batch with `findMany({ where: { id: { in: ids } } })`
- [ ] `npx prisma validate` passes before committing schema changes

## Post-Action Checklist
- [ ] `npx prisma generate` run after schema change
- [ ] Migration SQL reviewed line by line before applying to staging
- [ ] Migration applied to staging and verified before production
- [ ] Query tested with realistic data volume (not just 1-2 seed records)
- [ ] Connection pool not exhausted under load (check Vercel function logs)

## Emergency Recovery
```bash
# Migration failed on staging — rollback
npx prisma migrate resolve --rolled-back <migration-name>

# Regenerate client after schema fix
npx prisma generate

# Check migration history
npx prisma migrate status

# Seed dev database after reset (dev only — NEVER production)
npx prisma db seed
```
