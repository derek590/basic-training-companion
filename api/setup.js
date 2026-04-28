import { sql } from "./_lib/db.js";
import { readSessionId, setSessionCookie } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { branchId, recruitName, familyName, startDate, endDate, email } = req.body || {};

  if (!branchId || !recruitName || !familyName || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({ error: "End date must be after start date" });
  }

  const existingId = readSessionId(req);

  let user;
  if (existingId) {
    const { rows } = await sql`
      UPDATE users SET
        branch_id    = ${branchId},
        recruit_name = ${recruitName},
        family_name  = ${familyName},
        start_date   = ${startDate},
        end_date     = ${endDate},
        email        = COALESCE(${email || null}, email),
        updated_at   = now()
      WHERE id = ${existingId}
      RETURNING *
    `;
    user = rows[0];
  }

  if (!user) {
    const { rows } = await sql`
      INSERT INTO users (email, branch_id, recruit_name, family_name, start_date, end_date)
      VALUES (${email || null}, ${branchId}, ${recruitName}, ${familyName}, ${startDate}, ${endDate})
      RETURNING *
    `;
    user = rows[0];
    setSessionCookie(res, user.id);
  }

  return res.status(200).json({ user });
}
