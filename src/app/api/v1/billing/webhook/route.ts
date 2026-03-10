import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/response";
import { getStripe } from "@/lib/billing/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) return fail("Missing stripe signature or webhook secret", 400);

  const raw = await req.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Invalid signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const workspaceId = session?.metadata?.workspaceId;
    if (workspaceId) {
      await db.workspace.update({
        where: { id: workspaceId },
        data: { stripeCustomerId: (session.customer as string) || null }
      });

      await db.subscription.create({
        data: {
          workspaceId,
          provider: "stripe",
          providerCustomerId: session.customer || null,
          providerPlanId: session.metadata?.plan || null,
          status: "active"
        }
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as any;
    await db.subscription.updateMany({
      where: { providerCustomerId: sub.customer as string },
      data: { status: "canceled" }
    });
  }

  return ok({ received: true });
}
