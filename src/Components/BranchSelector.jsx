import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Page from "./Page";
import BranchButton from "./BranchButton";
import branches from "../Data/branches.json";
import { LS_KEY } from "../utils";

export default function BranchSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle Stripe return with ?unlocked=true
    const params = new URLSearchParams(location.search);
    if (params.get("unlocked") === "true") {
      const pendingPlan = localStorage.getItem("btc_pending_plan") || "lifetime";
      localStorage.setItem("btc_paid", JSON.stringify({ plan: pendingPlan, ts: Date.now() }));
      localStorage.removeItem("btc_pending_plan");
      navigate("/dashboard", { replace: true });
      return;
    }

    // Redirect returning users to where they left off
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      const paid = localStorage.getItem("btc_paid");
      if (d.branchId && d.profile) {
        navigate(paid ? "/dashboard" : "/paywall", { replace: true });
      }
    } catch (e) {}
  }, []);

  return (
    <Page>
      <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Georgia,serif" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⭐</div>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.7rem,4vw,2.7rem)", fontWeight: "700", letterSpacing: "0.05em", margin: 0 }}>Basic Training Companion</h1>
          <p style={{ color: "#8a9bb0", fontSize: "0.95rem", marginTop: "0.6rem", fontStyle: "italic" }}>For the families who wait, worry, and beam with pride</p>
          <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg,#c8a84b,#4a90d9)", margin: "1.25rem auto 0" }} />
        </div>
        <p style={{ color: "#6a7d90", marginBottom: "1.25rem", fontSize: "0.9rem", textAlign: "center" }}>Select your loved one's branch to begin</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem", maxWidth: "520px", width: "100%" }}>
          {branches.map(branch => (
            <BranchButton
              key={branch.id}
              branch={branch}
              onSelect={() => navigate(`/${branch.id}`)}
            />
          ))}
        </div>
      </div>
    </Page>
  );
}
