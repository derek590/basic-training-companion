import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import BranchButton from "./BranchButton";
import branches from "../Data/branches.json";
import { useUser } from "../UserContext";

export default function BranchSelector() {
  const navigate = useNavigate();
  const { loading, user, profile } = useUser();

  useEffect(() => {
    if (loading) return;
    if (user && profile) {
      const paid = user.plan && user.planStatus === "active";
      navigate(paid ? "/dashboard" : "/paywall", { replace: true });
    }
  }, [loading, user, profile, navigate]);

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
          <BranchButton key={branch.id} branch={branch} />
        ))}
      </div>
    </Page>
  );
}
