import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/response";
import { getStripe } from "@/lib/billing/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body.customerId) return fail("customerId is required", 400);

  const stripe = getStripe();
  const returnUrl = process.env.STRIPE_PORTAL_RETURN_URL || "http://localhost:3000/dashboard";

  const session = await stripe.billingPortal.sessions.create({
    customer: body.customerId,
    return_url: returnUrl
  });

  return ok({ portalUrl: session.url });
}
