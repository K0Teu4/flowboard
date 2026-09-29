# Flowboard

Modern realtime project management SaaS for small teams and makers.

> v0.1 foundation: product shell, landing page, interactive demo board, auth UI, dashboard, and database draft.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase (auth/database/storage integration in next phases)
- Liveblocks (realtime collaboration in next phases)
- Vercel (deployment target)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The current foundation works without external credentials. Auth screens currently use local demo navigation; no account or data is written yet.

## Environment variables

Copy `.env.example` to `.env.local` and add the Supabase and Liveblocks keys when those integrations are enabled.

## Routes

- `/` — marketing landing
- `/demo` — interactive Kanban board
- `/auth/sign-in` — sign-in UI
- `/auth/sign-up` — sign-up UI
- `/app/overview` — workspace overview

## Database draft

`supabase-schema.sql` contains the first domain model. RLS policies, indexes, triggers, and production migrations will be added once the auth/data layer is implemented.
