# Deployment context — Separate Applications variant (KeyNotes)

This is a **parallel, comparison setup** to the one documented in
`DEPLOYMENT.md`. It does not replace it — `DEPLOYMENT.md` continues to
describe the working "single Docker Compose service" deployment
(`hn-api`/`hn-web`/`hn-website.sandnfun.site`), which stays untouched.

This file documents deploying the same codebase as **4 separate Dokploy
services** instead of one Compose stack, for learning/comparison purposes:
- `db` → Dokploy's native **Database** service (managed Postgres), not a
  container defined in a compose file.
- `api`, `web`, `website` → each its own Dokploy **Application** service,
  built directly from this repo via Dokploy's Dockerfile build type.

## Why this is possible (same repo, no code changes needed)
The existing per-app Dockerfiles under `docker/` already work standalone —
nothing in the repo needs to change. Dokploy's Application service type
supports monorepos by separating two settings:
- **Docker Context Path**: `.` (repo root) — required so `COPY packages/*`
  inside each Dockerfile still resolves, exactly like the Compose setup's
  `context: .`.
- **Dockerfile Path**: `docker/api.Dockerfile` / `docker/web.Dockerfile` /
  `docker/website.Dockerfile` (relative to the context above).

## Target environment
- Same Oracle Cloud VPS, same Dokploy instance, same Traefik — just a
  **separate Dokploy Project** so it doesn't interfere with the working
  Compose deployment.
- Project name: _TBD_
- New DNS subdomains (separate from `hn-*`, to be able to compare
  side-by-side): _TBD_

## Services

### `db` — Dokploy Database service (Postgres)
- Created via Dokploy's "Database" service type, not a Dockerfile build.
- Fresh instance — **no data migrated** from the Compose setup's `db`; this
  is a from-scratch comparison environment, not a production cutover.
- Dokploy will provide a connection string/host+port for this instance;
  `api`'s `DATABASE_URL` env var must point at it.

### `api` — Application service
- Build type: Dockerfile
- Docker Context Path: `.`
- Dockerfile Path: `docker/api.Dockerfile`
- Env vars: `DATABASE_URL` (pointing at the new `db` service),
  `NODE_ENV=production`, `PORT=4000`
- Domain: _TBD_, container port `4000`

### `web` — Application service
- Build type: Dockerfile
- Docker Context Path: `.`
- Dockerfile Path: `docker/web.Dockerfile`
- Build arg (baked in at build time — see caveat in `DEPLOYMENT.md`):
  `NEXT_PUBLIC_API_URL` = the real public URL of this setup's `api` domain
- Env vars: `NEXT_PUBLIC_API_URL`, `NODE_ENV=production`, `PORT=3000`,
  `HOSTNAME=0.0.0.0`
- Domain: _TBD_, container port `3000`

### `website` — Application service
- Build type: Dockerfile
- Docker Context Path: `.`
- Dockerfile Path: `docker/website.Dockerfile`
- Build arg: `NEXT_PUBLIC_WEB_URL` = the real public URL of this setup's
  `web` domain
- Env vars: `NEXT_PUBLIC_WEB_URL`, `NODE_ENV=production`, `PORT=3001`,
  `HOSTNAME=0.0.0.0`
- Domain: _TBD_, container port `3001`

## Key differences from the Compose setup (`DEPLOYMENT.md`)
- **Independent deploys**: each Application redeploys on its own — changing
  `api` doesn't rebuild/restart `web`/`website`, unlike the Compose setup
  where one "Deploy" rebuilds the whole stack.
- **No shared compose network by default**: services aren't automatically
  on the same Docker network the way `docker-compose.yml` wires them up.
  `api` needs to be reachable from `web`'s server-side code — check what
  network Dokploy puts each Application on and whether cross-service
  networking needs to be configured manually (likely via Dokploy's internal
  service discovery / same-project networking — confirm in practice).
- **Env vars are per-service**, not centralized in one compose file — no
  single source of truth in-repo the way `docker-compose.yml` acts as one;
  this doc's tables above are the source of truth instead.
- **`db` is Dokploy-managed**, not a container you can `docker exec` into
  directly the same way — use Dokploy's own DB UI/connection info.

## Deployment readiness checklist (separate-apps variant)
- [ ] Decide project name and create it in Dokploy.
- [ ] Choose new DNS subdomains (distinct from `hn-*`) and create DNS
      records pointing to the same Oracle VPS IP.
- [ ] Create the `db` Database service in Dokploy; note its connection
      details.
- [ ] Create `api` Application service (context `.`, dockerfile
      `docker/api.Dockerfile`); set env vars; assign domain.
- [ ] Create `web` Application service; set env vars (build-time
      `NEXT_PUBLIC_API_URL` pointed at the new `api` domain); assign domain.
- [ ] Create `website` Application service; set env vars (build-time
      `NEXT_PUBLIC_WEB_URL` pointed at the new `web` domain); assign domain.
- [ ] Verify cross-service networking (`api` reachable from `web`).
- [ ] Smoke test full note CRUD end-to-end on the new domains.
- [ ] Compare operational experience against the Compose setup (redeploy
      speed, ease of env var management, log visibility, etc.) — this is
      the actual point of this exercise.
