# Flowboard — architecture notes

## High-level model

Supabase/Postgres is the durable source of truth for application data.

Liveblocks is the collaboration layer for rooms, presence, cursors, and realtime collaboration features.

Vercel hosts the Next.js application and preview/production deployments.

## Domain hierarchy

User → Workspace → Board → List → Card

Supporting entities:
- workspace_members
- labels / card_labels
- checklists / checklist_items
- activity_logs

## Security direction

Authorization will be enforced server-side and with Supabase Row Level Security. UI visibility is not considered a security boundary.

## Realtime direction

A board maps to a Liveblocks room. Persisted board/card state lives in Postgres; ephemeral collaboration state lives in Liveblocks.

## Next implementation step

Replace the local demo navigation with real Supabase authentication and workspace bootstrap, then introduce Liveblocks room authorization after an authenticated user exists.
