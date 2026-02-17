"use client";

import { useState } from "react";
import { C, DEFECT_CAUSES } from "./constants";
import { Btn, OptionButton } from "./BaseComponents";
import { todayStr, timeStr, friendlyDate } from "./utils";

// ═══════════════════════════════════════════════════════════════
// DEFECT LOGGER - Behavioral debugging with AI analysis
// ═══════════════════════════════════════════════════════════════

export function DefectLogger({ defects, onSave }) {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [customCause, setCustomCause] = useState("");
  const [corrective, setCorrective] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  function handleSave() {
    const defect = {
      id: Date.now(), date: todayStr(), time: timeStr(),
      description, expected, actual,
      rootCause: rootCause === "Custom" ? customCause : rootCause,
      corrective, timestamp: Date.now(),
    };
    onSave(defect);
    setDescription(""); setExpected(""); setActual(""); setRootCause(""); setCustomCause(""); setCorrective("");
    setShowForm(false);
  }

  async function analyseDefects() {
    if (defects.length === 0) return;
    setAnalysisLoading(true);
    try {
      const sp = `You are trained on the NSOM framework. Analyse defect logs from a neurodivergent person's behavioural debugging system. Look for recurring root causes and patterns. Suggest preventive controls. Respond JSON only:
{"recurring_causes":["cause 1","cause 2"],"patterns":["pattern"],"preventive_actions":["action"],"summary":"3-4 sentences"}`;
      const data = defects.slice(-20).map(d => `${d.date} ${d.time}: ${d.description} | Expected: ${d.expected} | Actual: ${d.actual} | Cause: ${d.rootCause} | Fix: ${d.corrective}`).join("\n");
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sp, messages: [{ role: "user", content: `Defect logs:\n\n${data}` }] }) });
      const d = await r.json(); const t = d.content?.map(b => b.text || "").join("\n") || "";
      setAnalysisResult(JSON.parse(t.replace(/```json|```/g, "").trim()));
    } catch { setAnalysisResult({ summary: "Unable to analyse.", recurring_causes: [], patterns: [], preventive_actions: [] }); }
    setAnalysisLoading(false);
  }

  const sorted = [...defects].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {!showForm ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn onClick={() => setShowForm(true)}>Log a defect</Btn>
          {defects.length >= 3 && <Btn variant="secondary" onClick={analyseDefects} disabled={analysisLoading}>{analysisLoading ? "Analysing…" : `Analyse ${defects.length} defects`}</Btn>}
        </div>
      ) : (
        <div style={{ background: C.white, border: `2px solid ${C.accent}`, borderRadius: 14, padding: "22px 24px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>New Defect Log</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label htmlFor="df-what" style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>What happened?</label>
              <textarea id="df-what" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the event" style={{ width: "100%", minHeight: 60, padding: 14, border: `2px solid ${C.borderLight}`, borderRadius: 8, fontSize: 15, fontFamily: "'Source Serif 4', Georgia, serif", color: C.text, background: C.bg, resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="df-exp" style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>Expected</label>
                <input id="df-exp" value={expected} onChange={e => setExpected(e.target.value)} placeholder="What you planned" style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box" }} />
              </div>
              <div>
                <label htmlFor="df-act" style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>Actual</label>
                <input id="df-act" value={actual} onChange={e => setActual(e.target.value)} placeholder="What happened" style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box" }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Suspected root cause</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {DEFECT_CAUSES.map(c => <OptionButton key={c} label={c} selected={rootCause === c} onClick={() => setRootCause(c)} />)}
              </div>
              {rootCause === "Custom" && <input value={customCause} onChange={e => setCustomCause(e.target.value)} placeholder="Describe the cause" style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box", marginTop: 8 }} />}
            </div>
            <div>
              <label htmlFor="df-fix" style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>Corrective action (one concrete change)</label>
              <input id="df-fix" value={corrective} onChange={e => setCorrective(e.target.value)} placeholder="One specific thing to change" style={{ width: "100%", padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={handleSave} disabled={!description.trim()}>Save defect</Btn>
              <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Analysis results */}
      {analysisResult && (
        <div style={{ background: C.bgDeep, borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 14 }}>{analysisResult.summary}</div>
          {analysisResult.recurring_causes?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Recurring causes</div>
              {analysisResult.recurring_causes.map((c, i) => <div key={i} style={{ fontSize: 14, color: C.text, paddingLeft: 14, borderLeft: `3px solid ${C.red}`, marginBottom: 6 }}>{c}</div>)}
            </div>
          )}
          {analysisResult.preventive_actions?.length > 0 && (
            <div style={{ padding: 14, background: C.greenSoft, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 6 }}>Preventive actions</div>
              {analysisResult.preventive_actions.map((a, i) => <div key={i} style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{a}</div>)}
            </div>
          )}
        </div>
      )}

      {/* Defect list */}
      {sorted.length > 0 && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>{sorted.length} defects logged</div>
          {sorted.slice(0, 15).map((d, i) => (
            <div key={d.id} style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 10, padding: "14px 18px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{friendlyDate(d.date)} · {d.time}</span>
                <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 12, background: C.amberSoft, color: C.amber }}>{d.rootCause}</span>
              </div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 6 }}>{d.description}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                <div><span style={{ color: C.textLight }}>Expected:</span> <span style={{ color: C.textMuted }}>{d.expected}</span></div>
                <div><span style={{ color: C.textLight }}>Actual:</span> <span style={{ color: C.textMuted }}>{d.actual}</span></div>
              </div>
              {d.corrective && <div style={{ marginTop: 8, padding: "8px 12px", background: C.greenSoft, borderRadius: 8, fontSize: 13, color: C.green }}><strong>Fix:</strong> {d.corrective}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
