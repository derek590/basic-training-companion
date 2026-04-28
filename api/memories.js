import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";

export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

export default async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "POST") {
    const { type, text, photoData, photoName } = req.body || {};
    if (!type) return res.status(400).json({ error: "Missing type" });
    if (!text && !photoData) return res.status(400).json({ error: "Memory must have text or a photo" });

    const { rows } = await sql`
      INSERT INTO memories (user_id, type, text, photo_data, photo_name)
      VALUES (${user.id}, ${type}, ${text || null}, ${photoData || null}, ${photoName || null})
      RETURNING id, type, text, photo_data, photo_name, created_at
    `;
    return res.status(200).json({ memory: rows[0] });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing id" });
    await sql`DELETE FROM memories WHERE id = ${id} AND user_id = ${user.id}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
