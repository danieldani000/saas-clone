# Deployment Guide (Staging/Prod)

## 1) Prepare env
```bash
cp .env.prod.example .env.prod
# edit secrets
```

## 2) Build and run
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```

## 3) Check health
```bash
curl http://localhost:3000/api/v1/health
```

## 4) Smoke test
```bash
ADMIN_TOKEN=<your-admin-token> BASE_URL=http://localhost:3000 ./scripts/smoke-api.sh
```

## 5) Reverse proxy (recommended)
Put Nginx/Caddy in front with HTTPS and forward to `localhost:3000`.

## 6) Update rollout
```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```

## Notes
- Keep `ADMIN_TOKEN` secret
- Limit inbound access to 80/443 and SSH only
- Move Postgres/Redis to managed services for higher reliability
