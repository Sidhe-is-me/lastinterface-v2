"use client";
// NSOM v4 - Cache bust 2025-02-17

import { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";
import {
  C,
  STORAGE_KEY,
  STORAGE_ENTRIES,
  STORAGE_CHECKINS,
  STORAGE_RESETS,
  STORAGE_REDLINES,
  STORAGE_WORK,
  STORAGE_TRANSITIONS,
  STORAGE_DEFECTS,
  srOnly,
  focusStyle,
} from "./nsom/constants";
import { todayStr, timeOfDay } from "./nsom/utils";
import { Btn, SectionHead, Callout, ProgressIndicator } from "./nsom/BaseComponents";
import { BreathingGuide } from "./nsom/BreathingGuide";
import { StepCard } from "./nsom/StepCard";
import { DecisionGate } from "./nsom/DecisionGate";
import { SessionTypeSelector } from "./nsom/SessionTypeSelector";
import { JournalingSection } from "./nsom/JournalingSection";
import { DailyCheckIn } from "./nsom/DailyCheckIn";
import { RedLineMonitor } from "./nsom/RedLineMonitor";
import { WeeklyResetFlow } from "./nsom/WeeklyResetFlow";
import { DualChart } from "./nsom/DualChart";
import { HistoryView } from "./nsom/HistoryView";
import { DGAEPWithTimers } from "./nsom/DGAEPWithTimers";
import { RedLinesReference } from "./nsom/RedLinesReference";
import { LoadDomainDetector } from "./nsom/LoadDomainDetector";
import { WorkMode } from "./nsom/WorkMode";
import { TransitionMicroEvent, TransitionHistory } from "./nsom/TransitionArchitecture";
import { DefectLogger } from "./nsom/DefectLogger";

// ═══════════════════════════════════════════════════════════════
// MAIN NSOM APP v4
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

  // Journaling state
  const [journalEntry, setJournalEntry] = useState("");
  const [sensations, setSensations] = useState([]);
  const [loadDomain, setLoadDomain] = useState("");
  const [hrv, setHrv] = useState("");
  const [hr, setHr] = useState("");
  const [notes, setNotes] = useState("");
  const [burnout, setBurnout] = useState(null);

  // Data stores
  const [entries, setEntries] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [resets, setResets] = useState([]);
  const [redLineAlerts, setRedLineAlerts] = useState([]);
  const [workData, setWorkData] = useState({ days: [], dischargeTime: "17:00" });
  const [transitions, setTransitions] = useState([]);
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(STORAGE_ENTRIES) || "[]")); } catch {}
    try { setCheckins(JSON.parse(localStorage.getItem(STORAGE_CHECKINS) || "[]")); } catch {}
    try { setResets(JSON.parse(localStorage.getItem(STORAGE_RESETS) || "[]")); } catch {}
    try { setRedLineAlerts(JSON.parse(localStorage.getItem(STORAGE_REDLINES) || "[]")); } catch {}
    try { setWorkData(JSON.parse(localStorage.getItem(STORAGE_WORK) || '{"days":[],"dischargeTime":"17:00"}')); } catch {}
    try { setTransitions(JSON.parse(localStorage.getItem(STORAGE_TRANSITIONS) || "[]")); } catch {}
    try { setDefects(JSON.parse(localStorage.getItem(STORAGE_DEFECTS) || "[]")); } catch {}
    setLoading(false);
  }, []);

  const persist = useCallback((key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} }, []);

  function advanceStep() { if (step < 6) setStep(step + 1); else setGateReached(true); }

  function handleGateYes() { setGatePassed(true); }

  function handleGateNo() {
    if (attempt < 2) { setAttempt(2); setStep(1); setGateReached(false); }
    else {
      setEscalated(true);
      const e = { date: todayStr(), timeOfDay: timeOfDay(), sessionType: sessionType || "acute", gatePassed: false, escalated: true, attempts: 2, journal: null, sensations: [], loadDomain: "", hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: "", burnout, redLine: false };
      const updated = [...entries, e];
      setEntries(updated); persist(STORAGE_ENTRIES, updated);
    }
  }

  function handleJournalSave() {
    const e = { date: todayStr(), timeOfDay: timeOfDay(), sessionType: sessionType || "acute", gatePassed: true, escalated: false, attempts: attempt, journal: journalEntry.trim() || null, sensations, loadDomain, hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: notes.trim() || null, burnout, redLine: false };
    const updated = [...entries, e];
    setEntries(updated); persist(STORAGE_ENTRIES, updated);
    setSaved(true);
  }

  function handleJournalEscalate() {
    if (journalEntry.trim()) {
      const e = { date: todayStr(), timeOfDay: timeOfDay(), sessionType: sessionType || "acute", gatePassed: true, escalated: false, attempts: attempt, journal: journalEntry.trim(), sensations, loadDomain, hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: "Body escalated during journaling", burnout, redLine: false };
      const updated = [...entries, e];
      setEntries(updated); persist(STORAGE_ENTRIES, updated);
    }
    setSaved(true);
  }

  function resetLoop() {
    setStep(1); setBreathingActive(false); setGateReached(false); setGatePassed(false);
    setAttempt(1); setEscalated(false); setJournalEntry(""); setSensations([]);
    setLoadDomain(""); setHrv(""); setHr(""); setNotes(""); setSaved(false); setSessionType(null); setBurnout(null);
  }

  function applyFocus(e) { Object.assign(e.target.style, focusStyle); }
  function removeFocus(e) { e.target.style.outline = "none"; e.target.style.outlineOffset = ""; }

  const navItems = [
    { id: "loop", label: "Regulate", icon: "🔄" },
    { id: "work", label: "Work", icon: "⏱" },
    { id: "dgaep", label: "DGAEP", icon: "↑" },
    { id: "tracking", label: "Tracking", icon: "📈" },
    { id: "weekly", label: "Reset", icon: "🔄" },
    { id: "defects", label: "Defects", icon: "🔧" },
    { id: "analysis", label: "Analysis", icon: "🧠" },
    { id: "redlines", label: "Red Lines", icon: "📕" },
  ];

  const totalSteps = 6;
  const lastReset = resets.length > 0 ? resets[resets.length - 1] : null;

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
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: C.accent, marginBottom: 6 }}>The Nervous System Operating Manual</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.2, margin: 0 }}>Daily Regulation Protocol</h1>
          <p style={{ fontSize: 15, color: C.textMuted, fontStyle: "italic", margin: "6px 0 0" }}>Your body has a job. Its job is to keep you safe.</p>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <button role="switch" aria-checked={audioBreathing} onClick={async () => { if (!audioBreathing) try { await Tone.start(); } catch {} setAudioBreathing(!audioBreathing); }} style={{ width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: audioBreathing ? C.accentBtn : C.bgWarm, position: "relative", transition: "background 0.2s" }} onFocus={applyFocus} onBlur={removeFocus}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: audioBreathing ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </button>
            <span style={{ fontSize: 13, color: C.textMuted }}>Audio cues</span>
          </div>
        </div>
      </header>

      <nav aria-label="Main" style={{ borderBottom: `2px solid ${C.border}`, background: C.white, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setView(item.id); if (item.id === "loop") resetLoop(); }} aria-current={view === item.id ? "page" : undefined} style={{ padding: "14px 14px", minHeight: 48, border: "none", borderBottom: view === item.id ? `3px solid ${C.accent}` : "3px solid transparent", background: "transparent", color: view === item.id ? C.accent : C.textMuted, fontSize: 12, fontWeight: view === item.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }} onFocus={applyFocus} onBlur={removeFocus}>
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 18px 90px" }}>
        <RedLineMonitor entries={entries} checkins={checkins} onAcknowledge={t => { const u = [...redLineAlerts, { type: t, date: todayStr() }]; setRedLineAlerts(u); persist(STORAGE_REDLINES, u); }} activeAlerts={redLineAlerts} />

        {/* LOOP VIEW */}
        {view === "loop" && (
          <div>
            {!sessionType && !saved && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <DailyCheckIn checkins={checkins} onSave={c => { const u = [...checkins.filter(x => x.date !== c.date), c]; setCheckins(u); persist(STORAGE_CHECKINS, u); }} />
                <SessionTypeSelector onSelect={st => { setSessionType(st); if (st === "discharge") setGatePassed(true); }} />
              </div>
            )}

            {sessionType && (
              <div>
                <Callout type="info"><strong>Core Principle:</strong> No body change = no next step.</Callout>
                <div style={{ height: 16 }} />

                {!saved && !escalated && !gatePassed && (
                  <div style={{ marginBottom: 16 }}>
                    <ProgressIndicator current={Math.min(step, totalSteps)} total={totalSteps} label="Regulation loop" />
                  </div>
                )}

                {saved ? (
                  <div style={{ textAlign: "center", padding: "44px 22px" }} role="status">
                    <div style={{ fontSize: 48, marginBottom: 14 }}>◉</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.green, marginBottom: 8 }}>Entry Stored</div>
                    <p style={{ fontSize: 15, color: C.textMuted, margin: "0 0 24px" }}>Do not re-read.</p>
                    <Btn variant="secondary" onClick={resetLoop}>New session</Btn>
                  </div>
                ) : escalated ? (
                  <div style={{ textAlign: "center", padding: "44px 22px" }} role="alert">
                    <div style={{ fontSize: 48, marginBottom: 14 }}>↑</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.amber, marginBottom: 8 }}>Escalate to DGAEP</div>
                    <p style={{ fontSize: 15, color: C.textMuted, margin: "0 0 24px" }}>Not failure. Activation exceeds first-line capacity.</p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}><Btn onClick={() => setView("dgaep")}>Open DGAEP</Btn><Btn variant="secondary" onClick={resetLoop}>Reset</Btn></div>
                  </div>
                ) : gatePassed ? (
                  <JournalingSection entry={journalEntry} setEntry={setJournalEntry} sensations={sensations} setSensations={setSensations} loadDomain={loadDomain} setLoadDomain={setLoadDomain} hrv={hrv} setHrv={setHrv} hr={hr} setHr={setHr} notes={notes} setNotes={setNotes} onSave={handleJournalSave} sessionType={sessionType} onEscalate={handleJournalEscalate} burnout={burnout} setBurnout={setBurnout} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {attempt > 1 && <div role="alert" style={{ background: C.amberSoft, borderRadius: 10, padding: "12px 18px", fontSize: 14, color: C.amber, fontWeight: 600, textAlign: "center" }}>Second attempt — escalate if no change.</div>}
                    <StepCard number={1} title="Pause" why="Stop. Stand still 10 seconds." active={step === 1} completed={step > 1}><Btn small onClick={advanceStep}>Paused →</Btn></StepCard>
                    <StepCard number={2} title="Breathe" why="3 slow breaths: in 4, out 6." active={step === 2} completed={step > 2}>{!breathingActive && <Btn small onClick={() => setBreathingActive(true)}>Start</Btn>}<BreathingGuide active={breathingActive} audioEnabled={audioBreathing} onComplete={() => { setBreathingActive(false); advanceStep(); }} /></StepCard>
                    <StepCard number={3} title="Orient" why="Name 3 colours in the room." active={step === 3} completed={step > 3}><Btn small onClick={advanceStep}>Done →</Btn></StepCard>
                    <StepCard number={4} title="Body scan" why="Head to toe. Name sensations." active={step === 4} completed={step > 4}><Btn small onClick={advanceStep}>Scanned →</Btn></StepCard>
                    <StepCard number={5} title="Walk" why="10 slow steps. Count each." active={step === 5} completed={step > 5}><Btn small onClick={advanceStep}>Done →</Btn></StepCard>
                    <StepCard number={6} title="Second scan" why='What changed? "Not worse" counts.' active={step === 6} completed={gateReached}><Btn small onClick={advanceStep}>Gate →</Btn></StepCard>
                    {gateReached && !gatePassed && <DecisionGate onYes={handleGateYes} onNo={handleGateNo} attempt={attempt} />}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* WORK VIEW */}
        {view === "work" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <SectionHead icon="⏱" title="Work Mode" subtitle="90-minute ultradian cycles with meeting recovery and end-of-day discharge." />
            <WorkMode workData={workData} onSave={d => { setWorkData(d); persist(STORAGE_WORK, d); }} onNavigateToLoop={() => { resetLoop(); setView("loop"); }} />
            <TransitionMicroEvent transitions={transitions} onComplete={t => { const u = [...transitions, t]; setTransitions(u); persist(STORAGE_TRANSITIONS, u); }} />
            <TransitionHistory transitions={transitions} />
          </div>
        )}

        {/* DGAEP VIEW */}
        {view === "dgaep" && (
          <div>
            <SectionHead icon="↑" title="DGAEP" subtitle="When regulation fails, escalation is the next step." />
            <DGAEPWithTimers />
          </div>
        )}

        {/* TRACKING VIEW */}
        {view === "tracking" && (
          <div>
            <SectionHead icon="📈" title="Tracking" subtitle="The pattern matters." />
            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "44px 22px" }}><div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: C.textMuted }}>No entries yet</div></div>
            ) : (
              <>
                <DualChart entries={entries} />
                <div style={{ height: 22 }} />
                <HistoryView entries={entries} />
              </>
            )}
          </div>
        )}

        {/* WEEKLY VIEW */}
        {view === "weekly" && (
          <WeeklyResetFlow entries={entries} resets={resets} onComplete={d => { const u = [...resets, d]; setResets(u); persist(STORAGE_RESETS, u); setView("tracking"); }} onNavigateToLoop={() => { resetLoop(); setView("loop"); }} />
        )}

        {/* DEFECTS VIEW */}
        {view === "defects" && (
          <div>
            <SectionHead icon="🔧" title="Defect Log" subtitle="Structured post-mortems. Not failure — engineering data." />
            <DefectLogger defects={defects} onSave={d => { const u = [...defects, d]; setDefects(u); persist(STORAGE_DEFECTS, u); }} />
          </div>
        )}

        {/* ANALYSIS VIEW */}
        {view === "analysis" && (
          <div>
            <SectionHead icon="🧠" title="Analysis" />
            <LoadDomainDetector />
          </div>
        )}

        {/* RED LINES VIEW */}
        {view === "redlines" && (
          <div>
            <SectionHead icon="📕" title="Red Lines" subtitle="Non-negotiable structural load limits." />
            <RedLinesReference />
          </div>
        )}
      </main>

      <footer style={{ borderTop: `2px solid ${C.border}`, padding: "18px 22px", textAlign: "center", background: C.white }}>
        <div style={{ fontSize: 13, color: C.textMuted }}>NSOM — Yve Bergeron — Neurodiversity & Autism Studies, UCC</div>
        <div style={{ fontSize: 12, color: C.textLight, marginTop: 4, fontStyle: "italic" }}>The nervous system is the last interface.</div>
      </footer>
    </div>
  );
}
