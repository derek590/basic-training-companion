import { sql } from "./db.js";
import { readSessionId } from "./session.js";

export async function getUser(req) {
  const id = readSessionId(req);
  if (!id) return null;
  try {
    const { rows } = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function requireUser(req, res) {
  const user = await getUser(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return user;
}
