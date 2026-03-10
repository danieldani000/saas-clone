import { NextRequest } from "next/server";
import { getWorkspaceFromBearer } from "@/lib/api/auth";
import { fail } from "@/lib/api/response";

export async function requireApiAuth(req: NextRequest) {
  const auth = await getWorkspaceFromBearer(req);
  if (!auth) return { error: fail("Unauthorized", 401) };
  if (!auth.rate.allowed) return { error: fail("Rate limit exceeded", 429) };
  return { auth };
}
