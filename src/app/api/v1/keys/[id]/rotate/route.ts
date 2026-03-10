import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { generateApiKey } from "@/lib/api/auth";
import { writeAudit } from "@/lib/api/audit";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || req.headers.get("x-admin-token") !== adminToken) {
    return fail("Forbidden", 403);
  }

  const existing = await db.apiKey.findUnique({ where: { id: params.id } });
  if (!existing) return fail("API key not found", 404);

  const generated = generateApiKey();

  await db.$transaction([
    db.apiKey.update({ where: { id: existing.id }, data: { active: false } }),
    db.apiKey.create({
      data: {
        workspaceId: existing.workspaceId,
        name: `${existing.name}-rotated`,
        keyPrefix: generated.prefix,
        keyHash: generated.hash,
        active: true
      }
    })
  ]);

  await writeAudit({
    level: "warn",
    event: "api_key_rotated",
    workspaceId: existing.workspaceId,
    data: { oldKeyId: existing.id }
  });

  return ok({ rotatedFrom: existing.id, token: generated.raw }, 201);
}
