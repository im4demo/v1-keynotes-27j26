#!/bin/sh
set -e

echo "Running database migrations..."
pnpm --filter @keynotes/db db:migrate

echo "Starting API..."
exec pnpm --filter @keynotes/api start
