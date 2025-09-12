## Prisma Guide (Simple)

Prereqs
- .env must have `DATABASE_URL` and `JWT_SECRET`
- Install deps once: `npm i`

Daily commands
- Format schema: `npx prisma format`
- Validate schema: `npx prisma validate`
- Generate client: `npx prisma generate`
- Push schema to DB: `npx prisma db push`
- Open DB UI: `npx prisma studio`

Typical workflow
1) Edit `prisma/schema.prisma`
2) `npx prisma format && npx prisma validate`
3) `npx prisma db push`
4) `npx prisma generate`
5) Restart dev server if the client changed (`npm run dev`)

Seeding (optional)
- If you add a seed script, run: `npm run seed`

Making model changes safely
- Add new fields as optional first (or provide defaults)
- Use enums for controlled values
- Keep relations bidirectional (add back-relations on both models)

Troubleshooting
- Relation error: ensure both sides define the relation and back-reference
- Client init error: run `npx prisma generate`
- DB mismatch: run `npx prisma db push`


