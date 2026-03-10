# Creative Ops Clone V1

Functional clone scaffold for an AI creative-agent SaaS.

## Includes
- Next.js app router
- Prisma schema (workspace, agents, runs, outputs, usage)
- API routes for core operations
- BullMQ worker for async run execution
- Minimal dashboard UI

## Setup
```bash
cd saas-clone
cp .env.example .env
npm install
npm run db:generate
npm run db:push
node prisma/seed.ts
npm run dev
```

## Run worker
In a second terminal:
```bash
cd saas-clone
npx tsx src/workers/agent-runner.ts
```

## API smoke tests
```bash
cd saas-clone
chmod +x scripts/smoke-api.sh
BASE_URL=http://localhost:3000 ./scripts/smoke-api.sh
```

Manual cURL examples: `scripts/curl-quickstart.md`

## Docker (all-in-one)
```bash
cd saas-clone
docker compose up --build
```

This starts:
- `app` on http://localhost:3000
- `postgres` on 5432
- `redis` on 6379
- `worker` (background run processor)

## Production compose
- `Dockerfile.prod`
- `docker-compose.prod.yml`
- `.env.prod.example`
- `DEPLOYMENT.md`

## Core routes
- `POST /api/workspaces`
- `GET /api/agents`
- `POST /api/agent-runs`
- `GET /api/agent-runs/:id`
- `POST /api/brand-kit`
- `GET /api/outputs?workspaceId=...`
- `GET /api/usage?workspaceId=...`

## API-style routes (external integration)
- `GET /api/v1/health`
- `GET /api/v1/audit-logs` (requires `x-admin-token`, optional `workspaceId`, `limit`)
- `POST /api/v1/billing/checkout` (Stripe checkout)
- `POST /api/v1/billing/portal` (Stripe billing portal)
- `POST /api/v1/billing/webhook` (Stripe events)
- `GET /api/v1/workspaces/:id/billing` (current billing status)
- `POST /api/v1/generate-flow` (runs text+image+video generation flow)
- `POST /api/v1/assets/:id/duplicate` (duplicate an output asset)
- `DELETE /api/v1/assets/:id` (soft delete an output asset)
- `POST /api/v1/assets/:id/restore` (undo soft delete)
- `/assets/trash` (UI to review and restore deleted assets)
- `GET /api/usage?workspaceId=...` returns used/limit/remaining/plan
- `POST /api/v1/keys` (bootstrap API key creation)
- `DELETE /api/v1/keys/:id` (revoke key, requires `x-admin-token`)
- `POST /api/v1/keys/:id/rotate` (rotate key, requires `x-admin-token`)
- `POST /api/v1/agents/:slug/execute` (Bearer auth + rate limit)
- `POST /api/v1/triggers` (Bearer auth + rate limit)
- `GET /api/v1/runs/:id` (Bearer auth + rate limit)

Rate limiting env:
- `RATE_LIMIT_WINDOW_SECONDS` (default: 60)
- `RATE_LIMIT_MAX` (default: 120)

Admin env:
- `ADMIN_TOKEN` (required for revoke endpoint)

Security:
- API JSON responses include security headers (HSTS, X-Frame-Options, nosniff, etc.)
- Structured API logs are emitted as JSON lines
- Auth/rate-limit centralized through `requireApiAuth()` guard
- Audit events are persisted in DB (`AuditLog`) for key actions

Provider routing:
- `TEXT_PROVIDER=openai|gemini|claude`
- `IMAGE_PROVIDER=openai|nanobananapro`
- `VIDEO_PROVIDER=kling`
- Per-run override in UI/API: set `input.provider` (ex: `claude`, `gemini`, `nanobananapro`, `kling`)

Stripe env required:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `STRIPE_PORTAL_RETURN_URL`

Quota env:
- `QUOTA_FREE_LIMIT` (default 100)
- `QUOTA_PRO_LIMIT` (default 2000)
- `QUOTA_GROWTH_LIMIT` (default 10000)
