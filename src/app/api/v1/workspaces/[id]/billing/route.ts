import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const ws = await db.workspace.findUnique({
    where: { id: params.id },
    include: { subscriptions: { orderBy: { createdAt: "desc" }, take: 1 } }
  });

  if (!ws) return fail("Workspace not found", 404);
  return ok({
    workspaceId: ws.id,
    stripeCustomerId: ws.stripeCustomerId,
    subscription: ws.subscriptions[0] || null
  });
}
