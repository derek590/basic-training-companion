import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Page from "./Page";
import branches from "../Data/branches.json";
import { saveToStorage } from "../utils";

export default function SetupScreen() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const branch = branches.find(b => b.id === branchId);
  const [form, setForm] = useState({ recruiterName: "", familyName: "", startDate: "", endDate: "" });
  const [err, setErr] = useState("");

  if (!branch) return <Navigate to="/select" replace />;

  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inp = {
    width: "100%", padding: "0.82rem 1rem", borderRadius: "8px",
    border: `1px solid ${branch.colors.main}40`, background: "rgba(255,255,255,0.08)",
    color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "Georgia,serif",
  };
  const lbl = {
    color: branch.colors.accent, fontSize: "0.75rem", letterSpacing: "0.1em",
    textTransform: "uppercase", marginBottom: "0.35rem", display: "block",
  };

  const submit = () => {
    if (!form.recruiterName || !form.familyName || !form.startDate || !form.endDate) {
      setErr("Please fill in all fields.");
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setErr("End date must be after start date.");
      return;
    }
    saveToStorage({ branchId, profile: form });
    navigate(localStorage.getItem("btc_paid") ? "/dashboard" : "/paywall");
  };

  return (
    <Page
      style={{
        "--background-color": branch.colors.dark,
      }}
    >
        <div style={{ maxWidth: "440px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <h2 style={{ color: "#fff", fontSize: "1.7rem", margin: 0 }}>{branch.fullName}</h2>
            <p style={{ color: branch.colors.accent, fontStyle: "italic", margin: "0.4rem 0" }}>{branch.motto}</p>
            <div style={{ width: "45px", height: "2px", background: branch.colors.accent, margin: "0.85rem auto" }} />
            <p style={{ color: "#8a9bb0", margin: 0, fontSize: "0.9rem" }}>Let's personalize your companion</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={lbl}>Recruit's Name</label>
              <input style={inp} placeholder="e.g. James Rivera" value={form.recruiterName} onChange={e => s("recruiterName", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Your Name (Family Member)</label>
              <input style={inp} placeholder="e.g. Maria Rivera" value={form.familyName} onChange={e => s("familyName", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Training Start Date</label>
              <input type="date" style={inp} value={form.startDate} onChange={e => s("startDate", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Anticipated Graduation Date</label>
              <input type="date" style={inp} value={form.endDate} onChange={e => s("endDate", e.target.value)} />
            </div>
            {err && <p style={{ color: "#ff6b6b", fontSize: "0.88rem", textAlign: "center", margin: 0 }}>{err}</p>}
            <button
              onClick={submit}
              style={{ padding: "0.95rem", borderRadius: "10px", background: branch.colors.main, border: `2px solid ${branch.colors.accent}`, color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", fontFamily: "Georgia,serif", marginTop: "0.25rem" }}
            >
              Continue to App
            </button>
            <button
              onClick={() => navigate("/")}
              style={{ background: "transparent", border: "none", color: "#6a7d90", cursor: "pointer", fontSize: "0.88rem", fontFamily: "Georgia,serif" }}
            >
              Choose different branch
          </button>
        </div>
      </div>
    </Page>
  );
}
