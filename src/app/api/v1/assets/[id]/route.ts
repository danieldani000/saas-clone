import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api/response";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const asset = await db.output.findUnique({ where: { id: params.id } });
  if (!asset) return fail("Asset not found", 404);

  await db.output.update({
    where: { id: params.id },
    data: { deletedAt: new Date() }
  });

  return ok({ id: params.id, deleted: true });
}
