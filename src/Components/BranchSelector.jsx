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
      <header className="page__header">
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⭐</div>
        <h1 className="page__title">Basic Training Companion</h1>
        <p className="page__subtitle text_secondary">For the families who wait, worry, and beam with pride</p>
      </header>
        <p className="text_secondary">Select your loved one's branch to begin</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem", maxWidth: "520px", width: "100%", margin: "0 auto" }}>
          {branches.map(branch => (
            <BranchButton
              key={branch.id}
              branch={branch}
            />
          ))}
        </div>
    </Page>
  );
}
