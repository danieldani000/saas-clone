import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || req.headers.get("x-admin-token") !== adminToken) {
    return fail("Forbidden", 403);
  }

  const workspaceId = req.nextUrl.searchParams.get("workspaceId") || undefined;
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 100), 500);

  const logs = await db.auditLog.findMany({
    where: workspaceId ? { workspaceId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit
  });

  return ok({ items: logs, count: logs.length });
}
