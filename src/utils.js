export const getDaysBetween = (a, b) =>
  Math.ceil((new Date(b) - new Date(a)) / 86400000);

export const getDaysUntil = d => {
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(d + "T12:00:00") - n) / 86400000);
};

export const getCurrentWeek = sd =>
  Math.max(1, Math.ceil(getDaysBetween(sd, new Date().toISOString().split("T")[0]) / 7));

export const getTodayQuote = quotes =>
  quotes[new Date().getDate() % quotes.length];

export const fmtDate = d =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// API serves dates as ISO timestamps; normalize back to YYYY-MM-DD for the helpers above.
export const toDateOnly = d => (d ? String(d).slice(0, 10) : d);
