import { db } from "@/lib/db";
import { getQuotaLimit } from "./plans";

export async function checkWorkspaceQuota(workspaceId: string) {
  const [usage, latestSub] = await Promise.all([
    db.usageEvent.aggregate({ where: { workspaceId, metric: "credits" }, _sum: { value: true } }),
    db.subscription.findFirst({ where: { workspaceId, status: "active" }, orderBy: { createdAt: "desc" } })
  ]);

  const used = usage._sum.value || 0;
  const limit = getQuotaLimit(latestSub?.providerPlanId || null);
  const remaining = Math.max(0, limit - used);

  return {
    used,
    limit,
    remaining,
    allowed: remaining > 0,
    plan: latestSub?.providerPlanId || "free"
  };
}
