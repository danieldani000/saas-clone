import { db } from "@/lib/db";
import { apiLog } from "@/lib/api/logger";

export async function writeAudit(params: {
  level?: "info" | "warn" | "error";
  event: string;
  workspaceId?: string;
  apiKeyId?: string;
  data?: Record<string, unknown>;
}) {
  const level = params.level || "info";
  apiLog(level, params.event, { workspaceId: params.workspaceId, apiKeyId: params.apiKeyId, ...(params.data || {}) });

  await db.auditLog.create({
    data: {
      level,
      event: params.event,
      workspaceId: params.workspaceId,
      apiKeyId: params.apiKeyId,
      data: (params.data || {}) as object
    }
  });
}
