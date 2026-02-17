"use client";

import { useState, useEffect, useRef } from "react";
import { C, SENSATIONS, CONTEXTS, LOAD_DOMAINS, focusStyle } from "./constants";
import { Btn, Chip, Callout } from "./BaseComponents";
import { AudioRecorder } from "./AudioRecorder";

// ═══════════════════════════════════════════════════════════════
// JOURNALING SECTION (v4 - unified layout)
// ═══════════════════════════════════════════════════════════════

export function JournalingSection({ entry, setEntry, sensations, setSensations, loadDomain, setLoadDomain, hrv, setHrv, hr, setHr, onSave, notes, setNotes, sessionType, onEscalate, burnout, setBurnout }) {
  const [mode, setMode] = useState("type");
  const [bodyCheckVisible, setBodyCheckVisible] = useState(false);
  const [bodyCheckDismissed, setBodyCheckDismissed] = useState(false);

  const toggleSensation = s => setSensations(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleContext = c => {
    const currentContexts = notes ? notes.split(", ").filter(Boolean) : [];
    const updated = currentContexts.includes(c) ? currentContexts.filter(x => x !== c) : [...currentContexts, c];
    setNotes(updated.join(", "));
  };

  useEffect(() => {
    if (bodyCheckDismissed) return;
    const t = setTimeout(() => {
      setBodyCheckVisible(true);
      setTimeout(() => setBodyCheckVisible(false), 15000);
    }, 90000);
    return () => clearTimeout(t);
  }, [bodyCheckDismissed]);

  const isDischarge = sessionType === "discharge";
  const isMorning = sessionType === "morning";

  function applyFocus(e) { Object.assign(e.target.style, focusStyle); }
  function removeFocus(e) { e.target.style.outline = "none"; e.target.style.outlineOffset = ""; }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} role="region" aria-label="Journaling">
      <div style={{ background: C.greenSoft, borderRadius: 10, padding: "12px 18px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 1.5 }}>
          {isDischarge ? "End-of-Day Discharge" : "Gate Passed — Journaling Unlocked"}
        </span>
      </div>

      <Callout type="neutral">
        <strong>Rules:</strong> Storage, not understanding. No decisions. No reviewing after. If body worsens, stop.
      </Callout>

      {isMorning && (
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Burnout Score (0–10)</label>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setBurnout(i)}
                aria-pressed={burnout === i}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  border: `2px solid ${burnout === i ? C.accent : C.borderLight}`,
                  background: burnout === i ? C.accentGlow : "transparent",
                  color: burnout === i ? C.accent : C.textMuted,
                  fontSize: 16,
                  fontWeight: burnout === i ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onFocus={applyFocus}
                onBlur={removeFocus}
              >
                {i}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.textLight, marginTop: 6 }}>0 = resourced, 10 = depleted</div>
        </div>
      )}

      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>Body sensations</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SENSATIONS.map(s => <Chip key={s} label={s} selected={sensations.includes(s)} onClick={() => toggleSensation(s)} />)}
        </div>
      </fieldset>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="ld" style={{ display: "block", fontSize: 14, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>Load Domain</label>
          <select id="ld" value={loadDomain} onChange={e => setLoadDomain(e.target.value)} style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg }} onFocus={applyFocus} onBlur={removeFocus}>
            <option value="">Select…</option>
            {LOAD_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hv" style={{ display: "block", fontSize: 14, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>HRV (ms)</label>
          <input id="hv" type="number" value={hrv} onChange={e => setHrv(e.target.value)} placeholder="38" style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box" }} onFocus={applyFocus} onBlur={removeFocus} />
        </div>
        <div>
          <label htmlFor="hrt" style={{ display: "block", fontSize: 14, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>HR (bpm)</label>
          <input id="hrt" type="number" value={hr} onChange={e => setHr(e.target.value)} placeholder="68" style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box" }} onFocus={applyFocus} onBlur={removeFocus} />
        </div>
      </div>

      <div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, background: C.bgDeep, borderRadius: 8, padding: 4 }} role="tablist">
          {[{ id: "type", label: "Type" }, { id: "audio", label: "Speak" }].map(m => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                padding: "12px 16px",
                minHeight: 44,
                border: "none",
                borderRadius: 6,
                background: mode === m.id ? C.white : "transparent",
                color: mode === m.id ? C.accent : C.textMuted,
                fontSize: 15,
                fontWeight: mode === m.id ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onFocus={applyFocus}
              onBlur={removeFocus}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "type" ? (
          <div>
            <label htmlFor="jt" style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
              {isDischarge ? "What is unfinished, pending, held" : "Describe — no analysis"}
            </label>
            <textarea
              id="jt"
              value={entry}
              onChange={e => setEntry(e.target.value)}
              placeholder={isDischarge ? "What work tasks are unfinished?" : '"Chest tight. Shoulders high." Description only.'}
              style={{
                width: "100%",
                minHeight: 110,
                padding: 16,
                border: `2px solid ${C.borderLight}`,
                borderRadius: 10,
                fontSize: 15,
                fontFamily: "'Source Serif 4', Georgia, serif",
                color: C.text,
                background: C.bg,
                resize: "vertical",
                lineHeight: 1.7,
                boxSizing: "border-box",
              }}
              onFocus={applyFocus}
              onBlur={removeFocus}
            />
          </div>
        ) : (
          <AudioRecorder onTranscript={t => setEntry(t)} />
        )}
      </div>

      {!isDischarge && (
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>Context</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CONTEXTS.map(c => (
              <Chip key={c} label={c} selected={(notes || "").split(", ").includes(c)} onClick={() => toggleContext(c)} />
            ))}
          </div>
        </fieldset>
      )}

      {/* Body Check Alert */}
      {bodyCheckVisible && (
        <div role="alert" aria-live="polite" style={{ background: C.amberSoft, border: `2px solid ${C.amber}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>Quick check — body still OK?</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn small variant="green" onClick={() => { setBodyCheckVisible(false); setBodyCheckDismissed(true); }}>Still OK</Btn>
            <Btn small variant="amber" onClick={() => { setBodyCheckVisible(false); onEscalate?.(); }}>Escalating</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <span style={{ fontSize: 14, color: C.textLight }}>Store. Save and close. Do not re-read.</span>
        <Btn onClick={onSave}>Store &amp; Close</Btn>
      </div>
    </div>
  );
}
