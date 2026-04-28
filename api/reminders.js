import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";

export default async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "POST") {
    const { text } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: "Missing text" });
    const { rows } = await sql`
      INSERT INTO reminders (user_id, text)
      VALUES (${user.id}, ${text.trim()})
      RETURNING id, text, done, created_at
    `;
    return res.status(200).json({ reminder: rows[0] });
  }

  if (req.method === "PATCH") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const { done } = req.body || {};
    if (typeof done !== "boolean") return res.status(400).json({ error: "Missing done flag" });
    const { rows } = await sql`
      UPDATE reminders SET done = ${done}
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING id, text, done, created_at
    `;
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ reminder: rows[0] });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing id" });
    await sql`DELETE FROM reminders WHERE id = ${id} AND user_id = ${user.id}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
