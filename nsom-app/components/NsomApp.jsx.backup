"use client";

import { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { C, STORAGE_KEY, srOnly } from "./nsom/constants";
import { todayStr, timeOfDay } from "./nsom/utils";
import { Btn, SectionHead, Callout, ProgressIndicator } from "./nsom/BaseComponents";
import { BreathingGuide } from "./nsom/BreathingGuide";
import { StepCard } from "./nsom/StepCard";
import { DecisionGate } from "./nsom/DecisionGate";
import { SessionTypeSelector } from "./nsom/SessionTypeSelector";

// ═══════════════════════════════════════════════════════════════
// MAIN NSOM APP
// ═══════════════════════════════════════════════════════════════

export default function NsomApp() {
  const [view, setView] = useState("loop");
  const [sessionType, setSessionType] = useState(null);
  const [step, setStep] = useState(1);
  const [breathingActive, setBreathingActive] = useState(false);
  const [audioBreathing, setAudioBreathing] = useState(false);
  const [gateReached, setGateReached] = useState(false);
  const [gatePassed, setGatePassed] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [escalated, setEscalated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = useCallback((data) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, []);

  function advanceStep() {
    if (step < 6) setStep(step + 1);
    else setGateReached(true);
  }

  function handleGateYes() {
    setGatePassed(true);
    const e = { date: todayStr(), timeOfDay: timeOfDay(), sessionType: sessionType || "acute", gatePassed: true, escalated: false, attempts: attempt };
    const updated = [...entries, e];
    setEntries(updated);
    persist(updated);
    setSaved(true);
  }

  function handleGateNo() {
    if (attempt < 2) { setAttempt(2); setStep(1); setGateReached(false); }
    else {
      setEscalated(true);
      const e = { date: todayStr(), timeOfDay: timeOfDay(), sessionType: sessionType || "acute", gatePassed: false, escalated: true, attempts: 2 };
      const updated = [...entries, e];
      setEntries(updated);
      persist(updated);
    }
  }

  function resetLoop() {
    setStep(1); setBreathingActive(false); setGateReached(false); setGatePassed(false);
    setAttempt(1); setEscalated(false); setSaved(false); setSessionType(null);
  }

  const navItems = [
    { id: "loop", label: "Regulate", icon: "🔄" },
    { id: "tracking", label: "Tracking", icon: "📈" },
    { id: "dgaep", label: "Escalation", icon: "↑" },
  ];

  const totalSteps = 6;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div role="status" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: C.textMuted }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Source Serif 4', Georgia, serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />

      <a href="#main-content" style={srOnly}>Skip to main content</a>

      <header style={{ borderBottom: `2px solid ${C.border}`, padding: "26px 22px 20px", background: C.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: C.accent, marginBottom: 6 }}>
            The Nervous System Operating Manual
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.2, margin: 0 }}>
            Daily Regulation Protocol
          </h1>
          <p style={{ fontSize: 15, color: C.textMuted, fontStyle: "italic", margin: "6px 0 0" }}>
            Your body has a job. Its job is to keep you safe. This protocol tells you how to let it.
          </p>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <button role="switch" aria-checked={audioBreathing} onClick={async () => { if (!audioBreathing) { try { await Tone.start(); } catch {} } setAudioBreathing(!audioBreathing); }} style={{ width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: audioBreathing ? C.accentBtn : C.bgWarm, position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: audioBreathing ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </button>
            <span style={{ fontSize: 13, color: C.textMuted }}>Audio breathing cues</span>
          </div>
        </div>
      </header>

      <nav aria-label="Main navigation" style={{ borderBottom: `2px solid ${C.border}`, background: C.white, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setView(item.id); if (item.id === "loop") resetLoop(); }} aria-current={view === item.id ? "page" : undefined} style={{ padding: "14px 18px", minHeight: 48, border: "none", borderBottom: view === item.id ? `3px solid ${C.accent}` : "3px solid transparent", background: "transparent", color: view === item.id ? C.accent : C.textMuted, fontSize: 14, fontWeight: view === item.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 18px 90px" }}>
        {view === "loop" && <div>{!sessionType && !saved && <SessionTypeSelector onSelect={setSessionType} />}{sessionType && sessionType !== "discharge" && <div><Callout type="info"><strong>Core Principle:</strong> No body change = no next step. The body is the authority, not the mind, not the schedule, not the therapist, and not the protocol itself.</Callout><div style={{ height: 16 }} />{!saved && !escalated && !gatePassed && <div style={{ marginBottom: 16 }}><ProgressIndicator current={Math.min(step, totalSteps)} total={totalSteps} label="Regulation loop progress" /></div>}{saved ? <div style={{ textAlign: "center", padding: "44px 22px" }} role="status"><div aria-hidden="true" style={{ fontSize: 48, marginBottom: 14 }}>◉</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.green, marginBottom: 8 }}>Entry Stored</div><p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24, margin: "0 0 24px" }}>Gate passed. Session complete.</p><Btn variant="secondary" onClick={resetLoop} ariaLabel="Start a new session">New session</Btn></div> : escalated ? <div style={{ textAlign: "center", padding: "44px 22px" }} role="alert"><div aria-hidden="true" style={{ fontSize: 48, marginBottom: 14 }}>↑</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.amber, marginBottom: 8 }}>Escalate to DGAEP</div><p style={{ fontSize: 15, color: C.textMuted, margin: "0 0 8px" }}>The regulation loop was attempted twice and the body has not shifted.</p><p style={{ fontSize: 14, color: C.textMuted, fontStyle: "italic", margin: "0 0 24px" }}>This is not failure. The activation level exceeds first-line capacity.</p><div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}><Btn onClick={() => setView("dgaep")} ariaLabel="Open DGAEP escalation protocol">Open DGAEP Protocol</Btn><Btn variant="secondary" onClick={resetLoop} ariaLabel="Reset and start over">Reset</Btn></div></div> : gatePassed ? <div style={{ textAlign: "center", padding: "44px 22px" }}><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.green, marginBottom: 16 }}>Gate Passed</div><p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24 }}>Full journaling features coming soon.</p></div> : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{attempt > 1 && <div role="alert" style={{ background: C.amberSoft, borderRadius: 10, padding: "12px 18px", fontSize: 14, color: C.amber, fontWeight: 600, textAlign: "center" }}>Second attempt — if no change this time, escalate to DGAEP.</div>}<StepCard number={1} title="Pause" why="Stop what you are doing. Sit or stand still for 10 seconds. This interrupts the current autonomic trajectory." active={step === 1} completed={step > 1}><Btn small onClick={advanceStep} ariaLabel="I have paused, go to next step">I have paused →</Btn></StepCard><StepCard number={2} title="Breathe" why="3 slow breaths: in through the nose (4 counts), out through the mouth (6 counts). Extended exhale activates the vagus nerve." active={step === 2} completed={step > 2}>{!breathingActive && <Btn small onClick={() => setBreathingActive(true)} ariaLabel="Start the breathing guide">Start breathing guide</Btn>}<BreathingGuide active={breathingActive} audioEnabled={audioBreathing} onComplete={() => { setBreathingActive(false); advanceStep(); }} /></StepCard><StepCard number={3} title="Orient visually" why="Find and name 3 colours in the room. This activates the ventral vagal system through visual orientation without emotional content." active={step === 3} completed={step > 3}><Btn small onClick={advanceStep} ariaLabel="I have named 3 colours, go to next step">I have named 3 colours →</Btn></StepCard><StepCard number={4} title="Body scan" why="Notice sensations from head to toe. Name what you find: tight, heavy, buzzy, numb, warm, cold. Naming without interpreting prevents the scan from becoming a trigger." active={step === 4} completed={step > 4}><Btn small onClick={advanceStep} ariaLabel="Body scan complete, go to next step">Scan complete →</Btn></StepCard><StepCard number={5} title="Walk" why="10 slow steps, counting each one. Or rock gently. Rhythmic bilateral movement activates both hemispheres. This is the most reliably effective single intervention." active={step === 5} completed={step > 5}><Btn small onClick={advanceStep} ariaLabel="10 steps done, go to next step">10 steps done →</Btn></StepCard><StepCard number={6} title="Second body scan" why='Notice what changed. Any change counts. The protocol asks "did anything change?" not "do you feel better?" Even "not worse" is valid.' active={step === 6} completed={gateReached}><Btn small onClick={advanceStep} ariaLabel="Go to decision gate">Go to decision gate →</Btn></StepCard>{gateReached && !gatePassed && <DecisionGate onYes={handleGateYes} onNo={handleGateNo} attempt={attempt} />}</div>}</div>}</div>}
        {view === "tracking" && <div><SectionHead icon="📈" title="Tracking" subtitle="The pattern matters, not the individual day." />{entries.length === 0 ? <div style={{ textAlign: "center", padding: "44px 22px", color: C.textLight }}><div aria-hidden="true" style={{ fontSize: 30, marginBottom: 10 }}>◉</div><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: C.textMuted }}>No entries yet</div><div style={{ fontSize: 14, marginTop: 6 }}>Complete your first regulation loop to begin tracking.</div></div> : <div><div style={{ background: C.white, borderRadius: 12, padding: 20, marginBottom: 16 }}><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Recent Sessions</div>{entries.slice(-10).reverse().map((entry, i) => <div key={i} style={{ padding: "12px 0", borderBottom: i < Math.min(entries.length, 10) - 1 ? `1px solid ${C.borderLight}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 14, color: C.text }}>{entry.date} · {entry.timeOfDay}</div><div style={{ fontSize: 13, color: C.textMuted }}>{entry.sessionType || "acute"}</div></div><div style={{ fontSize: 13, color: entry.gatePassed ? C.green : C.amber, fontWeight: 600 }}>{entry.gatePassed ? "Gate ✓" : "Escalated"}</div></div>)}</div></div>}</div>}
        {view === "dgaep" && <div><SectionHead icon="↑" title="Decision-Gated Autonomic Escalation Protocol" subtitle="When first-line regulation fails, escalation is not failure. It is the next step." /><Callout type="info"><strong>DGAEP implementation coming soon.</strong> This protocol provides 6 escalation levels for when the regulation loop doesn't produce body change.</Callout></div>}
      </main>

      <footer style={{ borderTop: `2px solid ${C.border}`, padding: "18px 22px", textAlign: "center", background: C.white }}>
        <div style={{ fontSize: 13, color: C.textMuted }}>The Nervous System Operating Manual — Yve Bergeron — Neurodiversity & Autism Studies, University College Cork</div>
        <div style={{ fontSize: 12, color: C.textLight, marginTop: 4, fontStyle: "italic" }}>The nervous system is the last interface.</div>
      </footer>
    </div>
  );
}
