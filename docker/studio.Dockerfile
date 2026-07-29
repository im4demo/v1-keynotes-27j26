FROM node:20-bookworm-slim
WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production

# drizzle-kit studio has no built-in authentication — this image is only
# meant to be deployed behind a Traefik Basic Auth middleware. See the
# "Drizzle Studio (admin tool, auth-gated)" section in
# DEPLOYMENT-Separate-apps.md before exposing this via a public domain.
EXPOSE 4983
CMD ["pnpm", "--filter", "@keynotes/db", "exec", "drizzle-kit", "studio", "--host", "0.0.0.0", "--port", "4983"]
