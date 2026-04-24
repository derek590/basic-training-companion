import { useState, useEffect } from "react";
import Confetti from "./Confetti";

export default function GraduationCelebration({ profile, branch, onDismiss }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const col = branch.colors.main, acc = branch.colors.accent;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <Confetti active={show} />
      <style>{`
        @keyframes celebIn { from{transform:scale(0.4) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{opacity:0.7} 50%{opacity:1} 100%{opacity:0.7} }
      `}</style>
      <div style={{
        background: `linear-gradient(135deg,${branch.colors.dark},#050505)`,
        border: `2px solid ${acc}`,
        borderRadius: "20px",
        padding: "2.5rem 2rem",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        position: "relative",
        zIndex: 1001,
        animation: show ? "celebIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
        opacity: show ? 1 : 0,
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem", animation: "float 2s ease-in-out infinite" }}>🎓</div>
        <h1 style={{ color: acc, fontSize: "2rem", margin: "0 0 0.4rem", fontFamily: "Georgia,serif", letterSpacing: "0.03em" }}>They Did It!</h1>
        <p style={{ color: "#fff", fontSize: "1.15rem", margin: "0 0 0.2rem", fontFamily: "Georgia,serif" }}>{profile.recruiterName}</p>
        <p style={{ color: "#8a9bb0", fontFamily: "Georgia,serif", fontSize: "0.88rem", margin: "0 0 1.5rem" }}>
          has completed {branch.trainingName}
        </p>
        <div style={{ background: `${col}25`, borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem", border: `1px solid ${acc}50`, animation: "shimmer 2s ease-in-out infinite" }}>
          <p style={{ color: acc, fontStyle: "italic", fontFamily: "Georgia,serif", margin: 0, fontSize: "0.95rem" }}>"{branch.motto}"</p>
        </div>
        <p style={{ color: "#a0b0c0", fontFamily: "Georgia,serif", fontSize: "0.85rem", lineHeight: "1.65", marginBottom: "1.5rem" }}>
          Your strength, love, and patience carried them through every hard day. This victory belongs to all of you.
        </p>
        <button onClick={onDismiss} style={{ padding: "0.9rem 2rem", borderRadius: "10px", background: col, border: `2px solid ${acc}`, color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", fontFamily: "Georgia,serif", width: "100%" }}>
          View Their Journey
        </button>
      </div>
    </div>
  );
}
