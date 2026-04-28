import { sql } from "./_lib/db.js";
import { getStripe } from "./_lib/stripe.js";

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ error: "STRIPE_WEBHOOK_SECRET is not set" });

  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];
  const raw = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object;
        const userId = s.client_reference_id || s.metadata?.user_id;
        if (!userId) break;
        const plan = s.metadata?.plan || (s.mode === "subscription" ? "monthly" : "lifetime");
        const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
        const subId = typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
        await sql`
          UPDATE users SET
            plan                   = ${plan},
            plan_status            = 'active',
            stripe_customer_id     = COALESCE(${customerId || null}, stripe_customer_id),
            stripe_subscription_id = COALESCE(${subId || null}, stripe_subscription_id),
            updated_at             = now()
          WHERE id = ${userId}
        `;
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const status = sub.status === "active" || sub.status === "trialing" ? "active" : sub.status;
        await sql`
          UPDATE users SET plan_status = ${status}, updated_at = now()
          WHERE stripe_subscription_id = ${sub.id}
        `;
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await sql`
          UPDATE users SET plan_status = 'canceled', updated_at = now()
          WHERE stripe_subscription_id = ${sub.id}
        `;
        break;
      }

      default:
        // Ignore other event types.
        break;
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ received: true });
}
