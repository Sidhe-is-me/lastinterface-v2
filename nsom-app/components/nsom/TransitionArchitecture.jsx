"use client";

import { useState, useEffect, useRef } from "react";
import { C, TRANSITION_ACTIVITIES } from "./constants";
import { Btn, ProgressIndicator, OptionButton } from "./BaseComponents";
import { todayStr, timeStr } from "./utils";

// ═══════════════════════════════════════════════════════════════
// TRANSITION ARCHITECTURE - Micro-event protocol
// ═══════════════════════════════════════════════════════════════

export function TransitionMicroEvent({ transitions, onComplete }) {
  const [phase, setPhase] = useState(0); // 0=close, 1=orient, 2=stabilise, 3=begin
  const [closing, setClosing] = useState("");
  const [orienting, setOrienting] = useState("");
  const [breathActive, setBreathActive] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const phases = [
    { name: "Close", q: "What are you finishing?", options: TRANSITION_ACTIVITIES },
    { name: "Orient", q: "What's next?", options: TRANSITION_ACTIVITIES },
    { name: "Stabilise", q: "One breath.", options: null },
    { name: "Begin", q: "Ready to start.", options: null },
  ];

  function handleSelect(value) {
    if (phase === 0) { setClosing(value); setPhase(1); }
    else if (phase === 1) { setOrienting(value); setPhase(2); setBreathActive(true); }
  }

  function handleBreathComplete() {
    setBreathActive(false); setPhase(3);
  }

  function handleBegin() {
    const event = { date: todayStr(), time: timeStr(), closing, orienting, timestamp: Date.now() };
    onComplete(event);
    setCompleted(true);
  }

  function reset() { setPhase(0); setClosing(""); setOrienting(""); setBreathActive(false); setStarted(false); setCompleted(false); }

  if (completed) return (
    <div style={{ textAlign: "center", padding: "32px 20px", background: C.greenSoft, borderRadius: 14 }}>
      <div style={{ fontSize: 15, color: C.green, fontWeight: 600 }}>✓ Transition complete: {closing} → {orienting}</div>
      <div style={{ marginTop: 12 }}><Btn small variant="secondary" onClick={reset}>New transition</Btn></div>
    </div>
  );

  if (!started) return (
    <div style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 22px", textAlign: "center" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Transition</h3>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 16px", lineHeight: 1.6 }}>Four taps, ten seconds. Prevents the executive function freefall between activities.</p>
      <Btn onClick={() => setStarted(true)}>Start transition</Btn>
    </div>
  );

  return (
    <div style={{ background: C.white, border: `2px solid ${C.accent}`, borderRadius: 14, padding: "22px 24px" }}>
      <ProgressIndicator current={phase + 1} total={4} label="Transition" />
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: C.accent, marginBottom: 6 }}>
          {phases[phase].name}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 14 }}>
          {phases[phase].q}
        </div>

        {/* Phase 0 & 1: Activity selection */}
        {(phase === 0 || phase === 1) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {phases[phase].options.map(o => (
              <OptionButton key={o} label={o} selected={phase === 0 ? closing === o : orienting === o} onClick={() => handleSelect(o)} />
            ))}
          </div>
        )}

        {/* Phase 2: One breath */}
        {phase === 2 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <MiniBreath active={breathActive} onComplete={handleBreathComplete} />
          </div>
        )}

        {/* Phase 3: Begin */}
        {phase === 3 && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, color: C.textMuted, margin: "0 0 16px" }}>{closing} → {orienting}</p>
            <Btn variant="green" onClick={handleBegin}>Begin</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniBreath({ active, onComplete }) {
  const [phase, setPhase] = useState("in"); const [count, setCount] = useState(4);
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    setPhase("in"); setCount(4);
    ref.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          if (phase === "in") { setPhase("out"); return 6; }
          clearInterval(ref.current); onComplete?.(); return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [active, phase]);

  if (!active) return <Btn onClick={onComplete}>Skip breath</Btn>;
  const sz = phase === "in" ? 80 : 50;
  return (
    <div role="timer" aria-live="polite" aria-label={`${phase === "in" ? "Inhale" : "Exhale"}, ${count}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ width: sz, height: sz, borderRadius: "50%", background: C.accentGlow, border: `2px solid ${C.accentDeco}`, transition: "all 0.8s", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: C.accent, fontWeight: 700 }}>{count}</span>
      </div>
      <span style={{ fontSize: 15, color: C.textMuted, fontStyle: "italic" }}>{phase === "in" ? "In…" : "Out…"}</span>
    </div>
  );
}

// Transition pattern display
export function TransitionHistory({ transitions }) {
  const recent = [...transitions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
  if (recent.length === 0) return null;

  // Frequency analysis
  const closingCounts = {}; const orientingCounts = {};
  transitions.filter(t => {
    const tDate = new Date(t.date + "T12:00:00");
    const now = new Date();
    const diffDays = Math.floor((now - tDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).forEach(t => {
    closingCounts[t.closing] = (closingCounts[t.closing] || 0) + 1;
    orientingCounts[t.orienting] = (orientingCounts[t.orienting] || 0) + 1;
  });
  const hardest = Object.entries(closingCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Transition Patterns</h3>
      {hardest && <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 14 }}>Most frequent transition from: <strong style={{ color: C.accent }}>{hardest[0]}</strong> ({hardest[1]}x this week)</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {recent.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < recent.length - 1 ? `1px solid ${C.borderLight}` : "none", fontSize: 14 }}>
            <span style={{ color: C.textLight, minWidth: 80 }}>{t.time}</span>
            <span style={{ color: C.text }}>{t.closing}</span>
            <span style={{ color: C.textLight }}>→</span>
            <span style={{ color: C.text }}>{t.orienting}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
