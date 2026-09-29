# Flowboard

Modern visual project management workspace for small teams and makers.

## v0.3.0

The current build is a functional product prototype with real client-side state, not a static UI mock.

### Included

- Russian / English interface
- Workspace auth flow with local credential verification
- Workspace-wide boards list
- Create, rename and delete boards
- Kanban columns with create / rename / delete
- Drag & drop cards between columns
- Create and edit cards
- Priority, labels, due dates, checklist progress and blocked state
- Search across boards and cards
- Project Pulse computed from board state
- Calendar page built from task deadlines
- Members page and invitation-link workflow
- Profile settings and data reset
- Responsive mobile navigation
- Persistent local workspace state in `localStorage`
- Public demo isolated from personal workspace data

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

### Main routes

- `/` — product landing
- `/demo` — interactive public demo
- `/auth/sign-up` — account creation
- `/auth/sign-in` — account sign in
- `/app/overview` — workspace overview
- `/app/boards` — boards
- `/app/boards/[boardId]` — Kanban board
- `/app/calendar` — deadlines
- `/app/members` — members and invitations
- `/app/settings` — profile and local data settings

## Product direction

The next backend milestone replaces the local persistence adapter with Supabase Auth + PostgreSQL + RLS, then adds Liveblocks presence and realtime collaboration. The relational schema is already kept in `supabase-schema.sql` as the domain source for that migration.


## GitHub Pages

Flowboard has a static showcase deployment for GitHub Pages. GitHub Actions builds the Next.js static export and publishes it automatically from `main`. The public showcase is intended for UI/UX review and localStorage-powered interaction.

Project Pages URL:
`https://k0teu4.github.io/flowboard/`

Interactive demo:
`https://k0teu4.github.io/flowboard/demo/`

The full SaaS version will use a server-capable deployment such as Vercel for Supabase and Liveblocks server-side integration; GitHub Pages is the public static showcase.
