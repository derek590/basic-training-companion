import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { notifPrefs, celebDone } = req.body || {};

  const { rows } = await sql`
    UPDATE users SET
      notif_prefs = COALESCE(${notifPrefs ? JSON.stringify(notifPrefs) : null}::jsonb, notif_prefs),
      celeb_done  = COALESCE(${typeof celebDone === "boolean" ? celebDone : null}, celeb_done),
      updated_at  = now()
    WHERE id = ${user.id}
    RETURNING *
  `;

  return res.status(200).json({ user: rows[0] });
}
