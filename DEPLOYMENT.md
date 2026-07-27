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

## Environment variables (per service, set in Dokploy's UI, not committed)
- `api`: `DATABASE_URL`, `NODE_ENV=production`
- `web`: `NEXT_PUBLIC_API_URL` (public `api` domain), `NODE_ENV=production`
- `website`: `NODE_ENV=production`
- `db` (if still compose-managed): `POSTGRES_USER`, `POSTGRES_PASSWORD`,
  `POSTGRES_DB`
- Each app keeps a committed `.env.example` listing these keys with dummy
  values; real values live only in Dokploy's environment UI per service.

## What's manual vs. what Cursor helps with
- Manual (Dokploy dashboard, cannot be scripted from this repo): creating
  the Project, connecting the git repo, entering env var values, assigning
  domains, clicking Deploy.
- Cursor-assisted (files in this repo): writing/editing Dockerfiles,
  `docker-compose.yml`, `.env.example` files, and any healthcheck /
  `restart: unless-stopped` additions for production readiness.