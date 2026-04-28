import { useState } from "react";
import { api } from "../api";
import { useUser } from "../UserContext";

export default function NotificationPanel({ branch, profile, onClose }) {
  const { user, refresh } = useUser();
  const [perm, setPerm] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [schedule, setSchedule] = useState(user?.notifPrefs || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const col = branch.colors.main, acc = branch.colors.accent;

  const requestPerm = async () => {
    if (typeof Notification === "undefined") return;
    const r = await Notification.requestPermission();
    setPerm(r);
    if (r === "granted") {
      new Notification("Basic Training Companion", {
        body: `Daily support for ${profile.recruiterName}'s journey is now active.`,
      });
    }
  };

  const toggle = k => setSchedule(s => ({ ...s, [k]: !s[k] }));
  const save = async () => {
    setSaving(true);
    try {
      await api.savePreferences({ notifPrefs: schedule });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const cs = { background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "1rem", marginBottom: "0.65rem", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 900, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: branch.colors.dark, borderRadius: "20px 20px 0 0", padding: "1.5rem 1.25rem", width: "100%", maxWidth: "580px", maxHeight: "85vh", overflowY: "auto", border: `1px solid ${acc}25`, borderBottom: "none", fontFamily: "Georgia,serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ color: acc, fontSize: "1.1rem", margin: 0 }}>Notification Settings</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#6a7d90", fontSize: "1.6rem", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ ...cs, background: perm === "granted" ? `${col}20` : "rgba(255,80,80,0.1)", borderColor: perm === "granted" ? `${col}50` : "rgba(255,80,80,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: perm === "granted" ? acc : "#ff8080", fontSize: "0.85rem", fontWeight: "700", margin: "0 0 0.2rem" }}>
                {perm === "granted" ? "Notifications Enabled" : perm === "denied" ? "Notifications Blocked" : "Notifications Not Yet Enabled"}
              </p>
              <p style={{ color: "#8a9bb0", fontSize: "0.78rem", margin: 0 }}>
                {perm === "granted" ? "Daily support messages active" : perm === "denied" ? "Enable in your browser settings to proceed" : "Tap Enable to receive daily quotes and reminders"}
              </p>
            </div>
            {perm !== "granted" && perm !== "denied" && (
              <button onClick={requestPerm} style={{ padding: "0.45rem 0.9rem", borderRadius: "8px", background: col, border: `1px solid ${acc}`, color: "#fff", cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                Enable
              </button>
            )}
          </div>
        </div>
        <div style={{ ...cs, background: `${col}10`, borderColor: `${col}30` }}>
          <p style={{ color: acc, fontSize: "0.72rem", fontWeight: "700", margin: "0 0 0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Mobile Push (OneSignal)</p>
          <p style={{ color: "#7a8d9e", fontSize: "0.8rem", lineHeight: "1.5", margin: 0 }}>
            Full mobile push requires OneSignal when hosted. Add your App ID to enable push notifications on iOS/Android even when the app is closed.
          </p>
        </div>
        <p style={{ color: "#6a7d90", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0.75rem 0 0.6rem" }}>Notification preferences</p>
        {[
          { k: "dailyQuote", label: "Daily Motivational Quote", desc: "New quote every morning at 8am", icon: "💬" },
          { k: "weeklyPreview", label: "Weekly Training Preview", desc: "What your recruit is doing this week", icon: "📅" },
          { k: "letterReminder", label: "Letter Reminder", desc: "Every Tuesday - reminder to send a letter", icon: "✉️" },
          { k: "gradCountdown", label: "Graduation Milestones", desc: "Alerts at 30, 14, 7, and 1 day before graduation", icon: "🎓" },
        ].map(item => (
          <div key={item.k} style={{ ...cs, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", flex: 1 }}>
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              <div>
                <p style={{ margin: "0 0 0.15rem", color: "#d0dce8", fontSize: "0.88rem" }}>{item.label}</p>
                <p style={{ margin: 0, color: "#6a7d90", fontSize: "0.76rem" }}>{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(item.k)}
              style={{ width: "42px", height: "22px", borderRadius: "11px", background: schedule[item.k] ? col : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s" }}
            >
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: schedule[item.k] ? "23px" : "3px", transition: "left 0.2s" }} />
            </button>
          </div>
        ))}
        <button onClick={save} disabled={saving} style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", background: col, border: `2px solid ${acc}`, color: "#fff", fontSize: "0.95rem", fontWeight: "700", cursor: saving ? "wait" : "pointer", marginTop: "0.5rem", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
