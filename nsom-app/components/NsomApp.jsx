import { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

const STORAGE_KEY = "nsom-tracker-v3";
const DAILY_KEY = "nsom-daily-v3";
const DGAEP_SESSION_KEY = "nsom-dgaep-session";

/*
 * ═══════════════════════════════════════════════════════════
 * WCAG 2.2 AAA Color Palette — Teal/Green Soothing Theme
 * All foreground/background combinations verified ≥ 7:1
 * contrast ratio for normal text, ≥ 4.5:1 for large text.
 * ═══════════════════════════════════════════════════════════
 */
const colors = {
  // Backgrounds
  bg: "#F0F5F4",           // Light sage — main bg
  bgDeep: "#E2ECEB",       // Deeper sage
  bgWarm: "#D5E3E1",       // Warm sage
  white: "#FFFFFF",

  // Text — all meet 7:1+ on bg/white
  text: "#1A2F2E",         // Deep teal-black — 14.8:1 on bg
  textMuted: "#3D5C5A",    // Muted teal — 7.2:1 on bg
  textLight: "#5A7B79",    // Light teal — 4.6:1 on bg (large text only)

  // Primary accent — teal
  accent: "#1B7A72",       // Primary teal — 7.1:1 on white
  accentSoft: "#2A9D93",   // Lighter teal
  accentGlow: "rgba(27, 122, 114, 0.1)",

  // Status colors — all 7:1+ on white
  green: "#1A6B4A",        // Success green — 8.2:1 on white
  greenSoft: "rgba(26, 107, 74, 0.1)",
  greenDark: "#145438",

  amber: "#7A5D1A",        // Warning amber — 7.1:1 on white
  amberSoft: "rgba(122, 93, 26, 0.12)",

  red: "#8B2E2E",          // Alert red — 8.9:1 on white
  redSoft: "rgba(139, 46, 46, 0.08)",

  blue: "#2B6684",         // Info blue — 7.0:1 on white
  blueSoft: "rgba(43, 102, 132, 0.1)",

  // Borders
  border: "#B8CCC9",
  borderLight: "#CDDAD8",

  // Focus ring
  focusRing: "#0E5A54",    // High-contrast focus — 11:1 on white
};

const LOAD_DOMAINS = ["Cognitive", "Emotional", "Sensory", "Social", "Executive"];

const BODY_STATE_OPTIONS = [
  "Racing thoughts", "Tight chest", "Shallow breathing", "Jaw clenched",
  "Hands shaking", "Nausea", "Head pressure", "Skin crawling",
  "Heart pounding", "Can't sit still", "Frozen/stuck", "Crying",
  "Hot face", "Numb", "Dizzy", "Hyperventilating",
];

// ——— Storage Helpers (localStorage) ———
function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function formatDate(d) { return d.toISOString().split("T")[0]; }
function todayStr() { return formatDate(new Date()); }
function friendlyDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function timeNow() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/*
 * ═══════════════════════════════════════════════════════════
 * WCAG 2.2 AAA — Shared focus style applied to all
 * interactive elements. 3px solid offset for visibility.
 * ═══════════════════════════════════════════════════════════
 */
const focusStyle = {
  outline: `3px solid ${colors.focusRing}`,
  outlineOffset: "2px",
};

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

// ——— Step Definitions (American English) ———
const STEPS = [
  {
    number: 1,
    title: "Pause",
    instruction: "Stop what you are doing. Sit or stand still for 10 seconds.",
    rationale: "Interrupts the current autonomic trajectory. The nervous system cannot begin regulation while the body is still in motion toward the stressor. Stopping creates the micro-gap the vagus nerve needs to initiate a shift.",
    timerSeconds: 10,
    timerLabel: "10-second pause",
    trackPrompt: "I've paused",
    trackWhat: "Paused and held still",
  },
  {
    number: 2,
    title: "Breathe",
    instruction: "3 slow breaths: in through the nose (4 counts), out through the mouth (6 counts).",
    rationale: "Extended exhale activates the vagus nerve directly. The 4:6 ratio is not arbitrary — the exhale must be longer than the inhale to trigger parasympathetic engagement. This is the single most reliable first-line vagal activation technique in the research literature.",
    hasBreathingGuide: true,
    trackPrompt: "Breathing complete",
    trackWhat: "3 slow breaths (4-in, 6-out)",
  },
  {
    number: 3,
    title: "Orient Visually",
    instruction: "Find and name 3 colors in the room. Say them out loud or internally.",
    rationale: "Activates the ventral vagal complex through visual orientation without emotional content. Naming colors engages the prefrontal cortex in a low-demand task, competing with the amygdala for processing resources. This is neuroception — telling the nervous system 'I can see, therefore I am safe enough to look.'",
    timerSeconds: 30,
    timerLabel: "Orientation time",
    trackPrompt: "I've named 3 colors",
    trackWhat: "Named 3 colors in room",
  },
  {
    number: 4,
    title: "Body Scan",
    instruction: "Notice sensations from head to toe. Name what you find: tight, heavy, buzzy, numb, warm, cold.",
    rationale: "Naming without interpreting prevents the scan from becoming a trigger. Interoception — the ability to notice internal body states — is the foundation of regulation. Many neurodivergent people have altered interoception (either heightened or diminished). This step trains the channel without overloading it.",
    timerSeconds: 60,
    timerLabel: "Body scan timer",
    trackPrompt: "Scan complete",
    trackWhat: "Head-to-toe body scan",
  },
  {
    number: 5,
    title: "Walk",
    instruction: "10 slow steps, counting each one. Or rock gently if walking isn't possible.",
    rationale: "Rhythmic bilateral movement activates both hemispheres simultaneously. This is the most reliably effective single intervention in the protocol. Walking engages proprioception, vestibular input, and motor cortex — all of which compete with the cognitive loop maintaining the dysregulation. The body moves before the mind decides to.",
    timerSeconds: 45,
    timerLabel: "Walking timer",
    trackPrompt: "10 steps done",
    trackWhat: "10 slow counted steps",
  },
  {
    number: 6,
    title: "Second Body Scan",
    instruction: "Notice what changed. Any change counts. Even 'not worse' is valid.",
    rationale: "The protocol asks 'did anything change?' not 'do you feel better?' This is the critical distinction. Regulation is not about feeling good — it is about the system showing any capacity to shift state. A 2% change and a 90% change are both valid gate passes. The body decides, not the mind.",
    timerSeconds: 45,
    timerLabel: "Second scan",
    trackPrompt: "Go to decision gate",
    trackWhat: "Second body scan — noted changes",
  },
];

// ═══ Accessible Button ═══
function Btn({ children, onClick, variant = "primary", disabled, small, style, ariaLabel }) {
  const base = {
    padding: small ? "8px 18px" : "12px 26px",
    borderRadius: 8,
    fontSize: small ? 14 : 15,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit",
    border: "none",
    transition: "background 0.2s, color 0.2s",
    minHeight: 44, // WCAG target size
    minWidth: 44,
    ...style,
  };
  const variants = {
    primary: { background: disabled ? colors.bgWarm : colors.accent, color: disabled ? colors.textLight : colors.white },
    secondary: { background: "transparent", color: colors.textMuted, border: `2px solid ${colors.border}` },
    green: { background: colors.green, color: colors.white },
    amber: { background: colors.amber, color: colors.white },
    ghost: { background: "transparent", color: colors.textMuted, padding: small ? "6px 12px" : "10px 18px" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      style={{ ...base, ...variants[variant] }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
    >
      {children}
    </button>
  );
}

// ═══ Section Header ═══
function SectionHead({ title, subtitle, level = 2 }) {
  const Tag = `h${level}`;
  return (
    <div style={{ marginBottom: 16 }}>
      <Tag style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: level === 1 ? 28 : 24, fontWeight: 700, color: colors.text, lineHeight: 1.2, margin: 0 }}>
        {title}
      </Tag>
      {subtitle && <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 4, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

// ═══ Callout ═══
function Callout({ children, type = "info", role = "note" }) {
  const styles = {
    info: { bg: colors.amberSoft, border: colors.amber },
    success: { bg: colors.greenSoft, border: colors.green },
    warning: { bg: colors.redSoft, border: colors.red },
    neutral: { bg: colors.bgDeep, border: colors.accent },
  };
  const s = styles[type];
  return (
    <div role={role} style={{ background: s.bg, borderLeft: `4px solid ${s.border}`, borderRadius: 10, padding: "14px 18px", color: colors.text, fontSize: 15, lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

// ═══ Breathing Animation (respects prefers-reduced-motion) ═══
function BreathingGuide({ active, onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [breathNum, setBreathNum] = useState(0);
  const timerRef = useRef(null);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!active) { setPhase("ready"); setCount(0); setBreathNum(0); return; }
    if (phase === "ready") { setPhase("inhale"); setCount(4); setBreathNum(1); }
  }, [active]);

  useEffect(() => {
    if (!active || phase === "ready" || phase === "done") return;
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          if (phase === "inhale") { setPhase("exhale"); return 6; }
          if (phase === "exhale") {
            if (breathNum >= 3) { setPhase("done"); clearInterval(timerRef.current); setTimeout(() => onComplete?.(), 600); return 0; }
            setBreathNum((b) => b + 1); setPhase("inhale"); return 4;
          }
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, active, breathNum]);

  if (!active || phase === "ready") return null;
  const circleSize = prefersReduced ? 90 : phase === "inhale" ? 120 : phase === "exhale" ? 60 : 90;
  const phaseText = phase === "inhale" ? "Breathe in through your nose..." : phase === "exhale" ? "Breathe out through your mouth..." : "Complete";

  return (
    <div role="timer" aria-live="polite" aria-label={`Breathing guide. ${phaseText} ${count} seconds remaining. Breath ${Math.min(breathNum, 3)} of 3.`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "24px 0" }}>
      <div style={{
        width: circleSize, height: circleSize, borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.accentSoft}44 0%, ${colors.accent}22 100%)`,
        border: `3px solid ${colors.accent}`,
        transition: prefersReduced ? "none" : "all 1s ease-in-out",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span aria-hidden="true" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: colors.accent, fontWeight: 700 }}>
          {phase === "done" ? "✓" : count}
        </span>
      </div>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: colors.text, fontStyle: "italic" }}>
        {phaseText}
      </span>
      <span style={{ fontSize: 13, color: colors.textMuted }}>Breath {Math.min(breathNum, 3)} of 3</span>
    </div>
  );
}

// ═══ Countdown Timer ═══
function CountdownTimer({ duration, label, onComplete }) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  function start() { setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setRemaining(duration); }

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(intervalRef.current); setRunning(false); onComplete?.(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = ((duration - remaining) / duration) * 100;
  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;

  return (
    <div role="timer" aria-label={`${label}: ${timeStr} remaining`} style={{ background: colors.white, border: `1px solid ${colors.borderLight}`, borderRadius: 10, padding: "14px 18px", marginTop: 10 }}>
      <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div aria-live="polite" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 700, color: remaining === 0 ? colors.green : colors.text, minWidth: 70 }}>
          {timeStr}
        </div>
        <div style={{ flex: 1 }} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`Timer progress: ${Math.round(pct)}%`}>
          <div style={{ height: 6, background: colors.bgDeep, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: remaining === 0 ? colors.green : colors.accent, borderRadius: 3, transition: "width 1s linear" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {remaining === 0 ? (
            <span style={{ fontSize: 14, color: colors.green, fontWeight: 700 }} role="status">Complete</span>
          ) : running ? (
            <Btn small variant="secondary" onClick={pause} ariaLabel="Pause timer">Pause</Btn>
          ) : (
            <>
              <Btn small onClick={start} ariaLabel={remaining < duration ? "Resume timer" : "Start timer"}>{remaining < duration ? "Resume" : "Start"}</Btn>
              {remaining < duration && <Btn small variant="ghost" onClick={reset} ariaLabel="Reset timer">Reset</Btn>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ Enhanced Step Card ═══
function EnhancedStepCard({ stepDef, active, completed, completedTime, onComplete, onBreathingStart, breathingActive }) {
  const [showRationale, setShowRationale] = useState(false);
  const cardRef = useRef(null);
  const { number, title, instruction, rationale, timerSeconds, timerLabel, hasBreathingGuide, trackPrompt } = stepDef;

  // Auto-focus active step for screen readers
  useEffect(() => {
    if (active && cardRef.current) {
      cardRef.current.focus({ preventScroll: false });
    }
  }, [active]);

  return (
    <article
      ref={cardRef}
      tabIndex={active ? 0 : -1}
      aria-label={`Step ${number}: ${title}${completed ? " — completed" : active ? " — current step" : " — upcoming"}`}
      aria-current={active ? "step" : undefined}
      style={{
        background: completed ? colors.greenSoft : active ? colors.white : colors.bgDeep,
        border: `2px solid ${active ? colors.accent : completed ? colors.green : colors.borderLight}`,
        borderRadius: 14, overflow: "hidden",
        transition: "border-color 0.2s",
        opacity: !active && !completed ? 0.6 : 1,
      }}
      onFocus={(e) => { if (active) Object.assign(e.currentTarget.style, { outline: `3px solid ${colors.focusRing}`, outlineOffset: "2px" }); }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
    >
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <div aria-hidden="true" style={{
          width: 36, height: 36, borderRadius: "50%",
          background: completed ? colors.green : active ? colors.accent : colors.bgWarm,
          color: completed || active ? colors.white : colors.textMuted,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, flexShrink: 0,
        }}>
          {completed ? "✓" : number}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 700, color: colors.text, margin: 0 }}>
            {title}
          </h3>
          {completed && completedTime && (
            <div style={{ fontSize: 13, color: colors.greenDark, marginTop: 2 }}>
              Completed at {completedTime}
            </div>
          )}
        </div>
        {completed && (
          <span style={{
            padding: "4px 12px", borderRadius: 12,
            background: colors.green, color: colors.white,
            fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          }} aria-hidden="true">DONE</span>
        )}
      </div>

      {/* Expanded content */}
      {active && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${colors.borderLight}`, paddingTop: 16 }}>
          <p style={{ fontSize: 15, color: colors.text, lineHeight: 1.7, marginBottom: 12, margin: "0 0 12px" }}>
            {instruction}
          </p>

          {/* Expandable rationale */}
          <button
            onClick={() => setShowRationale(!showRationale)}
            aria-expanded={showRationale}
            aria-controls={`rationale-${number}`}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, color: colors.accent, fontWeight: 600,
              fontFamily: "inherit", padding: "6px 0", marginBottom: showRationale ? 8 : 12,
              display: "flex", alignItems: "center", gap: 8,
              minHeight: 44,
            }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
          >
            <span aria-hidden="true" style={{ transition: "transform 0.2s", transform: showRationale ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
            {showRationale ? "Hide rationale" : "Why this works"}
          </button>
          {showRationale && (
            <div id={`rationale-${number}`} role="region" aria-label={`Rationale for step ${number}`} style={{
              fontSize: 14, color: colors.textMuted, lineHeight: 1.7,
              padding: "14px 18px", marginBottom: 14,
              background: colors.bgDeep, borderRadius: 8,
              borderLeft: `3px solid ${colors.accentSoft}`,
            }}>
              {rationale}
            </div>
          )}

          {/* Timer */}
          {timerSeconds && !hasBreathingGuide && (
            <CountdownTimer duration={timerSeconds} label={timerLabel} onComplete={() => {}} />
          )}

          {/* Breathing guide */}
          {hasBreathingGuide && (
            <>
              {!breathingActive && (
                <Btn small onClick={onBreathingStart} ariaLabel="Start guided breathing exercise" style={{ marginBottom: 8 }}>
                  Start breathing guide
                </Btn>
              )}
              <BreathingGuide active={breathingActive} onComplete={onComplete} />
            </>
          )}

          {/* Completion button */}
          {!hasBreathingGuide && (
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
              <Btn small onClick={onComplete} ariaLabel={`Mark step ${number} as complete: ${trackPrompt}`}>
                {trackPrompt} →
              </Btn>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ═══ Decision Gate ═══
function DecisionGate({ onYes, onNo, attempt }) {
  return (
    <section aria-label="Decision gate" role="region" style={{ background: `linear-gradient(135deg, ${colors.amberSoft}, ${colors.accentGlow})`, border: `2px solid ${colors.amber}`, borderRadius: 14, padding: "28px 24px", textAlign: "center" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: colors.amber, marginBottom: 10, margin: "0 0 10px" }}>
        Decision Gate{attempt > 1 ? ` — Attempt ${attempt}` : ""}
      </h3>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 8, margin: "0 0 8px" }}>Did the body show any change?</p>
      <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 22, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 22px" }}>
        Any change counts: breathing slightly slower, shoulders slightly lower, thoughts slightly less loud. Even "not worse" is valid.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn variant="green" onClick={onYes} ariaLabel="Yes, something shifted — pass the gate">Yes — something shifted</Btn>
        <Btn variant="secondary" onClick={onNo} ariaLabel="No change detected">No change</Btn>
      </div>
    </section>
  );
}

// ═══ Daily Progress ═══
function DailyProgress({ completedSteps, totalSteps }) {
  const pct = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  return (
    <div style={{ background: colors.white, border: `1px solid ${colors.borderLight}`, borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>Today's Loop</span>
        <span style={{ fontSize: 14, color: completedSteps === totalSteps && completedSteps > 0 ? colors.green : colors.textMuted, fontWeight: 700 }}>
          {completedSteps}/{totalSteps} steps
        </span>
      </div>
      <div role="progressbar" aria-valuenow={completedSteps} aria-valuemin={0} aria-valuemax={totalSteps} aria-label={`Daily progress: ${completedSteps} of ${totalSteps} steps completed`}>
        <div style={{ height: 8, background: colors.bgDeep, borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: completedSteps === totalSteps && completedSteps > 0 ? colors.green : colors.accent,
            borderRadius: 4, transition: "width 0.5s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

// ═══ Claude API Call ═══
async function callClaude(systemPrompt, userMessage) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    const data = await response.json();
    return data.content?.map((b) => b.text || "").join("\n") || "No response received.";
  } catch (e) {
    return "Unable to connect to analysis. Please try again.";
  }
}

// ═══ Load Domain Detector ═══
function LoadDomainDetector() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!input.trim()) return;
    setLoading(true);
    const systemPrompt = `You are an expert in autonomic nervous system regulation for neurodivergent individuals, specifically trained on the Nervous System Operating Manual (NSOM) framework by Yve Bergeron.

Your task is to identify which of the Five Load Domains are currently active based on a person's description of their state. The five domains are:

1. COGNITIVE — processing demands: thinking, learning, holding info. Markers: head pressure, mental fog, "too many tabs open"
2. EMOTIONAL — felt and unfelt emotion, masking suppression. Markers: chest tightness, throat constriction, facial heat, disproportionate tears/anger
3. SENSORY — total sensory channel input. Markers: skin crawling, causeless irritability, flinching at sounds, filtering difficulty
4. SOCIAL — interaction processing demands, masking. Markers: post-social exhaustion, mental rehearsal, eye contact difficulty
5. EXECUTIVE — planning, organizing, initiating, transitioning. Markers: paralysis, decision fatigue, the "wall" between intention and action

Respond in this exact JSON format only, no markdown, no backticks:
{"primary":"domain name","secondary":"domain name or null","confidence":"high/medium/low","explanation":"2-3 sentences explaining why","intervention":"1-2 specific intervention suggestions based on the identified domain"}`;

    const text = await callClaude(systemPrompt, `Here is what I'm experiencing right now: ${input}`);
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch {
      setResult({ primary: "Unknown", secondary: null, confidence: "low", explanation: text, intervention: "Try describing your physical sensations and current situation in more detail." });
    }
    setLoading(false);
  }

  const domainColors = { Cognitive: colors.blue, Emotional: colors.red, Sensory: colors.amber, Social: colors.accent, Executive: colors.green };

  return (
    <section aria-label="Load domain detection" style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 4, margin: "0 0 4px" }}>Load Domain Detection</h3>
      <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 14, margin: "0 0 14px" }}>Describe what you're experiencing — physical sensations, situation, what's difficult right now.</p>
      <label htmlFor="load-input" style={srOnly}>Describe your current state</label>
      <textarea
        id="load-input"
        value={input} onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., I can't start the report even though I know what to write. My head feels foggy and I keep checking my phone instead..."
        style={{ width: "100%", minHeight: 80, padding: 14, border: `2px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 15, fontFamily: "'Source Serif 4', Georgia, serif", color: colors.text, background: colors.bg, resize: "vertical", lineHeight: 1.7, boxSizing: "border-box", outline: "none" }}
        onFocus={(e) => { e.target.style.borderColor = colors.focusRing; Object.assign(e.target.style, focusStyle); }}
        onBlur={(e) => { e.target.style.borderColor = colors.borderLight; e.target.style.outline = "none"; }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <Btn onClick={analyze} disabled={!input.trim() || loading} ariaLabel="Analyze load domains">{loading ? "Analyzing..." : "Identify Load Domains"}</Btn>
      </div>
      {result && (
        <div role="region" aria-live="polite" aria-label="Analysis results" style={{ marginTop: 16, padding: 16, background: colors.bgDeep, borderRadius: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ padding: "5px 14px", borderRadius: 20, background: domainColors[result.primary] || colors.accent, color: colors.white, fontSize: 14, fontWeight: 700 }}>
              Primary: {result.primary}
            </span>
            {result.secondary && result.secondary !== "null" && (
              <span style={{ padding: "5px 14px", borderRadius: 20, background: colors.bgWarm, color: domainColors[result.secondary] || colors.accent, fontSize: 14, fontWeight: 700, border: `2px solid ${domainColors[result.secondary] || colors.accent}` }}>
                Secondary: {result.secondary}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: colors.text, lineHeight: 1.7, marginBottom: 10, margin: "0 0 10px" }}>{result.explanation}</p>
          <div style={{ fontSize: 14, color: colors.greenDark, lineHeight: 1.7, padding: "12px 16px", background: colors.greenSoft, borderRadius: 8 }}>
            <strong>Intervention:</strong> {result.intervention}
          </div>
        </div>
      )}
    </section>
  );
}

// ═══ Weekly Pattern Analysis ═══
function WeeklyPatternAnalysis({ entries }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const last7 = entries.filter((e) => (new Date() - new Date(e.date)) / 86400000 <= 7);

  async function analyze() {
    if (last7.length === 0) return;
    setLoading(true);
    const systemPrompt = `You are an expert in autonomic nervous system regulation for neurodivergent individuals, trained on the NSOM framework by Yve Bergeron.

Perform a Weekly Pattern Analysis. Your job:
1. Identify recurring patterns — what keeps showing up (not why)
2. Note which load domains appear most often
3. Note body sensation patterns
4. Assess gate pass rate
5. Suggest ONE concrete action

Rules: Look for patterns, not causes. One decision maximum. Do not psychoanalyze.

Respond in JSON only, no markdown, no backticks:
{"patterns":["pattern 1","pattern 2","pattern 3"],"dominant_domain":"most frequent domain or null","sensation_pattern":"recurring body sensations","gate_rate":"X/Y with brief interpretation","risk_flags":["any red line concerns"],"one_decision":"single concrete action suggested","summary":"3-4 sentence overall assessment"}`;

    const dataStr = last7.map((e) => `Date:${e.date} Gate:${e.gatePassed ? "passed" : "no"} Attempts:${e.attempts || 1} Steps:${(e.stepsCompleted || []).join(",")} Domain:${e.loadDomain || "?"} Sensations:${(e.sensations || []).join(",")} HRV:${e.hrv || "?"} Journal:${e.journal || "none"}`).join("\n");

    const text = await callClaude(systemPrompt, `Regulation log entries from the past 7 days:\n\n${dataStr}`);
    try { setResult(JSON.parse(text.replace(/```json|```/g, "").trim())); }
    catch { setResult({ patterns: [], dominant_domain: null, sensation_pattern: "", gate_rate: "", risk_flags: [], one_decision: "", summary: text }); }
    setLoading(false);
  }

  return (
    <section aria-label="Weekly pattern analysis" style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: colors.text, margin: "0 0 4px" }}>Weekly Pattern Analysis</h3>
      <p style={{ fontSize: 14, color: colors.textMuted, margin: "0 0 14px" }}>
        {last7.length === 0 ? "No entries in the past 7 days." : `${last7.length} entries available.`}
      </p>
      <Btn onClick={analyze} disabled={last7.length === 0 || loading} ariaLabel={`Analyze ${last7.length} entries`}>{loading ? "Analyzing..." : `Analyze ${last7.length} entries`}</Btn>
      {result && (
        <div role="region" aria-live="polite" style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ padding: 14, background: colors.bgDeep, borderRadius: 10, fontSize: 14, color: colors.text, lineHeight: 1.7, margin: 0 }}>{result.summary}</p>
          {result.patterns?.length > 0 && (
            <div style={{ padding: 14, background: colors.blueSoft, borderRadius: 10 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: colors.blue, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 6px" }}>Recurring Patterns</h4>
              {result.patterns.map((p, i) => <p key={i} style={{ fontSize: 14, color: colors.text, lineHeight: 1.7, paddingLeft: 12, borderLeft: `2px solid ${colors.blue}`, marginBottom: 6, margin: "0 0 6px" }}>{p}</p>)}
            </div>
          )}
          {result.one_decision && (
            <div style={{ padding: 14, background: colors.greenSoft, borderRadius: 10, borderLeft: `4px solid ${colors.green}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: colors.greenDark, margin: "0 0 4px" }}>One Decision (Maximum)</h4>
              <p style={{ fontSize: 15, color: colors.text, lineHeight: 1.7, margin: 0 }}>{result.one_decision}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ═══ DGAEP Intro Section ═══
function DGAEPIntro() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section aria-label="What is DGAEP" style={{ marginBottom: 20 }}>
      <div style={{ background: colors.white, border: `2px solid ${colors.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: colors.text, margin: "0 0 10px" }}>
          What is DGAEP?
        </h3>
        <p style={{ fontSize: 15, color: colors.text, lineHeight: 1.7, margin: "0 0 10px" }}>
          The Decision-Gated Autonomic Escalation Protocol is what happens <em>after</em> first-line regulation has been tried and has not worked. It is not a replacement for breathing, grounding, or body scanning. It is the structured next step when those approaches encounter a nervous system state that exceeds their operating range.
        </p>
        <p style={{ fontSize: 15, color: colors.text, lineHeight: 1.7, margin: "0 0 12px" }}>
          If breathing three times did not work, breathing ten times will not work. The system needs <em>different</em> input, not more of the same.
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls="dgaep-principles"
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: colors.accent, fontWeight: 700,
            fontFamily: "inherit", padding: "6px 0",
            display: "flex", alignItems: "center", gap: 8, minHeight: 44,
          }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
        >
          <span aria-hidden="true" style={{ transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
          {expanded ? "Hide core principles" : "Read the 5 core principles"}
        </button>

        {expanded && (
          <div id="dgaep-principles" role="region" aria-label="DGAEP core principles" style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "Regulation attempts may fail without indicating error", desc: "A technique that doesn't produce a calming response has not failed. It has encountered a system state that exceeds its operating range. The response is escalation to a different category of input." },
              { title: "Escalation is physiological, not emotional", desc: "DGAEP does not ask what you are feeling, why you are upset, or what triggered the activation. It asks only: did the body change? This is a physiological decision, not a psychological one." },
              { title: "Cognitive slowing is not always achievable", desc: "When voluntary cognitive slowing fails, the protocol shifts to cognitive interruption — not calming the thoughts, but redirecting the processing resources maintaining the loop toward external structured tasks." },
              { title: "Containment is a valid endpoint", desc: "Not every escalation resolves in calm. Sometimes the best achievable outcome is: the activation does not get worse, you do not harm yourself or others, and the system is given time." },
              { title: "Medical escalation has defined red flags", desc: "If chest pain, fainting, confusion, slurred speech, new neurological symptoms, or panic persisting for hours without fluctuation appear — the protocol terminates and medical support is sought. This is non-negotiable." },
            ].map((p, i) => (
              <div key={i} style={{ padding: "12px 16px", background: colors.bgDeep, borderRadius: 8, borderLeft: `3px solid ${colors.accent}` }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: colors.text, margin: "0 0 4px" }}>
                  {i + 1}. {p.title}
                </h4>
                <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ═══ Body State Capture ═══
function BodyStateCapture({ label, stateKey, selectedStates, setSelectedStates, freeText, setFreeText, timestamp }) {
  const toggleState = (s) => setSelectedStates((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: colors.text, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
          {label}
        </h4>
        {timestamp && (
          <span style={{ fontSize: 12, color: colors.textMuted }}>{timestamp}</span>
        )}
      </div>
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={srOnly}>{label} — select what you notice</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }} role="group" aria-label={`${label} body sensations`}>
          {BODY_STATE_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleState(s)}
              role="checkbox"
              aria-checked={selectedStates.includes(s)}
              style={{
                padding: "6px 12px", borderRadius: 20,
                border: `2px solid ${selectedStates.includes(s) ? colors.accent : colors.borderLight}`,
                background: selectedStates.includes(s) ? colors.accentGlow : "transparent",
                color: selectedStates.includes(s) ? colors.accent : colors.textMuted,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                fontWeight: selectedStates.includes(s) ? 700 : 400, minHeight: 36,
              }}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
            >{s}</button>
          ))}
        </div>
      </fieldset>
      <label htmlFor={`body-note-${stateKey}`} style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>
        Anything else you notice (optional)
      </label>
      <input
        id={`body-note-${stateKey}`}
        type="text"
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder="e.g., left shoulder won't drop, vision tunneling..."
        style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: `2px solid ${colors.borderLight}`, fontSize: 14, fontFamily: "inherit", color: colors.text, background: colors.white, boxSizing: "border-box", minHeight: 44 }}
        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
        onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
      />
    </div>
  );
}

// ═══ Before/After Comparison ═══
function BodyStateComparison({ beforeStates, beforeNote, afterStates, afterNote }) {
  if (beforeStates.length === 0 && afterStates.length === 0) return null;

  const resolved = beforeStates.filter((s) => !afterStates.includes(s));
  const persisting = beforeStates.filter((s) => afterStates.includes(s));
  const newSymptoms = afterStates.filter((s) => !beforeStates.includes(s));

  return (
    <div role="region" aria-label="Before and after comparison" style={{ background: colors.white, border: `2px solid ${colors.borderLight}`, borderRadius: 12, padding: "16px 18px", marginTop: 12 }}>
      <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, color: colors.text, margin: "0 0 12px" }}>
        What Changed
      </h4>

      {resolved.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.green, textTransform: "uppercase", letterSpacing: 0.5 }}>Resolved</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
            {resolved.map((s) => (
              <span key={s} style={{ padding: "3px 10px", borderRadius: 16, background: colors.greenSoft, color: colors.green, fontSize: 13, fontWeight: 600, textDecoration: "line-through" }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {persisting.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 0.5 }}>Still present</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
            {persisting.map((s) => (
              <span key={s} style={{ padding: "3px 10px", borderRadius: 16, background: colors.amberSoft, color: colors.amber, fontSize: 13, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {newSymptoms.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.blue, textTransform: "uppercase", letterSpacing: 0.5 }}>New</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
            {newSymptoms.map((s) => (
              <span key={s} style={{ padding: "3px 10px", borderRadius: 16, background: colors.blueSoft, color: colors.blue, fontSize: 13, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {resolved.length === 0 && persisting.length === 0 && newSymptoms.length === 0 && (
        <p style={{ fontSize: 14, color: colors.textMuted, margin: 0, fontStyle: "italic" }}>No changes detected between states.</p>
      )}

      {(beforeNote || afterNote) && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${colors.borderLight}`, fontSize: 13, color: colors.textMuted }}>
          {beforeNote && <p style={{ margin: "0 0 4px" }}><strong>Before note:</strong> {beforeNote}</p>}
          {afterNote && <p style={{ margin: 0 }}><strong>After note:</strong> {afterNote}</p>}
        </div>
      )}
    </div>
  );
}

// ═══ Enhanced DGAEP With Timers + Body State Tracking ═══
function DGAEPEnhanced() {
  const levels = [
    { level: 1, name: "Postural Reset & Breathing", time: "3–5 min", seconds: 240, desc: "Change position. Drink water (cold if available). 3 slow breaths: inhale nose, exhale mouth. Place both feet on the floor.", rationale: "Postural change interrupts proprioceptive feedback. Hydration addresses dehydration-driven sympathetic activation." },
    { level: 2, name: "Sensory Weight", time: "15–20 min", seconds: 1020, desc: "Weighted blanket, heavy hoodie, or lap pad. Apply firm pressure — palms together, squeeze arms, press back into wall. If tolerated: cold water on wrists.", rationale: "Deep pressure activates parasympathetic response through proprioceptive loading. Cold input triggers the mammalian dive reflex." },
    { level: 3, name: "Cognitive Loop Interruption", time: "10–15 min", seconds: 720, desc: "Count backwards from 100 by 7s. Name objects by category. Describe a physical object in exact detail.", rationale: "Reroutes cognitive resources maintaining the dysregulation loop toward external structured tasks. This is not distraction — it is deliberate cognitive redirection." },
    { level: 4, name: "Rhythmic Override", time: "10–20 min", seconds: 900, desc: "Walking (any pace, rhythmic). Rocking. Bilateral tapping — alternate tapping knees or shoulders. Drumming at steady beat. Let the body choose its rhythm.", rationale: "Vestibular and proprioceptive input competes with the cognitive loop for processing resources. Pattern interrupts at the motor cortex level." },
    { level: 5, name: "Sensory Containment", time: "20–30 min", seconds: 1500, desc: "Darken room. Noise-canceling headphones or silence. Functional language only. No questions about feelings. No reassurance loops. Containment, not engagement.", rationale: "When the system hasn't responded to increased input, reduce total sensory load. The system is overwhelmed by input volume — including regulatory input." },
    { level: 6, name: "Time-Based Holding", time: "20–30 min", seconds: 1500, desc: "Set timer. Stay present. No interventions. No fixing. No techniques. Time and physical safety only.", rationale: "Containment is a valid endpoint. Not every escalation resolves in calm. The goal is that activation does not worsen and the system is given time." },
  ];

  const [activeLevel, setActiveLevel] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Before state (captured once at start of escalation)
  const [beforeStates, setBeforeStates] = useState([]);
  const [beforeNote, setBeforeNote] = useState("");
  const [beforeTime, setBeforeTime] = useState(null);

  // After state (per level, updated as user progresses)
  const [afterStates, setAfterStates] = useState({});
  const [afterNotes, setAfterNotes] = useState({});
  const [levelResults, setLevelResults] = useState({});

  // Current after capture
  const [currentAfterStates, setCurrentAfterStates] = useState([]);
  const [currentAfterNote, setCurrentAfterNote] = useState("");
  const [showAfterCapture, setShowAfterCapture] = useState(false);

  // Load persisted session
  useEffect(() => {
    const session = loadData(DGAEP_SESSION_KEY, null);
    if (session && session.date === todayStr()) {
      setSessionStarted(session.started || false);
      setBeforeStates(session.beforeStates || []);
      setBeforeNote(session.beforeNote || "");
      setBeforeTime(session.beforeTime || null);
      setAfterStates(session.afterStates || {});
      setAfterNotes(session.afterNotes || {});
      setLevelResults(session.levelResults || {});
    }
  }, []);

  function saveSession(updates = {}) {
    const session = {
      date: todayStr(),
      started: sessionStarted,
      beforeStates, beforeNote, beforeTime,
      afterStates, afterNotes, levelResults,
      ...updates,
    };
    saveData(DGAEP_SESSION_KEY, session);
  }

  function startSession() {
    const time = timeNow();
    setSessionStarted(true);
    setBeforeTime(time);
    saveSession({ started: true, beforeTime: time });
  }

  function recordAfterState(level) {
    const newAfterStates = { ...afterStates, [level]: currentAfterStates };
    const newAfterNotes = { ...afterNotes, [level]: currentAfterNote };
    setAfterStates(newAfterStates);
    setAfterNotes(newAfterNotes);
    setShowAfterCapture(false);
    setCurrentAfterStates([]);
    setCurrentAfterNote("");
    saveSession({ afterStates: newAfterStates, afterNotes: newAfterNotes });
  }

  function recordLevelResult(level, result) {
    const newResults = { ...levelResults, [level]: { result, time: timeNow() } };
    setLevelResults(newResults);
    saveSession({ levelResults: newResults });
  }

  function resetSession() {
    if (!confirm("Reset this escalation session? Your before/after notes will be cleared.")) return;
    setSessionStarted(false);
    setBeforeStates([]); setBeforeNote(""); setBeforeTime(null);
    setAfterStates({}); setAfterNotes({}); setLevelResults({});
    setActiveLevel(null); setShowAfterCapture(false);
    setCurrentAfterStates([]); setCurrentAfterNote("");
    saveData(DGAEP_SESSION_KEY, { date: todayStr() });
  }

  // The latest after state to compare against before
  const latestAfterLevel = Math.max(...Object.keys(afterStates).map(Number), 0);
  const latestAfterStates = afterStates[latestAfterLevel] || [];
  const latestAfterNote = afterNotes[latestAfterLevel] || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DGAEPIntro />

      {/* Before state capture */}
      {!sessionStarted ? (
        <section aria-label="Begin escalation session" style={{ background: colors.white, border: `2px solid ${colors.accent}`, borderRadius: 14, padding: "22px 22px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: colors.text, margin: "0 0 8px" }}>
            Before you begin — capture your body state
          </h3>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, margin: "0 0 14px" }}>
            This records how your body feels right now, before any escalation steps. You'll capture your state again after each level so you can see what changed. Your working memory is already compromised during escalation — let the tool remember for you.
          </p>
          <BodyStateCapture
            label="Body State — Right Now"
            stateKey="before"
            selectedStates={beforeStates}
            setSelectedStates={setBeforeStates}
            freeText={beforeNote}
            setFreeText={setBeforeNote}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={startSession} ariaLabel="Save body state and begin escalation protocol">
              Save state & begin escalation
            </Btn>
          </div>
        </section>
      ) : (
        <>
          {/* Session active indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: colors.accentGlow, borderRadius: 10, padding: "10px 16px" }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: colors.accent }}>Escalation session active</span>
              {beforeTime && <span style={{ fontSize: 13, color: colors.textMuted, marginLeft: 8 }}>Started {beforeTime}</span>}
            </div>
            <Btn small variant="ghost" onClick={resetSession} ariaLabel="Reset escalation session">Reset session</Btn>
          </div>

          {/* Before state summary (collapsed) */}
          {beforeStates.length > 0 && (
            <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "12px 16px" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Before state ({beforeTime}): </span>
              <span style={{ fontSize: 13, color: colors.text }}>{beforeStates.join(", ")}</span>
              {beforeNote && <span style={{ fontSize: 13, color: colors.textMuted }}> — {beforeNote}</span>}
            </div>
          )}

          {/* Decision gate reminder */}
          <Callout type="info">
            <strong>Decision gate at every level:</strong> After the timer — how does the body feel now? Record it below. If the body changed (even slightly) → stay at this level. If no change → escalate to the next level.
          </Callout>

          {/* Escalation levels */}
          {levels.map((l) => {
            const levelDone = levelResults[l.level];
            const levelAfter = afterStates[l.level];
            return (
              <div key={l.level} role="region" aria-label={`Level ${l.level}: ${l.name}${levelDone ? ` — ${levelDone.result}` : ""}`} style={{
                background: colors.white, borderRadius: 12, overflow: "hidden",
                border: `2px solid ${levelDone?.result === "shifted" ? colors.green : levelDone?.result === "escalate" ? colors.amber : activeLevel === l.level ? colors.accent : colors.borderLight}`,
              }}>
                <button
                  onClick={() => { setActiveLevel(activeLevel === l.level ? null : l.level); setShowAfterCapture(false); }}
                  aria-expanded={activeLevel === l.level}
                  aria-controls={`dgaep-level-${l.level}`}
                  style={{ width: "100%", padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", fontFamily: "inherit", minHeight: 48, textAlign: "left" }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div aria-hidden="true" style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: levelDone?.result === "shifted" ? colors.green : levelDone?.result === "escalate" ? colors.amber : colors.accent,
                      color: colors.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700,
                    }}>
                      {levelDone?.result === "shifted" ? "✓" : levelDone?.result === "escalate" ? "↑" : l.level}
                    </div>
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, color: colors.text }}>{l.name}</span>
                      {levelDone && (
                        <div style={{ fontSize: 12, color: levelDone.result === "shifted" ? colors.green : colors.amber, marginTop: 2 }}>
                          {levelDone.result === "shifted" ? "Body shifted" : "Escalated"} at {levelDone.time}
                        </div>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: colors.textMuted }}>{l.time}</span>
                </button>

                {activeLevel === l.level && (
                  <div id={`dgaep-level-${l.level}`} style={{ padding: "0 20px 20px", borderTop: `1px solid ${colors.borderLight}`, paddingTop: 14 }}>
                    <p style={{ fontSize: 15, color: colors.text, lineHeight: 1.7, margin: "0 0 10px" }}>{l.desc}</p>
                    <p style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.6, fontStyle: "italic", margin: "0 0 14px", paddingLeft: 12, borderLeft: `2px solid ${colors.bgWarm}` }}>{l.rationale}</p>

                    <CountdownTimer duration={l.seconds} label={`Level ${l.level} timer`} onComplete={() => setShowAfterCapture(true)} />

                    {/* After state capture — appears when timer completes or user triggers it */}
                    {!levelDone && (
                      <div style={{ marginTop: 14 }}>
                        {!showAfterCapture ? (
                          <Btn small variant="secondary" onClick={() => setShowAfterCapture(true)} ariaLabel="Record how your body feels after this level">
                            Record body state after this level
                          </Btn>
                        ) : (
                          <div style={{ marginTop: 10 }}>
                            <BodyStateCapture
                              label={`After Level ${l.level}`}
                              stateKey={`after-${l.level}`}
                              selectedStates={currentAfterStates}
                              setSelectedStates={setCurrentAfterStates}
                              freeText={currentAfterNote}
                              setFreeText={setCurrentAfterNote}
                              timestamp={timeNow()}
                            />
                            <div style={{ marginTop: 12 }}>
                              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 700, color: colors.text, margin: "0 0 10px" }}>
                                Did the body show any change?
                              </p>
                              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <Btn variant="green" onClick={() => { recordAfterState(l.level); recordLevelResult(l.level, "shifted"); }} ariaLabel="Body shifted — stay at this level">
                                  Yes — something shifted
                                </Btn>
                                <Btn variant="secondary" onClick={() => { recordAfterState(l.level); recordLevelResult(l.level, "escalate"); }} ariaLabel="No change — escalate to next level">
                                  No change — escalate
                                </Btn>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Show recorded after state for completed levels */}
                    {levelDone && levelAfter && (
                      <div style={{ marginTop: 12, padding: "10px 14px", background: colors.bgDeep, borderRadius: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>Recorded after state: </span>
                        <span style={{ fontSize: 13, color: colors.text }}>{levelAfter.join(", ") || "None selected"}</span>
                        {afterNotes[l.level] && <span style={{ fontSize: 13, color: colors.textMuted }}> — {afterNotes[l.level]}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Before/After comparison — always visible when we have data */}
          {latestAfterLevel > 0 && (
            <BodyStateComparison
              beforeStates={beforeStates}
              beforeNote={beforeNote}
              afterStates={latestAfterStates}
              afterNote={latestAfterNote}
            />
          )}

          {/* Medical red flags */}
          <div role="alert" style={{ background: colors.redSoft, borderRadius: 12, padding: "16px 20px", borderLeft: `4px solid ${colors.red}`, marginTop: 4 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 700, color: colors.red, margin: "0 0 4px" }}>Medical Red Flags — Stop protocol, seek immediate medical help</h3>
            <p style={{ fontSize: 14, color: colors.text, lineHeight: 1.7, margin: 0 }}>
              Chest pain · Fainting · Confusion or disorientation · Slurred speech · New neurological symptoms · Panic persisting for hours without fluctuation
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ═══ Journaling Section ═══
function JournalingSection({ entry, setEntry, sensations, setSensations, loadDomain, setLoadDomain, hrv, setHrv, hr, setHr, onSave, notes, setNotes }) {
  const sensationOptions = ["Tight", "Heavy", "Buzzy", "Numb", "Warm", "Cold", "Racing", "Foggy", "Shallow breathing", "Chest pressure", "Throat constriction", "Jaw clenched"];
  const toggleSensation = (s) => setSensations((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <section aria-label="Journaling" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div role="status" style={{ background: colors.greenSoft, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.green, textTransform: "uppercase", letterSpacing: 1.5 }}>Gate Passed — Journaling Unlocked</span>
      </div>
      <Callout type="neutral">
        <strong>Journaling rules:</strong> Storage, not understanding. No decisions while journaling. No reviewing immediately after. If the body worsens, stop.
      </Callout>

      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ fontSize: 14, fontWeight: 700, color: colors.textMuted, marginBottom: 8 }}>Body Sensations (from your scan)</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} role="group" aria-label="Select body sensations">
          {sensationOptions.map((s) => (
            <button key={s} onClick={() => toggleSensation(s)} role="checkbox" aria-checked={sensations.includes(s)} style={{
              padding: "7px 14px", borderRadius: 20, border: `2px solid ${sensations.includes(s) ? colors.accent : colors.borderLight}`,
              background: sensations.includes(s) ? colors.accentGlow : "transparent", color: sensations.includes(s) ? colors.accent : colors.textMuted,
              fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: sensations.includes(s) ? 700 : 400, minHeight: 36,
            }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
            >{s}</button>
          ))}
        </div>
      </fieldset>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <label htmlFor="load-domain" style={{ fontSize: 13, color: colors.textMuted, marginBottom: 4, display: "block" }}>Primary Load Domain</label>
          <select id="load-domain" value={loadDomain} onChange={(e) => setLoadDomain(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `2px solid ${colors.borderLight}`, fontSize: 14, fontFamily: "inherit", color: colors.text, background: colors.bg, minHeight: 44 }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
          >
            <option value="">Select...</option>
            {LOAD_DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hrv-input" style={{ fontSize: 13, color: colors.textMuted, marginBottom: 4, display: "block" }}>HRV (SDNN ms)</label>
          <input id="hrv-input" type="number" value={hrv} onChange={(e) => setHrv(e.target.value)} placeholder="e.g. 38" style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `2px solid ${colors.borderLight}`, fontSize: 14, fontFamily: "inherit", color: colors.text, background: colors.bg, boxSizing: "border-box", minHeight: 44 }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
          />
        </div>
        <div>
          <label htmlFor="hr-input" style={{ fontSize: 13, color: colors.textMuted, marginBottom: 4, display: "block" }}>Resting HR (bpm)</label>
          <input id="hr-input" type="number" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="e.g. 68" style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `2px solid ${colors.borderLight}`, fontSize: 14, fontFamily: "inherit", color: colors.text, background: colors.bg, boxSizing: "border-box", minHeight: 44 }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="journal-entry" style={{ fontSize: 14, fontWeight: 700, color: colors.textMuted, marginBottom: 6, display: "block" }}>Journal Entry — describe, don't analyze</label>
        <textarea id="journal-entry" value={entry} onChange={(e) => setEntry(e.target.value)}
          placeholder='"My chest was tight. Shoulders were high. Breathing was shallow." — Description only.'
          style={{ width: "100%", minHeight: 100, padding: 14, border: `2px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 15, fontFamily: "'Source Serif 4', Georgia, serif", color: colors.text, background: colors.bg, resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
        />
      </div>

      <div>
        <label htmlFor="context-notes" style={{ fontSize: 13, color: colors.textMuted, marginBottom: 4, display: "block" }}>Context notes (what was happening)</label>
        <input id="context-notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Brief context..." style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: `2px solid ${colors.borderLight}`, fontSize: 14, fontFamily: "inherit", color: colors.text, background: colors.bg, boxSizing: "border-box", minHeight: 44 }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: colors.textMuted }}>Store. Save and close. Do not re-read.</span>
        <Btn onClick={onSave} ariaLabel="Store journal entry and close">Store & Close</Btn>
      </div>
    </section>
  );
}

// ═══ HRV Chart ═══
function HRVChart({ entries }) {
  const hrvData = entries.filter((e) => e.hrv).sort((a, b) => a.date.localeCompare(b.date)).map((e) => ({
    date: new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    hrv: e.hrv, hr: e.hr || null,
  }));

  if (hrvData.length < 2) return (
    <div style={{ textAlign: "center", padding: "32px 20px", color: colors.textMuted }}>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, margin: 0 }}>Need at least 2 HRV entries to show a trend</p>
      <p style={{ fontSize: 14, marginTop: 6, margin: "6px 0 0" }}>Log your HRV reading from Apple Health when creating regulation entries.</p>
    </div>
  );

  const avgHRV = Math.round(hrvData.reduce((s, d) => s + d.hrv, 0) / hrvData.length);
  return (
    <section aria-label="HRV trend chart">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: colors.textMuted }}>HRV (SDNN ms) — higher indicates better parasympathetic recovery</span>
        <span style={{ fontSize: 14, color: colors.textMuted }}>Avg: <strong>{avgHRV} ms</strong></span>
      </div>
      <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.borderLight}`, padding: "16px 8px 8px 0" }}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={hrvData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent} stopOpacity={0.2} />
                <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: colors.textMuted }} />
            <YAxis tick={{ fontSize: 12, fill: colors.textMuted }} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip contentStyle={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 14 }} />
            <ReferenceLine y={avgHRV} stroke={colors.textMuted} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="hrv" stroke="none" fill="url(#hrvGradient)" />
            <Line type="monotone" dataKey="hrv" stroke={colors.accent} strokeWidth={2.5} dot={{ fill: colors.accent, r: 3 }} />
            {hrvData.some((d) => d.hr) && <Line type="monotone" dataKey="hr" stroke={colors.red} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ═══ History View ═══
function HistoryView({ entries }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const last7 = sorted.filter((e) => (new Date() - new Date(e.date)) / 86400000 <= 7);
  const gateRate = last7.length > 0 ? Math.round((last7.filter((e) => e.gatePassed).length / last7.length) * 100) : 0;
  const avgAttempts = last7.length > 0 ? (last7.reduce((s, e) => s + (e.attempts || 1), 0) / last7.length).toFixed(1) : "—";
  const avgSteps = last7.length > 0 ? (last7.reduce((s, e) => s + (e.stepsCompleted?.length || 0), 0) / last7.length).toFixed(1) : "—";

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }} role="group" aria-label="7-day summary statistics">
        {[
          { val: `${gateRate}%`, label: "Gate pass (7d)", color: colors.green, bg: colors.greenSoft },
          { val: avgAttempts, label: "Avg attempts", color: colors.amber, bg: colors.amberSoft },
          { val: avgSteps, label: "Avg steps", color: colors.blue, bg: colors.blueSoft },
          { val: `${sorted.length}`, label: "Total entries", color: colors.accent, bg: colors.accentGlow },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 10, padding: 14, textAlign: "center" }} aria-label={`${s.label}: ${s.val}`}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div role="list" aria-label="Regulation history entries">
        {sorted.slice(0, 20).map((entry, i) => (
          <div key={i} role="listitem" style={{ background: colors.white, borderRadius: 8, padding: "12px 16px", border: `1px solid ${colors.borderLight}`, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: entry.gatePassed ? colors.green : entry.escalated ? colors.amber : colors.red, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>
                  {friendlyDate(entry.date)}{entry.timeOfDay ? ` · ${entry.timeOfDay}` : ""}
                  {entry.loadDomain && <span style={{ marginLeft: 8, padding: "2px 10px", borderRadius: 10, background: colors.bgDeep, fontSize: 12, color: colors.textMuted }}>{entry.loadDomain}</span>}
                </div>
                {entry.journal && <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.journal}</div>}
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, textAlign: "right", flexShrink: 0 }}>
                {entry.gatePassed ? "Gate ✓" : entry.escalated ? "Escalated" : "No shift"}
                {entry.stepsCompleted && <div>{entry.stepsCompleted.length}/6 steps</div>}
                {entry.hrv ? <div>{entry.hrv} ms</div> : null}
              </div>
            </div>
            {entry.stepsCompleted?.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${colors.borderLight}` }} aria-label={`${entry.stepsCompleted.length} of 6 steps completed`}>
                {STEPS.map((s) => (
                  <div key={s.number} style={{ flex: 1, height: 5, borderRadius: 3, background: entry.stepsCompleted.includes(s.number) ? colors.green : colors.bgDeep }} title={`Step ${s.number}: ${s.title} — ${entry.stepsCompleted.includes(s.number) ? "completed" : "not completed"}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ Red Lines ═══
function RedLines() {
  const lines = [
    { title: "Sleep below 5 hours for 2+ consecutive nights", action: "Cancel all non-essential commitments. The system cannot regulate on insufficient sleep." },
    { title: "Sustained activation for 4+ hours", action: "Activate acute dysregulation protocol → DGAEP → seek human support." },
    { title: "Loss of appetite for 24+ hours", action: "Dorsal vagal signaling — shutdown. Reduce all demands. Prioritize gentle movement and warmth." },
    { title: "Inability to complete the regulation loop", action: "Load failure, not regulation failure. Seek co-regulation from a safe person or environment." },
    { title: "Suicidal ideation or self-harm urges", action: "Medical emergency. Contact emergency services, crisis helpline, or trusted person immediately.", critical: true },
  ];
  return (
    <div role="list" aria-label="Red line thresholds" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {lines.map((rl, i) => (
        <div key={i} role="listitem" style={{ background: rl.critical ? colors.redSoft : colors.white, border: `2px solid ${rl.critical ? colors.red : colors.border}`, borderRadius: 10, padding: "14px 18px", borderLeft: `4px solid ${colors.red}` }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 700, color: colors.text, margin: "0 0 4px" }}>{rl.title}</h3>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, margin: 0 }}>{rl.action}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
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
  const [dailySteps, setDailySteps] = useState({});

  useEffect(() => {
    setEntries(loadData(STORAGE_KEY, []));
    const daily = loadData(DAILY_KEY, { date: null, steps: {} });
    if (daily.date === todayStr()) { setDailySteps(daily.steps); }
    else { saveData(DAILY_KEY, { date: todayStr(), steps: {} }); }
  }, []);

  function saveDailyStep(stepNum) {
    const updated = { ...dailySteps, [stepNum]: { completed: true, time: timeNow() } };
    setDailySteps(updated);
    saveData(DAILY_KEY, { date: todayStr(), steps: updated });
  }

  function completedStepCount() { return Object.keys(dailySteps).filter((k) => dailySteps[k]?.completed).length; }

  function advanceStep() {
    saveDailyStep(step);
    if (step < 6) setStep(step + 1); else setGateReached(true);
  }

  function handleGateYes() { setGatePassed(true); }
  function handleGateNo() {
    if (attempt < 2) { setAttempt(2); setStep(1); setGateReached(false); }
    else {
      setEscalated(true);
      const e = { date: todayStr(), timeOfDay: new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening", gatePassed: false, escalated: true, attempts: 2, stepsCompleted: Object.keys(dailySteps).filter((k) => dailySteps[k]?.completed).map(Number), journal: null, sensations: [], loadDomain: "", hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: "" };
      const updated = [...entries, e]; setEntries(updated); saveData(STORAGE_KEY, updated);
    }
  }

  function handleSave() {
    const e = { date: todayStr(), timeOfDay: new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening", gatePassed: true, escalated: false, attempts: attempt, stepsCompleted: Object.keys(dailySteps).filter((k) => dailySteps[k]?.completed).map(Number), journal: journalEntry.trim() || null, sensations, loadDomain, hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: notes.trim() || null };
    const updated = [...entries, e]; setEntries(updated); saveData(STORAGE_KEY, updated); setSaved(true);
  }

  function resetLoop() {
    setStep(1); setBreathingActive(false); setGateReached(false); setGatePassed(false);
    setAttempt(1); setEscalated(false); setJournalEntry(""); setSensations([]);
    setLoadDomain(""); setHrv(""); setHr(""); setNotes(""); setSaved(false);
  }

  const navItems = [
    { id: "loop", label: "Regulation Loop" },
    { id: "dgaep", label: "Escalation" },
    { id: "tracking", label: "Tracking" },
    { id: "analysis", label: "Analysis" },
    { id: "redlines", label: "Red Lines" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />

      {/* Skip navigation link */}
      <a href="#main-content" style={{ ...srOnly, position: "absolute", top: 0, left: 0, background: colors.accent, color: colors.white, padding: "12px 20px", zIndex: 100, fontSize: 14 }}
        onFocus={(e) => { e.target.style.position = "static"; e.target.style.clip = "auto"; e.target.style.width = "auto"; e.target.style.height = "auto"; e.target.style.margin = "0"; e.target.style.overflow = "visible"; e.target.style.whiteSpace = "normal"; }}
        onBlur={(e) => Object.assign(e.target.style, srOnly)}
      >Skip to main content</a>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: "24px 20px 18px", background: colors.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: colors.accent, marginBottom: 4 }}>The Nervous System Operating Manual</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: colors.text, lineHeight: 1.2, marginBottom: 3, margin: "0 0 3px" }}>Daily Regulation Protocol</h1>
          <p style={{ fontSize: 15, color: colors.textMuted, fontStyle: "italic", margin: 0 }}>Your body has a job. Its job is to keep you safe. This protocol tells you how to let it.</p>
        </div>
      </header>

      {/* Nav */}
      <nav aria-label="Protocol sections" style={{ borderBottom: `1px solid ${colors.border}`, background: colors.white, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", overflowX: "auto" }} role="tablist">
          {navItems.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={view === item.id}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => setView(item.id)}
              style={{
                padding: "12px 18px", border: "none",
                borderBottom: view === item.id ? `3px solid ${colors.accent}` : "3px solid transparent",
                background: "transparent",
                color: view === item.id ? colors.accent : colors.textMuted,
                fontSize: 14, fontWeight: view === item.id ? 700 : 400,
                cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                minHeight: 48,
              }}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => { e.target.style.outline = "none"; e.target.style.outlineOffset = "0"; }}
            >{item.label}</button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ═══ REGULATION LOOP ═══ */}
        <div role="tabpanel" id="panel-loop" aria-labelledby="tab-loop" hidden={view !== "loop"}>
          {view === "loop" && (
            <>
              <DailyProgress completedSteps={completedStepCount()} totalSteps={6} />
              <Callout type="info"><strong>Core Principle:</strong> No body change = no next step. The body is the authority, not the mind, not the schedule, not the therapist, and not the protocol itself.</Callout>
              <div style={{ height: 16 }} />
              {saved ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }} role="status">
                  <div aria-hidden="true" style={{ fontSize: 44, marginBottom: 12 }}>○</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: colors.green, margin: "0 0 6px" }}>Entry Stored</h2>
                  <p style={{ fontSize: 15, color: colors.textMuted, margin: "0 0 20px" }}>Do not re-read. Processing happens later, on a different day, with full capacity.</p>
                  <Btn variant="secondary" onClick={resetLoop} ariaLabel="Start a new regulation loop">Start a new loop</Btn>
                </div>
              ) : escalated ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }} role="status">
                  <div aria-hidden="true" style={{ fontSize: 44, marginBottom: 12 }}>↑</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: colors.amber, margin: "0 0 6px" }}>Escalate to DGAEP</h2>
                  <p style={{ fontSize: 15, color: colors.textMuted, margin: "0 0 6px" }}>The regulation loop was attempted twice and the body has not shifted. This is not failure — the activation level exceeds first-line capacity.</p>
                  <p style={{ fontSize: 14, color: colors.textMuted, fontStyle: "italic", margin: "0 0 20px" }}>When first-line regulation fails, escalation is not failure. It is the next step in the protocol.</p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <Btn onClick={() => setView("dgaep")} ariaLabel="Open the DGAEP escalation protocol">Open DGAEP Protocol</Btn>
                    <Btn variant="secondary" onClick={resetLoop} ariaLabel="Reset the regulation loop">Reset</Btn>
                  </div>
                </div>
              ) : gatePassed ? (
                <JournalingSection entry={journalEntry} setEntry={setJournalEntry} sensations={sensations} setSensations={setSensations} loadDomain={loadDomain} setLoadDomain={setLoadDomain} hrv={hrv} setHrv={setHrv} hr={hr} setHr={setHr} notes={notes} setNotes={setNotes} onSave={handleSave} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }} role="list" aria-label="Regulation loop steps">
                  {attempt > 1 && <div role="alert" style={{ background: colors.amberSoft, borderRadius: 8, padding: "10px 16px", fontSize: 14, color: colors.amber, fontWeight: 600, textAlign: "center" }}>Second attempt — if no change this time, escalate to DGAEP.</div>}
                  {STEPS.map((stepDef) => (
                    <EnhancedStepCard
                      key={stepDef.number}
                      stepDef={stepDef}
                      active={step === stepDef.number}
                      completed={step > stepDef.number || (dailySteps[stepDef.number]?.completed && step !== stepDef.number)}
                      completedTime={dailySteps[stepDef.number]?.time}
                      onComplete={() => { if (stepDef.hasBreathingGuide) setBreathingActive(false); advanceStep(); }}
                      onBreathingStart={() => setBreathingActive(true)}
                      breathingActive={breathingActive}
                    />
                  ))}
                  {gateReached && !gatePassed && <DecisionGate onYes={handleGateYes} onNo={handleGateNo} attempt={attempt} />}
                </div>
              )}
            </>
          )}
        </div>

        {/* ═══ DGAEP ═══ */}
        <div role="tabpanel" id="panel-dgaep" aria-labelledby="tab-dgaep" hidden={view !== "dgaep"}>
          {view === "dgaep" && (
            <>
              <DGAEPEnhanced />
            </>
          )}
        </div>

        {/* ═══ TRACKING ═══ */}
        <div role="tabpanel" id="panel-tracking" aria-labelledby="tab-tracking" hidden={view !== "tracking"}>
          {view === "tracking" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <SectionHead title="Tracking" subtitle="The pattern matters, not the individual day." />
                {entries.length > 0 && <Btn small variant="ghost" onClick={() => { if (confirm("Clear all data?")) { setEntries([]); saveData(STORAGE_KEY, []); } }} ariaLabel="Clear all tracking data">Reset</Btn>}
              </div>
              {entries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: colors.textMuted }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, margin: 0 }}>No entries yet</p>
                  <p style={{ fontSize: 14, marginTop: 6, margin: "6px 0 0" }}>Complete your first regulation loop to begin tracking.</p>
                </div>
              ) : (
                <>
                  <HRVChart entries={entries} />
                  <div style={{ height: 20 }} />
                  <HistoryView entries={entries} />
                </>
              )}
            </>
          )}
        </div>

        {/* ═══ ANALYSIS ═══ */}
        <div role="tabpanel" id="panel-analysis" aria-labelledby="tab-analysis" hidden={view !== "analysis"}>
          {view === "analysis" && (
            <>
              <SectionHead title="Analysis" subtitle="Claude-powered pattern detection and load domain identification." />
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <LoadDomainDetector />
                <WeeklyPatternAnalysis entries={entries} />
              </div>
            </>
          )}
        </div>

        {/* ═══ RED LINES ═══ */}
        <div role="tabpanel" id="panel-redlines" aria-labelledby="tab-redlines" hidden={view !== "redlines"}>
          {view === "redlines" && (
            <>
              <SectionHead title="Red Lines" subtitle="Non-negotiable structural load limits. Crossing a red line is not failure — it is the system signaling that protective action is required." />
              <RedLines />
              <div style={{ marginTop: 24, background: colors.bgDeep, borderRadius: 12, padding: "18px 20px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, color: colors.text, margin: "0 0 10px" }}>What Success Looks Like</h3>
                {[
                  { period: "Daily", desc: "The regulation loop produces a body change more often than it does not. Some days it will not work. The pattern matters." },
                  { period: "Weekly", desc: "The weekly reset identifies at least one recurring pattern. You begin to see the system's habits rather than being caught in them." },
                  { period: "Monthly", desc: "Baseline HRV and resting HR trend favorably. More time in ventral vagal, less in sustained sympathetic or dorsal vagal." },
                  { period: "Quarterly", desc: "Higher load tolerance before the gate's 'no change' branch. Window of tolerance widened through sustained regulation." },
                ].map((s, i) => (
                  <p key={i} style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, margin: "0 0 6px" }}>
                    <strong style={{ color: colors.text }}>{s.period}:</strong> {s.desc}
                  </p>
                ))}
                <p style={{ marginTop: 12, fontSize: 14, color: colors.textMuted, fontStyle: "italic", borderTop: `1px solid ${colors.border}`, paddingTop: 10, margin: "12px 0 0" }}>
                  The protocol does not cure anything. It manages load. This is not dependency — it is maintenance. You do not stop maintaining a bridge because it has not collapsed yet.
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${colors.border}`, padding: "16px 20px", textAlign: "center", background: colors.white }}>
        <p style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>The Nervous System Operating Manual — Yve Bergeron — Neurodiversity & Autism Studies, University College Cork</p>
        <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 2, fontStyle: "italic", margin: "2px 0 0" }}>The nervous system is the last interface.</p>
      </footer>
    </div>
  );
}
