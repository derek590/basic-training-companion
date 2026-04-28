import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";
import { getStripe } from "./_lib/stripe.js";

const PRICES = {
  lifetime: { env: "STRIPE_PRICE_LIFETIME", mode: "payment" },
  monthly:  { env: "STRIPE_PRICE_MONTHLY",  mode: "subscription" },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { plan } = req.body || {};
  const cfg = PRICES[plan];
  if (!cfg) return res.status(400).json({ error: "Invalid plan" });

  const priceId = process.env[cfg.env];
  if (!priceId) return res.status(500).json({ error: `${cfg.env} is not set` });

  const origin = process.env.APP_URL || `https://${req.headers.host}`;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: cfg.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    customer: user.stripe_customer_id || undefined,
    customer_email: user.stripe_customer_id ? undefined : user.email || undefined,
    client_reference_id: user.id,
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/paywall`,
    metadata: { user_id: user.id, plan },
    ...(cfg.mode === "subscription"
      ? { subscription_data: { metadata: { user_id: user.id, plan } } }
      : { payment_intent_data: { metadata: { user_id: user.id, plan } } }),
  });

  // Remember which plan the user chose, in case the webhook needs it.
  await sql`UPDATE users SET updated_at = now() WHERE id = ${user.id}`;

  return res.status(200).json({ url: session.url });
}
