# Deployment context (KeyNotes)

This file documents how KeyNotes is deployed. Reference it when editing
Dockerfiles, docker-compose.yml, or env files. It is not a substitute for
`.cursorrules` — that file still governs code conventions.

## Target environment
- Host: Oracle Cloud VPS (self-managed).
- Deploy tool: **Dokploy** (self-hosted PaaS on top of Docker + Traefik),
  already installed on the VPS.
- Deployment method: Dokploy's **"Docker Compose" service type**, pointed at
  the repo's root `docker-compose.yml` — not Dokploy's per-app "Application"
  service type. This matters because `web`, `website`, and `api` all build
  with the **repo root** as Docker build context (they need `packages/*`),
  which per-app Application services don't handle as cleanly.

## Services in docker-compose.yml
- `web`, `website`, `api`: each has its own Dockerfile under `docker/`,
  multi-stage, production build (`output: 'standalone'` for the two Next.js
  apps).
- `db`: official `postgres:16` image, no custom Dockerfile.
  - Open decision: staying on compose-managed `db` vs. migrating to
    Dokploy's managed Postgres service (separate provisioning/backups). If
    migrated, remove `db` from docker-compose.yml and point `api`'s
    `DATABASE_URL` at Dokploy's internal Postgres connection string instead.

## Domains and routing
- Dokploy uses Traefik internally for routing + automatic Let's Encrypt SSL.
- Intended domains (adjust to the real domain once chosen):
  - `app.<domain>` → `web`
  - `www.<domain>` or `<domain>` → `website`
  - `api.<domain>` → `api`
- DNS: A records for each subdomain must point to the Oracle VPS public IP
  before enabling SSL in Dokploy, or certificate issuance fails.

## Oracle Cloud networking (VCN-level, not just OS firewall)
- Oracle blocks inbound traffic at the VCN Security List / Network Security
  Group level, separate from any OS-level firewall (ufw/iptables).
- Required open ingress ports: 80, 443 (Traefik/HTTPS), and Dokploy's
  dashboard port (3000 by default). If a deploy "isn't reachable" but builds
  succeed, check this first — it's the most common Oracle-specific gap.

## Environment variables (project-level, set in Dokploy's UI, not committed)
`docker-compose.yml` reads these via `${VAR:-default}` substitution, so
Dokploy's project env vars actually flow into the containers. A root
`.env.example` documents them for local use (copy to `.env`, gitignored).
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` → `db`.
- `DATABASE_URL` → `api` (must match the `db` credentials above when using
  compose-managed Postgres).
- `NEXT_PUBLIC_API_URL` → `web`. **Baked in at Docker build time** (Next.js
  inlines `NEXT_PUBLIC_*` into the client JS bundle) via the `web` service's
  build `args:` — not just a runtime env var. Set this to the real public
  `api.<domain>` in Dokploy before the first production build, or the
  deployed frontend will keep calling `localhost:4000`.
- `NEXT_PUBLIC_WEB_URL` → `website`. Same build-time caveat as above.
- Each app also keeps its own committed `.env.example`
  (`apps/api`, `apps/web`, `apps/website`, `packages/db`) for running that
  app outside Docker.

## Local dev vs. production ports
- `docker-compose.yml` does **not** publish host ports for any service —
  Traefik/Dokploy route to containers over the internal Docker network via
  each service's assigned domain + container port, so host ports aren't
  needed in production. This also avoids a port clash with Dokploy's own
  dashboard (default `3000`, same port `web` uses internally).
- `docker-compose.override.yml` adds the host port mappings back
  (`5432`, `4000`, `3000`, `3001`) for local development only. Plain
  `docker compose up` auto-merges it; Dokploy is pointed at
  `docker-compose.yml` directly and never reads the override file.

## What's manual vs. what Cursor helps with
- Manual (Dokploy dashboard, cannot be scripted from this repo): creating
  the Project, connecting the git repo, entering env var values, assigning
  domains, clicking Deploy.
- Cursor-assisted (files in this repo): writing/editing Dockerfiles,
  `docker-compose.yml`, `.env.example` files, and any healthcheck /
  `restart: unless-stopped` additions for production readiness.

## Deployment readiness checklist
Repo-side (done):
- [x] Git repo initialized, pushed to GitHub (`im4demo/v1-keynotes-27j26`).
- [x] `.env` files confirmed untracked; only `.env.example` files committed.
- [x] `docker-compose.yml` env vars parameterized (`${VAR:-default}`) so
      Dokploy's project env vars actually take effect.
- [x] `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_WEB_URL` build args wired to the
      same substitution variables (still must be set to real domains in
      Dokploy before first prod build — see above).
- [x] Host `ports:` removed from `docker-compose.yml`; moved to
      `docker-compose.override.yml` for local dev only.
- [x] Healthchecks + `restart: unless-stopped` added for `db`, `api`, `web`,
      `website`.
- [x] Root `.env.example` added documenting compose-level variables.

Still open (manual, in Dokploy/Oracle Cloud):
- [ ] Confirm whether the GitHub repo is private; if so, add a deploy key or
      PAT in Dokploy's Git Provider settings so it can clone.
- [ ] Decide compose-managed `db` vs. Dokploy-managed Postgres (see "Services
      in docker-compose.yml" above); if staying compose-managed, set up a
      backup strategy for the `keynotes_pgdata` volume (e.g. scheduled
      `pg_dump`).
- [ ] Choose the real domain; update `app.`/`www.`/`api.` DNS A records to
      the Oracle VPS public IP.
- [ ] Open ports 80, 443, and Dokploy's dashboard port at the **Oracle VCN
      Security List / NSG level** (not just OS firewall).
- [ ] In Dokploy: create Project → Docker Compose service → point at repo
      root → set all env vars from the root `.env.example` (with real
      values) → assign domains per service (`web`, `website`, `api`) →
      Deploy.
- [ ] After first deploy, verify SSL issued correctly for all three
      subdomains and that `web`'s browser-side calls hit the real
      `api.<domain>` (not `localhost:4000`).