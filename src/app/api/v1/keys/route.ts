import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { generateApiKey } from "@/lib/api/auth";

// bootstrap endpoint for now (replace with authenticated dashboard flow)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body.workspaceId || !body.name) return fail("workspaceId and name are required", 400);

  const generated = generateApiKey();
  const key = await db.apiKey.create({
    data: {
      workspaceId: body.workspaceId,
      name: body.name,
      keyPrefix: generated.prefix,
      keyHash: generated.hash
    }
  });

  return ok({ id: key.id, name: key.name, keyPrefix: key.keyPrefix, token: generated.raw }, 201);
}
