import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Page from "./Page";
import Ring from "./Ring";
import GraduationCelebration from "./GraduationCelebration";
import NotificationPanel from "./NotificationPanel";
import LetterTemplates from "./LetterTemplates";
import branches from "../Data/branches.json";
import quotes from "../Data/quotes.json";
import { getDaysBetween, getDaysUntil, getCurrentWeek, getTodayQuote, fmtDate } from "../utils";
import { api } from "../api";
import { useUser } from "../UserContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, user, branchId, profile, memories, reminders, refresh } = useUser();
  const branch = branches.find(b => b.id === branchId);

  const [tab, setTab] = useState("home");
  const [newMem, setNewMem] = useState({ type: "feeling", text: "", photoPreview: null, photoName: null });
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);
  const [newRemText, setNewRemText] = useState("");
  const [savingMem, setSavingMem] = useState(false);
  const fileRef = useRef(null);

  // Confirm Stripe checkout if returning from payment.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    (async () => {
      try {
        await api.confirmCheckout(sessionId);
      } catch {
        // Webhook will catch up; ignore client-side errors here.
      } finally {
        await refresh();
        navigate("/dashboard", { replace: true });
      }
    })();
  }, [location.search, navigate, refresh]);

  // Trigger graduation celebration when training completes.
  useEffect(() => {
    if (!user || !profile) return;
    if (getDaysUntil(profile.endDate) < 0 && !user.celebDone) setShowCeleb(true);
  }, [user, profile]);

  if (loading) return null;
  if (!user || !branch || !profile) return <Navigate to="/" replace />;
  if (!user.plan || user.planStatus !== "active") return <Navigate to="/paywall" replace />;

  const col = branch.colors.main, acc = branch.colors.accent;
  const daysStart = getDaysUntil(profile.startDate);
  const daysEnd = getDaysUntil(profile.endDate);
  const totalDays = getDaysBetween(profile.startDate, profile.endDate);
  const started = daysStart <= 0;
  const complete = daysEnd < 0;
  const curWeek = started && !complete ? getCurrentWeek(profile.startDate) : 1;
  const thisWeek = branch.weeklyEvents.find(w => w.week === curWeek);
  const nextWeek = branch.weeklyEvents.find(w => w.week === curWeek + 1);
  const quote = getTodayQuote(quotes);

  const onReset = async () => {
    await api.logout();
    await refresh();
    navigate("/");
  };

  const dismissCeleb = async () => {
    setShowCeleb(false);
    try {
      await api.savePreferences({ celebDone: true });
      await refresh();
    } catch {}
  };

  const uploadPhoto = e => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onloadend = () => setNewMem(m => ({ ...m, photoPreview: rd.result, photoName: f.name }));
    rd.readAsDataURL(f);
  };

  const addMemory = async () => {
    if (!newMem.text.trim() && !newMem.photoPreview) return;
    setSavingMem(true);
    try {
      await api.addMemory({
        type: newMem.type,
        text: newMem.text || null,
        photoData: newMem.photoPreview || null,
        photoName: newMem.photoName || null,
      });
      setNewMem({ type: "feeling", text: "", photoPreview: null, photoName: null });
      await refresh();
    } catch {} finally {
      setSavingMem(false);
    }
  };

  const removeMemory = async id => {
    try {
      await api.deleteMemory(id);
      await refresh();
    } catch {}
  };

  const addReminder = async () => {
    const text = newRemText.trim();
    if (!text) return;
    try {
      await api.addReminder(text);
      setNewRemText("");
      await refresh();
    } catch {}
  };

  const toggleReminder = async r => {
    try {
      await api.updateReminder(r.id, !r.done);
      await refresh();
    } catch {}
  };

  const removeReminder = async id => {
    try {
      await api.deleteReminder(id);
      await refresh();
    } catch {}
  };

  const cs = { background: "rgba(255,255,255,0.05)", borderRadius: "13px", padding: "1rem 1.15rem", marginBottom: "0.85rem", border: "1px solid rgba(255,255,255,0.08)" };
  const TABS = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "timeline", icon: "📅", label: "Timeline" },
    { id: "glossary", icon: "📖", label: "Glossary" },
    { id: "ranks", icon: "🎖", label: "Ranks" },
    { id: "memories", icon: "📝", label: "Journal" },
    { id: "letters", icon: "✉️", label: "Letters" },
    { id: "reminders", icon: "🔔", label: "Reminders" },
  ];
  const filtAcr = branch.acronyms.filter(a =>
    a.abbr.toLowerCase().includes(search.toLowerCase()) || a.meaning.toLowerCase().includes(search.toLowerCase())
  );
  const filtTrm = branch.keyTerms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page>
      <div style={{ minHeight: "100vh", background: branch.colors.dark, fontFamily: "Georgia,serif", color: "#fff", paddingBottom: "5rem" }}>
        {showCeleb && !user.celebDone && (
          <GraduationCelebration profile={profile} branch={branch} onDismiss={dismissCeleb} />
        )}
        {notifOpen && <NotificationPanel branch={branch} profile={profile} onClose={() => setNotifOpen(false)} />}

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${col},${branch.colors.dark})`, padding: "1.3rem 1.15rem 0.85rem", borderBottom: `1px solid ${acc}22` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: 0, color: acc, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{branch.name} · {branch.trainingName}</p>
              <h1 style={{ margin: "0.2rem 0 0", fontSize: "1.3rem", fontWeight: "700" }}>{profile.recruiterName}'s Journey</h1>
              <p style={{ margin: "0.12rem 0 0", color: "#8a9bb0", fontSize: "0.8rem" }}>Followed by {profile.familyName}</p>
            </div>
            <div style={{ display: "flex", gap: "0.45rem" }}>
              <button onClick={() => setNotifOpen(true)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", padding: "0.38rem 0.6rem", cursor: "pointer", fontSize: "0.82rem" }}>🔔</button>
              <button onClick={onReset} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "6px", color: "#8a9bb0", padding: "0.38rem 0.6rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: "Georgia,serif" }}>Switch</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.28)", padding: "0 0.2rem" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ background: "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${acc}` : "2px solid transparent", color: tab === t.id ? "#fff" : "#6a7d90", padding: "0.6rem 0.75rem", cursor: "pointer", fontSize: "0.72rem", whiteSpace: "nowrap", fontFamily: "Georgia,serif", display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", transition: "color 0.2s", flexShrink: 0 }}>
              <span style={{ fontSize: "0.9rem" }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: "1rem 1.05rem", maxWidth: "680px", margin: "0 auto" }}>

          {/* HOME */}
          {tab === "home" && (
            <div>
              <div style={{ ...cs, background: `linear-gradient(135deg,${col}40,rgba(0,0,0,0.3))`, border: `1px solid ${acc}40`, textAlign: "center" }}>
                {complete ? (
                  <div>
                    <div style={{ fontSize: "2.5rem" }}>🎓</div>
                    <h2 style={{ color: acc, margin: "0.4rem 0" }}>Training Complete!</h2>
                    <p style={{ color: "#8a9bb0", margin: "0 0 0.75rem" }}>Congratulations to {profile.recruiterName}!</p>
                    <button onClick={() => setShowCeleb(true)} style={{ padding: "0.45rem 1.15rem", borderRadius: "20px", background: `${acc}25`, border: `1px solid ${acc}`, color: acc, cursor: "pointer", fontSize: "0.82rem", fontFamily: "Georgia,serif" }}>
                      Replay Celebration
                    </button>
                  </div>
                ) : started ? (
                  <div>
                    <p style={{ color: acc, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.2rem" }}>Currently Training · Week {curWeek}</p>
                    <Ring days={daysEnd} total={totalDays} accent={acc} />
                    <p style={{ color: "#8a9bb0", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>Graduation: {fmtDate(profile.endDate)}</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: acc, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.2rem" }}>Countdown to Training</p>
                    <Ring days={daysStart} total={daysStart + 1} accent={acc} />
                    <p style={{ color: "#8a9bb0", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>Training begins {fmtDate(profile.startDate)}</p>
                  </div>
                )}
              </div>
              <div style={{ ...cs, borderLeft: `3px solid ${acc}` }}>
                <p style={{ color: acc, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 0.45rem" }}>Today's Inspiration</p>
                <p style={{ color: "#d0dce8", fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.6", margin: "0 0 0.35rem" }}>"{quote.quote}"</p>
                <p style={{ color: "#6a7d90", fontSize: "0.8rem", margin: 0 }}>— {quote.author}</p>
              </div>
              {started && !complete && thisWeek && (
                <div style={cs}>
                  <p style={{ color: acc, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 0.55rem" }}>This Week — {thisWeek.title}</p>
                  {thisWeek.events.map((ev, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span style={{ color: acc, fontSize: "0.75rem", marginTop: "2px" }}>▸</span>
                      <span style={{ color: "#c0ccd8", fontSize: "0.86rem" }}>{ev.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {started && !complete && nextWeek && (
                <div style={{ ...cs, background: "rgba(255,255,255,0.03)" }}>
                  <p style={{ color: "#6a7d90", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 0.55rem" }}>Coming Up — Week {nextWeek.week}: {nextWeek.title}</p>
                  {nextWeek.events.slice(0, 3).map((ev, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <span style={{ color: "#6a7d90", fontSize: "0.75rem", marginTop: "2px" }}>◦</span>
                      <span style={{ color: "#8a9bb0", fontSize: "0.83rem" }}>{ev.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ textAlign: "center", color: `${acc}55`, fontStyle: "italic", fontSize: "0.82rem", letterSpacing: "0.04em", padding: "0.4rem 0" }}>{branch.motto}</p>
            </div>
          )}

          {/* TIMELINE */}
          {tab === "timeline" && (
            <div>
              <h2 style={{ color: acc, fontSize: "1.05rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>Training Timeline</h2>
              {branch.weeklyEvents.map((wk, i) => {
                const cur = started && wk.week === curWeek;
                const past = started && wk.week < curWeek;
                return (
                  <div key={i} style={{ display: "flex", gap: "0.8rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: cur ? acc : past ? col : "rgba(255,255,255,0.08)", border: `2px solid ${cur ? acc : past ? col : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", color: cur ? "#000" : "#fff", flexShrink: 0 }}>
                        {wk.week}
                      </div>
                      {i < branch.weeklyEvents.length - 1 && (
                        <div style={{ width: "2px", flex: 1, background: past ? `${col}45` : "rgba(255,255,255,0.07)", minHeight: "14px" }} />
                      )}
                    </div>
                    <div style={{ ...cs, flex: 1, padding: "0.8rem 0.95rem", marginBottom: 0, borderColor: cur ? `${acc}45` : "rgba(255,255,255,0.07)", background: cur ? `${col}18` : "rgba(255,255,255,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <p style={{ margin: 0, fontWeight: "700", color: cur ? acc : past ? "#4a5d70" : "#d0dce8", fontSize: "0.87rem" }}>{wk.title}</p>
                        {cur && <span style={{ background: acc, color: "#000", fontSize: "0.6rem", padding: "2px 7px", borderRadius: "20px", fontWeight: "700" }}>NOW</span>}
                      </div>
                      {wk.events.map((ev, j) => (
                        <div key={j} style={{ color: past ? "#3a4d60" : "#8a9bb0", fontSize: "0.8rem", marginBottom: "0.18rem" }}>
                          {past ? "✓" : "•"} {ev.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* GLOSSARY */}
          {tab === "glossary" && (
            <div>
              <h2 style={{ color: acc, fontSize: "1.05rem", letterSpacing: "0.05em", marginBottom: "0.85rem" }}>Glossary & Acronyms</h2>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search terms or acronyms..."
                style={{ width: "100%", padding: "0.68rem 0.95rem", borderRadius: "8px", border: `1px solid ${col}45`, background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", marginBottom: "1rem", fontFamily: "Georgia,serif" }}
              />
              {filtAcr.length > 0 && (
                <div style={{ marginBottom: "1.1rem" }}>
                  <p style={{ color: "#6a7d90", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Acronyms</p>
                  {filtAcr.map((a, i) => (
                    <div key={i} style={{ ...cs, padding: "0.65rem 0.95rem", display: "flex", gap: "0.85rem", marginBottom: "0.4rem" }}>
                      <span style={{ color: acc, fontWeight: "700", fontSize: "0.88rem", minWidth: "52px" }}>{a.abbr}</span>
                      <span style={{ color: "#c0ccd8", fontSize: "0.85rem" }}>{a.meaning}</span>
                    </div>
                  ))}
                </div>
              )}
              {filtTrm.length > 0 && (
                <div>
                  <p style={{ color: "#6a7d90", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Key Terms</p>
                  {filtTrm.map((t, i) => (
                    <div key={i} style={{ ...cs, marginBottom: "0.6rem" }}>
                      <p style={{ margin: "0 0 0.25rem", color: acc, fontWeight: "700", fontSize: "0.88rem" }}>{t.term}</p>
                      <p style={{ margin: 0, color: "#a0b0c0", fontSize: "0.83rem", lineHeight: "1.5" }}>{t.def}</p>
                    </div>
                  ))}
                </div>
              )}
              {filtAcr.length === 0 && filtTrm.length === 0 && (
                <p style={{ color: "#6a7d90", textAlign: "center", fontStyle: "italic" }}>No results found.</p>
              )}
            </div>
          )}

          {/* RANKS */}
          {tab === "ranks" && (
            <div>
              <h2 style={{ color: acc, fontSize: "1.05rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>{branch.name} Enlisted Rank Structure</h2>
              {branch.ranks.map((r, i) => (
                <div key={i} style={{ ...cs, display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.75rem 0.95rem", marginBottom: "0.4rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: `${col}38`, border: `1px solid ${col}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: acc, fontSize: "0.65rem", fontWeight: "700" }}>{r.grade}</span>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 0.12rem", fontWeight: "700", color: "#d0dce8", fontSize: "0.88rem" }}>{r.abbr}</p>
                    <p style={{ margin: 0, color: "#8a9bb0", fontSize: "0.8rem" }}>{r.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* JOURNAL */}
          {tab === "memories" && (
            <div>
              <h2 style={{ color: acc, fontSize: "1.05rem", letterSpacing: "0.05em", marginBottom: "0.7rem" }}>Memory Journal</h2>
              <div style={cs}>
                <p style={{ color: "#6a7d90", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Capture a moment</p>
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                  {[{ id: "feeling", label: "Feeling", icon: "💭" }, { id: "call", label: "Call", icon: "📞" }, { id: "photo", label: "Moment", icon: "📸" }].map(t => (
                    <button key={t.id} onClick={() => setNewMem(m => ({ ...m, type: t.id }))}
                      style={{ padding: "0.32rem 0.65rem", borderRadius: "20px", border: `1px solid ${newMem.type === t.id ? acc : "rgba(255,255,255,0.14)"}`, background: newMem.type === t.id ? `${acc}28` : "transparent", color: newMem.type === t.id ? acc : "#6a7d90", cursor: "pointer", fontSize: "0.76rem", fontFamily: "Georgia,serif" }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={newMem.text}
                  onChange={e => setNewMem(m => ({ ...m, text: e.target.value }))}
                  placeholder={newMem.type === "feeling" ? "Write about your feelings today..." : newMem.type === "call" ? "Write about your phone call..." : "Describe this special moment..."}
                  rows={3}
                  style={{ width: "100%", padding: "0.68rem", borderRadius: "8px", border: `1px solid ${col}38`, background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "0.86rem", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "Georgia,serif" }}
                />
                <input type="file" accept="image/*" ref={fileRef} onChange={uploadPhoto} style={{ display: "none" }} />
                <button onClick={() => fileRef.current.click()}
                  style={{ marginTop: "0.55rem", width: "100%", padding: "0.48rem", borderRadius: "8px", border: `1px dashed ${col}70`, background: "transparent", color: "#8a9bb0", cursor: "pointer", fontSize: "0.8rem", fontFamily: "Georgia,serif" }}>
                  {newMem.photoName ? `Photo attached: ${newMem.photoName}` : "Attach a photo (optional)"}
                </button>
                {newMem.photoPreview && (
                  <div style={{ marginTop: "0.5rem", position: "relative" }}>
                    <img src={newMem.photoPreview} alt="preview" style={{ width: "100%", maxHeight: "170px", objectFit: "cover", borderRadius: "8px", border: `1px solid ${col}45` }} />
                    <button onClick={() => setNewMem(m => ({ ...m, photoPreview: null, photoName: null }))}
                      style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "0.75rem" }}>×</button>
                  </div>
                )}
                <button onClick={addMemory} disabled={savingMem} style={{ marginTop: "0.62rem", padding: "0.58rem 1.15rem", borderRadius: "8px", background: col, border: `1px solid ${acc}`, color: "#fff", cursor: savingMem ? "wait" : "pointer", fontSize: "0.86rem", fontFamily: "Georgia,serif", opacity: savingMem ? 0.7 : 1 }}>
                  {savingMem ? "Saving..." : "Save to Journal"}
                </button>
              </div>
              {memories.length === 0
                ? <p style={{ color: "#5a6d80", textAlign: "center", fontStyle: "italic", marginTop: "1.1rem" }}>Your journal is empty. Start capturing this journey.</p>
                : (
                  <>
                    <p style={{ color: "#6a7d90", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.55rem" }}>{memories.length} entr{memories.length !== 1 ? "ies" : "y"}</p>
                    {[...memories].reverse().map(entry => (
                      <div key={entry.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "0.85rem 0.95rem", marginBottom: "0.6rem", borderLeft: `3px solid ${acc}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", marginBottom: "0.3rem" }}>
                              <span>{entry.type === "feeling" ? "💭" : entry.type === "call" ? "📞" : "📸"}</span>
                              <span style={{ color: acc, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{entry.type} · {entry.date}</span>
                            </div>
                            {entry.text && <p style={{ color: "#d0dce8", margin: "0 0 0.45rem", fontSize: "0.86rem", lineHeight: "1.5" }}>{entry.text}</p>}
                            {entry.photoPreview && <img src={entry.photoPreview} alt="memory" style={{ width: "100%", maxHeight: "190px", objectFit: "cover", borderRadius: "7px" }} />}
                          </div>
                          <button onClick={() => removeMemory(entry.id)} style={{ background: "transparent", border: "none", color: "#ff6b6b33", cursor: "pointer", fontSize: "1.1rem", padding: "0 0 0 0.4rem" }}>×</button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
            </div>
          )}

          {/* LETTERS */}
          {tab === "letters" && <LetterTemplates branch={branch} profile={profile} />}

          {/* REMINDERS */}
          {tab === "reminders" && (
            <div>
              <h2 style={{ color: acc, fontSize: "1.05rem", letterSpacing: "0.05em", marginBottom: "0.9rem" }}>Family Reminders</h2>
              <div style={{ ...cs, display: "flex", gap: "0.5rem", padding: "0.7rem 0.85rem" }}>
                <input
                  value={newRemText}
                  onChange={e => setNewRemText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addReminder(); }}
                  placeholder="Add a custom reminder..."
                  style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "0.86rem", outline: "none", fontFamily: "Georgia,serif" }}
                />
                <button
                  onClick={addReminder}
                  style={{ padding: "0.38rem 0.7rem", borderRadius: "6px", background: col, border: `1px solid ${acc}`, color: "#fff", cursor: "pointer", fontSize: "0.78rem", fontFamily: "Georgia,serif" }}
                >
                  Add
                </button>
              </div>
              {reminders.map(r => (
                <div key={r.id} style={{ ...cs, display: "flex", alignItems: "flex-start", gap: "0.65rem", opacity: r.done ? 0.48 : 1 }}>
                  <button
                    onClick={() => toggleReminder(r)}
                    style={{ width: "21px", height: "21px", borderRadius: "50%", border: `2px solid ${r.done ? acc : "rgba(255,255,255,0.28)"}`, background: r.done ? acc : "transparent", flexShrink: 0, cursor: "pointer", marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "700", fontSize: "0.68rem" }}
                  >
                    {r.done ? "✓" : ""}
                  </button>
                  <p style={{ margin: 0, flex: 1, color: r.done ? "#4a5d70" : "#c0ccd8", fontSize: "0.86rem", textDecoration: r.done ? "line-through" : "none" }}>{r.text}</p>
                  <button onClick={() => removeReminder(r.id)} style={{ background: "transparent", border: "none", color: "#ff6b6b28", cursor: "pointer", fontSize: "0.95rem", padding: 0 }}>×</button>
                </div>
              ))}
              <div style={{ ...cs, background: `${col}10`, borderColor: `${col}30`, marginTop: "0.5rem" }}>
                <p style={{ color: acc, fontSize: "0.76rem", fontWeight: "700", margin: "0 0 0.55rem" }}>Letter Writing Tips</p>
                {[
                  "Write at least once a week — it means everything",
                  "Keep letters positive and encouraging",
                  "Include photos, drawings, or clippings from home",
                  "Number your letters so they can be read in order",
                  "Let them know specific things you're proud of",
                ].map((t, i) => (
                  <p key={i} style={{ color: "#a0b0c0", fontSize: "0.8rem", margin: "0 0 0.28rem" }}>• {t}</p>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Page>
  );
}
