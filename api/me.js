import { sql } from "./_lib/db.js";
import { getUser } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUser(req);
  if (!user) return res.status(200).json({ user: null });

  const [{ rows: memories }, { rows: reminders }] = await Promise.all([
    sql`SELECT id, type, text, photo_data, photo_name, created_at
        FROM memories WHERE user_id = ${user.id} ORDER BY created_at ASC`,
    sql`SELECT id, text, done, created_at
        FROM reminders WHERE user_id = ${user.id} ORDER BY created_at ASC`,
  ]);

  return res.status(200).json({ user, memories, reminders });
}
