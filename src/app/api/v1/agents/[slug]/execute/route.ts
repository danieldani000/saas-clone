import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { runsQueue } from "@/lib/queue";
import { fail, ok } from "@/lib/api/response";
import { requireApiAuth } from "@/app/api/v1/_utils/auth-guard";
import { writeAudit } from "@/lib/api/audit";
import { checkWorkspaceQuota } from "@/lib/quota/check";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const guard = await requireApiAuth(req);
  if (guard.error) return guard.error;
  const auth = guard.auth;

  const agent = await db.agent.findUnique({ where: { slug: params.slug } });
  if (!agent) return fail("Agent not found", 404);

  const body = await req.json().catch(() => ({}));

  const quota = await checkWorkspaceQuota(auth.workspaceId);
  if (!quota.allowed) {
    return fail(`Quota exceeded (${quota.used}/${quota.limit})`, 402);
  }

  const run = await db.agentRun.create({
    data: {
      workspaceId: auth.workspaceId,
      agentId: agent.id,
      input: body.input || {}
    }
  });

  await runsQueue.add("run-agent", { runId: run.id });
  await writeAudit({
    event: "agent_execute_queued",
    workspaceId: auth.workspaceId,
    apiKeyId: auth.apiKeyId,
    data: { runId: run.id, agentSlug: params.slug }
  });

  return ok({ runId: run.id, status: run.status }, 202);
}
