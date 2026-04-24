import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LS_KEY } from "../utils";
import Loading from "./Loading";

export default function RootRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("unlocked") === "true") {
      const pendingPlan = localStorage.getItem("btc_pending_plan") || "lifetime";
      localStorage.setItem("btc_paid", JSON.stringify({ plan: pendingPlan, ts: Date.now() }));
      localStorage.removeItem("btc_pending_plan");
      navigate("/dashboard", { replace: true });
      return;
    }

    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      const paid = localStorage.getItem("btc_paid");
      if (d.branchId && d.profile) {
        navigate(paid ? "/dashboard" : "/paywall", { replace: true });
        return;
      }
    } catch (e) {}
    navigate("/select", { replace: true });
  }, []);

  return <Loading />;
}
