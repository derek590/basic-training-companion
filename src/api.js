async function request(path, { method = "GET", body, query } = {}) {
  const url = query
    ? `${path}?${new URLSearchParams(query).toString()}`
    : path;
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  me: () => request("/api/me"),
  setup: (payload) => request("/api/setup", { method: "POST", body: payload }),
  checkout: (plan) => request("/api/checkout", { method: "POST", body: { plan } }),
  confirmCheckout: (sessionId) =>
    request("/api/checkout/confirm", { method: "POST", body: { sessionId } }),
  addMemory: (payload) => request("/api/memories", { method: "POST", body: payload }),
  deleteMemory: (id) => request("/api/memories", { method: "DELETE", query: { id } }),
  addReminder: (text) => request("/api/reminders", { method: "POST", body: { text } }),
  updateReminder: (id, done) =>
    request("/api/reminders", { method: "PATCH", body: { done }, query: { id } }),
  deleteReminder: (id) => request("/api/reminders", { method: "DELETE", query: { id } }),
  savePreferences: (payload) =>
    request("/api/preferences", { method: "PATCH", body: payload }),
  logout: () => request("/api/logout", { method: "POST" }),
};
