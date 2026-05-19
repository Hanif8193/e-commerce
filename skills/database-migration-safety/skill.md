# Skill: Database Migration Safety

## Description
Safe, zero-downtime Prisma database migration patterns for a production PostgreSQL ecommerce app. Covers migration planning, staging validation, rollback strategy, and destructive change prevention.

## When To Use
- Before creating any new Prisma migration
- Before running `npx prisma migrate deploy` on any environment
- When planning a schema change that involves renaming, dropping, or restructuring
- When a migration fails on staging or production

## Key Principles
- **Staging first**: always apply and validate migrations on staging before production
- **Small and reversible**: one concern per migration — additive changes are safest
- **Never rename directly**: use add-migrate-drop strategy (3 steps) for column renames
- **Always backup before destructive changes**: drop column, drop table, change NOT NULL
- **Review generated SQL**: always read the migration file before applying
- **Descriptive names**: `add_product_slug` not `migration_1` — the name is the changelog

## Dependencies
- Prisma CLI (`npx prisma`)
- `DATABASE_URL` pointing to the correct environment (verify before running)
- Database backup tool (pg_dump or Vercel Postgres snapshot)
- Staging environment that mirrors production schema

## Pitfalls To Avoid
- **Running migrate deploy on the wrong DATABASE_URL**: check the target env before every deploy
- **Adding NOT NULL without a default**: fails instantly on tables with existing rows
- **Renaming a column in one step**: column is gone before the code is updated
- **Dropping a column used by running code**: causes immediate production errors
- **`prisma migrate reset` on production**: destroys all data — development only
