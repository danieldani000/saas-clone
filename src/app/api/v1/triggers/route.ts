import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { runsQueue } from "@/lib/queue";
import { fail, ok } from "@/lib/api/response";
import { requireApiAuth } from "@/app/api/v1/_utils/auth-guard";
import { writeAudit } from "@/lib/api/audit";
import { checkWorkspaceQuota } from "@/lib/quota/check";

export async function POST(req: NextRequest) {
  const guard = await requireApiAuth(req);
  if (guard.error) return guard.error;
  const auth = guard.auth;

  const body = await req.json().catch(() => ({}));
  if (!body.type || !body.agentSlug) return fail("type and agentSlug are required", 400);

  const agent = await db.agent.findUnique({ where: { slug: body.agentSlug } });
  if (!agent) return fail("Agent not found", 404);

  const quota = await checkWorkspaceQuota(auth.workspaceId);
  if (!quota.allowed) return fail(`Quota exceeded (${quota.used}/${quota.limit})`, 402);

  const run = await db.agentRun.create({
    data: {
      workspaceId: auth.workspaceId,
      agentId: agent.id,
      input: body.payload || {}
    }
  });

  const trigger = await db.trigger.create({
    data: {
      workspaceId: auth.workspaceId,
      type: body.type,
      agentSlug: body.agentSlug,
      payload: body.payload || {},
      runId: run.id,
      status: "queued"
    }
  });

  await runsQueue.add("run-agent", { runId: run.id });
  await writeAudit({
    event: "trigger_queued",
    workspaceId: auth.workspaceId,
    apiKeyId: auth.apiKeyId,
    data: { triggerId: trigger.id, runId: run.id, type: body.type }
  });

  return ok({ triggerId: trigger.id, runId: run.id, status: "queued" }, 202);
}
