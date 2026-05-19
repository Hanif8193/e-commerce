import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateCart } from "@/services/cart.service";
import { createPaymentIntent } from "@/services/payment.service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import Stripe from "stripe";

export async function POST(request: Request) {
  const { allowed } = rateLimit(`checkout:${getClientIp(request)}`, 10, 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cart = await getOrCreateCart(session.user.id);

    if (!cart.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const paymentIntent = await createPaymentIntent(cart, session.user.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeAuthenticationError) {
      console.error("[checkout] Stripe authentication failed — check STRIPE_SECRET_KEY");
      return NextResponse.json({ error: "Payment service misconfigured" }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
