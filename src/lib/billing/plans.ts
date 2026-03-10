export const plans = {
  pro: {
    id: process.env.STRIPE_PRICE_PRO || "",
    name: "Pro"
  },
  growth: {
    id: process.env.STRIPE_PRICE_GROWTH || "",
    name: "Growth"
  }
} as const;

export type PlanKey = keyof typeof plans;
