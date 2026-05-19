---
id: "001"
title: Neon DB connection fix direct URL
stage: general
date: 2026-05-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: Hanif
command: "DATABASE_URL switch pooler → direct; npm run db:seed"
labels: ["database","neon","seed","connection","devops"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .env
  - .env.local
tests:
  - "npm run db:seed — 20 products seeded successfully"
---

## Prompt

User provided the Neon pooler DATABASE_URL and asked: "IF IT IS NOT CORRECT THEN U CAN MAKE IT NO POOLar". Previous seed attempts failed with PrismaClientInitializationError (can't reach database server) using the pooler URL.

## Response snapshot

Switched both `.env` and `.env.local` DATABASE_URL from pooler hostname
`ep-autumn-lake-a4sf2shl-pooler.us-east-1.aws.neon.tech` to direct hostname
`ep-autumn-lake-a4sf2shl.us-east-1.aws.neon.tech`.

Ran `npm run db:seed` — succeeded: 20 products seeded with dual images (Unsplash + placehold.co).

## Outcome

- ✅ Impact: Neon free-tier database now reachable; seed completed; 20 products with updated image arrays persisted
- 🧪 Tests: npm run db:seed exit 0 — all upserts succeeded
- 📁 Files: .env, .env.local (DATABASE_URL hostname change only)
- 🔁 Next prompts: Restart dev server; proceed to Phase 9 hardening
- 🧠 Reflection: Neon free tier pooler is unreliable for Prisma CLI direct commands; direct URL is preferred for migrations and seeding

## Evaluation notes (flywheel)

- Failure modes observed: channel_binding=require incompatible with Prisma 5.x; pooler URL auto-suspends and rejects CLI connections on free tier
- Graders run and results (PASS/FAIL): seed script PASS
- Prompt variant (if applicable): null
- Next experiment: try pgbouncer pooler mode for app runtime if connection limits become an issue at scale
