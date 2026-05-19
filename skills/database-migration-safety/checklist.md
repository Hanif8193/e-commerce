# Database Migration Safety — Checklist

## Pre-Action Checklist
- [ ] `DATABASE_URL` confirmed to point to the correct environment (dev/staging/production)
- [ ] Prisma schema change is minimal — one concern per migration
- [ ] Migration name is descriptive: `add_product_slug`, `drop_legacy_address_table`
- [ ] Generated SQL reviewed line by line: `cat prisma/migrations/<name>/migration.sql`
- [ ] For destructive changes: database backup completed before proceeding
- [ ] Checked: any new NOT NULL field has a default value or a two-step migration plan

## During Checklist
- [ ] Applied to dev first: `npx prisma migrate dev --name <name>`
- [ ] Applied to staging: `npx prisma migrate deploy`
- [ ] Staging app verified: key flows work correctly after migration
- [ ] `npx prisma validate` passes
- [ ] `npx prisma generate` run to update client

## Post-Action Checklist
- [ ] Production migration applied: `npx prisma migrate deploy`
- [ ] `npx prisma migrate status` shows no pending migrations
- [ ] Production app verified for 15 minutes after migration
- [ ] No error spike in Sentry post-migration
- [ ] Seed data (if applicable) still loads correctly

## Emergency Recovery
```bash
# Migration failed — check current state
npx prisma migrate status

# Mark a failed migration as rolled back
npx prisma migrate resolve --rolled-back <migration-name>

# Fix the migration SQL or schema, then retry
npx prisma migrate dev --name <fixed-name>   # dev
npx prisma migrate deploy                     # staging/production

# Restore from backup (last resort — production only)
pg_restore -d $DATABASE_URL backup.dump
```
