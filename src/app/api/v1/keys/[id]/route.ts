import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { writeAudit } from "@/lib/api/audit";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || req.headers.get("x-admin-token") !== adminToken) {
    return fail("Forbidden", 403);
  }

  const key = await db.apiKey.findUnique({ where: { id: params.id } });
  if (!key) return fail("API key not found", 404);

  const updated = await db.apiKey.update({
    where: { id: params.id },
    data: { active: false }
  });

  await writeAudit({
    level: "warn",
    event: "api_key_revoked",
    workspaceId: updated.workspaceId,
    data: { keyId: updated.id }
  });
  return ok({ id: updated.id, active: updated.active });
}
