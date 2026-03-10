import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api/response";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const source = await db.output.findUnique({ where: { id: params.id } });
  if (!source) return fail("Asset not found", 404);

  const duplicated = await db.output.create({
    data: {
      workspaceId: source.workspaceId,
      runId: source.runId,
      kind: source.kind,
      uri: source.uri,
      metadata: source.metadata,
      version: source.version + 1
    }
  });

  return ok({ id: duplicated.id, sourceId: source.id });
}
