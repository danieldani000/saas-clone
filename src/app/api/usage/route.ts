import { NextRequest, NextResponse } from "next/server";
import { checkWorkspaceQuota } from "@/lib/quota/check";

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  const quota = await checkWorkspaceQuota(workspaceId);

  return NextResponse.json({
    data: {
      creditsUsed: quota.used,
      creditsLimit: quota.limit,
      remaining: quota.remaining,
      plan: quota.plan
    }
  });
}
