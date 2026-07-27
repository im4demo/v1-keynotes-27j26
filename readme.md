# Project context for Cursor AI

## What this project is
KeyNotes — a minimal notes app. Keep features lean: create, list, view, edit,
delete notes. Do not add scope (auth, sharing, etc.) unless explicitly asked.

This repo is currently empty aside from this file. Treat this document as the
brief for code that does not exist yet, not a description of an existing
codebase — scaffold accordingly rather than assuming files are already there.

## Build phases
Work **one phase at a time**. Do not start the next phase until the user
asks. When asked to implement, only touch files belonging to the current
phase. Mark progress by completing the phase checklist before moving on.

### Phase 1 — Monorepo skeleton
- Root: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`,
  `.nvmrc` (Node 20), root `tsconfig` if needed.
- `packages/config`: shared eslint, tsconfig, and Tailwind preset.
- Empty package stubs for `@keynotes/db`, `@keynotes/validators`,
  `@keynotes/ui` (package.json + tsconfig only — no real logic yet).
- Empty app stubs for `@keynotes/web`, `@keynotes/website`, `@keynotes/api`
  (minimal package.json so workspace links resolve).
- **Done when:** `pnpm install` succeeds from repo root.

### Phase 2 — Database package
- `packages/db`: Drizzle schema for `notes` (fields per Initial data model),
  db client, drizzle config.
- Migration setup (drizzle-kit generate/migrate scripts).
- `.env.example` documenting `DATABASE_URL`.
- **Done when:** schema compiles and a migration can be generated.

### Phase 3 — Validators package
- `packages/validators`: Zod schemas via `createInsertSchema` /
  `createSelectSchema` from the notes table.
- Export create/update/select schemas used by the API.
- **Done when:** `@keynotes/api` (or a smoke import) can import validators
  without circular dependency issues.

### Phase 4 — API (Express)
- `apps/api`: Express app on port 4000, routes under `/api`.
- Notes CRUD: `GET/POST /api/notes`, `GET/PATCH/DELETE /api/notes/:id`.
- Thin handlers: Zod validation → Drizzle via `@keynotes/db`.
- `.env.example` with `DATABASE_URL`.
- **Done when:** CRUD works against a running Postgres (local or compose db).

### Phase 5 — Shared UI
- `packages/ui`: minimal shared components needed by the app (e.g. button,
  input, textarea, layout primitives) — only what Phase 6 needs.
- Wired to shared Tailwind from `@keynotes/config`.
- **Done when:** components build and are importable as `@keynotes/ui`.

### Phase 6 — Web app (notes UI)
- `apps/web`: Next.js App Router on port 3000 + Tailwind.
- Pages for list, create, view, edit notes; delete action.
- Calls API via `NEXT_PUBLIC_API_URL`.
- `.env.example` with `NEXT_PUBLIC_API_URL`.
- **Done when:** full notes CRUD works end-to-end in the browser.

### Phase 7 — Marketing website
- `apps/website`: Next.js on port 3001 + Tailwind.
- Simple landing that links to the web app — no notes CRUD here.
- Reuse `@keynotes/ui` where it fits.
- **Done when:** site builds and runs on port 3001.

### Phase 8 — Docker
- `docker/` Dockerfiles for `web`, `website`, `api` (context = repo root).
- Root `docker-compose.yml`: `web`, `website`, `api`, and `db`
  (`postgres:16` image, no custom db Dockerfile).
- Next apps use `output: 'standalone'`.
- **Done when:** `docker compose up` brings up the full stack.

## Monorepo structure
Turborepo + pnpm workspaces. Respect this layout — don't create new top-level
folders without asking.

```
apps/
  web/        Next.js app (main frontend), Tailwind CSS
  website/    Next.js marketing site, Tailwind CSS
  api/        Express backend (REST API)
packages/
  db/         Drizzle schema + db client — the single source of truth for tables
  validators/ Zod schemas built from Drizzle tables via drizzle-zod
  ui/         Shared React components used by web + website
  config/     Shared eslint/tsconfig/tailwind config
docker/       Dockerfiles per app
docker-compose.yml
```

## Stack rules
- Package manager: **pnpm** only. Never suggest npm/yarn commands or lockfiles.
- Monorepo commands run via **Turborepo** (`pnpm turbo run <task> --filter=<app>`).
- **apps/web** and **apps/website**: Next.js (App Router) + Tailwind CSS.
  Tailwind config extends the shared one in `packages/config`.
- **apps/api**: Express. Keep route handlers thin — validation via Zod,
  data access via Drizzle. No raw SQL strings. All routes are mounted under
  the `/api` base path (e.g. `/api/notes`, `/api/notes/:id`) — never bare
  `/notes`.
- **packages/db**: All table definitions live here (Drizzle ORM, `pg-core`).
  Never duplicate table shapes elsewhere.
- **packages/validators**: Zod schemas are created from Drizzle tables using
  `createInsertSchema` / `createSelectSchema` from `drizzle-zod` — this is a
  runtime call, not a codegen step. Do not invent a generate script; import
  the table from `packages/db` and call these functions directly in
  `packages/validators`.
- Database: PostgreSQL, always accessed through Drizzle — no direct `pg`
  queries outside `packages/db`.
- No mobile app in this project.

## Containers
- `web`, `website`, and `api` each have their own Dockerfile under `docker/`,
  composed via the root `docker-compose.yml`.
- `db` uses the official `postgres:16` image directly in `docker-compose.yml`
  — no custom Dockerfile. Do not create `docker/db.Dockerfile`.
- Docker build context for app Dockerfiles is the **repo root**, not the app
  folder, since they need access to `packages/*`.
- `apps/web` and `apps/website` use Next.js `output: 'standalone'` for small
  production images.

## Local env
- Node 20 LTS everywhere — Dockerfiles, CI, and local dev must all match this.
- `api`: reads `DATABASE_URL` (postgres connection string), runs on port 4000.
- `web`: runs on port 3000, calls the api via `NEXT_PUBLIC_API_URL`.
- `website`: runs on port 3001.
- `db`: postgres, exposed on port 5432 in `docker-compose.yml`.
- Each app with env vars should have its own `.env.example` committed, and a
  real `.env` (gitignored) for local values.

## Initial data model
- `notes` table (packages/db): `id` (uuid, pk), `title` (varchar), `body`
  (text), `createdAt` (timestamp), `updatedAt` (timestamp). Don't add fields
  (tags, userId, etc.) unless asked.

## Conventions
- TypeScript everywhere, strict mode on.
- Shared types/schemas go in `packages/`, imported via workspace aliases
  under the `@keynotes/` scope — never relative-path across apps. Package
  names:
  - `@keynotes/web` (apps/web)
  - `@keynotes/website` (apps/website)
  - `@keynotes/api` (apps/api)
  - `@keynotes/db` (packages/db)
  - `@keynotes/validators` (packages/validators)
  - `@keynotes/ui` (packages/ui)
  - `@keynotes/config` (packages/config)
  Use these exact names in `--filter` flags (e.g. `pnpm turbo run build
  --filter=@keynotes/web`).
- Prefer editing/extending existing files over creating new ones unless a
  new file is clearly warranted by the structure above.
- Keep API responses and Zod-validated request bodies consistent with the
  Drizzle schema at all times — if one changes, update the others in the
  same change.
