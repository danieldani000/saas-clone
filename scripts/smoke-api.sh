#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
WORKSPACE_NAME="${WORKSPACE_NAME:-Demo Workspace}"
KEY_NAME="${KEY_NAME:-local-smoke}"
ADMIN_TOKEN="${ADMIN_TOKEN:-change-me}"

command -v jq >/dev/null 2>&1 || { echo "jq is required"; exit 1; }

echo "1) Create workspace"
WS_RES=$(curl -sS -X POST "$BASE_URL/api/workspaces" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"$WORKSPACE_NAME\"}")
WORKSPACE_ID=$(echo "$WS_RES" | jq -r '.data.id')
echo "workspaceId=$WORKSPACE_ID"

if [[ -z "$WORKSPACE_ID" || "$WORKSPACE_ID" == "null" ]]; then
  echo "Failed creating workspace"; echo "$WS_RES"; exit 1
fi

echo "2) Create API key"
KEY_RES=$(curl -sS -X POST "$BASE_URL/api/v1/keys" \
  -H 'Content-Type: application/json' \
  -d "{\"workspaceId\":\"$WORKSPACE_ID\",\"name\":\"$KEY_NAME\"}")
KEY_ID=$(echo "$KEY_RES" | jq -r '.data.id')
TOKEN=$(echo "$KEY_RES" | jq -r '.data.token')
echo "keyId=$KEY_ID token_prefix=${TOKEN:0:16}..."

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "Failed creating API key"; echo "$KEY_RES"; exit 1
fi

echo "3) List agents"
AGENTS=$(curl -sS "$BASE_URL/api/agents")
AGENT_SLUG=$(echo "$AGENTS" | jq -r '.data[0].slug')
if [[ -z "$AGENT_SLUG" || "$AGENT_SLUG" == "null" ]]; then
  echo "No agents found. Seed first: node prisma/seed.ts"; exit 1
fi
echo "agentSlug=$AGENT_SLUG"

echo "4) Execute agent"
EXEC_RES=$(curl -sS -X POST "$BASE_URL/api/v1/agents/$AGENT_SLUG/execute" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"input":{"productName":"Test Product","usps":["Fast","Cheap"]}}')
RUN_ID=$(echo "$EXEC_RES" | jq -r '.data.runId')
echo "runId=$RUN_ID"

if [[ -z "$RUN_ID" || "$RUN_ID" == "null" ]]; then
  echo "Failed execute"; echo "$EXEC_RES"; exit 1
fi

echo "5) Poll run status"
for i in {1..20}; do
  RUN_RES=$(curl -sS "$BASE_URL/api/v1/runs/$RUN_ID" -H "Authorization: Bearer $TOKEN")
  STATUS=$(echo "$RUN_RES" | jq -r '.data.status')
  echo "attempt $i: status=$STATUS"
  if [[ "$STATUS" == "done" || "$STATUS" == "failed" ]]; then
    echo "$RUN_RES" | jq
    break
  fi
  sleep 1
done

echo "6) Trigger run"
TRIG_RES=$(curl -sS -X POST "$BASE_URL/api/v1/triggers" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"type":"onCampaignCreated","agentSlug":"market-research","payload":{"competitors":["A","B"],"channel":"meta"}}')
echo "$TRIG_RES" | jq

echo "7) Healthcheck"
curl -sS "$BASE_URL/api/v1/health" | jq

echo "8) Rotate key"
ROTATE_RES=$(curl -sS -X POST "$BASE_URL/api/v1/keys/$KEY_ID/rotate" -H "x-admin-token: $ADMIN_TOKEN")
NEW_TOKEN=$(echo "$ROTATE_RES" | jq -r '.data.token')
echo "$ROTATE_RES" | jq

echo "9) Revoke old key"
REVOKE_RES=$(curl -sS -X DELETE "$BASE_URL/api/v1/keys/$KEY_ID" -H "x-admin-token: $ADMIN_TOKEN")
echo "$REVOKE_RES" | jq

echo "10) Verify old key is unauthorized"
HTTP_CODE=$(curl -s -o /tmp/revoked_response.json -w "%{http_code}" "$BASE_URL/api/v1/runs/$RUN_ID" -H "Authorization: Bearer $TOKEN")
echo "old_key_status_code=$HTTP_CODE"
cat /tmp/revoked_response.json | jq

echo "11) Verify rotated key works"
if [[ -n "$NEW_TOKEN" && "$NEW_TOKEN" != "null" ]]; then
  curl -sS "$BASE_URL/api/v1/runs/$RUN_ID" -H "Authorization: Bearer $NEW_TOKEN" | jq
fi

echo "Smoke test completed ✅"
