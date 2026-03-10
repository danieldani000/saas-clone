import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/response";
import { getStripe } from "@/lib/billing/stripe";
import { plans, type PlanKey } from "@/lib/billing/plans";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body.workspaceId || !body.plan) return fail("workspaceId and plan are required", 400);

  const plan = body.plan as PlanKey;
  if (!plans[plan]) return fail("Invalid plan", 400);
  if (!plans[plan].id) return fail(`Missing Stripe price for plan ${plan}`, 400);

  const stripe = getStripe();
  const successUrl = process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/dashboard?billing=success";
  const cancelUrl = process.env.STRIPE_CANCEL_URL || "http://localhost:3000/dashboard?billing=cancel";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plans[plan].id, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { workspaceId: body.workspaceId, plan }
  });

  return ok({ checkoutUrl: session.url, sessionId: session.id });
}
