# Database Guardian — Rules

## Strict DO Rules
- **DO** run `npx prisma migrate dev --name <name>` in development before any other environment
- **DO** review the generated `migration.sql` file before applying it anywhere
- **DO** add `@@index` on all foreign keys and all frequently filtered/sorted fields
- **DO** use descriptive migration names that explain the change (e.g., `add_product_category_index`)
- **DO** test migrations on staging before applying to production
- **DO** back up the production database before running `npx prisma migrate deploy`
- **DO** run `npx prisma validate` before every commit that touches the schema
- **DO** document every cascade rule (`onDelete`, `onUpdate`) with a comment explaining the intent
- **DO** keep migrations small — one logical change per migration
- **DO** coordinate with backend-engineer before any breaking schema change

## Strict DON'T Rules
- **DON'T** use `prisma migrate reset` or `--force` in production environments
- **DON'T** rename columns directly — use the add-migrate-drop pattern
- **DON'T** drop columns or tables without first removing all application references
- **DON'T** add a NOT NULL column to an existing table without a `@default` or two-step migration
- **DON'T** use raw SQL (`$queryRaw`) unless absolutely necessary and reviewed
- **DON'T** apply migrations to production without staging verification
- **DON'T** touch `app/api/`, `lib/auth.ts`, `components/`, or `middleware.ts`
- **DON'T** use `onDelete: Cascade` on critical business data (orders, payments) without explicit sign-off
- **DON'T** commit a migration that shows unintended table drops
- **DON'T** skip the backup step for any migration that modifies existing data

## Recovery Steps
1. **Migration fails in production** — Do NOT retry; assess the database state; if data is intact and migration partially applied, resolve manually; if in doubt, restore from pre-migration backup
2. **Missing index causing full table scan** — Run `EXPLAIN ANALYZE`; identify the scan; add `@@index` to schema; generate migration; apply to staging; then production
3. **Duplicate key error after adding unique constraint** — Identify duplicates with `SELECT ... GROUP BY ... HAVING COUNT(*) > 1`; resolve duplicates in a data migration; then apply the constraint
4. **Prisma client out of sync** — Run `npx prisma generate` on the application server; restart the application
5. **Connection pool exhaustion** — Add `connection_limit=10` to `DATABASE_URL`; reduce pool size in `lib/db.ts`; escalate to production-hardening-agent

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| Backend query uses a pattern that requires schema optimization | backend-engineer (provide updated query recommendations) |
| Schema change affects User, Session, Account, or Role models | auth-security-guardian |
| Migration touches production data at scale (>100k rows) | deployment-engineer (coordinate maintenance window) |
| Slow query cannot be resolved with indexing alone | ecommerce-product-manager (discuss caching or search service) |
| Health check query fails after migration | production-hardening-agent |
| Production migration causes data loss | All agents — immediate incident response |
