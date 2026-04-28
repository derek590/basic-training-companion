const COOKIE_NAME = "btc_sid";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function readSessionId(req) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function setSessionCookie(res, userId) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(userId)}; Path=/; Max-Age=${ONE_YEAR}; HttpOnly; SameSite=Lax${secure}`
  );
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`
  );
}
