import { useState } from "react";
import { Navigate } from "react-router-dom";
import Page from "./Page";
import branches from "../Data/branches.json";
import { api } from "../api";
import { useUser } from "../UserContext";

const PLANS = [
  {
    id: "lifetime",
    label: "Lifetime Access",
    price: "$14.99",
    period: "one-time purchase",
    badge: "BEST VALUE",
    features: [
      "Unlimited journal entries",
      "Photo uploads",
      "All 5 letter templates",
      "Daily quotes & reminders",
      "Full training timeline",
      "Graduation celebration",
      "Notification scheduling",
      "Lifetime access — no subscription",
    ],
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "$4.99",
    period: "per month",
    features: [
      "Full app access during training",
      "Journal + photo uploads",
      "Letter templates",
      "Daily quotes",
      "Cancel anytime",
    ],
  },
];

export default function PaywallScreen() {
  const { loading, user, branchId, profile } = useUser();
  const branch = branches.find(b => b.id === branchId);
  const [plan, setPlan] = useState("lifetime");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (loading) return null;
  if (!branch || !profile) return <Navigate to="/" replace />;
  if (user?.plan && user?.planStatus === "active") return <Navigate to="/dashboard" replace />;

  const col = branch.colors.main, acc = branch.colors.accent;

  const checkout = async () => {
    setBusy(true);
    setErr("");
    try {
      const { url } = await api.checkout(plan);
      window.location.href = url;
    } catch (e) {
      setErr(e.message || "Could not start checkout. Please try again.");
      setBusy(false);
    }
  };

  const selectedPlan = PLANS.find(p => p.id === plan);

  return (
    <Page>
      <div style={{ minHeight: "100vh", background: branch.colors.dark, fontFamily: "Georgia,serif", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto" }}>
        <style>{`@keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${acc}44}50%{box-shadow:0 0 0 12px ${acc}00}}`}</style>
        <div style={{ maxWidth: "460px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔓</div>
            <h1 style={{ color: "#fff", fontSize: "1.6rem", margin: "0 0 0.4rem" }}>Unlock Full Access</h1>
            <p style={{ color: "#8a9bb0", margin: 0, fontSize: "0.9rem" }}>Support {branch.name} families through every step of the journey</p>
            <div style={{ width: "50px", height: "2px", background: acc, margin: "1rem auto 0" }} />
          </div>

          <div style={{ background: `${col}20`, borderRadius: "14px", padding: "1rem 1.1rem", marginBottom: "1.5rem", border: `1px solid ${col}40` }}>
            <p style={{ color: acc, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.65rem" }}>Everything included</p>
            {[
              "📅 Smart countdown tied to your recruit's exact dates",
              "📖 Branch-specific glossary, acronyms & rank charts",
              "📝 Memory journal with photo uploads",
              "✉️ 5 personalizable letter templates",
              "💬 Daily motivational quotes & reminders",
              "🎓 Graduation celebration animation",
              "🔔 Notification scheduling (OneSignal-ready)",
            ].map((f, i) => (
              <p key={i} style={{ color: "#c0ccd8", fontSize: "0.85rem", margin: "0 0 0.35rem" }}>{f}</p>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.1rem" }}>
            {PLANS.map(p => (
              <div
                key={p.id}
                onClick={() => setPlan(p.id)}
                style={{
                  background: plan === p.id ? `${col}30` : "rgba(255,255,255,0.04)",
                  border: `2px solid ${plan === p.id ? acc : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "14px", padding: "1rem 1.15rem", cursor: "pointer", position: "relative", transition: "all 0.2s",
                  animation: plan === p.id && p.id === "lifetime" ? "pulse2 2s ease-in-out infinite" : "none",
                }}
              >
                {p.badge && (
                  <div style={{ position: "absolute", top: "-10px", right: "12px", background: acc, color: "#000", fontSize: "0.62rem", fontWeight: "700", padding: "2px 10px", borderRadius: "20px", letterSpacing: "0.08em" }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 0.3rem", color: "#fff", fontWeight: "700", fontSize: "0.95rem" }}>{p.label}</p>
                    {p.features.slice(0, 3).map((f, i) => (
                      <p key={i} style={{ margin: "0 0 0.12rem", color: "#8a9bb0", fontSize: "0.77rem" }}>• {f}</p>
                    ))}
                    {p.features.length > 3 && (
                      <p style={{ margin: "0.1rem 0 0", color: "#5a6d80", fontSize: "0.73rem" }}>+{p.features.length - 3} more</p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                    <p style={{ margin: 0, color: acc, fontWeight: "700", fontSize: "1.3rem" }}>{p.price}</p>
                    <p style={{ margin: 0, color: "#6a7d90", fontSize: "0.72rem" }}>{p.period}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: "#5a6d80", fontSize: "0.78rem", textAlign: "center", margin: "0 0 1rem" }}>
            Have a promo code? Enter it on the secure Stripe checkout page.
          </p>

          {err && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center", margin: "0 0 0.75rem" }}>{err}</p>}

          <button
            onClick={checkout}
            disabled={busy}
            style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: busy ? `${col}70` : `linear-gradient(135deg,${col},${col}bb)`, border: `2px solid ${acc}`, color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: busy ? "wait" : "pointer", fontFamily: "Georgia,serif", letterSpacing: "0.03em" }}
          >
            {busy ? "Redirecting to Stripe..." : `Unlock Now — ${selectedPlan?.price}`}
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
            {["🔒 Secure checkout", "💳 Stripe payments", "↩️ 7-day refund"].map((t, i) => (
              <span key={i} style={{ color: "#4a5d70", fontSize: "0.75rem" }}>{t}</span>
            ))}
          </div>

          <p style={{ color: "#2a3d50", fontSize: "0.72rem", textAlign: "center", marginTop: "1.25rem", lineHeight: "1.5" }}>
            By purchasing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </Page>
  );
}
