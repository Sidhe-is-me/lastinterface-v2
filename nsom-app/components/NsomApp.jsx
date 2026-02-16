"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart,
} from "recharts";
import { storage } from "../lib/storage";

const STORAGE_KEY = "nsom-tracker-v2";

const c = {
  bg: "#F7F3EE", bgDeep: "#EDE7DF", bgWarm: "#E8DFD4",
  text: "#3D3229", textMuted: "#8B7D6F", textLight: "#A69888",
  accent: "#B8845C", accentSoft: "#D4A97A", accentGlow: "rgba(184,132,92,0.12)",
  green: "#7A9E7E", greenSoft: "rgba(122,158,126,0.15)", greenDark: "#5C8260",
  amber: "#C4964A", amberSoft: "rgba(196,150,74,0.15)",
  red: "#B85C5C", redSoft: "rgba(184,92,92,0.12)",
  white: "#FFFFFF", border: "#DDD4C8", borderLight: "#E8E0D6",
  blue: "#6B8EAE", blueSoft: "rgba(107,142,174,0.15)",
};

const LOAD_DOMAINS = ["Cognitive", "Emotional", "Sensory", "Social", "Executive"];
const SENSATIONS = ["Tight","Heavy","Buzzy","Numb","Warm","Cold","Racing","Foggy","Shallow breathing","Chest pressure","Throat constriction","Jaw clenched"];

function todayStr() { return new Date().toISOString().split("T")[0]; }
function friendlyDate(d) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
function timeOfDay() { const h = new Date().getHours(); return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; }

// ─── Call our own API route (keeps key server-side) ───
async function callClaude(systemPrompt, userMessage) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: systemPrompt, message: userMessage }),
    });
    const data = await res.json();
    if (data.error) return "Analysis unavailable: " + data.error;
    return data.text || "No response received.";
  } catch {
    return "Unable to connect to analysis. Please try again.";
  }
}

// ─── Btn ───
function Btn({ children, onClick, variant = "primary", disabled, small, style: sx }) {
  const base = { padding: small ? "6px 16px" : "10px 24px", borderRadius: 8, fontSize: small ? 13 : 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: "inherit", border: "none", transition: "all 0.2s", ...sx };
  const v = {
    primary: { background: disabled ? c.bgWarm : c.accent, color: disabled ? c.textLight : c.white },
    secondary: { background: "transparent", color: c.textMuted, border: `1.5px solid ${c.border}` },
    green: { background: c.green, color: c.white },
    ghost: { background: "transparent", color: c.textMuted, padding: small ? "4px 10px" : "8px 16px" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant] }}>{children}</button>;
}

// ─── Callout ───
function Callout({ children, type = "info" }) {
  const s = { info: { bg: c.amberSoft, br: c.amber }, success: { bg: c.greenSoft, br: c.green }, warning: { bg: c.redSoft, br: c.red }, neutral: { bg: c.bgDeep, br: c.accent } }[type];
  return <div style={{ background: s.bg, borderLeft: `4px solid ${s.br}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, lineHeight: 1.6, color: c.text }}>{children}</div>;
}

// ─── Breathing Guide ───
function BreathingGuide({ active, onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [breathNum, setBreathNum] = useState(0);
  const ref = useRef(null);

  useEffect(() => { if (!active) { setPhase("ready"); setCount(0); setBreathNum(0); return; } if (phase === "ready") { setPhase("inhale"); setCount(4); setBreathNum(1); } }, [active]);
  useEffect(() => {
    if (!active || phase === "ready" || phase === "done") return;
    ref.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          if (phase === "inhale") { setPhase("exhale"); return 6; }
          if (phase === "exhale") { if (breathNum >= 3) { setPhase("done"); clearInterval(ref.current); setTimeout(() => onComplete?.(), 600); return 0; } setBreathNum(b => b + 1); setPhase("inhale"); return 4; }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [phase, active, breathNum]);

  if (!active || phase === "ready") return null;
  const sz = phase === "inhale" ? 110 : phase === "exhale" ? 55 : 80;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
      <div style={{ width: sz, height: sz, borderRadius: "50%", background: `radial-gradient(circle, ${c.accentSoft} 0%, ${c.accent}44 100%)`, transition: "all 1s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, color: c.accent, fontWeight: 600 }}>{phase === "done" ? "✓" : count}</span>
      </div>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: c.textMuted, fontStyle: "italic" }}>{phase === "inhale" ? "Breathe in..." : phase === "exhale" ? "Breathe out..." : "Complete"}</span>
      <span style={{ fontSize: 12, color: c.textLight }}>Breath {Math.min(breathNum, 3)} of 3</span>
    </div>
  );
}

// ─── Countdown Timer ───
function CountdownTimer({ duration, label, onComplete }) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) { clearInterval(ref.current); return; }
    ref.current = setInterval(() => { setRemaining(r => { if (r <= 1) { clearInterval(ref.current); setRunning(false); onComplete?.(); return 0; } return r - 1; }); }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = ((duration - remaining) / duration) * 100;

  return (
    <div style={{ background: c.white, border: `1px solid ${c.borderLight}`, borderRadius: 10, padding: "16px 20px" }}>
      <div style={{ fontSize: 13, color: c.textLight, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 600, color: remaining === 0 ? c.green : c.text, minWidth: 90 }}>{mins}:{secs.toString().padStart(2, "0")}</div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: c.bgDeep, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: remaining === 0 ? c.green : c.accent, borderRadius: 3, transition: "width 1s linear" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {remaining === 0
            ? <Btn small variant="green" onClick={() => { setRunning(false); setRemaining(duration); }}>✓ Done</Btn>
            : running
              ? <Btn small variant="secondary" onClick={() => setRunning(false)}>Pause</Btn>
              : <>
                  <Btn small onClick={() => setRunning(true)}>{remaining < duration ? "Resume" : "Start"}</Btn>
                  {remaining < duration && <Btn small variant="ghost" onClick={() => { setRunning(false); setRemaining(duration); }}>Reset</Btn>}
                </>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Step Card ───
function StepCard({ number, title, why, children, active, completed, onClick }) {
  return (
    <div onClick={onClick} style={{ background: completed ? c.greenSoft : active ? c.white : c.bgDeep, border: `1px solid ${active ? c.accent : completed ? c.green : c.borderLight}`, borderRadius: 12, padding: "18px 22px", cursor: onClick ? "pointer" : "default", transition: "all 0.3s", opacity: !active && !completed ? 0.55 : 1, boxShadow: active ? `0 2px 16px ${c.accentGlow}` : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: completed ? c.green : active ? c.accent : c.bgWarm, color: completed || active ? c.white : c.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{completed ? "✓" : number}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 4 }}>{title}</div>
          {active && <><div style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, marginBottom: children ? 10 : 0 }}>{why}</div>{children}</>}
        </div>
      </div>
    </div>
  );
}

// ─── Decision Gate ───
function DecisionGate({ onYes, onNo, attempt }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${c.amberSoft}, ${c.accentGlow})`, border: `2px solid ${c.amber}`, borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: c.amber, marginBottom: 8 }}>Decision Gate{attempt > 1 ? ` — Attempt ${attempt}` : ""}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 21, fontWeight: 600, color: c.text, marginBottom: 6 }}>Did the body show any change?</div>
      <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 18, lineHeight: 1.5 }}>Any change counts: breathing slightly slower, shoulders slightly lower, thoughts slightly less loud. Even &ldquo;not worse&rdquo; is valid.</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn variant="green" onClick={onYes}>Yes — something shifted</Btn>
        <Btn variant="secondary" onClick={onNo}>No change</Btn>
      </div>
    </div>
  );
}

// ─── Load Domain Detector (Claude-powered) ───
function LoadDomainDetector() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!input.trim()) return;
    setLoading(true);
    const sys = `You are an expert in autonomic nervous system regulation for neurodivergent individuals, trained on the NSOM framework by Yve Bergeron. Identify which of the Five Load Domains are active based on description. Domains: 1. COGNITIVE (head pressure, fog, "too many tabs"), 2. EMOTIONAL (chest tightness, throat constriction, disproportionate tears), 3. SENSORY (skin crawling, irritability, flinching), 4. SOCIAL (post-social exhaustion, rehearsal), 5. EXECUTIVE (paralysis, decision fatigue, "wall" between intention and action). Respond ONLY with JSON, no markdown: {"primary":"domain","secondary":"domain or null","confidence":"high/medium/low","explanation":"2-3 sentences","intervention":"specific suggestion"}`;
    const text = await callClaude(sys, `Current experience: ${input}`);
    try { setResult(JSON.parse(text.replace(/```json|```/g, "").trim())); }
    catch { setResult({ primary: "Unknown", secondary: null, confidence: "low", explanation: text, intervention: "Try describing physical sensations and current situation in more detail." }); }
    setLoading(false);
  }

  const dc = { Cognitive: c.blue, Emotional: c.red, Sensory: c.amber, Social: c.accent, Executive: c.green };

  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 4 }}>Load Domain Detection</div>
      <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 14 }}>Describe what you&apos;re experiencing. Claude identifies active load domains and suggests domain-specific interventions.</div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., I can't start the report even though I know what to write. My head feels foggy and I keep checking my phone..." style={{ width: "100%", minHeight: 80, padding: 14, border: `1px solid ${c.borderLight}`, borderRadius: 8, fontSize: 14, fontFamily: "'Source Serif 4', Georgia, serif", color: c.text, background: c.bg, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <Btn onClick={analyze} disabled={!input.trim() || loading}>{loading ? "Analysing..." : "Identify Load Domains"}</Btn>
      </div>
      {result && (
        <div style={{ marginTop: 16, padding: 16, background: c.bgDeep, borderRadius: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ padding: "4px 14px", borderRadius: 20, background: dc[result.primary] || c.accent, color: c.white, fontSize: 13, fontWeight: 600 }}>Primary: {result.primary}</span>
            {result.secondary && result.secondary !== "null" && <span style={{ padding: "4px 14px", borderRadius: 20, background: (dc[result.secondary] || c.accent) + "33", color: dc[result.secondary] || c.accent, fontSize: 13, fontWeight: 600, border: `1px solid ${dc[result.secondary] || c.accent}` }}>Secondary: {result.secondary}</span>}
            <span style={{ padding: "4px 10px", borderRadius: 20, background: c.bgWarm, color: c.textMuted, fontSize: 12 }}>{result.confidence} confidence</span>
          </div>
          <div style={{ fontSize: 14, color: c.text, lineHeight: 1.6, marginBottom: 10 }}>{result.explanation}</div>
          <div style={{ fontSize: 14, color: c.greenDark, lineHeight: 1.6, padding: "10px 14px", background: c.greenSoft, borderRadius: 8 }}><strong>Intervention:</strong> {result.intervention}</div>
        </div>
      )}
    </div>
  );
}

// ─── Weekly Pattern Analysis (Claude-powered) ───
function WeeklyPatternAnalysis({ entries }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const last7 = entries.filter(e => (Date.now() - new Date(e.date).getTime()) / 86400000 <= 7);

  async function analyze() {
    if (last7.length === 0) return;
    setLoading(true);
    const sys = `You are an expert in the NSOM framework by Yve Bergeron. Perform Weekly Pattern Analysis on regulation log data. Rules: look for patterns not causes, ask "what keeps showing up" not "why", one decision maximum. Respond ONLY with JSON, no markdown: {"patterns":["pattern 1","pattern 2"],"dominant_domain":"domain or null","sensation_pattern":"recurring sensations","gate_rate":"X/Y with interpretation","risk_flags":["concerns"],"one_decision":"single concrete action","summary":"3-4 sentence assessment"}`;
    const dataStr = last7.map(e => `Date:${e.date} Time:${e.timeOfDay||"?"} Gate:${e.gatePassed?"pass":"no"} Attempts:${e.attempts||1} Escalated:${e.escalated?"yes":"no"} Domain:${e.loadDomain||"?"} Sensations:${(e.sensations||[]).join(",")} HRV:${e.hrv||"?"} Journal:${e.journal||"none"} RedLine:${e.redLine?"yes":"no"}`).join("\n");
    const text = await callClaude(sys, `Regulation log entries (past 7 days):\n\n${dataStr}`);
    try { setResult(JSON.parse(text.replace(/```json|```/g, "").trim())); }
    catch { setResult({ patterns: [], dominant_domain: null, sensation_pattern: "", gate_rate: "", risk_flags: [], one_decision: "", summary: text }); }
    setLoading(false);
  }

  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 4 }}>Weekly Pattern Analysis</div>
      <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 14 }}>Claude analyses your past 7 days to surface recurring patterns. {last7.length === 0 ? "No entries yet." : `${last7.length} entries available.`}</div>
      <Btn onClick={analyze} disabled={last7.length === 0 || loading}>{loading ? "Analysing..." : `Analyse ${last7.length} entries`}</Btn>
      {result && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 14, background: c.bgDeep, borderRadius: 10, fontSize: 14, color: c.text, lineHeight: 1.6 }}>{result.summary}</div>
          {result.patterns?.length > 0 && (
            <div style={{ padding: 14, background: c.blueSoft, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.blue, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Recurring Patterns</div>
              {result.patterns.map((p, i) => <div key={i} style={{ fontSize: 14, color: c.text, lineHeight: 1.6, paddingLeft: 12, borderLeft: `2px solid ${c.blue}`, marginBottom: 6 }}>{p}</div>)}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {result.dominant_domain && <div style={{ background: c.amberSoft, borderRadius: 8, padding: 12, textAlign: "center" }}><div style={{ fontSize: 12, color: c.textLight }}>Dominant domain</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: c.amber }}>{result.dominant_domain}</div></div>}
            {result.gate_rate && <div style={{ background: c.greenSoft, borderRadius: 8, padding: 12, textAlign: "center" }}><div style={{ fontSize: 12, color: c.textLight }}>Gate rate</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: c.green }}>{result.gate_rate}</div></div>}
            {result.sensation_pattern && <div style={{ background: c.accentGlow, borderRadius: 8, padding: 12, textAlign: "center" }}><div style={{ fontSize: 12, color: c.textLight }}>Body pattern</div><div style={{ fontSize: 13, fontWeight: 500, color: c.accent, marginTop: 2 }}>{result.sensation_pattern}</div></div>}
          </div>
          {result.risk_flags?.length > 0 && <div style={{ padding: 14, background: c.redSoft, borderRadius: 10, borderLeft: `4px solid ${c.red}` }}><div style={{ fontSize: 13, fontWeight: 600, color: c.red, marginBottom: 4 }}>Flags</div>{result.risk_flags.map((f, i) => <div key={i} style={{ fontSize: 14, color: c.text }}>{f}</div>)}</div>}
          {result.one_decision && <div style={{ padding: 14, background: c.greenSoft, borderRadius: 10, borderLeft: `4px solid ${c.green}` }}><div style={{ fontSize: 13, fontWeight: 600, color: c.greenDark, marginBottom: 4 }}>One Decision (Maximum)</div><div style={{ fontSize: 15, color: c.text, lineHeight: 1.6 }}>{result.one_decision}</div></div>}
        </div>
      )}
    </div>
  );
}

// ─── HRV Chart ───
function HRVChart({ entries }) {
  const data = entries.filter(e => e.hrv).sort((a, b) => a.date.localeCompare(b.date)).map(e => ({ date: new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }), hrv: e.hrv, hr: e.hr || null }));
  if (data.length < 2) return <div style={{ textAlign: "center", padding: "32px 20px", color: c.textLight }}><div style={{ fontSize: 28, marginBottom: 8 }}>📊</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17 }}>Need at least 2 HRV entries for chart</div><div style={{ fontSize: 13, marginTop: 4 }}>Log your overnight SDNN from Apple Health.</div></div>;
  const avg = Math.round(data.reduce((s, d) => s + d.hrv, 0) / data.length);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}><div style={{ fontSize: 13, color: c.textLight }}>HRV (SDNN ms) — higher = better parasympathetic recovery</div><div style={{ fontSize: 13, color: c.textMuted }}>Avg: <strong>{avg} ms</strong></div></div>
      <div style={{ background: c.white, borderRadius: 12, border: `1px solid ${c.borderLight}`, padding: "16px 8px 8px 0" }}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs><linearGradient id="hrvG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c.accent} stopOpacity={0.2} /><stop offset="95%" stopColor={c.accent} stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.borderLight} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: c.textLight }} />
            <YAxis tick={{ fontSize: 11, fill: c.textLight }} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip contentStyle={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 13 }} formatter={(val, name) => [val + (name === "hrv" ? " ms" : " bpm"), name === "hrv" ? "HRV" : "Resting HR"]} />
            <ReferenceLine y={avg} stroke={c.textLight} strokeDasharray="4 4" label={{ value: `avg ${avg}`, position: "right", fontSize: 11, fill: c.textLight }} />
            <Area type="monotone" dataKey="hrv" stroke="none" fill="url(#hrvG)" />
            <Line type="monotone" dataKey="hrv" stroke={c.accent} strokeWidth={2.5} dot={{ fill: c.accent, r: 3 }} activeDot={{ r: 5 }} />
            {data.some(d => d.hr) && <Line type="monotone" dataKey="hr" stroke={c.red} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── DGAEP with Timers ───
function DGAEPWithTimers() {
  const levels = [
    { level: 1, name: "Postural Reset & Breathing", time: "3–5 min", seconds: 240, desc: "Change position. Drink water (cold if available). 3 slow breaths: inhale nose, exhale mouth. Feet on floor.", rationale: "Postural change interrupts proprioceptive feedback. Hydration addresses dehydration-driven sympathetic activation. Slow breathing activates vagal tone." },
    { level: 2, name: "Sensory Weight", time: "15–20 min", seconds: 1020, desc: "Weighted blanket, heavy hoodie, or lap pad. Firm pressure — palms together, squeeze arms, press back into wall. If tolerated: cold water on wrists, cold cloth on neck.", rationale: "Deep pressure activates parasympathetic response through proprioceptive loading. Cold triggers mammalian dive reflex." },
    { level: 3, name: "Cognitive Loop Interruption", time: "10–15 min", seconds: 720, desc: "Count backwards from 100 by 7s. Name objects by category. Describe a physical object in exact detail. Engage structured external task — sorting, arranging, stacking.", rationale: "Not calming — redirecting. Reroutes cognitive resources maintaining the loop toward external structured tasks." },
    { level: 4, name: "Rhythmic Override", time: "10–20 min", seconds: 900, desc: "Walking (any pace, rhythmic, continuous). Rocking. Bilateral tapping — alternate knees or shoulders. Drumming at steady beat. Let the body choose its rhythm.", rationale: "Pattern interrupts at motor cortex level. Vestibular and proprioceptive input competes with cognitive loop." },
    { level: 5, name: "Sensory Containment", time: "20–30 min", seconds: 1500, desc: "Darken room. Noise-cancelling headphones or silence. Functional language only. No questions about feelings. No reassurance loops. Containment, not engagement.", rationale: "System is overwhelmed by input volume — including regulatory input. Reduce total sensory load." },
    { level: 6, name: "Time-Based Holding", time: "20–30 min", seconds: 1500, desc: "Set timer. Stay present. No interventions. No fixing. No techniques. Time and physical safety only.", rationale: "Containment is a valid endpoint. The goal is that activation does not worsen and the system is given time." },
  ];
  const [active, setActive] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Callout type="info"><strong>Decision gate at every level:</strong> After the timer, ask — did the body change? YES → stay. NO → escalate. Follow levels in order. Do not skip.</Callout>
      {levels.map(l => (
        <div key={l.level} style={{ background: c.white, borderRadius: 12, border: `1px solid ${active === l.level ? c.accent : c.borderLight}`, overflow: "hidden", transition: "all 0.2s" }}>
          <div onClick={() => setActive(active === l.level ? null : l.level)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.accent, color: c.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{l.level}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, color: c.text }}>{l.name}</div>
            </div>
            <span style={{ fontSize: 12, color: c.textLight }}>{l.time}</span>
          </div>
          {active === l.level && (
            <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${c.borderLight}`, paddingTop: 14 }}>
              <div style={{ fontSize: 14, color: c.text, lineHeight: 1.6, marginBottom: 10 }}>{l.desc}</div>
              <div style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, fontStyle: "italic", marginBottom: 14, paddingLeft: 12, borderLeft: `2px solid ${c.bgWarm}` }}>{l.rationale}</div>
              <CountdownTimer duration={l.seconds} label={`Level ${l.level} timer`} onComplete={() => {}} />
            </div>
          )}
        </div>
      ))}
      <div style={{ background: c.redSoft, borderRadius: 12, padding: "16px 20px", borderLeft: `4px solid ${c.red}`, marginTop: 4 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: c.red, marginBottom: 4 }}>Medical Red Flags — Stop protocol, seek immediate medical help</div>
        <div style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6 }}>Chest pain · Fainting · Confusion or disorientation · Slurred speech · New neurological symptoms · Panic persisting for hours without fluctuation</div>
      </div>
    </div>
  );
}

// ─── History ───
function HistoryView({ entries }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const last7 = sorted.filter(e => (Date.now() - new Date(e.date).getTime()) / 86400000 <= 7);
  const gateRate = last7.length > 0 ? Math.round((last7.filter(e => e.gatePassed).length / last7.length) * 100) : 0;
  const avgAtt = last7.length > 0 ? (last7.reduce((s, e) => s + (e.attempts || 1), 0) / last7.length).toFixed(1) : "—";
  const esc = last7.filter(e => e.escalated).length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[{ v: `${gateRate}%`, l: "Gate pass (7d)", bg: c.greenSoft, fg: c.green }, { v: avgAtt, l: "Avg attempts", bg: c.amberSoft, fg: c.amber }, { v: esc, l: "Escalations (7d)", bg: c.redSoft, fg: c.red }, { v: sorted.length, l: "Total entries", bg: c.accentGlow, fg: c.accent }].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: s.fg }}>{s.v}</div>
            <div style={{ fontSize: 11, color: c.textMuted }}>{s.l}</div>
          </div>
        ))}
      </div>
      {sorted.slice(0, 20).map((entry, i) => (
        <div key={i} style={{ background: c.white, borderRadius: 8, padding: "10px 14px", border: `1px solid ${c.borderLight}`, display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.gatePassed ? c.green : entry.escalated ? c.amber : c.red, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>
              {friendlyDate(entry.date)}{entry.timeOfDay ? ` · ${entry.timeOfDay}` : ""}
              {entry.loadDomain && <span style={{ marginLeft: 8, padding: "1px 8px", borderRadius: 10, background: c.bgDeep, fontSize: 11, color: c.textMuted }}>{entry.loadDomain}</span>}
            </div>
            {entry.journal && <div style={{ fontSize: 12, color: c.textLight, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.journal}</div>}
          </div>
          <div style={{ fontSize: 11, color: c.textLight, textAlign: "right", flexShrink: 0 }}>
            {entry.gatePassed ? "Gate ✓" : entry.escalated ? "Escalated" : "No shift"}
            {entry.hrv ? <div>{entry.hrv} ms</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Red Lines ───
function RedLines() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { title: "Sleep below 5 hours for 2+ consecutive nights", action: "Cancel all non-essential commitments. The system cannot regulate on insufficient sleep." },
        { title: "Sustained activation for 4+ hours", action: "Activate acute protocol → DGAEP → seek human support." },
        { title: "Loss of appetite for 24+ hours", action: "Dorsal vagal signalling — shutdown. Reduce all demands. Gentle movement and warmth." },
        { title: "Inability to complete the regulation loop", action: "Load failure, not regulation failure. Seek co-regulation from a safe person or environment." },
        { title: "Suicidal ideation or self-harm urges", action: "Medical emergency. Contact emergency services, crisis helpline, or trusted person immediately.", critical: true },
      ].map((rl, i) => (
        <div key={i} style={{ background: rl.critical ? c.redSoft : c.white, border: `1px solid ${rl.critical ? c.red : c.border}`, borderRadius: 10, padding: "14px 18px", borderLeft: `4px solid ${c.red}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 4 }}>{rl.title}</div>
          <div style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5 }}>{rl.action}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function NsomApp() {
  const [view, setView] = useState("loop");
  const [step, setStep] = useState(1);
  const [breathingActive, setBreathingActive] = useState(false);
  const [gateReached, setGateReached] = useState(false);
  const [gatePassed, setGatePassed] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [escalated, setEscalated] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [sensations, setSensations] = useState([]);
  const [loadDomain, setLoadDomain] = useState("");
  const [hrv, setHrv] = useState("");
  const [hr, setHr] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    (async () => {
      const r = await storage.get(STORAGE_KEY);
      if (r?.value) { try { setEntries(JSON.parse(r.value)); } catch {} }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (data) => { await storage.set(STORAGE_KEY, JSON.stringify(data)); }, []);

  function advanceStep() { if (step < 6) setStep(step + 1); else setGateReached(true); }
  function handleGateYes() { setGatePassed(true); }
  function handleGateNo() {
    if (attempt < 2) { setAttempt(2); setStep(1); setGateReached(false); }
    else {
      setEscalated(true);
      const e = { date: todayStr(), timeOfDay: timeOfDay(), gatePassed: false, escalated: true, attempts: 2, journal: null, sensations: [], loadDomain: "", hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: "", redLine: false };
      const u = [...entries, e]; setEntries(u); persist(u);
    }
  }
  function handleSave() {
    const e = { date: todayStr(), timeOfDay: timeOfDay(), gatePassed: true, escalated: false, attempts: attempt, journal: journalEntry.trim() || null, sensations, loadDomain, hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: notes.trim() || null, redLine: false };
    const u = [...entries, e]; setEntries(u); persist(u); setSaved(true);
  }
  function resetLoop() {
    setStep(1); setBreathingActive(false); setGateReached(false); setGatePassed(false);
    setAttempt(1); setEscalated(false); setJournalEntry(""); setSensations([]);
    setLoadDomain(""); setHrv(""); setHr(""); setNotes(""); setSaved(false);
  }

  const toggleSensation = s => setSensations(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const navItems = [
    { id: "loop", label: "Regulation Loop", icon: "🔄" },
    { id: "dgaep", label: "Escalation", icon: "↑" },
    { id: "tracking", label: "Tracking", icon: "📊" },
    { id: "analysis", label: "Analysis", icon: "🧠" },
    { id: "redlines", label: "Red Lines", icon: "🔴" },
  ];

  if (loading) return <div style={{ minHeight: "100vh", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: c.textMuted }}>Loading...</div></div>;

  return (
    <div style={{ minHeight: "100vh", background: c.bg }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${c.border}`, padding: "24px 20px 18px", background: c.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: c.accent, marginBottom: 4 }}>The Nervous System Operating Manual</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: c.text, lineHeight: 1.2, marginBottom: 3 }}>Daily Regulation Protocol</div>
          <div style={{ fontSize: 14, color: c.textMuted, fontStyle: "italic" }}>Your body has a job. Its job is to keep you safe. This protocol tells you how to let it.</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${c.border}`, background: c.white, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{ padding: "10px 16px", border: "none", borderBottom: view === item.id ? `2px solid ${c.accent}` : "2px solid transparent", background: "transparent", color: view === item.id ? c.accent : c.textMuted, fontSize: 13, fontWeight: view === item.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{item.icon} {item.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* REGULATION LOOP */}
        {view === "loop" && (
          <div>
            <Callout type="info"><strong>Core Principle:</strong> No body change = no next step. The body is the authority.</Callout>
            <div style={{ height: 16 }} />

            {saved ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>○</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: c.green, marginBottom: 6 }}>Entry Stored</div>
                <div style={{ fontSize: 14, color: c.textMuted, marginBottom: 20 }}>Do not re-read. Processing happens later, on a different day, with full capacity.</div>
                <Btn variant="secondary" onClick={resetLoop}>Start a new loop</Btn>
              </div>
            ) : escalated ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>↑</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: c.amber, marginBottom: 6 }}>Escalate to DGAEP</div>
                <div style={{ fontSize: 14, color: c.textMuted, marginBottom: 20 }}>The body has not shifted after two attempts. This is not failure — activation exceeds first-line capacity.</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Btn onClick={() => setView("dgaep")}>Open DGAEP</Btn><Btn variant="secondary" onClick={resetLoop}>Reset</Btn></div>
              </div>
            ) : gatePassed ? (
              /* JOURNALING */
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: c.greenSoft, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}><span style={{ fontSize: 13, fontWeight: 600, color: c.green, textTransform: "uppercase", letterSpacing: 1.5 }}>Gate Passed — Journaling Unlocked</span></div>
                <Callout type="neutral"><strong>Rules:</strong> Storage, not understanding. No decisions. No reviewing after. If the body worsens, stop.</Callout>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.textMuted, marginBottom: 8 }}>Body Sensations</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {SENSATIONS.map(s => <button key={s} onClick={() => toggleSensation(s)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${sensations.includes(s) ? c.accent : c.borderLight}`, background: sensations.includes(s) ? c.accentGlow : "transparent", color: sensations.includes(s) ? c.accent : c.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: sensations.includes(s) ? 600 : 400 }}>{s}</button>)}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div><div style={{ fontSize: 12, color: c.textLight, marginBottom: 4 }}>Load Domain</div><select value={loadDomain} onChange={e => setLoadDomain(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${c.borderLight}`, fontSize: 13, fontFamily: "inherit", color: c.text, background: c.bg }}><option value="">Select...</option>{LOAD_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div><div style={{ fontSize: 12, color: c.textLight, marginBottom: 4 }}>HRV (SDNN ms)</div><input type="number" value={hrv} onChange={e => setHrv(e.target.value)} placeholder="e.g. 38" style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${c.borderLight}`, fontSize: 13, fontFamily: "inherit", color: c.text, background: c.bg, boxSizing: "border-box" }} /></div>
                  <div><div style={{ fontSize: 12, color: c.textLight, marginBottom: 4 }}>Resting HR</div><input type="number" value={hr} onChange={e => setHr(e.target.value)} placeholder="e.g. 68" style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${c.borderLight}`, fontSize: 13, fontFamily: "inherit", color: c.text, background: c.bg, boxSizing: "border-box" }} /></div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.textMuted, marginBottom: 6 }}>Journal — describe, don&apos;t analyse</div>
                  <textarea value={journalEntry} onChange={e => setJournalEntry(e.target.value)} placeholder="Description only. No analysis." style={{ width: "100%", minHeight: 100, padding: 14, border: `1px solid ${c.borderLight}`, borderRadius: 8, fontSize: 14, fontFamily: "'Source Serif 4', Georgia, serif", color: c.text, background: c.bg, resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }} />
                </div>
                <div><div style={{ fontSize: 12, color: c.textLight, marginBottom: 4 }}>Context notes</div><input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What was happening..." style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${c.borderLight}`, fontSize: 13, fontFamily: "inherit", color: c.text, background: c.bg, boxSizing: "border-box" }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: c.textLight }}>Store and close. Do not re-read.</span><Btn onClick={handleSave}>Store &amp; Close</Btn></div>
              </div>
            ) : (
              /* LOOP STEPS */
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {attempt > 1 && <div style={{ background: c.amberSoft, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: c.amber, fontWeight: 500, textAlign: "center" }}>Second attempt — if no change, escalate to DGAEP.</div>}
                <StepCard number={1} title="Pause" why="Stop. Sit or stand still for 10 seconds. Interrupts the autonomic trajectory." active={step === 1} completed={step > 1}><Btn small onClick={advanceStep}>I&apos;ve paused →</Btn></StepCard>
                <StepCard number={2} title="Breathe" why="3 slow breaths: in through the nose (4 counts), out through the mouth (6 counts)." active={step === 2} completed={step > 2}>
                  {!breathingActive && <Btn small onClick={() => setBreathingActive(true)}>Start breathing guide</Btn>}
                  <BreathingGuide active={breathingActive} onComplete={() => { setBreathingActive(false); advanceStep(); }} />
                </StepCard>
                <StepCard number={3} title="Orient visually" why="Find and name 3 colours in the room." active={step === 3} completed={step > 3}><Btn small onClick={advanceStep}>3 colours named →</Btn></StepCard>
                <StepCard number={4} title="Body scan" why="Head to toe. Name sensations: tight, heavy, buzzy, numb, warm, cold. Name without interpreting." active={step === 4} completed={step > 4}><Btn small onClick={advanceStep}>Scan complete →</Btn></StepCard>
                <StepCard number={5} title="Walk" why="10 slow steps, counting each. Or rock gently. Most reliably effective single intervention." active={step === 5} completed={step > 5}><Btn small onClick={advanceStep}>10 steps done →</Btn></StepCard>
                <StepCard number={6} title="Second body scan" why="Notice what changed. Any change counts. 'Not worse' is valid." active={step === 6} completed={gateReached}><Btn small onClick={advanceStep}>Decision gate →</Btn></StepCard>
                {gateReached && !gatePassed && <DecisionGate onYes={handleGateYes} onNo={handleGateNo} attempt={attempt} />}
              </div>
            )}
          </div>
        )}

        {view === "dgaep" && <><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: c.text, marginBottom: 4 }}>↑ Escalation Protocol (DGAEP)</div><div style={{ fontSize: 14, color: c.textMuted, marginBottom: 16 }}>When first-line regulation fails, escalation is not failure.</div><DGAEPWithTimers /></>}

        {view === "tracking" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: c.text }}>📊 Tracking</div><div style={{ fontSize: 14, color: c.textMuted }}>The pattern matters, not the individual day.</div></div>
              {entries.length > 0 && <Btn small variant="ghost" onClick={async () => { if (confirm("Clear all data?")) { setEntries([]); await storage.delete(STORAGE_KEY); } }}>Reset</Btn>}
            </div>
            {entries.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 20px", color: c.textLight }}><div style={{ fontSize: 28, marginBottom: 8 }}>○</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17 }}>No entries yet</div></div>
              : <><HRVChart entries={entries} /><div style={{ height: 20 }} /><HistoryView entries={entries} /></>
            }
          </div>
        )}

        {view === "analysis" && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: c.text, marginBottom: 4 }}>🧠 Analysis</div>
            <div style={{ fontSize: 14, color: c.textMuted, marginBottom: 16 }}>Claude-powered pattern detection and load domain identification.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <LoadDomainDetector />
              <WeeklyPatternAnalysis entries={entries} />
            </div>
          </div>
        )}

        {view === "redlines" && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: c.text, marginBottom: 4 }}>🔴 Red Lines</div>
            <div style={{ fontSize: 14, color: c.textMuted, marginBottom: 16 }}>Non-negotiable structural load limits.</div>
            <RedLines />
            <div style={{ marginTop: 24, background: c.bgDeep, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, color: c.text, marginBottom: 10 }}>What Success Looks Like</div>
              {[{ p: "Daily", d: "The loop produces a body change more often than not. Some days it won't. The pattern matters." }, { p: "Weekly", d: "The reset identifies at least one recurring pattern." }, { p: "Monthly", d: "Baseline HRV trends favourably. More ventral vagal, less sympathetic." }, { p: "Quarterly", d: "Higher load tolerance before 'no change.' Window widened through regulation, not pushing." }].map((s, i) => (
                <div key={i} style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, marginBottom: 6 }}><span style={{ fontWeight: 600, color: c.text }}>{s.p}:</span> {s.d}</div>
              ))}
              <div style={{ marginTop: 12, fontSize: 13, color: c.textMuted, fontStyle: "italic", borderTop: `1px solid ${c.border}`, paddingTop: 10 }}>The protocol manages load. This is maintenance, not dependency.</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${c.border}`, padding: "14px 20px", textAlign: "center", background: c.white }}>
        <div style={{ fontSize: 11, color: c.textLight }}>The Nervous System Operating Manual — Yve Bergeron — UCC Neurodiversity &amp; Autism Studies</div>
        <div style={{ fontSize: 10, color: c.textLight, marginTop: 2, fontStyle: "italic" }}>The nervous system is the last interface.</div>
      </div>
    </div>
  );
}
