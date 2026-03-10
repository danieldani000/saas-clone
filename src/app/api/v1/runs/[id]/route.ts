import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { requireApiAuth } from "@/app/api/v1/_utils/auth-guard";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireApiAuth(req);
  if (guard.error) return guard.error;
  const auth = guard.auth;

  const run = await db.agentRun.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
    include: { outputs: true, steps: true, agent: true }
  });

  if (!run) return fail("Run not found", 404);
  return ok(run);
}
