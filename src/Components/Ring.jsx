export default function Ring({ days, total, accent }) {
  const r = 70, c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, 1 - Math.max(0, days) / Math.max(1, total)));
  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      <circle cx="85" cy="85" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
      <circle
        cx="85" cy="85" r={r} fill="none" stroke={accent} strokeWidth="10"
        strokeDasharray={c} strokeDashoffset={c * (1 - p)} strokeLinecap="round"
        transform="rotate(-90 85 85)"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text x="85" y="78" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700" fontFamily="Georgia,serif">
        {Math.max(0, days)}
      </text>
      <text x="85" y="100" textAnchor="middle" fill={accent} fontSize="11" fontFamily="Georgia,serif">
        DAYS TO GO
      </text>
    </svg>
  );
}
