TutorFlow is a focused SaaS starter for tutors and small service businesses. It gives you a production-leaning base for bookings, clients, invoices, notes, and one targeted AI workflow.

## Stack

- Next.js 16 with the App Router
- TypeScript
- Tailwind CSS 4
- Prisma with PostgreSQL-ready schema
- ESLint

## Included starter scope

- Marketing landing page
- Dashboard scaffold with sample operating data
- Prisma schema for businesses, clients, bookings, invoices, payments, notes, and AI actions
- Environment variable template for app and database configuration

## Getting started

Install dependencies if needed:

```bash
npm install
```

Copy the environment file and update values:

```bash
copy .env.example .env
```

Generate the Prisma client:

```bash
npm run db:generate
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 to view the landing page.

Open http://localhost:3000/dashboard to view the starter dashboard.

## Database workflow

Point `DATABASE_URL` at a PostgreSQL database, then run:

```bash
npm run db:push
```

Open Prisma Studio when you want to inspect records locally:

```bash
npm run db:studio
```

## Suggested next implementation steps

- Add authentication and role-aware access control
- Replace sample dashboard data with Prisma-backed queries
- Wire invoice and reminder events to external providers
- Add the AI note-to-follow-up action behind a server route

## Scripts

- `npm run dev`: start the local dev server
- `npm run build`: create the production build
- `npm run lint`: run ESLint
- `npm run db:generate`: generate the Prisma client
- `npm run db:push`: push the schema to your database
- `npm run db:studio`: open Prisma Studio

## Notes

The current dashboard uses sample data so the app is runnable before a database is configured.
