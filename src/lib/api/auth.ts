import crypto from "crypto";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/api/rate-limit";

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function getWorkspaceFromBearer(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const keyHash = hashToken(token);
  const key = await db.apiKey.findUnique({ where: { keyHash } });
  if (!key || !key.active) return null;

  const rate = await checkRateLimit(key.id);

  return {
    workspaceId: key.workspaceId,
    apiKeyId: key.id,
    rate
  };
}

export function generateApiKey() {
  const raw = `ck_live_${crypto.randomBytes(24).toString("hex")}`;
  return {
    raw,
    prefix: raw.slice(0, 12),
    hash: hashToken(raw)
  };
}
