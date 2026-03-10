export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  const outputs = await db.output.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return NextResponse.json({ data: outputs });
}
