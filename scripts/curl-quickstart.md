# cURL quickstart

Assume app runs at `http://localhost:3000`.

## 0) Create workspace
```bash
curl -X POST http://localhost:3000/api/workspaces \
  -H 'Content-Type: application/json' \
  -d '{"name":"Demo Workspace"}'
```

## 1) Create API key
```bash
curl -X POST http://localhost:3000/api/v1/keys \
  -H 'Content-Type: application/json' \
  -d '{"workspaceId":"<WORKSPACE_ID>","name":"local-key"}'
```

Copy `data.token` as `API_KEY`.

## 2) Execute an agent
```bash
curl -X POST http://localhost:3000/api/v1/agents/ugc-script/execute \
  -H "Authorization: Bearer <API_KEY>" \
  -H 'Content-Type: application/json' \
  -d '{"input":{"productName":"My product","usps":["Fast","Reliable"]}}'
```

## 3) Get run
```bash
curl http://localhost:3000/api/v1/runs/<RUN_ID> \
  -H "Authorization: Bearer <API_KEY>"
```

## 4) Trigger event
```bash
curl -X POST http://localhost:3000/api/v1/triggers \
  -H "Authorization: Bearer <API_KEY>" \
  -H 'Content-Type: application/json' \
  -d '{"type":"onCampaignCreated","agentSlug":"market-research","payload":{"competitors":["A","B"],"channel":"meta"}}'
```

## 5) Healthcheck
```bash
curl http://localhost:3000/api/v1/health
```

## 6) Revoke key
```bash
curl -X DELETE http://localhost:3000/api/v1/keys/<KEY_ID> \
  -H "x-admin-token: <ADMIN_TOKEN>"
```

## 7) Rotate key
```bash
curl -X POST http://localhost:3000/api/v1/keys/<KEY_ID>/rotate \
  -H "x-admin-token: <ADMIN_TOKEN>"
```

## 8) Read audit logs
```bash
curl "http://localhost:3000/api/v1/audit-logs?limit=50" \
  -H "x-admin-token: <ADMIN_TOKEN>"
```
