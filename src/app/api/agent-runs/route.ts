export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runsQueue } from "@/lib/queue";
import { checkWorkspaceQuota } from "@/lib/quota/check";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const quota = await checkWorkspaceQuota(body.workspaceId);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "Quota exceeded", data: { used: quota.used, limit: quota.limit, plan: quota.plan } },
      { status: 402 }
    );
  }

  const run = await db.agentRun.create({
    data: {
      workspaceId: body.workspaceId,
      agentId: body.agentId,
      input: body.input || {}
    }
  });

  await runsQueue.add("run-agent", { runId: run.id });

  return NextResponse.json({ data: run }, { status: 201 });
}
