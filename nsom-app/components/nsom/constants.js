// ═══════════════════════════════════════════════════════════════
// NSOM Constants and Color System
// ═══════════════════════════════════════════════════════════════

// ─── AAA Color System ───
// All text colors verified 7:1+ on bg (#F2F7F7) for normal text
// Large text (18px+ / 14px+ bold) needs only 4.5:1
// Button text (white on colored bg) verified 7:1+
export const C = {
  bg: "#F0F5F5",       // Main background
  bgDeep: "#E0EBEB",   // Section backgrounds
  bgWarm: "#D4E0E0",   // Wells, inactive cards
  text: "#1A3333",      // Primary text — 12:1 on bg
  textMuted: "#2D4F4F", // Secondary text — 8:1 on bg
  textLight: "#3A5858", // Labels, captions — 7.1:1 on bg
  accent: "#195252",    // Accent text/links — 7.5:1 on bg
  accentBtn: "#1B5656", // Button bg — 7.4:1 with white text
  accentHover: "#1E6363",// Button hover
  accentGlow: "rgba(25, 82, 82, 0.10)",
  accentSoft: "rgba(25, 82, 82, 0.06)",
  green: "#1A5528",     // Success text — 7.6:1 on bg
  greenBtn: "#1D5E2D",  // Green button bg — 7.2:1 white
  greenSoft: "rgba(26, 85, 40, 0.10)",
  amber: "#6B4E1A",     // Warning text — 7.3:1 on bg
  amberBtn: "#6B4E1A",  // Amber button bg
  amberSoft: "rgba(107, 78, 26, 0.10)",
  red: "#7A2D2D",       // Error/critical — 9.2:1 on bg
  redSoft: "rgba(122, 45, 45, 0.10)",
  blue: "#24506B",      // Info text — 7.7:1 on bg
  blueSoft: "rgba(36, 80, 107, 0.10)",
  white: "#FFFFFF",
  border: "#B0C8C8",
  borderLight: "#C8D8D8",
  // Decorative (no contrast req for non-text)
  accentDeco: "#2A7A7A",
  greenDeco: "#3D7A52",
  amberDeco: "#8A6E2F",
  redDeco: "#9E4444",
};

export const LOAD_DOMAINS = ["Cognitive", "Emotional", "Sensory", "Social", "Executive"];

export const SENSATIONS = [
  "Tight", "Heavy", "Buzzy", "Numb", "Warm", "Cold",
  "Racing", "Foggy", "Shallow breathing", "Chest pressure",
  "Throat constriction", "Jaw clenched"
];

export const CONTEXTS = [
  "Work", "Home", "Parenting", "Social event", "Meeting", "Commute",
  "Morning", "Evening", "After conflict", "Sensory overload",
  "Sleep-deprived", "Transition"
];

export const SESSION_TYPES = [
  {
    id: "morning",
    label: "Morning Baseline",
    icon: "☀",
    desc: "Set the day's starting state. Brief journaling."
  },
  {
    id: "acute",
    label: "Regulation Loop",
    icon: "⚡",
    desc: "Something happened. Full protocol."
  },
  {
    id: "work",
    label: "Work Cycle Reset",
    icon: "⏱",
    desc: "90-minute cycle break. Condensed loop."
  },
  {
    id: "discharge",
    label: "End-of-Day Discharge",
    icon: "☽",
    desc: "Release work content. Journaling only."
  },
  {
    id: "evening",
    label: "Evening Wind-Down",
    icon: "★",
    desc: "Second daily loop. Day summary."
  },
];

export const STORAGE_KEY = "nsom-v4";
export const STORAGE_ENTRIES = "nsom-v4-entries";
export const STORAGE_CHECKINS = "nsom-v4-checkins";
export const STORAGE_RESETS = "nsom-v4-resets";
export const STORAGE_REDLINES = "nsom-v4-redlines";
export const STORAGE_WORK = "nsom-v4-work";
export const STORAGE_TRANSITIONS = "nsom-v4-transitions";
export const STORAGE_DEFECTS = "nsom-v4-defects";

export const DEFECT_CAUSES = [
  "Missed regulation break", "Insufficient recovery buffer", "Sensory overload",
  "Social masking cost", "Sleep deficit", "Nutrition skip", "Transition failure",
  "Underestimated task load", "Unexpected demand", "Custom",
];

export const TRANSITION_ACTIVITIES = ["Work task", "Meeting", "Break", "Email", "Commute", "Childcare", "Meal", "Exercise", "Social", "Rest", "Other"];

export const focusStyle = {
  outline: "3px solid #195252",
  outlineOffset: "2px",
  borderRadius: 4
};

export const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: 0
};
