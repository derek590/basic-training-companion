import { useNavigate } from "react-router-dom";

export default function BranchButton({ branch }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${branch.id}`)}
      className="card"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "2px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "1.4rem 1rem",
        cursor: "pointer",
        transition: "all 0.25s",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Georgia,serif",
      }}
    >
      <div style={{ fontSize: "1.9rem", marginBottom: "0.45rem" }}>{branch.icon}</div>
      <div style={{ fontSize: "1rem", fontWeight: "700", letterSpacing: "0.04em" }}>{branch.name}</div>
      <div style={{ fontSize: "0.7rem", color: "#6a7d90", marginTop: "0.25rem", lineHeight: "1.3" }}>{branch.trainingName}</div>
    </button>
  );
}
