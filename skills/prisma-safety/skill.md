# Skill: Prisma Safety

## Description
Safe patterns for using Prisma ORM in a production Next.js ecommerce app. Covers query safety, connection management, migration discipline, and N+1 prevention.

## When To Use
- Before writing any Prisma query in a new feature
- Before running a database migration
- When debugging slow queries or connection pool exhaustion
- During code review of any file that imports from `@prisma/client`

## Key Principles
- Always use a singleton Prisma client (`lib/db.ts`) — never instantiate `new PrismaClient()` in component files
- Wrap all DB calls in `try/catch` — never let Prisma errors bubble unhandled
- Use `select` to fetch only the fields you need — never fetch entire records for display
- Use `include` carefully — deeply nested includes cause N+1 queries
- Use Prisma transactions (`$transaction`) for any multi-step write operation
- Add `@@index` on foreign keys and frequently filtered fields
- Never run `prisma migrate reset` on production

## Dependencies
- `@prisma/client` installed and generated
- `DATABASE_URL` set in environment
- `prisma/schema.prisma` is the single source of truth

## Pitfalls To Avoid
- **N+1 queries**: fetching related records inside a loop — use `include` or batch with `findMany`
- **Missing indexes**: foreign key fields without indexes cause full table scans
- **Connection pool exhaustion**: creating `new PrismaClient()` per request in serverless environments
- **Unhandled disconnects**: not catching `PrismaClientKnownRequestError` for constraint violations
- **Blind deletes**: using `delete` without verifying the record exists — use `deleteMany` with where clause
