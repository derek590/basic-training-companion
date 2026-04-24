import { useState } from "react";
import letterTemplates from "../Data/letterTemplates.json";

export default function LetterTemplates({ branch, profile }) {
  const [sel, setSel] = useState(null);
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const col = branch.colors.main, acc = branch.colors.accent;
  const cs = { background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "0.9rem 1rem", marginBottom: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" };

  const open = t => {
    const filled = t.body
      .replace(/\[Recruit Name\]/g, profile.recruiterName)
      .replace(/\[Your Name\]/g, profile.familyName);
    setBody(filled);
    setSel(t);
  };

  const copy = () => {
    navigator.clipboard.writeText(body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(body);
    a.download = `Letter_${profile.recruiterName}.txt`;
    a.click();
  };

  if (sel) return (
    <div style={{ fontFamily: "Georgia,serif" }}>
      <button onClick={() => setSel(null)} style={{ background: "transparent", border: "none", color: acc, cursor: "pointer", fontSize: "0.85rem", padding: 0, marginBottom: "0.85rem" }}>
        ← Back to Templates
      </button>
      <h3 style={{ color: "#fff", margin: "0 0 0.2rem" }}>{sel.title}</h3>
      <p style={{ color: "#6a7d90", fontSize: "0.78rem", marginBottom: "0.85rem" }}>
        Pre-filled for {profile.recruiterName} and {profile.familyName} — edit freely below
      </p>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={17}
        style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: `1px solid ${col}50`, background: "rgba(255,255,255,0.06)", color: "#d0dce8", fontSize: "0.88rem", lineHeight: "1.65", resize: "vertical", outline: "none", boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.65rem" }}>
        <button onClick={copy} style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", background: copied ? `${acc}30` : col, border: `1px solid ${acc}`, color: "#fff", cursor: "pointer", fontSize: "0.88rem" }}>
          {copied ? "Copied!" : "Copy Letter"}
        </button>
        <button onClick={download} style={{ padding: "0.7rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#d0dce8", cursor: "pointer", fontSize: "0.88rem" }}>
          Save .txt
        </button>
      </div>
    </div>
  );

  const cats = [...new Set(letterTemplates.map(t => t.category))];
  return (
    <div style={{ fontFamily: "Georgia,serif" }}>
      <h2 style={{ color: acc, fontSize: "1.05rem", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>Letter Templates</h2>
      <p style={{ color: "#6a7d90", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Pre-written and personalized for {profile.recruiterName}</p>
      {cats.map(cat => (
        <div key={cat}>
          <p style={{ color: "#6a7d90", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.45rem" }}>{cat}</p>
          {letterTemplates.filter(t => t.category === cat).map(t => (
            <div
              key={t.id}
              onClick={() => open(t)}
              style={cs}
              onMouseEnter={e => e.currentTarget.style.borderColor = acc}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 0.2rem", color: "#d0dce8", fontWeight: "700", fontSize: "0.9rem" }}>{t.title}</p>
                  <p style={{ margin: 0, color: "#6a7d90", fontSize: "0.78rem" }}>{t.body.replace(/\n/g, " ").substring(0, 75)}...</p>
                </div>
                <span style={{ color: acc, marginLeft: "0.75rem", fontSize: "1.1rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ background: `${col}12`, borderRadius: "10px", padding: "0.9rem", border: `1px solid ${col}30`, marginTop: "0.5rem" }}>
        <p style={{ color: acc, fontSize: "0.78rem", fontWeight: "700", margin: "0 0 0.5rem" }}>Letter Writing Tips</p>
        {[
          "Write at least once a week — it truly means the world",
          "Keep letters positive and uplifting",
          "Include photos, drawings, or clippings from home",
          "Number letters so they can be read in order",
          "Address them by full name and unit on the envelope",
        ].map((t, i) => (
          <p key={i} style={{ color: "#8a9bb0", fontSize: "0.81rem", margin: "0 0 0.25rem" }}>• {t}</p>
        ))}
      </div>
    </div>
  );
}
