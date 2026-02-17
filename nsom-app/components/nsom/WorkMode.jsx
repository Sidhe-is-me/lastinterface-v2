"use client";

import { useState, useEffect, useRef } from "react";
import { C } from "./constants";
import { Btn, OptionButton } from "./BaseComponents";
import { todayStr, timeStr, daysAgo } from "./utils";

// ═══════════════════════════════════════════════════════════════
// WORK MODE - 90-minute cycles, meeting recovery, discharge
// ═══════════════════════════════════════════════════════════════

export function WorkMode({ workData, onSave, onNavigateToLoop }) {
  const [cycleRunning, setCycleRunning] = useState(false);
  const [cycleElapsed, setCycleElapsed] = useState(0);
  const [cyclePrompt, setCyclePrompt] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState("");
  const [meetingIntensity, setMeetingIntensity] = useState("");
  const [recoveryActive, setRecoveryActive] = useState(false);
  const [recoveryElapsed, setRecoveryElapsed] = useState(0);
  const [dischargeTime, setDischargeTime] = useState(workData.dischargeTime || "17:00");
  const cycleRef = useRef(null);
  const recoveryRef = useRef(null);

  // Today's work data
  const todayData = workData.days?.find(d => d.date === todayStr()) || { date: todayStr(), cycles: 0, cyclesWithBreak: 0, meetings: [], dischargeCompleted: false };

  // 90-minute cycle timer
  useEffect(() => {
    if (!cycleRunning) { clearInterval(cycleRef.current); return; }
    cycleRef.current = setInterval(() => {
      setCycleElapsed(e => {
        if (e >= 5400) { // 90 minutes
          setCyclePrompt(true); setCycleRunning(false);
          return 0;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(cycleRef.current);
  }, [cycleRunning]);

  // Recovery buffer timer
  useEffect(() => {
    if (!recoveryActive) { clearInterval(recoveryRef.current); return; }
    recoveryRef.current = setInterval(() => {
      setRecoveryElapsed(e => { if (e >= 600) { setRecoveryActive(false); return 0; } return e + 1; });
    }, 1000);
    return () => clearInterval(recoveryRef.current);
  }, [recoveryActive]);

  function handleCycleAcknowledge(didRegulate) {
    setCyclePrompt(false);
    const updated = { ...todayData, cycles: todayData.cycles + 1, cyclesWithBreak: todayData.cyclesWithBreak + (didRegulate ? 1 : 0) };
    saveDay(updated);
    if (didRegulate) onNavigateToLoop?.();
    else setCycleRunning(true); // restart
  }

  function handleLogMeeting() {
    if (!meetingDuration) return;
    const dur = Number(meetingDuration);
    const meeting = { time: timeStr(), duration: dur, intensity: meetingIntensity || "medium" };
    const updated = { ...todayData, meetings: [...(todayData.meetings || []), meeting] };
    saveDay(updated);
    setMeetingDuration(""); setMeetingIntensity("");
    if (dur >= 30) { setRecoveryActive(true); setRecoveryElapsed(0); }
  }

  function saveDay(dayData) {
    const days = (workData.days || []).filter(d => d.date !== todayStr());
    days.push(dayData);
    onSave({ ...workData, days, dischargeTime });
  }

  // Weekly stats
  const weekDays = (workData.days || []).filter(d => daysAgo(d.date) <= 7);
  const totalCycles = weekDays.reduce((s, d) => s + (d.cycles || 0), 0);
  const totalWithBreak = weekDays.reduce((s, d) => s + (d.cyclesWithBreak || 0), 0);
  const totalMeetings = weekDays.reduce((s, d) => s + (d.meetings?.length || 0), 0);
  const dischargeRate = weekDays.length > 0 ? Math.round((weekDays.filter(d => d.dischargeCompleted).length / weekDays.length) * 100) : 0;

  const cycleMin = Math.floor(cycleElapsed / 60); const cycleSec = cycleElapsed % 60;
  const recMin = Math.floor((600 - recoveryElapsed) / 60); const recSec = (600 - recoveryElapsed) % 60;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Cycle prompt overlay */}
      {cyclePrompt && (
        <div role="alertdialog" aria-label="90-minute cycle complete" style={{ background: `linear-gradient(135deg, ${C.accentGlow}, ${C.amberSoft})`, border: `3px solid ${C.accent}`, borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>90-minute cycle complete</div>
          <p style={{ fontSize: 15, color: C.textMuted, margin: "0 0 22px", lineHeight: 1.6 }}>Cognitive performance operates in 90-minute ultradian cycles. Take a deliberate regulation break. This is not optional — it is nervous system maintenance.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="green" onClick={() => handleCycleAcknowledge(true)}>Take regulation break</Btn>
            <Btn variant="secondary" onClick={() => handleCycleAcknowledge(false)}>Skip this time</Btn>
          </div>
        </div>
      )}

      {/* Active timer */}
      <div style={{ background: C.white, border: `2px solid ${cycleRunning ? C.accent : C.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Ultradian Cycle Timer</h3>
        {cycleRunning ? (
          <div>
            <div role="timer" aria-label={`Work cycle: ${cycleMin} minutes elapsed`} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 42, fontWeight: 700, color: C.accent }}>{cycleMin}:{cycleSec.toString().padStart(2, "0")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: C.bgDeep, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(cycleElapsed / 5400) * 100}%`, background: C.accentDeco, borderRadius: 4, transition: "width 1s linear" }} />
                </div>
                <div style={{ fontSize: 13, color: C.textLight, marginTop: 6 }}>{90 - cycleMin} min until regulation break</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}><Btn small variant="secondary" onClick={() => { setCycleRunning(false); setCycleElapsed(0); }}>End cycle</Btn></div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 12px" }}>Start a 90-minute focused work cycle. The app will prompt a regulation break when the timer completes.</p>
            <Btn onClick={() => { setCycleRunning(true); setCycleElapsed(0); }}>Start work cycle</Btn>
          </div>
        )}
      </div>

      {/* Meeting recovery */}
      {recoveryActive && (
        <div role="alert" style={{ background: C.blueSoft, border: `2px solid ${C.blue}`, borderRadius: 14, padding: "18px 22px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 700, color: C.blue, marginBottom: 6 }}>Meeting recovery buffer</div>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 8px" }}>The NSOM says: allow a minimum 10-minute buffer before beginning cognitive work after a 30+ minute meeting.</p>
          <div role="timer" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.blue }}>{recMin}:{recSec.toString().padStart(2, "0")} remaining</div>
          <div style={{ marginTop: 10 }}><Btn small variant="ghost" onClick={() => onNavigateToLoop?.()}>Use buffer for regulation loop</Btn></div>
        </div>
      )}

      {/* Meeting logger */}
      <div style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Log a Meeting</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label htmlFor="mtg-dur" style={{ display: "block", fontSize: 13, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>Duration (min)</label>
            <input id="mtg-dur" type="number" value={meetingDuration} onChange={e => setMeetingDuration(e.target.value)} placeholder="30" style={{ width: 80, padding: "12px 14px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg, boxSizing: "border-box" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>Intensity</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Low", "Medium", "High"].map(i => <OptionButton key={i} label={i} selected={meetingIntensity === i.toLowerCase()} onClick={() => setMeetingIntensity(i.toLowerCase())} />)}
            </div>
          </div>
          <Btn small onClick={handleLogMeeting} disabled={!meetingDuration}>Log meeting</Btn>
        </div>
        {todayData.meetings?.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 13, color: C.textLight, marginBottom: 6 }}>Today's meetings</div>
            {todayData.meetings.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: i < todayData.meetings.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                <span style={{ fontSize: 14, color: C.text }}>{m.time}</span>
                <span style={{ fontSize: 14, color: C.textMuted }}>{m.duration} min</span>
                <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 12, background: m.intensity === "high" ? C.redSoft : m.intensity === "medium" ? C.amberSoft : C.greenSoft, color: m.intensity === "high" ? C.red : m.intensity === "medium" ? C.amber : C.green }}>{m.intensity}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discharge time config */}
      <div style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>End-of-Day Discharge</h3>
            <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>Work-related cognitive loops do not stop at 5 PM.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label htmlFor="discharge-time" style={{ fontSize: 13, color: C.textLight }}>Trigger at:</label>
            <input id="discharge-time" type="time" value={dischargeTime} onChange={e => { setDischargeTime(e.target.value); onSave({ ...workData, dischargeTime: e.target.value }); }}
              style={{ padding: "10px 12px", minHeight: 44, borderRadius: 8, border: `2px solid ${C.borderLight}`, fontSize: 15, fontFamily: "inherit", color: C.text, background: C.bg }} />
          </div>
        </div>
      </div>

      {/* Weekly work stats */}
      <div style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Work Stats (7 days)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          <div style={{ background: C.accentGlow, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.accent }}>{totalCycles}</div><div style={{ fontSize: 12, color: C.textMuted }}>Cycles</div>
          </div>
          <div style={{ background: totalCycles > 0 ? C.greenSoft : C.bgDeep, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.green }}>{totalCycles > 0 ? Math.round((totalWithBreak / totalCycles) * 100) : 0}%</div><div style={{ fontSize: 12, color: C.textMuted }}>Break compliance</div>
          </div>
          <div style={{ background: C.blueSoft, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.blue }}>{totalMeetings}</div><div style={{ fontSize: 12, color: C.textMuted }}>Meetings</div>
          </div>
          <div style={{ background: C.amberSoft, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.amber }}>{dischargeRate}%</div><div style={{ fontSize: 12, color: C.textMuted }}>Discharge rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
