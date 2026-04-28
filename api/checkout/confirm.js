import { sql } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
import { getStripe } from "../_lib/stripe.js";

// Synchronous confirmation after Stripe redirects back with ?session_id=...
// The webhook is the source of truth, but checking the session here means the
// dashboard can render the unlocked state immediately instead of polling.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.client_reference_id !== user.id) {
    return res.status(403).json({ error: "Session does not belong to this user" });
  }

  const paid = session.payment_status === "paid" || session.status === "complete";
  if (!paid) return res.status(200).json({ paid: false });

  const plan = session.metadata?.plan || (session.mode === "subscription" ? "monthly" : "lifetime");
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  const { rows } = await sql`
    UPDATE users SET
      plan                   = ${plan},
      plan_status            = 'active',
      stripe_customer_id     = COALESCE(${customerId || null}, stripe_customer_id),
      stripe_subscription_id = COALESCE(${subscriptionId || null}, stripe_subscription_id),
      updated_at             = now()
    WHERE id = ${user.id}
    RETURNING *
  `;

  return res.status(200).json({ paid: true, user: rows[0] });
}
