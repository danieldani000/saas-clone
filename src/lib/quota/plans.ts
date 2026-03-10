export function getQuotaLimit(subscriptionPlanId: string | null | undefined) {
  const freeLimit = Number(process.env.QUOTA_FREE_LIMIT || 100);
  const proLimit = Number(process.env.QUOTA_PRO_LIMIT || 2000);
  const growthLimit = Number(process.env.QUOTA_GROWTH_LIMIT || 10000);

  if (!subscriptionPlanId) return freeLimit;
  if (subscriptionPlanId === "growth") return growthLimit;
  return proLimit;
}
