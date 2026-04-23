import { useState, useEffect, useRef } from "react";

import "./style.scss";
import BranchButton from "./Components/BranchButton";

import branches from "./Data/branches.json";

const LETTER_TEMPLATES = [
  { id: "week1", title: "First Week Check-In", category: "Early Training",
    body: `Dear [Recruit Name],\n\nWe're thinking of you every single moment. By now you've arrived, been processed, and are starting to find your footing. We know it's overwhelming right now - the noise, the pace, the new faces - but you were built for this.\n\nAt home, everything feels a little quieter without you here. We keep the routines going just like you'd want.\n\nWe are so incredibly proud of you. You took a step that most people only talk about. That takes real courage.\n\nWrite back when you can. We check the mailbox every single day.\n\nAll our love,\n[Your Name]` },
  { id: "encouragement", title: "You've Got This", category: "Encouragement",
    body: `Dear [Recruit Name],\n\nThere may be moments where you wonder if you can do this. You can. You absolutely can.\n\nThink about every hard thing you've overcome before. You faced those moments and came out stronger. This is no different - it's just bigger. Every hard day in training is building the person we already know you are.\n\nWe don't talk about how hard the waiting is here at home - because our job is to keep things light for you. But know that every night we think of you, and every morning we start the day with you in our hearts.\n\nKeep going. We'll be there cheering at graduation.\n\nWith so much love,\n[Your Name]` },
  { id: "news", title: "News from Home", category: "Stay Connected",
    body: `Dear [Recruit Name],\n\nLife at home keeps moving, but it's not quite the same without you here.\n\nThis week a lot has happened that I know you'd want to hear about. [Share a news update - a family event, something funny, a neighbor's news, a pet story.]\n\nEveryone asks about you. They all send their love and want you to know they're proud.\n\nThe weather has been [describe the weather] - we keep thinking of you and wondering what it's like where you are.\n\nWe're keeping your room just as you left it. Everything is waiting for you.\n\nCounting the days,\n[Your Name]` },
  { id: "midpoint", title: "Halfway There", category: "Milestone",
    body: `Dear [Recruit Name],\n\nCan you believe it? You're past the halfway point. The finish line is real now - we can almost see it from here.\n\nLook how far you've come since that first week. Every early morning, every hard run, every moment of doubt you pushed through - that was you. That was your strength.\n\nWe've been tracking every week on our calendar here at home. We cross off each day together, getting closer to the moment we see your face again.\n\nThe graduation date is circled. We already have our plans. We cannot wait to see you walk across that field.\n\nAlmost there,\n[Your Name]` },
  { id: "graduation", title: "We'll Be There", category: "Graduation",
    body: `Dear [Recruit Name],\n\nGraduation is close. We have our plans made, our bags ready, and our hearts full.\n\nI've been thinking about the moment I'll see your face - standing in formation, in uniform, having done something extraordinary. I don't know if I'll be able to hold it together. I probably won't.\n\nYou set out to do something hard and you did it. You became something. And you did it while we loved you from a distance, which is the hardest kind of loving there is.\n\nCome home proud. Come home rested when you can. And know that everything waiting for you here is better because you went.\n\nSee you at graduation.\n\nForever proud,\n[Your Name]` },
];

const QUOTES = [
  { quote: "The price of freedom is eternal vigilance.", author: "Thomas Jefferson" },
  { quote: "Behind every strong soldier is an even stronger family.", author: "Military Family Wisdom" },
  { quote: "Distance means so little when someone means so much.", author: "Tom McNeal" },
  { quote: "Courage is not the absence of fear, but the judgment that something else is more important.", author: "Ambrose Redmoon" },
  { quote: "They are not just fighting for their country - they are fighting for you.", author: "Unknown" },
  { quote: "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.", author: "Rikki Rogers" },
  { quote: "Waiting is the hardest part - but every day brings you closer.", author: "Military Family Wisdom" },
  { quote: "Pride is the hardest emotion to explain and the easiest to feel.", author: "Military Family Wisdom" },
  { quote: "You don't have to be in uniform to serve with honor.", author: "Unknown" },
  { quote: "The soldier above all prays for peace, for it is the soldier who bears the deepest wounds.", author: "General Douglas MacArthur" },
  { quote: "Service to others is the rent you pay for your room here on Earth.", author: "Muhammad Ali" },
  { quote: "A hero is someone who has given their life to something bigger than themselves.", author: "Joseph Campbell" },
  { quote: "Every day of waiting is a day closer to the proudest moment of your life.", author: "Military Family Wisdom" },
  { quote: "Home is where the heart is, and our hearts are with our heroes.", author: "Unknown" },
];

const LS_KEY = "btc_v3";
const getDaysBetween = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);
const getDaysUntil = d => { const n = new Date(); n.setHours(0,0,0,0); return Math.ceil((new Date(d+"T12:00:00") - n) / 86400000); };
const getCurrentWeek = sd => Math.max(1, Math.ceil(getDaysBetween(sd, new Date().toISOString().split("T")[0]) / 7));
const getTodayQuote = () => QUOTES[new Date().getDate() % QUOTES.length];
const fmtDate = d => new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

// -- Confetti ------------------------------------------------------------------
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ["#c8a84b","#4a7c59","#4a90d9","#8b0000","#fff","#ffd700","#ff6b6b","#6bcaff"];
    const pts = Array.from({length:150}, () => ({
      x: Math.random()*canvas.width, y: Math.random()*-canvas.height,
      r: Math.random()*7+3, d: Math.random()*150,
      color: colors[Math.floor(Math.random()*colors.length)],
      tilt: 0, tiltAngle: 0, tiltSpeed: Math.random()*0.1+0.05,
      speed: Math.random()*3+1,
    }));
    let angle = 0, raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      angle += 0.01;
      pts.forEach(p => {
        p.tiltAngle += p.tiltSpeed; p.y += p.speed;
        p.x += Math.sin(angle+p.d)*1.5; p.tilt = Math.sin(p.tiltAngle)*12;
        if (p.y > canvas.height+20) { p.y = -10; p.x = Math.random()*canvas.width; }
        ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color;
        ctx.moveTo(p.x+p.tilt+p.r/4, p.y); ctx.lineTo(p.x+p.tilt, p.y+p.tilt+p.r/4); ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height); }, 6000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}} />;
}

// -- Graduation Celebration ----------------------------------------------------
function GraduationCelebration({ profile, branch, onDismiss }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);
  const col = branch.color, acc = branch.accent;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <Confetti active={show} />
      <style>{`
        @keyframes celebIn { from{transform:scale(0.4) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{opacity:0.7} 50%{opacity:1} 100%{opacity:0.7} }
      `}</style>
      <div style={{background:`linear-gradient(135deg,${branch.dark},#050505)`,border:`2px solid ${acc}`,borderRadius:"20px",padding:"2.5rem 2rem",maxWidth:"400px",width:"100%",textAlign:"center",position:"relative",zIndex:1001,animation:show?"celebIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards":"none",opacity:show?1:0}}>
        <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"float 2s ease-in-out infinite"}}> </div>
        <h1 style={{color:acc,fontSize:"2rem",margin:"0 0 0.4rem",fontFamily:"Georgia,serif",letterSpacing:"0.03em"}}>They Did It!</h1>
        <p style={{color:"#fff",fontSize:"1.15rem",margin:"0 0 0.2rem",fontFamily:"Georgia,serif"}}>{profile.recruiterName}</p>
        <p style={{color:"#8a9bb0",fontFamily:"Georgia,serif",fontSize:"0.88rem",margin:"0 0 1.5rem"}}>has completed {branch.trainingName}</p>
        <div style={{background:`${col}25`,borderRadius:"12px",padding:"1rem",marginBottom:"1.25rem",border:`1px solid ${acc}50`,animation:"shimmer 2s ease-in-out infinite"}}>
          <p style={{color:acc,fontStyle:"italic",fontFamily:"Georgia,serif",margin:0,fontSize:"0.95rem"}}>"{branch.motto}"</p>
        </div>
        <p style={{color:"#a0b0c0",fontFamily:"Georgia,serif",fontSize:"0.85rem",lineHeight:"1.65",marginBottom:"1.5rem"}}>
          Your strength, love, and patience carried them through every hard day. This victory belongs to all of you.
        </p>
        <button onClick={onDismiss} style={{padding:"0.9rem 2rem",borderRadius:"10px",background:col,border:`2px solid ${acc}`,color:"#fff",fontSize:"1rem",fontWeight:"700",cursor:"pointer",fontFamily:"Georgia,serif",width:"100%"}}>
          View Their Journey  
        </button>
      </div>
    </div>
  );
}

// -- Notification Panel --------------------------------------------------------
function NotificationPanel({ branch, profile, onClose }) {
  const [perm, setPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");
  const [schedule, setSchedule] = useState(() => {
    try { return JSON.parse(localStorage.getItem("btc_notif") || "{}"); } catch { return {}; }
  });
  const [saved, setSaved] = useState(false);
  const col = branch.color, acc = branch.accent;

  const requestPerm = async () => {
    if (typeof Notification === "undefined") return;
    const r = await Notification.requestPermission();
    setPerm(r);
    if (r === "granted") new Notification("Basic Training Companion", { body: `Daily support for ${profile.recruiterName}'s journey is now active.` });
  };

  const toggle = k => setSchedule(s => ({ ...s, [k]: !s[k] }));
  const save = () => { localStorage.setItem("btc_notif", JSON.stringify(schedule)); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const cs = { background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"1rem", marginBottom:"0.65rem", border:"1px solid rgba(255,255,255,0.08)" };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:900,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{background:branch.colors.dark,borderRadius:"20px 20px 0 0",padding:"1.5rem 1.25rem",width:"100%",maxWidth:"580px",maxHeight:"85vh",overflowY:"auto",border:`1px solid ${acc}25`,borderBottom:"none",fontFamily:"Georgia,serif"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
          <h2 style={{color:acc,fontSize:"1.1rem",margin:0}}>Notification Settings</h2>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#6a7d90",fontSize:"1.6rem",cursor:"pointer",lineHeight:1}}>x</button>
        </div>
        <div style={{...cs, background:perm==="granted"?`${col}20`:"rgba(255,80,80,0.1)", borderColor:perm==="granted"?`${col}50`:"rgba(255,80,80,0.3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{color:perm==="granted"?acc:"#ff8080",fontSize:"0.85rem",fontWeight:"700",margin:"0 0 0.2rem"}}>{perm==="granted"?"Notifications Enabled":perm==="denied"?"Notifications Blocked":"Notifications Not Yet Enabled"}</p>
              <p style={{color:"#8a9bb0",fontSize:"0.78rem",margin:0}}>{perm==="granted"?"Daily support messages active":perm==="denied"?"Enable in your browser settings to proceed":"Tap Enable to receive daily quotes and reminders"}</p>
            </div>
            {perm!=="granted"&&perm!=="denied"&&<button onClick={requestPerm} style={{padding:"0.45rem 0.9rem",borderRadius:"8px",background:col,border:`1px solid ${acc}`,color:"#fff",cursor:"pointer",fontSize:"0.78rem",whiteSpace:"nowrap"}}>Enable</button>}
          </div>
        </div>
        <div style={{...cs,background:`${col}10`,borderColor:`${col}30`}}>
          <p style={{color:acc,fontSize:"0.72rem",fontWeight:"700",margin:"0 0 0.4rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>Mobile Push (OneSignal)</p>
          <p style={{color:"#7a8d9e",fontSize:"0.8rem",lineHeight:"1.5",margin:0}}>Full mobile push requires OneSignal when hosted. Add your App ID to enable push notifications on iOS/Android even when the app is closed.</p>
        </div>
        <p style={{color:"#6a7d90",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0.75rem 0 0.6rem"}}>Notification preferences</p>
        {[
          {k:"dailyQuote",label:"Daily Motivational Quote",desc:"New quote every morning at 8am",icon:" "},
          {k:"weeklyPreview",label:"Weekly Training Preview",desc:"What your recruit is doing this week",icon:" "},
          {k:"letterReminder",label:"Letter Reminder",desc:"Every Tuesday - reminder to send a letter",icon:"  "},
          {k:"gradCountdown",label:"Graduation Milestones",desc:"Alerts at 30, 14, 7, and 1 day before graduation",icon:" "},
        ].map(item => (
          <div key={item.k} style={{...cs,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:"0.7rem",alignItems:"flex-start",flex:1}}>
              <span style={{fontSize:"1.1rem"}}>{item.icon}</span>
              <div><p style={{margin:"0 0 0.15rem",color:"#d0dce8",fontSize:"0.88rem"}}>{item.label}</p><p style={{margin:0,color:"#6a7d90",fontSize:"0.76rem"}}>{item.desc}</p></div>
            </div>
            <button onClick={() => toggle(item.k)} style={{width:"42px",height:"22px",borderRadius:"11px",background:schedule[item.k]?col:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
              <div style={{width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:schedule[item.k]?"23px":"3px",transition:"left 0.2s"}}/>
            </button>
          </div>
        ))}
        <button onClick={save} style={{width:"100%",padding:"0.85rem",borderRadius:"10px",background:col,border:`2px solid ${acc}`,color:"#fff",fontSize:"0.95rem",fontWeight:"700",cursor:"pointer",marginTop:"0.5rem"}}>
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}

// -- Paywall -------------------------------------------------------------------
function PaywallScreen({ branch, onUnlock }) {
  const [plan, setPlan] = useState("lifetime");
  const [loading, setLoading] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoOk, setPromoOk] = useState(false);
  const col = branch.color, acc = branch.accent;

  const PLANS = [
    { id:"lifetime", label:"Lifetime Access", price: promoOk?"$9.99":"$14.99", period:"one-time purchase", badge:"BEST VALUE",
      features:["Unlimited journal entries","Photo uploads","All 5 letter templates","Daily quotes & reminders","Full training timeline","Graduation celebration","Notification scheduling","Lifetime access - no subscription"] },
    { id:"monthly", label:"Monthly", price: promoOk?"$2.99":"$4.99", period:"per month",
      features:["Full app access during training","Journal + photo uploads","Letter templates","Daily quotes","Cancel anytime"] },
  ];

  // -- Real Stripe Payment Links ----------------------------------------------
  const STRIPE_LINKS = {
    lifetime: "https://buy.stripe.com/14A7sDayF6h31o4gBrbII00",
    monthly:  "https://buy.stripe.com/bJeeV5ayF20NeaQclbbII01",
  };

  const checkout = () => {
    setLoading(true);
    // Save the chosen plan so we know which one they paid for when they return
    localStorage.setItem("btc_pending_plan", plan);
    // Send the customer to their chosen Stripe Payment Link
    window.location.href = STRIPE_LINKS[plan];
  };

  const applyPromo = () => {
    if (["MILITARY10","FAMILY10","BOOTS2024"].includes(promo.toUpperCase())) setPromoOk(true);
    else alert("Invalid promo code. Try MILITARY10 for a discount.");
  };

  const selectedPlan = PLANS.find(p => p.id === plan);

  return (
    <div style={{minHeight:"100vh",background:branch.colors.dark,fontFamily:"Georgia,serif",padding:"1.5rem",display:"flex",flexDirection:"column",alignItems:"center",overflowY:"auto"}}>
      <style>{`@keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${acc}44}50%{box-shadow:0 0 0 12px ${acc}00}}`}</style>
      <div style={{maxWidth:"460px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}> </div>
          <h1 style={{color:"#fff",fontSize:"1.6rem",margin:"0 0 0.4rem"}}>Unlock Full Access</h1>
          <p style={{color:"#8a9bb0",margin:0,fontSize:"0.9rem"}}>Support {branch.name} families through every step of the journey</p>
          <div style={{width:"50px",height:"2px",background:acc,margin:"1rem auto 0"}}/>
        </div>

        {/* Feature preview */}
        <div style={{background:`${col}20`,borderRadius:"14px",padding:"1rem 1.1rem",marginBottom:"1.5rem",border:`1px solid ${col}40`}}>
          <p style={{color:acc,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 0.65rem"}}>Everything included</p>
          {["  Smart countdown tied to your recruit's exact dates","  Branch-specific glossary, acronyms & rank charts","  Memory journal with photo uploads","   5 personalizable letter templates","  Daily motivational quotes & reminders","  Graduation celebration animation","  Notification scheduling (OneSignal-ready)"].map((f,i) => (
            <p key={i} style={{color:"#c0ccd8",fontSize:"0.85rem",margin:"0 0 0.35rem"}}>{f}</p>
          ))}
        </div>

        {/* Plan cards */}
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1.1rem"}}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setPlan(p.id)}
              style={{background:plan===p.id?`${col}30`:"rgba(255,255,255,0.04)",border:`2px solid ${plan===p.id?acc:"rgba(255,255,255,0.1)"}`,borderRadius:"14px",padding:"1rem 1.15rem",cursor:"pointer",position:"relative",transition:"all 0.2s",animation:plan===p.id&&p.id==="lifetime"?"pulse2 2s ease-in-out infinite":"none"}}>
              {p.badge && <div style={{position:"absolute",top:"-10px",right:"12px",background:acc,color:"#000",fontSize:"0.62rem",fontWeight:"700",padding:"2px 10px",borderRadius:"20px",letterSpacing:"0.08em"}}>{p.badge}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <p style={{margin:"0 0 0.3rem",color:"#fff",fontWeight:"700",fontSize:"0.95rem"}}>{p.label}</p>
                  {p.features.slice(0,3).map((f,i) => <p key={i} style={{margin:"0 0 0.12rem",color:"#8a9bb0",fontSize:"0.77rem"}}>. {f}</p>)}
                  {p.features.length > 3 && <p style={{margin:"0.1rem 0 0",color:"#5a6d80",fontSize:"0.73rem"}}>+{p.features.length-3} more</p>}
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginLeft:"1rem"}}>
                  <p style={{margin:0,color:acc,fontWeight:"700",fontSize:"1.3rem"}}>{p.price}</p>
                  <p style={{margin:0,color:"#6a7d90",fontSize:"0.72rem"}}>{p.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.1rem"}}>
          <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code (e.g. MILITARY10)"
            style={{flex:1,padding:"0.62rem 0.85rem",borderRadius:"8px",border:`1px solid ${promoOk?acc:"rgba(255,255,255,0.15)"}`,background:"rgba(255,255,255,0.07)",color:"#fff",fontSize:"0.82rem",outline:"none",fontFamily:"Georgia,serif"}}/>
          <button onClick={applyPromo} style={{padding:"0.62rem 1rem",borderRadius:"8px",background:promoOk?`${acc}30`:"rgba(255,255,255,0.08)",border:`1px solid ${promoOk?acc:"rgba(255,255,255,0.2)"}`,color:promoOk?acc:"#8a9bb0",cursor:"pointer",fontSize:"0.82rem",whiteSpace:"nowrap"}}>
            {promoOk ? "Applied!" : "Apply"}
          </button>
        </div>

        {/* CTA */}
        <button onClick={checkout} disabled={loading}
          style={{width:"100%",padding:"1rem",borderRadius:"12px",background:loading?`${col}70`:`linear-gradient(135deg,${col},${col}bb)`,border:`2px solid ${acc}`,color:"#fff",fontSize:"1rem",fontWeight:"700",cursor:loading?"wait":"pointer",fontFamily:"Georgia,serif",letterSpacing:"0.03em"}}>
          {loading ? "Processing..." : `Unlock Now - ${selectedPlan?.price}`}
        </button>

        <div style={{display:"flex",justifyContent:"center",gap:"1.25rem",marginTop:"0.85rem",flexWrap:"wrap"}}>
          {["Lock Secure checkout","Card Stripe payments","Return 7-day refund"].map((t,i) => (
            <span key={i} style={{color:"#4a5d70",fontSize:"0.75rem"}}>{t}</span>
          ))}
        </div>

        {/* Dev integration note */}
        <div style={{marginTop:"1.5rem",background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"0.85rem 1rem",border:"1px solid rgba(255,255,255,0.07)"}}>
          <p style={{color:"#5a6d80",fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 0.4rem"}}>Developer Integration Note</p>
          <p style={{color:"#4a5d70",fontSize:"0.76rem",lineHeight:"1.5",margin:0}}>
            Replace the <code style={{color:acc}}>checkout()</code> function with your Stripe backend. Create a checkout session via <code style={{color:acc}}>POST /api/create-checkout-session</code>, redirect to <code style={{color:acc}}>session.url</code>, and handle the <code style={{color:acc}}>checkout.session.completed</code> webhook to grant permanent access.
          </p>
        </div>
        <p style={{color:"#2a3d50",fontSize:"0.72rem",textAlign:"center",marginTop:"0.75rem",lineHeight:"1.5"}}>By purchasing you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
}

// -- Letter Templates ----------------------------------------------------------
function LetterTemplates({ branch, profile }) {
  const [sel, setSel] = useState(null);
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const col = branch.color, acc = branch.accent;
  const cs = { background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"0.9rem 1rem", marginBottom:"0.6rem", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" };

  const open = t => {
    const filled = t.body.replace(/\[Recruit Name\]/g, profile.recruiterName).replace(/\[Your Name\]/g, profile.familyName);
    setBody(filled); setSel(t);
  };
  const copy = () => { navigator.clipboard.writeText(body).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const download = () => { const a = document.createElement("a"); a.href = "data:text/plain;charset=utf-8,"+encodeURIComponent(body); a.download = `Letter_${profile.recruiterName}.txt`; a.click(); };

  if (sel) return (
    <div style={{fontFamily:"Georgia,serif"}}>
      <button onClick={() => setSel(null)} style={{background:"transparent",border:"none",color:acc,cursor:"pointer",fontSize:"0.85rem",padding:0,marginBottom:"0.85rem"}}>Back to Templates</button>
      <h3 style={{color:"#fff",margin:"0 0 0.2rem"}}>{sel.title}</h3>
      <p style={{color:"#6a7d90",fontSize:"0.78rem",marginBottom:"0.85rem"}}>Pre-filled for {profile.recruiterName} and {profile.familyName} -- edit freely below</p>
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={17}
        style={{width:"100%",padding:"1rem",borderRadius:"10px",border:`1px solid ${col}50`,background:"rgba(255,255,255,0.06)",color:"#d0dce8",fontSize:"0.88rem",lineHeight:"1.65",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:"0.65rem",marginTop:"0.65rem"}}>
        <button onClick={copy} style={{flex:1,padding:"0.7rem",borderRadius:"8px",background:copied?`${acc}30`:col,border:`1px solid ${acc}`,color:"#fff",cursor:"pointer",fontSize:"0.88rem"}}>
          {copied ? "Copied!" : "Copy Letter"}
        </button>
        <button onClick={download} style={{padding:"0.7rem 1rem",borderRadius:"8px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#d0dce8",cursor:"pointer",fontSize:"0.88rem"}}>
          Save .txt
        </button>
      </div>
    </div>
  );

  const cats = [...new Set(LETTER_TEMPLATES.map(t => t.category))];
  return (
    <div style={{fontFamily:"Georgia,serif"}}>
      <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>Letter Templates</h2>
      <p style={{color:"#6a7d90",fontSize:"0.85rem",marginBottom:"1.25rem"}}>Pre-written and personalized for {profile.recruiterName}</p>
      {cats.map(cat => (
        <div key={cat}>
          <p style={{color:"#6a7d90",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.45rem"}}>{cat}</p>
          {LETTER_TEMPLATES.filter(t => t.category===cat).map(t => (
            <div key={t.id} onClick={() => open(t)} style={cs}
              onMouseEnter={e => e.currentTarget.style.borderColor=acc}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{margin:"0 0 0.2rem",color:"#d0dce8",fontWeight:"700",fontSize:"0.9rem"}}>{t.title}</p>
                  <p style={{margin:0,color:"#6a7d90",fontSize:"0.78rem"}}>{t.body.replace(/\n/g," ").substring(0,75)}...</p>
                </div>
                <span style={{color:acc,marginLeft:"0.75rem",fontSize:"1.1rem"}}>to</span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{background:`${col}12`,borderRadius:"10px",padding:"0.9rem",border:`1px solid ${col}30`,marginTop:"0.5rem"}}>
        <p style={{color:acc,fontSize:"0.78rem",fontWeight:"700",margin:"0 0 0.5rem"}}>Letter Writing Tips</p>
        {["Write at least once a week -- it truly means the world","Keep letters positive and uplifting","Include photos, drawings, or clippings from home","Number letters so they can be read in order","Address them by full name and unit on the envelope"].map((t,i) => (
          <p key={i} style={{color:"#8a9bb0",fontSize:"0.81rem",margin:"0 0 0.25rem"}}>. {t}</p>
        ))}
      </div>
    </div>
  );
}

// -- Branch Selector -----------------------------------------------------------
function BranchSelector({ onSelect }) {
  return (
    <div style={{minHeight:"100vh",background:"#0a0f1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"Georgia,serif"}}>
      <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>⭐</div>
        <h1 style={{color:"#fff",fontSize:"clamp(1.7rem,4vw,2.7rem)",fontWeight:"700",letterSpacing:"0.05em",margin:0}}>Basic Training Companion</h1>
        <p style={{color:"#8a9bb0",fontSize:"0.95rem",marginTop:"0.6rem",fontStyle:"italic"}}>For the families who wait, worry, and beam with pride</p>
        <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#c8a84b,#4a90d9)",margin:"1.25rem auto 0"}}/>
      </div>
      <p style={{color:"#6a7d90",marginBottom:"1.25rem",fontSize:"0.9rem",textAlign:"center"}}>Select your loved one's branch to begin</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1rem",maxWidth:"520px",width:"100%"}}>
        {branches.map(( branch, index ) => (
          <BranchButton key={index} branchIndex={index} branch={branch} onSelect={onSelect}/>
        ))}
      </div>
    </div>
  );
}

// -- Setup Screen --------------------------------------------------------------
function SetupScreen({ branch, onComplete }) {
  const [form, setForm] = useState({recruiterName:"",familyName:"",startDate:"",endDate:""});
  const [err, setErr] = useState("");
  const s = (k,v) => setForm(f => ({...f,[k]:v}));
  const inp = {width:"100%",padding:"0.82rem 1rem",borderRadius:"8px",border:`1px solid ${branch.color}40`,background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:"0.95rem",outline:"none",boxSizing:"border-box",fontFamily:"Georgia,serif"};
  const lbl = {color:branch.colors.accent,fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.35rem",display:"block"};
  const submit = () => {
    if (!form.recruiterName||!form.familyName||!form.startDate||!form.endDate) { setErr("Please fill in all fields."); return; }
    if (new Date(form.endDate)<=new Date(form.startDate)) { setErr("End date must be after start date."); return; }
    onComplete(form);
  };
  return (
    <div style={{minHeight:"100vh",background:branch.colors.dark,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:"440px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
          <h2 style={{color:"#fff",fontSize:"1.7rem",margin:0}}>{branch.fullName}</h2>
          <p style={{color:branch.colors.accent,fontStyle:"italic",margin:"0.4rem 0"}}>{branch.motto}</p>
          <div style={{width:"45px",height:"2px",background:branch.colors.accent,margin:"0.85rem auto"}}/>
          <p style={{color:"#8a9bb0",margin:0,fontSize:"0.9rem"}}>Let's personalize your companion</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div><label style={lbl}>Recruit's Name</label><input style={inp} placeholder="e.g. James Rivera" value={form.recruiterName} onChange={e => s("recruiterName",e.target.value)}/></div>
          <div><label style={lbl}>Your Name (Family Member)</label><input style={inp} placeholder="e.g. Maria Rivera" value={form.familyName} onChange={e => s("familyName",e.target.value)}/></div>
          <div><label style={lbl}>Training Start Date</label><input type="date" style={inp} value={form.startDate} onChange={e => s("startDate",e.target.value)}/></div>
          <div><label style={lbl}>Anticipated Graduation Date</label><input type="date" style={inp} value={form.endDate} onChange={e => s("endDate",e.target.value)}/></div>
          {err && <p style={{color:"#ff6b6b",fontSize:"0.88rem",textAlign:"center",margin:0}}>{err}</p>}
          <button onClick={submit} style={{padding:"0.95rem",borderRadius:"10px",background:branch.colors.color,border:`2px solid ${branch.accent}`,color:"#fff",fontSize:"1rem",fontWeight:"700",cursor:"pointer",fontFamily:"Georgia,serif",marginTop:"0.25rem"}}>Continue to App</button>
          <button onClick={() => onComplete(null)} style={{background:"transparent",border:"none",color:"#6a7d90",cursor:"pointer",fontSize:"0.88rem",fontFamily:"Georgia,serif"}}>Choose different branch</button>
        </div>
      </div>
    </div>
  );
}

// -- Countdown Ring ------------------------------------------------------------
function Ring({ days, total, accent }) {
  const r=70, c=2*Math.PI*r, p=Math.max(0,Math.min(1,1-Math.max(0,days)/Math.max(1,total)));
  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      <circle cx="85" cy="85" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10"/>
      <circle cx="85" cy="85" r={r} fill="none" stroke={accent} strokeWidth="10"
        strokeDasharray={c} strokeDashoffset={c*(1-p)} strokeLinecap="round"
        transform="rotate(-90 85 85)" style={{transition:"stroke-dashoffset 1.2s ease"}}/>
      <text x="85" y="78" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700" fontFamily="Georgia,serif">{Math.max(0,days)}</text>
      <text x="85" y="100" textAnchor="middle" fill={accent} fontSize="11" fontFamily="Georgia,serif">DAYS TO GO</text>
    </svg>
  );
}

// -- Dashboard -----------------------------------------------------------------
function Dashboard({ branchKey, branch, profile, onReset }) {
  const [tab, setTab] = useState("home");
  const [memories, setMemories] = useState([]);
  const [newMem, setNewMem] = useState({type:"feeling",text:"",photoPreview:null,photoName:null});
  const [reminders, setReminders] = useState([
    {id:1,text:"Send your first letter this week!",done:false},
    {id:2,text:"Write down your feelings today",done:false},
    {id:3,text:"Connect with another military family",done:false},
    {id:4,text:"Prepare graduation weekend travel plans",done:false},
  ]);
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);
  const [celebDone, setCelebDone] = useState(false);
  const [newRemText, setNewRemText] = useState("");
  const fileRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
      if (d.memories) setMemories(d.memories);
      if (d.reminders) setReminders(d.reminders);
      if (d.celebDone) setCelebDone(true);
    } catch(e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
      localStorage.setItem(LS_KEY, JSON.stringify({...existing, memories, reminders, celebDone}));
    } catch(e) {}
  }, [memories, reminders, celebDone]);

  const col=branch.color, acc=branch.accent;
  const daysStart = getDaysUntil(profile.startDate);
  const daysEnd = getDaysUntil(profile.endDate);
  const totalDays = getDaysBetween(profile.startDate, profile.endDate);
  const started = daysStart <= 0;
  const complete = daysEnd < 0;
  const curWeek = started && !complete ? getCurrentWeek(profile.startDate) : 1;
  const thisWeek = branch.weeklyEvents.find(w => w.week===curWeek);
  const nextWeek = branch.weeklyEvents.find(w => w.week===curWeek+1);
  const quote = getTodayQuote();

  useEffect(() => {
    if (complete && !celebDone) setShowCeleb(true);
  }, [complete, celebDone]);

  const uploadPhoto = e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onloadend = () => setNewMem(m => ({...m, photoPreview:rd.result, photoName:f.name}));
    rd.readAsDataURL(f);
  };

  const addMemory = () => {
    if (!newMem.text.trim() && !newMem.photoPreview) return;
    setMemories(m => [...m, {...newMem, id:Date.now(), date:new Date().toLocaleDateString()}]);
    setNewMem({type:"feeling",text:"",photoPreview:null,photoName:null});
  };

  const cs = {background:"rgba(255,255,255,0.05)",borderRadius:"13px",padding:"1rem 1.15rem",marginBottom:"0.85rem",border:"1px solid rgba(255,255,255,0.08)"};
  const TABS = [
    {id:"home",icon:"Home",label:"Home"},{id:"timeline",icon:"Cal",label:"Timeline"},
    {id:"glossary",icon:"Book",label:"Glossary"},{id:"ranks",icon:"Star",label:"Ranks"},
    {id:"memories",icon:"Note",label:"Journal"},{id:"letters",icon:"Mail",label:"Letters"},
    {id:"reminders",icon:"Bell",label:"Reminders"},
  ];
  const filtAcr = branch.acronyms.filter(a => a.abbr.toLowerCase().includes(search.toLowerCase())||a.meaning.toLowerCase().includes(search.toLowerCase()));
  const filtTrm = branch.keyTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase())||t.def.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{minHeight:"100vh",background:branch.colors.dark,fontFamily:"Georgia,serif",color:"#fff",paddingBottom:"5rem"}}>
      {showCeleb && !celebDone && (
        <GraduationCelebration profile={profile} branch={branch} onDismiss={() => {setShowCeleb(false); setCelebDone(true);}}/>
      )}
      {notifOpen && <NotificationPanel branch={branch} profile={profile} onClose={() => setNotifOpen(false)}/>}

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${col},${branch.dark})`,padding:"1.3rem 1.15rem 0.85rem",borderBottom:`1px solid ${acc}22`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{margin:0,color:acc,fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase"}}>{branch.name} . {branch.trainingName}</p>
            <h1 style={{margin:"0.2rem 0 0",fontSize:"1.3rem",fontWeight:"700"}}>{profile.recruiterName}'s Journey</h1>
            <p style={{margin:"0.12rem 0 0",color:"#8a9bb0",fontSize:"0.8rem"}}>Followed by {profile.familyName}</p>
          </div>
          <div style={{display:"flex",gap:"0.45rem"}}>
            <button onClick={() => setNotifOpen(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",color:"#fff",padding:"0.38rem 0.6rem",cursor:"pointer",fontSize:"0.82rem"}}>🔔</button>
            <button onClick={onReset} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.18)",borderRadius:"6px",color:"#8a9bb0",padding:"0.38rem 0.6rem",cursor:"pointer",fontSize:"0.7rem",fontFamily:"Georgia,serif"}}>Switch</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.28)",padding:"0 0.2rem"}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{background:"transparent",border:"none",borderBottom:tab===t.id?`2px solid ${acc}`:"2px solid transparent",color:tab===t.id?"#fff":"#6a7d90",padding:"0.6rem 0.75rem",cursor:"pointer",fontSize:"0.72rem",whiteSpace:"nowrap",fontFamily:"Georgia,serif",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px",transition:"color 0.2s",flexShrink:0}}>
            <span style={{fontSize:"0.9rem"}}>{t.icon==="Home"?"🏠":t.icon==="Cal"?"📅":t.icon==="Book"?"📖":t.icon==="Star"?"🎖":t.icon==="Note"?"📝":t.icon==="Mail"?"✉️":"🔔"}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{padding:"1rem 1.05rem",maxWidth:"680px",margin:"0 auto"}}>

        {/* HOME */}
        {tab==="home" && (
          <div>
            <div style={{...cs,background:`linear-gradient(135deg,${col}40,rgba(0,0,0,0.3))`,border:`1px solid ${acc}40`,textAlign:"center"}}>
              {complete ? (
                <div>
                  <div style={{fontSize:"2.5rem"}}>🎓</div>
                  <h2 style={{color:acc,margin:"0.4rem 0"}}>Training Complete!</h2>
                  <p style={{color:"#8a9bb0",margin:"0 0 0.75rem"}}>Congratulations to {profile.recruiterName}!</p>
                  <button onClick={() => {setCelebDone(false); setShowCeleb(true);}} style={{padding:"0.45rem 1.15rem",borderRadius:"20px",background:`${acc}25`,border:`1px solid ${acc}`,color:acc,cursor:"pointer",fontSize:"0.82rem",fontFamily:"Georgia,serif"}}>Replay Celebration</button>
                </div>
              ) : started ? (
                <div>
                  <p style={{color:acc,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 0.2rem"}}>Currently Training . Week {curWeek}</p>
                  <Ring days={daysEnd} total={totalDays} accent={acc}/>
                  <p style={{color:"#8a9bb0",fontSize:"0.82rem",margin:"0.2rem 0 0"}}>Graduation: {fmtDate(profile.endDate)}</p>
                </div>
              ) : (
                <div>
                  <p style={{color:acc,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 0.2rem"}}>Countdown to Training</p>
                  <Ring days={daysStart} total={daysStart+1} accent={acc}/>
                  <p style={{color:"#8a9bb0",fontSize:"0.82rem",margin:"0.2rem 0 0"}}>Training begins {fmtDate(profile.startDate)}</p>
                </div>
              )}
            </div>
            <div style={{...cs,borderLeft:`3px solid ${acc}`}}>
              <p style={{color:acc,fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.45rem"}}>Today's Inspiration</p>
              <p style={{color:"#d0dce8",fontStyle:"italic",fontSize:"0.95rem",lineHeight:"1.6",margin:"0 0 0.35rem"}}>"{quote.quote}"</p>
              <p style={{color:"#6a7d90",fontSize:"0.8rem",margin:0}}>-- {quote.author}</p>
            </div>
            {started && !complete && thisWeek && (
              <div style={cs}>
                <p style={{color:acc,fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.55rem"}}>This Week -- {thisWeek.title}</p>
                {thisWeek.events.map((ev,i) => <div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.35rem"}}><span style={{color:acc,fontSize:"0.75rem",marginTop:"2px"}}>▸</span><span style={{color:"#c0ccd8",fontSize:"0.86rem"}}>{ev}</span></div>)}
              </div>
            )}
            {started && !complete && nextWeek && (
              <div style={{...cs,background:"rgba(255,255,255,0.03)"}}>
                <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.55rem"}}>Coming Up -- Week {nextWeek.week}: {nextWeek.title}</p>
                {nextWeek.events.slice(0,3).map((ev,i) => <div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.3rem"}}><span style={{color:"#6a7d90",fontSize:"0.75rem",marginTop:"2px"}}>◦</span><span style={{color:"#8a9bb0",fontSize:"0.83rem"}}>{ev}</span></div>)}
              </div>
            )}
            <p style={{textAlign:"center",color:`${acc}55`,fontStyle:"italic",fontSize:"0.82rem",letterSpacing:"0.04em",padding:"0.4rem 0"}}>{branch.motto}</p>
          </div>
        )}

        {/* TIMELINE */}
        {tab==="timeline" && (
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"1rem"}}>Training Timeline</h2>
            {branch.weeklyEvents.map((wk,i) => {
              const cur = started && wk.week===curWeek;
              const past = started && wk.week<curWeek;
              return (
                <div key={i} style={{display:"flex",gap:"0.8rem",marginBottom:"0.75rem"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{width:"32px",height:"32px",borderRadius:"50%",background:cur?acc:past?col:"rgba(255,255,255,0.08)",border:`2px solid ${cur?acc:past?col:"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"700",color:cur?"#000":"#fff",flexShrink:0}}>{wk.week}</div>
                    {i<branch.weeklyEvents.length-1 && <div style={{width:"2px",flex:1,background:past?`${col}45`:"rgba(255,255,255,0.07)",minHeight:"14px"}}/>}
                  </div>
                  <div style={{...cs,flex:1,padding:"0.8rem 0.95rem",marginBottom:0,borderColor:cur?`${acc}45`:"rgba(255,255,255,0.07)",background:cur?`${col}18`:"rgba(255,255,255,0.03)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.35rem"}}>
                      <p style={{margin:0,fontWeight:"700",color:cur?acc:past?"#4a5d70":"#d0dce8",fontSize:"0.87rem"}}>{wk.title}</p>
                      {cur && <span style={{background:acc,color:"#000",fontSize:"0.6rem",padding:"2px 7px",borderRadius:"20px",fontWeight:"700"}}>NOW</span>}
                    </div>
                    {wk.events.map((ev,j) => <div key={j} style={{color:past?"#3a4d60":"#8a9bb0",fontSize:"0.8rem",marginBottom:"0.18rem"}}>{past?"✓":". "} {ev}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GLOSSARY */}
        {tab==="glossary" && (
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.85rem"}}>Glossary and Acronyms</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms or acronyms..."
              style={{width:"100%",padding:"0.68rem 0.95rem",borderRadius:"8px",border:`1px solid ${col}45`,background:"rgba(255,255,255,0.07)",color:"#fff",fontSize:"0.88rem",outline:"none",boxSizing:"border-box",marginBottom:"1rem",fontFamily:"Georgia,serif"}}/>
            {filtAcr.length>0 && <div style={{marginBottom:"1.1rem"}}>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Acronyms</p>
              {filtAcr.map((a,i) => <div key={i} style={{...cs,padding:"0.65rem 0.95rem",display:"flex",gap:"0.85rem",marginBottom:"0.4rem"}}><span style={{color:acc,fontWeight:"700",fontSize:"0.88rem",minWidth:"52px"}}>{a.abbr}</span><span style={{color:"#c0ccd8",fontSize:"0.85rem"}}>{a.meaning}</span></div>)}
            </div>}
            {filtTrm.length>0 && <div>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Key Terms</p>
              {filtTrm.map((t,i) => <div key={i} style={{...cs,marginBottom:"0.6rem"}}><p style={{margin:"0 0 0.25rem",color:acc,fontWeight:"700",fontSize:"0.88rem"}}>{t.term}</p><p style={{margin:0,color:"#a0b0c0",fontSize:"0.83rem",lineHeight:"1.5"}}>{t.def}</p></div>)}
            </div>}
            {filtAcr.length===0&&filtTrm.length===0 && <p style={{color:"#6a7d90",textAlign:"center",fontStyle:"italic"}}>No results found.</p>}
          </div>
        )}

        {/* RANKS */}
        {tab==="ranks" && (
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"1rem"}}>{branch.name} Enlisted Rank Structure</h2>
            {branch.ranks.map((r,i) => (
              <div key={i} style={{...cs,display:"flex",alignItems:"center",gap:"0.85rem",padding:"0.75rem 0.95rem",marginBottom:"0.4rem"}}>
                <div style={{width:"42px",height:"42px",borderRadius:"8px",background:`${col}38`,border:`1px solid ${col}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:acc,fontSize:"0.65rem",fontWeight:"700"}}>{r.grade}</span>
                </div>
                <div><p style={{margin:"0 0 0.12rem",fontWeight:"700",color:"#d0dce8",fontSize:"0.88rem"}}>{r.abbr}</p><p style={{margin:0,color:"#8a9bb0",fontSize:"0.8rem"}}>{r.name}</p></div>
              </div>
            ))}
          </div>
        )}

        {/* JOURNAL / MEMORIES */}
        {tab==="memories" && (
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.7rem"}}>Memory Journal</h2>
            <div style={cs}>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.6rem"}}>Capture a moment</p>
              <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.6rem",flexWrap:"wrap"}}>
                {[{id:"feeling",label:"Feeling"},{id:"call",label:"Call"},{id:"photo",label:"Moment"}].map(t => (
                  <button key={t.id} onClick={() => setNewMem(m => ({...m,type:t.id}))}
                    style={{padding:"0.32rem 0.65rem",borderRadius:"20px",border:`1px solid ${newMem.type===t.id?acc:"rgba(255,255,255,0.14)"}`,background:newMem.type===t.id?`${acc}28`:"transparent",color:newMem.type===t.id?acc:"#6a7d90",cursor:"pointer",fontSize:"0.76rem",fontFamily:"Georgia,serif"}}>
                    {t.id==="feeling"?"💭":t.id==="call"?"📞":"📸"} {t.label}
                  </button>
                ))}
              </div>
              <textarea value={newMem.text} onChange={e => setNewMem(m => ({...m,text:e.target.value}))}
                placeholder={newMem.type==="feeling"?"Write about your feelings today...":newMem.type==="call"?"Write about your phone call...":"Describe this special moment..."}
                rows={3} style={{width:"100%",padding:"0.68rem",borderRadius:"8px",border:`1px solid ${col}38`,background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:"0.86rem",resize:"vertical",outline:"none",boxSizing:"border-box",fontFamily:"Georgia,serif"}}/>
              {/* Photo upload */}
              <input type="file" accept="image/*" ref={fileRef} onChange={uploadPhoto} style={{display:"none"}}/>
              <button onClick={() => fileRef.current.click()}
                style={{marginTop:"0.55rem",width:"100%",padding:"0.48rem",borderRadius:"8px",border:`1px dashed ${col}70`,background:"transparent",color:"#8a9bb0",cursor:"pointer",fontSize:"0.8rem",fontFamily:"Georgia,serif"}}>
                {newMem.photoName ? `Photo attached: ${newMem.photoName}` : "Attach a photo (optional)"}
              </button>
              {newMem.photoPreview && (
                <div style={{marginTop:"0.5rem",position:"relative"}}>
                  <img src={newMem.photoPreview} alt="preview" style={{width:"100%",maxHeight:"170px",objectFit:"cover",borderRadius:"8px",border:`1px solid ${col}45`}}/>
                  <button onClick={() => setNewMem(m => ({...m,photoPreview:null,photoName:null}))}
                    style={{position:"absolute",top:"6px",right:"6px",background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",borderRadius:"50%",width:"22px",height:"22px",cursor:"pointer",fontSize:"0.75rem"}}>x</button>
                </div>
              )}
              <button onClick={addMemory} style={{marginTop:"0.62rem",padding:"0.58rem 1.15rem",borderRadius:"8px",background:col,border:`1px solid ${acc}`,color:"#fff",cursor:"pointer",fontSize:"0.86rem",fontFamily:"Georgia,serif"}}>Save to Journal</button>
            </div>
            {memories.length===0
              ? <p style={{color:"#5a6d80",textAlign:"center",fontStyle:"italic",marginTop:"1.1rem"}}>Your journal is empty. Start capturing this journey.</p>
              : <>
                  <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.55rem"}}>{memories.length} entr{memories.length!==1?"ies":"y"}</p>
                  {[...memories].reverse().map(entry => (
                    <div key={entry.id} style={{background:"rgba(255,255,255,0.05)",borderRadius:"10px",padding:"0.85rem 0.95rem",marginBottom:"0.6rem",borderLeft:`3px solid ${acc}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:"0.45rem",alignItems:"center",marginBottom:"0.3rem"}}>
                            <span>{entry.type==="feeling"?"💭":entry.type==="call"?"📞":"📸"}</span>
                            <span style={{color:acc,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.07em"}}>{entry.type} . {entry.date}</span>
                          </div>
                          {entry.text && <p style={{color:"#d0dce8",margin:"0 0 0.45rem",fontSize:"0.86rem",lineHeight:"1.5"}}>{entry.text}</p>}
                          {entry.photoPreview && <img src={entry.photoPreview} alt="memory" style={{width:"100%",maxHeight:"190px",objectFit:"cover",borderRadius:"7px"}}/>}
                        </div>
                        <button onClick={() => setMemories(m => m.filter(e => e.id!==entry.id))} style={{background:"transparent",border:"none",color:"#ff6b6b33",cursor:"pointer",fontSize:"1.1rem",padding:"0 0 0 0.4rem"}}>x</button>
                      </div>
                    </div>
                  ))}
                </>
            }
          </div>
        )}

        {/* LETTERS */}
        {tab==="letters" && <LetterTemplates branch={branch} profile={profile}/>}

        {/* REMINDERS */}
        {tab==="reminders" && (
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.9rem"}}>Family Reminders</h2>
            <div style={{...cs,display:"flex",gap:"0.5rem",padding:"0.7rem 0.85rem"}}>
              <input value={newRemText} onChange={e => setNewRemText(e.target.value)}
                onKeyDown={e => {if(e.key==="Enter"&&newRemText.trim()){setReminders(r => [...r,{id:Date.now(),text:newRemText.trim(),done:false}]);setNewRemText("");}}}
                placeholder="Add a custom reminder..."
                style={{flex:1,background:"transparent",border:"none",color:"#fff",fontSize:"0.86rem",outline:"none",fontFamily:"Georgia,serif"}}/>
              <button onClick={() => {if(newRemText.trim()){setReminders(r => [...r,{id:Date.now(),text:newRemText.trim(),done:false}]);setNewRemText("");}}}
                style={{padding:"0.38rem 0.7rem",borderRadius:"6px",background:col,border:`1px solid ${acc}`,color:"#fff",cursor:"pointer",fontSize:"0.78rem",fontFamily:"Georgia,serif"}}>Add</button>
            </div>
            {reminders.map(r => (
              <div key={r.id} style={{...cs,display:"flex",alignItems:"flex-start",gap:"0.65rem",opacity:r.done?0.48:1}}>
                <button onClick={() => setReminders(rs => rs.map(x => x.id===r.id?{...x,done:!x.done}:x))}
                  style={{width:"21px",height:"21px",borderRadius:"50%",border:`2px solid ${r.done?acc:"rgba(255,255,255,0.28)"}`,background:r.done?acc:"transparent",flexShrink:0,cursor:"pointer",marginTop:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:"700",fontSize:"0.68rem"}}>
                  {r.done?"✓":""}
                </button>
                <p style={{margin:0,flex:1,color:r.done?"#4a5d70":"#c0ccd8",fontSize:"0.86rem",textDecoration:r.done?"line-through":"none"}}>{r.text}</p>
                <button onClick={() => setReminders(rs => rs.filter(x => x.id!==r.id))} style={{background:"transparent",border:"none",color:"#ff6b6b28",cursor:"pointer",fontSize:"0.95rem",padding:0}}>x</button>
              </div>
            ))}
            <div style={{...cs,background:`${col}10`,borderColor:`${col}30`,marginTop:"0.5rem"}}>
              <p style={{color:acc,fontSize:"0.76rem",fontWeight:"700",margin:"0 0 0.55rem"}}>Letter Writing Tips</p>
              {["Write at least once a week -- it means everything","Keep letters positive and encouraging","Include photos, drawings, or clippings from home","Number your letters so they can be read in order","Let them know specific things you're proud of"].map((t,i) => (
                <p key={i} style={{color:"#a0b0c0",fontSize:"0.8rem",margin:"0 0 0.28rem"}}>. {t}</p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// -- Root ----------------------------------------------------------------------
export default function App() {
  const [stage, setStage] = useState("loading");
  const [bKey, setBKey] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
      const paid = localStorage.getItem("btc_paid");
      if (d.branchKey && d.profile) {
        setBKey(d.branchKey); setProfile(d.profile);
        setStage(paid ? "dashboard" : "paywall");
        return;
      }
    } catch(e) {}
    setStage("branch");
  }, []);

  useEffect(() => {
    if (bKey && profile) {
      try {
        const existing = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
        localStorage.setItem(LS_KEY, JSON.stringify({...existing, branchKey:bKey, profile}));
      } catch(e) {}
    }
  }, [bKey, profile]);

  const selectBranch = k => { setBKey(k); setStage("setup"); };
  const completeSetup = data => {
    if (!data) { setStage("branch"); setBKey(null); return; }
    setProfile(data);
    setStage(localStorage.getItem("btc_paid") ? "dashboard" : "paywall");
  };
  const unlock = () => { setStage("dashboard"); };

  // Auto-unlock when Stripe redirects customer back with ?unlocked=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("unlocked") === "true") {
      const pendingPlan = localStorage.getItem("btc_pending_plan") || "lifetime";
      localStorage.setItem("btc_paid", JSON.stringify({ plan: pendingPlan, ts: Date.now() }));
      localStorage.removeItem("btc_pending_plan");
      window.history.replaceState({}, document.title, window.location.pathname);
      setStage("dashboard");
    }
  }, []);

  const reset = () => {
    localStorage.removeItem(LS_KEY); localStorage.removeItem("btc_paid");
    setStage("branch"); setBKey(null); setProfile(null);
  };

  if (stage==="loading") return (
    <div style={{minHeight:"100vh",background:"#0a0f1a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{color:"#c8a84b",fontFamily:"Georgia,serif",fontSize:"1.1rem"}}>Loading...</p>
    </div>
  );
  if (stage==="branch") return <BranchSelector onSelect={selectBranch}/>;
  if (stage==="setup") return <SetupScreen branch={branches[bKey]} onComplete={completeSetup}/>;
  if (stage==="paywall") return <PaywallScreen branch={branches[bKey]} onUnlock={unlock}/>;
  return <Dashboard branchKey={bKey} branch={branches[bKey]} profile={profile} onReset={reset}/>;
}
