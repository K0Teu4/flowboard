# Flowboard

Flowboard is a modern realtime project-management SaaS concept inspired by Kanban workflows.

## v0.2

This release focuses on UX/UI polish and product separation:

- Russian UI is now the default, with RU/EN switching.
- Public demo data lives only on `/demo`.
- Local sign-up/sign-in creates a clean user workspace.
- The user workspace can create local boards until Supabase is connected.
- Refined top navigation, workspace navigation and landing footer.
- New teal/mint visual accent.
- Responsive layouts and improved focus states.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- Liveblocks
- Vercel

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo flow

- `/` — product landing page
- `/demo` — interactive public demo board
- `/auth/sign-up` — local demo registration
- `/auth/sign-in` — local demo login
- `/app/overview` — personal workspace shell

The current auth and board persistence are intentionally local. The next implementation phase will replace these with Supabase Auth, PostgreSQL persistence and RLS, followed by Liveblocks realtime rooms.

## GitHub setup

The VS Code `Publish Branch` action appears only after the folder has been initialized as a Git repository, has at least one commit, and has a local branch that is not yet published to a remote.

From the project folder, the direct PowerShell route is:

```powershell
git --version
git init -b main
git add .
git commit -m "feat: start Flowboard v0.2"
git branch -M main
git remote add origin https://github.com/K0Teu4/flowboard.git
git push -u origin main
```

Create the empty `K0Teu4/flowboard` repository on GitHub before the final two commands. Do not initialize that GitHub repository with another README, `.gitignore`, or license, because this project already contains them.
