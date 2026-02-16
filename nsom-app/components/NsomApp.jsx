import { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

const STORAGE_KEY = "nsom-tracker-v3";
const DAILY_KEY = "nsom-daily-v3";

const colors = {
  bg: "#F7F3EE",
  bgDeep: "#EDE7DF",
  bgWarm: "#E8DFD4",
  text: "#3D3229",
  textMuted: "#8B7D6F",
  textLight: "#A69888",
  accent: "#B8845C",
  accentSoft: "#D4A97A",
  accentGlow: "rgba(184, 132, 92, 0.12)",
  green: "#7A9E7E",
  greenSoft: "rgba(122, 158, 126, 0.15)",
  greenDark: "#5C8260",
  amber: "#C4964A",
  amberSoft: "rgba(196, 150, 74, 0.15)",
  red: "#B85C5C",
  redSoft: "rgba(184, 92, 92, 0.12)",
  white: "#FFFFFF",
  border: "#DDD4C8",
  borderLight: "#E8E0D6",
  blue: "#6B8EAE",
  blueSoft: "rgba(107, 142, 174, 0.15)",
};

const LOAD_DOMAINS = ["Cognitive", "Emotional", "Sensory", "Social", "Executive"];

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

// ——— Step Definitions ———
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
    instruction: "Find and name 3 colours in the room. Say them out loud or internally.",
    rationale: "Activates the ventral vagal complex through visual orientation without emotional content. Naming colours engages the prefrontal cortex in a low-demand task, competing with the amygdala for processing resources. This is neuroception — telling the nervous system 'I can see, therefore I am safe enough to look.'",
    timerSeconds: 30,
    timerLabel: "Orientation time",
    trackPrompt: "I've named 3 colours",
    trackWhat: "Named 3 colours in room",
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

// ——— Btn ———
function Btn({ children, onClick, variant = "primary", disabled, small, style }) {
  const base = {
    padding: small ? "6px 16px" : "10px 24px",
    borderRadius: 8,
    fontSize: small ? 13 : 14,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit",
    border: "none",
    transition: "all 0.2s",
    ...style,
  };
  const variants = {
    primary: { background: disabled ? colors.bgWarm : colors.accent, color: disabled ? colors.textLight : colors.white },
    secondary: { background: "transparent", color: colors.textMuted, border: `1.5px solid ${colors.border}` },
    green: { background: colors.green, color: colors.white },
    amber: { background: colors.amber, color: colors.white },
    ghost: { background: "transparent", color: colors.textMuted, padding: small ? "4px 10px" : "8px 16px" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

// ——— Section Header ———
function SectionHead({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
        {icon && <span style={{ marginRight: 10 }}>{icon}</span>}{title}
      </div>
      {subtitle && <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

// ——— Callout ———
function Callout({ children, type = "info" }) {
  const styles = {
    info: { bg: colors.amberSoft, border: colors.amber },
    success: { bg: colors.greenSoft, border: colors.green },
    warning: { bg: colors.redSoft, border: colors.red },
    neutral: { bg: colors.bgDeep, border: colors.accent },
  };
  const s = styles[type];
  return (
    <div style={{ background: s.bg, borderLeft: `4px solid ${s.border}`, borderRadius: 10, padding: "14px 18px", color: colors.text, fontSize: 14, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

// ——— Breathing Animation ———
function BreathingGuide({ active, onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [breathNum, setBreathNum] = useState(0);
  const timerRef = useRef(null);

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
  const circleSize = phase === "inhale" ? 120 : phase === "exhale" ? 60 : 90;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "24px 0" }}>
      <div style={{
        width: circleSize, height: circleSize, borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.accentSoft} 0%, ${colors.accent}33 100%)`,
        boxShadow: `0 0 ${phase === "inhale" ? 40 : 20}px ${colors.accent}22`,
        transition: "all 1s ease-in-out",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: colors.accent, fontWeight: 600 }}>
          {phase === "done" ? "✓" : count}
        </span>
      </div>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: colors.textMuted, fontStyle: "italic" }}>
        {phase === "inhale" ? "Breathe in through your nose..." : phase === "exhale" ? "Breathe out through your mouth..." : "Complete"}
      </span>
      <span style={{ fontSize: 12, color: colors.textLight }}>Breath {Math.min(breathNum, 3)} of 3</span>
    </div>
  );
}

// ——— Countdown Timer ———
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

  return (
    <div style={{ background: colors.white, border: `1px solid ${colors.borderLight}`, borderRadius: 10, padding: "14px 18px", marginTop: 10 }}>
      <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 600, color: remaining === 0 ? colors.green : colors.text, minWidth: 70 }}>
          {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 5, background: colors.bgDeep, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: remaining === 0 ? colors.green : colors.accent, borderRadius: 3, transition: "width 1s linear" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {remaining === 0 ? (
            <span style={{ fontSize: 13, color: colors.green, fontWeight: 600 }}>✓ Done</span>
          ) : running ? (
            <Btn small variant="secondary" onClick={pause}>Pause</Btn>
          ) : (
            <>
              <Btn small onClick={start}>{remaining < duration ? "Resume" : "Start"}</Btn>
              {remaining < duration && <Btn small variant="ghost" onClick={reset}>Reset</Btn>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ——— Enhanced Step Card ———
function EnhancedStepCard({ stepDef, active, completed, completedTime, onClick, onComplete, onBreathingStart, breathingActive }) {
  const [showRationale, setShowRationale] = useState(false);
  const { number, title, instruction, rationale, timerSeconds, timerLabel, hasBreathingGuide, trackPrompt } = stepDef;

  return (
    <div style={{
      background: completed ? colors.greenSoft : active ? colors.white : colors.bgDeep,
      border: `1.5px solid ${active ? colors.accent : completed ? colors.green : colors.borderLight}`,
      borderRadius: 14, overflow: "hidden",
      transition: "all 0.3s ease", opacity: !active && !completed ? 0.5 : 1,
      boxShadow: active ? `0 4px 24px ${colors.accentGlow}` : "none",
    }}>
      {/* Header row — always visible, clickable */}
      <div onClick={onClick} style={{
        padding: "16px 20px", cursor: onClick ? "pointer" : "default",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        {/* Step number / checkmark */}
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: completed ? colors.green : active ? colors.accent : colors.bgWarm,
          color: completed || active ? colors.white : colors.textMuted,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 600, flexShrink: 0,
          transition: "all 0.3s",
        }}>
          {completed ? "✓" : number}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 600, color: colors.text }}>
            {title}
          </div>
          {completed && completedTime && (
            <div style={{ fontSize: 11, color: colors.greenDark, marginTop: 2 }}>
              Completed at {completedTime}
            </div>
          )}
        </div>

        {/* Completion indicator */}
        {completed && (
          <div style={{
            padding: "3px 10px", borderRadius: 12,
            background: colors.green, color: colors.white,
            fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
          }}>DONE</div>
        )}
      </div>

      {/* Expanded content — only when active */}
      {active && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${colors.borderLight}`, paddingTop: 16 }}>
          {/* Instruction */}
          <div style={{ fontSize: 15, color: colors.text, lineHeight: 1.7, marginBottom: 12 }}>
            {instruction}
          </div>

          {/* Expandable rationale */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowRationale(!showRationale); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: colors.accent, fontWeight: 500,
              fontFamily: "inherit", padding: "4px 0", marginBottom: showRationale ? 8 : 12,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ transition: "transform 0.2s", transform: showRationale ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
            {showRationale ? "Hide rationale" : "Why this works"}
          </button>
          {showRationale && (
            <div style={{
              fontSize: 13, color: colors.textMuted, lineHeight: 1.65,
              padding: "12px 16px", marginBottom: 14,
              background: colors.bgDeep, borderRadius: 8,
              borderLeft: `3px solid ${colors.accentSoft}`,
            }}>
              {rationale}
            </div>
          )}

          {/* Timer (if step has one) */}
          {timerSeconds && !hasBreathingGuide && (
            <CountdownTimer duration={timerSeconds} label={timerLabel} onComplete={() => {}} />
          )}

          {/* Breathing guide (step 2) */}
          {hasBreathingGuide && (
            <>
              {!breathingActive && (
                <Btn small onClick={(e) => { e.stopPropagation(); onBreathingStart(); }} style={{ marginBottom: 8 }}>
                  Start breathing guide
                </Btn>
              )}
              <BreathingGuide active={breathingActive} onComplete={onComplete} />
            </>
          )}

          {/* Completion button */}
          {!hasBreathingGuide && (
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
              <Btn small onClick={(e) => { e.stopPropagation(); onComplete(); }}>
                {trackPrompt} →
              </Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ——— Decision Gate ———
function DecisionGate({ onYes, onNo, attempt }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${colors.amberSoft}, ${colors.accentGlow})`, border: `2px solid ${colors.amber}`, borderRadius: 14, padding: "28px 24px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2.5, color: colors.amber, marginBottom: 10 }}>
        Decision Gate{attempt > 1 ? ` — Attempt ${attempt}` : ""}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: colors.text, marginBottom: 8 }}>Did the body show any change?</div>
      <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 22, lineHeight: 1.6, maxWidth: 460, margin: "0 auto 22px" }}>
        Any change counts: breathing slightly slower, shoulders slightly lower, thoughts slightly less loud. Even "not worse" is valid.
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn variant="green" onClick={onYes}>Yes — something shifted</Btn>
        <Btn variant="secondary" onClick={onNo}>No change</Btn>
      </div>
    </div>
  );
}

// ——— Daily Progress Bar ———
function DailyProgress({ completedSteps, totalSteps }) {
  const pct = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  return (
    <div style={{ background: colors.white, border: `1px solid ${colors.borderLight}`, borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Today's Loop</span>
        <span style={{ fontSize: 13, color: completedSteps === totalSteps && completedSteps > 0 ? colors.green : colors.textMuted, fontWeight: 600 }}>
          {completedSteps}/{totalSteps} steps
        </span>
      </div>
      <div style={{ height: 6, background: colors.bgDeep, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: completedSteps === totalSteps && completedSteps > 0 ? colors.green : colors.accent,
          borderRadius: 3, transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

// ——— Claude API Call ———
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

// ——— Load Domain Detector ———
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
5. EXECUTIVE — planning, organising, initiating, transitioning. Markers: paralysis, decision fatigue, the "wall" between intention and action

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
    <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Load Domain Detection</div>
      <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 14 }}>Describe what you're experiencing — physical sensations, situation, what's difficult right now.</div>
      <textarea
        value={input} onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., I can't start the report even though I know what to write. My head feels foggy and I keep checking my phone instead..."
        style={{ width: "100%", minHeight: 80, padding: 14, border: `1px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 14, fontFamily: "'Source Serif 4', Georgia, serif", color: colors.text, background: colors.bg, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", outline: "none" }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <Btn onClick={analyze} disabled={!input.trim() || loading}>{loading ? "Analysing..." : "Identify Load Domains"}</Btn>
      </div>
      {result && (
        <div style={{ marginTop: 16, padding: 16, background: colors.bgDeep, borderRadius: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ padding: "4px 14px", borderRadius: 20, background: domainColors[result.primary] || colors.accent, color: colors.white, fontSize: 13, fontWeight: 600 }}>
              Primary: {result.primary}
            </span>
            {result.secondary && result.secondary !== "null" && (
              <span style={{ padding: "4px 14px", borderRadius: 20, background: (domainColors[result.secondary] || colors.accent) + "33", color: domainColors[result.secondary] || colors.accent, fontSize: 13, fontWeight: 600, border: `1px solid ${domainColors[result.secondary] || colors.accent}` }}>
                Secondary: {result.secondary}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.6, marginBottom: 10 }}>{result.explanation}</div>
          <div style={{ fontSize: 14, color: colors.greenDark, lineHeight: 1.6, padding: "10px 14px", background: colors.greenSoft, borderRadius: 8 }}>
            <strong>Intervention:</strong> {result.intervention}
          </div>
        </div>
      )}
    </div>
  );
}

// ——— Weekly Pattern Analysis ———
function WeeklyPatternAnalysis({ entries }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const last7 = entries.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return (now - d) / 86400000 <= 7;
  });

  async function analyze() {
    if (last7.length === 0) return;
    setLoading(true);
    const systemPrompt = `You are an expert in autonomic nervous system regulation for neurodivergent individuals, trained on the NSOM framework by Yve Bergeron.

You are performing a Weekly Pattern Analysis on regulation log data. Your job is to:
1. Identify recurring patterns — what keeps showing up (not why)
2. Note which load domains appear most often
3. Note body sensation patterns
4. Assess gate pass rate and what it indicates
5. Suggest ONE concrete decision or action based on the patterns

Rules:
- Look for patterns, not causes
- Ask "what keeps showing up" not "why"
- One decision maximum
- Do not psychoanalyse — report what the data shows

Respond in this exact JSON format only, no markdown, no backticks:
{"patterns":["pattern 1","pattern 2","pattern 3"],"dominant_domain":"most frequent domain or null","sensation_pattern":"recurring body sensations","gate_rate":"X/Y with brief interpretation","risk_flags":["any red line concerns"],"one_decision":"single concrete action suggested","summary":"3-4 sentence overall assessment"}`;

    const dataStr = last7.map((e) => `Date:${e.date} Time:${e.timeOfDay || "?"} Gate:${e.gatePassed ? "passed" : "no"} Attempts:${e.attempts || 1} Escalated:${e.escalated ? "yes" : "no"} Steps:${(e.stepsCompleted || []).join(",")} Domain:${e.loadDomain || "?"} Sensations:${(e.sensations || []).join(",")} HRV:${e.hrv || "?"} HR:${e.hr || "?"} Journal:${e.journal || "none"}`).join("\n");

    const text = await callClaude(systemPrompt, `Here are the regulation log entries from the past 7 days:\n\n${dataStr}`);
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch {
      setResult({ patterns: [], dominant_domain: null, sensation_pattern: "", gate_rate: "", risk_flags: [], one_decision: "", summary: text });
    }
    setLoading(false);
  }

  return (
    <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Weekly Pattern Analysis</div>
      <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 14 }}>
        {last7.length === 0 ? "No entries in the past 7 days." : `${last7.length} entries available for analysis.`}
      </div>
      <Btn onClick={analyze} disabled={last7.length === 0 || loading}>{loading ? "Analysing patterns..." : `Analyse ${last7.length} entries`}</Btn>

      {result && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 14, background: colors.bgDeep, borderRadius: 10, fontSize: 14, color: colors.text, lineHeight: 1.6 }}>{result.summary}</div>
          {result.patterns?.length > 0 && (
            <div style={{ padding: 14, background: colors.blueSoft, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.blue, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Recurring Patterns</div>
              {result.patterns.map((p, i) => (
                <div key={i} style={{ fontSize: 14, color: colors.text, lineHeight: 1.6, paddingLeft: 12, borderLeft: `2px solid ${colors.blue}`, marginBottom: 6 }}>{p}</div>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {result.dominant_domain && (
              <div style={{ background: colors.amberSoft, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: colors.textLight }}>Dominant domain</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: colors.amber }}>{result.dominant_domain}</div>
              </div>
            )}
            {result.gate_rate && (
              <div style={{ background: colors.greenSoft, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: colors.textLight }}>Gate rate</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: colors.green }}>{result.gate_rate}</div>
              </div>
            )}
            {result.sensation_pattern && (
              <div style={{ background: colors.accentGlow, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: colors.textLight }}>Body pattern</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.accent, marginTop: 2 }}>{result.sensation_pattern}</div>
              </div>
            )}
          </div>
          {result.risk_flags?.length > 0 && (
            <div style={{ padding: 14, background: colors.redSoft, borderRadius: 10, borderLeft: `4px solid ${colors.red}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.red, marginBottom: 4 }}>Flags</div>
              {result.risk_flags.map((f, i) => <div key={i} style={{ fontSize: 14, color: colors.text }}>{f}</div>)}
            </div>
          )}
          {result.one_decision && (
            <div style={{ padding: 14, background: colors.greenSoft, borderRadius: 10, borderLeft: `4px solid ${colors.green}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.greenDark, marginBottom: 4 }}>One Decision (Maximum)</div>
              <div style={{ fontSize: 15, color: colors.text, lineHeight: 1.6 }}>{result.one_decision}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ——— DGAEP With Timers ———
function DGAEPWithTimers() {
  const levels = [
    { level: 1, name: "Postural Reset & Breathing", time: "3–5 min", seconds: 240, desc: "Change position. Drink water (cold if available). 3 slow breaths: inhale nose, exhale mouth. Place both feet on the floor.", rationale: "Postural change interrupts proprioceptive feedback. Hydration addresses dehydration-driven sympathetic activation. Slow breathing activates vagal tone." },
    { level: 2, name: "Sensory Weight", time: "15–20 min", seconds: 1020, desc: "Weighted blanket, heavy hoodie, or lap pad. Apply firm pressure — palms together, squeeze arms, press back into wall. If tolerated: cold water on wrists, cold cloth on neck.", rationale: "Deep pressure activates parasympathetic response through proprioceptive loading. Cold input triggers the mammalian dive reflex." },
    { level: 3, name: "Cognitive Loop Interruption", time: "10–15 min", seconds: 720, desc: "Count backwards from 100 by 7s. Name objects by category (all blue things, all wooden things). Describe a physical object in exact detail.", rationale: "Not calming — redirecting. Reroutes cognitive resources maintaining the loop toward external structured tasks." },
    { level: 4, name: "Rhythmic Override", time: "10–20 min", seconds: 900, desc: "Walking (any pace, rhythmic, continuous). Rocking. Bilateral tapping — alternate tapping knees or shoulders. Drumming at steady beat.", rationale: "Pattern interrupts at the motor cortex level. Vestibular and proprioceptive input competes with the cognitive loop for processing resources." },
    { level: 5, name: "Sensory Containment", time: "20–30 min", seconds: 1500, desc: "Darken room. Noise-cancelling headphones or silence. Functional language only. No questions about feelings. Containment, not engagement.", rationale: "When the system hasn't responded to increased input, reduce total sensory load. The system is overwhelmed by input volume — including regulatory input." },
    { level: 6, name: "Time-Based Holding", time: "20–30 min", seconds: 1500, desc: "Set timer. Stay present. No interventions. No fixing. No techniques. Time and physical safety only.", rationale: "Containment is a valid endpoint. Not every escalation resolves in calm. The goal is that activation does not worsen." },
  ];

  const [activeLevel, setActiveLevel] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Callout type="info">
        <strong>Decision gate at every level:</strong> After the timer completes — did the body change? YES → stay at current level. NO → escalate. Follow levels in order. Do not skip.
      </Callout>
      {levels.map((l) => (
        <div key={l.level} style={{ background: colors.white, borderRadius: 12, border: `1px solid ${activeLevel === l.level ? colors.accent : colors.borderLight}`, overflow: "hidden", transition: "all 0.2s" }}>
          <div onClick={() => setActiveLevel(activeLevel === l.level ? null : l.level)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: colors.accent, color: colors.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{l.level}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, color: colors.text }}>{l.name}</div>
            </div>
            <span style={{ fontSize: 12, color: colors.textLight }}>{l.time}</span>
          </div>
          {activeLevel === l.level && (
            <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${colors.borderLight}`, paddingTop: 14 }}>
              <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.6, marginBottom: 10 }}>{l.desc}</div>
              <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.5, fontStyle: "italic", marginBottom: 14, paddingLeft: 12, borderLeft: `2px solid ${colors.bgWarm}` }}>{l.rationale}</div>
              <CountdownTimer duration={l.seconds} label={`Level ${l.level} timer`} onComplete={() => {}} />
            </div>
          )}
        </div>
      ))}
      <div style={{ background: colors.redSoft, borderRadius: 12, padding: "16px 20px", borderLeft: `4px solid ${colors.red}`, marginTop: 4 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: colors.red, marginBottom: 4 }}>Medical Red Flags — Stop protocol, seek immediate medical help</div>
        <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>
          Chest pain · Fainting · Confusion or disorientation · Slurred speech · New neurological symptoms · Panic persisting for hours without fluctuation
        </div>
      </div>
    </div>
  );
}

// ——— Journaling Section ———
function JournalingSection({ entry, setEntry, sensations, setSensations, loadDomain, setLoadDomain, hrv, setHrv, hr, setHr, onSave, notes, setNotes }) {
  const sensationOptions = ["Tight", "Heavy", "Buzzy", "Numb", "Warm", "Cold", "Racing", "Foggy", "Shallow breathing", "Chest pressure", "Throat constriction", "Jaw clenched"];
  const toggleSensation = (s) => setSensations((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: colors.greenSoft, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.green, textTransform: "uppercase", letterSpacing: 1.5 }}>Gate Passed — Journaling Unlocked</span>
      </div>
      <Callout type="neutral">
        <strong>Journaling rules:</strong> Storage, not understanding. No decisions while journaling. No reviewing immediately after. If the body worsens, stop.
      </Callout>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 8 }}>Body Sensations (from your scan)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {sensationOptions.map((s) => (
            <button key={s} onClick={() => toggleSensation(s)} style={{
              padding: "5px 12px", borderRadius: 20, border: `1px solid ${sensations.includes(s) ? colors.accent : colors.borderLight}`,
              background: sensations.includes(s) ? colors.accentGlow : "transparent", color: sensations.includes(s) ? colors.accent : colors.textMuted,
              fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: sensations.includes(s) ? 600 : 400,
            }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>Primary Load Domain</div>
          <select value={loadDomain} onChange={(e) => setLoadDomain(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontSize: 13, fontFamily: "inherit", color: colors.text, background: colors.bg, outline: "none" }}>
            <option value="">Select...</option>
            {LOAD_DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>HRV (SDNN ms)</div>
          <input type="number" value={hrv} onChange={(e) => setHrv(e.target.value)} placeholder="e.g. 38" style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontSize: 13, fontFamily: "inherit", color: colors.text, background: colors.bg, boxSizing: "border-box", outline: "none" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>Resting HR (bpm)</div>
          <input type="number" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="e.g. 68" style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontSize: 13, fontFamily: "inherit", color: colors.text, background: colors.bg, boxSizing: "border-box", outline: "none" }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>Journal Entry — describe, don't analyse</div>
        <textarea value={entry} onChange={(e) => setEntry(e.target.value)}
          placeholder='"My chest was tight. Shoulders were high. Breathing was shallow." — Description only.'
          style={{ width: "100%", minHeight: 100, padding: 14, border: `1px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 14, fontFamily: "'Source Serif 4', Georgia, serif", color: colors.text, background: colors.bg, resize: "vertical", lineHeight: 1.7, boxSizing: "border-box", outline: "none" }}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>Context notes (what was happening)</div>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Brief context..." style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontSize: 13, fontFamily: "inherit", color: colors.text, background: colors.bg, boxSizing: "border-box", outline: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: colors.textLight }}>Store. Save and close. Do not re-read.</span>
        <Btn onClick={onSave}>Store & Close</Btn>
      </div>
    </div>
  );
}

// ——— HRV Chart ———
function HRVChart({ entries }) {
  const hrvData = entries.filter((e) => e.hrv).sort((a, b) => a.date.localeCompare(b.date)).map((e) => ({
    date: new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    hrv: e.hrv,
    hr: e.hr || null,
  }));

  if (hrvData.length < 2) {
    return (
      <div style={{ textAlign: "center", padding: "32px 20px", color: colors.textLight }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17 }}>Need at least 2 HRV entries to show a trend</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Log your HRV reading from Apple Health when creating regulation entries.</div>
      </div>
    );
  }

  const avgHRV = Math.round(hrvData.reduce((s, d) => s + d.hrv, 0) / hrvData.length);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: colors.textLight }}>HRV (SDNN ms) — higher indicates better parasympathetic recovery</div>
        <div style={{ fontSize: 13, color: colors.textMuted }}>Avg: <strong>{avgHRV} ms</strong></div>
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
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.textLight }} />
            <YAxis tick={{ fontSize: 11, fill: colors.textLight }} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip contentStyle={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 13 }} />
            <ReferenceLine y={avgHRV} stroke={colors.textLight} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="hrv" stroke="none" fill="url(#hrvGradient)" />
            <Line type="monotone" dataKey="hrv" stroke={colors.accent} strokeWidth={2.5} dot={{ fill: colors.accent, r: 3 }} />
            {hrvData.some((d) => d.hr) && (
              <Line type="monotone" dataKey="hr" stroke={colors.red} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ——— History View ———
function HistoryView({ entries }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const last7 = sorted.filter((e) => (new Date() - new Date(e.date)) / 86400000 <= 7);
  const gateRate = last7.length > 0 ? Math.round((last7.filter((e) => e.gatePassed).length / last7.length) * 100) : 0;
  const avgAttempts = last7.length > 0 ? (last7.reduce((s, e) => s + (e.attempts || 1), 0) / last7.length).toFixed(1) : "—";
  const escalations = last7.filter((e) => e.escalated).length;
  const avgSteps = last7.length > 0 ? (last7.reduce((s, e) => s + (e.stepsCompleted?.length || 0), 0) / last7.length).toFixed(1) : "—";

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ background: colors.greenSoft, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: colors.green }}>{gateRate}%</div>
          <div style={{ fontSize: 11, color: colors.textMuted }}>Gate pass (7d)</div>
        </div>
        <div style={{ background: colors.amberSoft, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: colors.amber }}>{avgAttempts}</div>
          <div style={{ fontSize: 11, color: colors.textMuted }}>Avg attempts</div>
        </div>
        <div style={{ background: colors.blueSoft, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: colors.blue }}>{avgSteps}</div>
          <div style={{ fontSize: 11, color: colors.textMuted }}>Avg steps</div>
        </div>
        <div style={{ background: colors.accentGlow, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: colors.accent }}>{sorted.length}</div>
          <div style={{ fontSize: 11, color: colors.textMuted }}>Total entries</div>
        </div>
      </div>

      {sorted.slice(0, 20).map((entry, i) => (
        <div key={i} style={{ background: colors.white, borderRadius: 8, padding: "12px 16px", border: `1px solid ${colors.borderLight}`, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.gatePassed ? colors.green : entry.escalated ? colors.amber : colors.red, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>
                {friendlyDate(entry.date)}{entry.timeOfDay ? ` · ${entry.timeOfDay}` : ""}
                {entry.loadDomain && <span style={{ marginLeft: 8, padding: "1px 8px", borderRadius: 10, background: colors.bgDeep, fontSize: 11, color: colors.textMuted }}>{entry.loadDomain}</span>}
              </div>
              {entry.journal && <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.journal}</div>}
            </div>
            <div style={{ fontSize: 11, color: colors.textLight, textAlign: "right", flexShrink: 0 }}>
              {entry.gatePassed ? "Gate ✓" : entry.escalated ? `Esc L${entry.escalationLevel || "?"}` : "No shift"}
              {entry.stepsCompleted && <div>{entry.stepsCompleted.length}/6 steps</div>}
              {entry.hrv ? <div>{entry.hrv} ms</div> : null}
            </div>
          </div>
          {/* Step completion row */}
          {entry.stepsCompleted && entry.stepsCompleted.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${colors.borderLight}` }}>
              {STEPS.map((s) => (
                <div key={s.number} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: entry.stepsCompleted.includes(s.number) ? colors.green : colors.bgDeep,
                }} title={`Step ${s.number}: ${s.title}`} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ——— Red Lines ———
function RedLines() {
  const lines = [
    { title: "Sleep below 5 hours for 2+ consecutive nights", action: "Cancel all non-essential commitments. The system cannot regulate on insufficient sleep." },
    { title: "Sustained activation for 4+ hours", action: "Activate acute dysregulation protocol → DGAEP → seek human support." },
    { title: "Loss of appetite for 24+ hours", action: "Dorsal vagal signalling — shutdown. Reduce all demands. Prioritise gentle movement and warmth." },
    { title: "Inability to complete the regulation loop", action: "Load failure, not regulation failure. Seek co-regulation from a safe person or environment." },
    { title: "Suicidal ideation or self-harm urges", action: "Medical emergency. Contact emergency services, crisis helpline, or trusted person immediately.", critical: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {lines.map((rl, i) => (
        <div key={i} style={{ background: rl.critical ? colors.redSoft : colors.white, border: `1px solid ${rl.critical ? colors.red : colors.border}`, borderRadius: 10, padding: "14px 18px", borderLeft: `4px solid ${colors.red}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{rl.title}</div>
          <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>{rl.action}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════ MAIN APP ═══════════════
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

  // Daily step tracking
  const [dailySteps, setDailySteps] = useState({});
  // dailySteps = { stepNumber: { completed: true, time: "2:30 PM" } }

  // Load persisted data
  useEffect(() => {
    setEntries(loadData(STORAGE_KEY, []));
    const daily = loadData(DAILY_KEY, { date: null, steps: {} });
    if (daily.date === todayStr()) {
      setDailySteps(daily.steps);
    } else {
      // New day — reset daily tracking
      saveData(DAILY_KEY, { date: todayStr(), steps: {} });
    }
  }, []);

  function saveDailyStep(stepNum) {
    const updated = { ...dailySteps, [stepNum]: { completed: true, time: timeNow() } };
    setDailySteps(updated);
    saveData(DAILY_KEY, { date: todayStr(), steps: updated });
  }

  function completedStepCount() {
    return Object.keys(dailySteps).filter((k) => dailySteps[k]?.completed).length;
  }

  function advanceStep() {
    saveDailyStep(step);
    if (step < 6) setStep(step + 1);
    else setGateReached(true);
  }

  function handleGateYes() { setGatePassed(true); }
  function handleGateNo() {
    if (attempt < 2) { setAttempt(2); setStep(1); setGateReached(false); }
    else {
      setEscalated(true);
      const e = {
        date: todayStr(),
        timeOfDay: new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening",
        gatePassed: false, escalated: true, attempts: 2,
        stepsCompleted: Object.keys(dailySteps).filter((k) => dailySteps[k]?.completed).map(Number),
        journal: null, sensations: [], loadDomain: "",
        hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null, notes: "",
      };
      const updated = [...entries, e]; setEntries(updated); saveData(STORAGE_KEY, updated);
    }
  }

  function handleSave() {
    const e = {
      date: todayStr(),
      timeOfDay: new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening",
      gatePassed: true, escalated: false, attempts: attempt,
      stepsCompleted: Object.keys(dailySteps).filter((k) => dailySteps[k]?.completed).map(Number),
      journal: journalEntry.trim() || null, sensations, loadDomain,
      hrv: hrv ? Number(hrv) : null, hr: hr ? Number(hr) : null,
      notes: notes.trim() || null,
    };
    const updated = [...entries, e]; setEntries(updated); saveData(STORAGE_KEY, updated); setSaved(true);
  }

  function resetLoop() {
    setStep(1); setBreathingActive(false); setGateReached(false); setGatePassed(false);
    setAttempt(1); setEscalated(false); setJournalEntry(""); setSensations([]);
    setLoadDomain(""); setHrv(""); setHr(""); setNotes(""); setSaved(false);
  }

  const navItems = [
    { id: "loop", label: "Regulation Loop", icon: "○" },
    { id: "dgaep", label: "Escalation", icon: "↑" },
    { id: "tracking", label: "Tracking", icon: "◫" },
    { id: "analysis", label: "Analysis", icon: "◉" },
    { id: "redlines", label: "Red Lines", icon: "●" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "24px 20px 18px", background: colors.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: colors.accent, marginBottom: 4 }}>The Nervous System Operating Manual</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: colors.text, lineHeight: 1.2, marginBottom: 3 }}>Daily Regulation Protocol</div>
          <div style={{ fontSize: 14, color: colors.textMuted, fontStyle: "italic" }}>Your body has a job. Its job is to keep you safe. This protocol tells you how to let it.</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, background: colors.white, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              padding: "10px 16px", border: "none", borderBottom: view === item.id ? `2px solid ${colors.accent}` : "2px solid transparent",
              background: "transparent", color: view === item.id ? colors.accent : colors.textMuted,
              fontSize: 13, fontWeight: view === item.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}>{item.icon} {item.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ═══ REGULATION LOOP ═══ */}
        {view === "loop" && (
          <div>
            <DailyProgress completedSteps={completedStepCount()} totalSteps={6} />

            <Callout type="info"><strong>Core Principle:</strong> No body change = no next step. The body is the authority, not the mind, not the schedule, not the therapist, and not the protocol itself.</Callout>
            <div style={{ height: 16 }} />

            {saved ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>○</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: colors.green, marginBottom: 6 }}>Entry Stored</div>
                <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 20 }}>Do not re-read. Processing happens later, on a different day, with full capacity.</div>
                <Btn variant="secondary" onClick={resetLoop}>Start a new loop</Btn>
              </div>
            ) : escalated ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>↑</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: colors.amber, marginBottom: 6 }}>Escalate to DGAEP</div>
                <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 6 }}>The regulation loop was attempted twice and the body has not shifted. This is not failure — the activation level exceeds first-line capacity.</div>
                <div style={{ fontSize: 13, color: colors.textMuted, fontStyle: "italic", marginBottom: 20 }}>When first-line regulation fails, escalation is not failure. It is the next step in the protocol.</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <Btn onClick={() => setView("dgaep")}>Open DGAEP Protocol</Btn>
                  <Btn variant="secondary" onClick={resetLoop}>Reset</Btn>
                </div>
              </div>
            ) : gatePassed ? (
              <JournalingSection entry={journalEntry} setEntry={setJournalEntry} sensations={sensations} setSensations={setSensations} loadDomain={loadDomain} setLoadDomain={setLoadDomain} hrv={hrv} setHrv={setHrv} hr={hr} setHr={setHr} notes={notes} setNotes={setNotes} onSave={handleSave} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {attempt > 1 && <div style={{ background: colors.amberSoft, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: colors.amber, fontWeight: 500, textAlign: "center" }}>Second attempt — if no change this time, escalate to DGAEP.</div>}

                {STEPS.map((stepDef) => (
                  <EnhancedStepCard
                    key={stepDef.number}
                    stepDef={stepDef}
                    active={step === stepDef.number}
                    completed={step > stepDef.number || (dailySteps[stepDef.number]?.completed && step !== stepDef.number)}
                    completedTime={dailySteps[stepDef.number]?.time}
                    onClick={step > stepDef.number ? undefined : undefined}
                    onComplete={() => {
                      if (stepDef.hasBreathingGuide) {
                        setBreathingActive(false);
                        advanceStep();
                      } else {
                        advanceStep();
                      }
                    }}
                    onBreathingStart={() => setBreathingActive(true)}
                    breathingActive={breathingActive}
                  />
                ))}

                {gateReached && !gatePassed && <DecisionGate onYes={handleGateYes} onNo={handleGateNo} attempt={attempt} />}
              </div>
            )}
          </div>
        )}

        {/* ═══ DGAEP ═══ */}
        {view === "dgaep" && (
          <div>
            <SectionHead icon="↑" title="Decision-Gated Autonomic Escalation Protocol" subtitle="When first-line regulation fails, escalation is not failure. It is the next step." />
            <DGAEPWithTimers />
          </div>
        )}

        {/* ═══ TRACKING ═══ */}
        {view === "tracking" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <SectionHead icon="◫" title="Tracking" subtitle="The pattern matters, not the individual day." />
              {entries.length > 0 && (
                <Btn small variant="ghost" onClick={() => { if (confirm("Clear all data?")) { setEntries([]); saveData(STORAGE_KEY, []); } }}>Reset</Btn>
              )}
            </div>
            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: colors.textLight }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17 }}>No entries yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Complete your first regulation loop to begin tracking.</div>
              </div>
            ) : (
              <>
                <HRVChart entries={entries} />
                <div style={{ height: 20 }} />
                <HistoryView entries={entries} />
              </>
            )}
          </div>
        )}

        {/* ═══ ANALYSIS ═══ */}
        {view === "analysis" && (
          <div>
            <SectionHead icon="◉" title="Analysis" subtitle="Claude-powered pattern detection and load domain identification." />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <LoadDomainDetector />
              <WeeklyPatternAnalysis entries={entries} />
            </div>
          </div>
        )}

        {/* ═══ RED LINES ═══ */}
        {view === "redlines" && (
          <div>
            <SectionHead icon="●" title="Red Lines" subtitle="Non-negotiable structural load limits. Crossing a red line is not failure — it is the system signalling that protective action is required." />
            <RedLines />
            <div style={{ marginTop: 24, background: colors.bgDeep, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, color: colors.text, marginBottom: 10 }}>What Success Looks Like</div>
              {[
                { period: "Daily", desc: "The regulation loop produces a body change more often than it does not. Some days it will not work. The pattern matters." },
                { period: "Weekly", desc: "The weekly reset identifies at least one recurring pattern. You begin to see the system's habits rather than being caught in them." },
                { period: "Monthly", desc: "Baseline HRV and resting HR trend favourably. More time in ventral vagal, less in sustained sympathetic or dorsal vagal." },
                { period: "Quarterly", desc: "Higher load tolerance before the gate's 'no change' branch. Window of tolerance widened through sustained regulation." },
              ].map((s, i) => (
                <div key={i} style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.6, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: colors.text }}>{s.period}:</span> {s.desc}
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 13, color: colors.textMuted, fontStyle: "italic", borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
                The protocol does not cure anything. It manages load. This is not dependency — it is maintenance. You do not stop maintaining a bridge because it has not collapsed yet.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${colors.border}`, padding: "14px 20px", textAlign: "center", background: colors.white }}>
        <div style={{ fontSize: 11, color: colors.textLight }}>The Nervous System Operating Manual — Yve Bergeron — Neurodiversity & Autism Studies, University College Cork</div>
        <div style={{ fontSize: 10, color: colors.textLight, marginTop: 2, fontStyle: "italic" }}>The nervous system is the last interface.</div>
      </div>
    </div>
  );
}
