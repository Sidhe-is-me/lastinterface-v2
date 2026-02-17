// ═══════════════════════════════════════════════════════════
// NSOM Constants
// ═══════════════════════════════════════════════════════════

export const STORAGE_KEY = "nsom-tracker-v3";

export const LOAD_DOMAINS = [
  "Cognitive",
  "Emotional",
  "Sensory",
  "Social",
  "Executive",
];

export const BODY_REGIONS = [
  { id: "head", label: "Head / Face", emoji: "🧠" },
  { id: "neck", label: "Neck / Throat", emoji: "💬" },
  { id: "shoulders", label: "Shoulders / Arms", emoji: "💪" },
  { id: "chest", label: "Chest", emoji: "🫁" },
  { id: "belly", label: "Belly / Gut", emoji: "🌀" },
  { id: "back", label: "Lower Back", emoji: "🔙" },
  { id: "legs", label: "Hips / Legs", emoji: "🦵" },
  { id: "hands", label: "Hands / Feet", emoji: "✋" },
];

export const SENSATIONS = [
  "Tight",
  "Heavy",
  "Buzzy",
  "Numb",
  "Warm",
  "Cold",
  "Racing",
  "Foggy",
  "Pressure",
  "Tingling",
  "Pulsing",
  "Nothing specific",
];

export const CONTEXT_TAGS = [
  "Work",
  "Family",
  "Health",
  "Money",
  "Relationship",
  "Children",
  "Sensory environment",
  "Sleep debt",
  "Social event",
  "Transition / change",
  "No clear trigger",
];

export const LOOP_TOPICS = [
  "Work deadline",
  "Family conflict",
  "Health worry",
  "Financial stress",
  "Relationship",
  "Parenting",
  "Social interaction",
  "Decision paralysis",
  "Unfinished tasks",
  "Past event replay",
  "Future dread",
  "No clear topic",
];

export const RED_LINES = [
  {
    id: "sleep",
    title: "Sleep below 5 hours for 2+ nights",
    action:
      "Cancel all non-essential commitments. The system cannot regulate on insufficient sleep.",
    icon: "🌙",
  },
  {
    id: "activation",
    title: "Sustained activation for 4+ hours",
    action: "Activate DGAEP. If it does not resolve, seek human support.",
    icon: "⚡",
  },
  {
    id: "appetite",
    title: "Loss of appetite for 24+ hours",
    action:
      "Dorsal vagal signalling — shutdown. Reduce all demands. Prioritise gentle movement and warmth.",
    icon: "🍽",
  },
  {
    id: "loop_fail",
    title: "Cannot complete the regulation loop",
    action:
      "This is load failure, not regulation failure. Seek co-regulation from a safe person or environment.",
    icon: "🔄",
  },
  {
    id: "crisis",
    title: "Suicidal ideation or self-harm urges",
    action:
      "Medical emergency. Contact emergency services, a crisis helpline, or a trusted person immediately.",
    icon: "🚨",
    critical: true,
  },
];

export const DGAEP_LEVELS = [
  {
    level: 1,
    name: "Postural Reset & Breathing",
    time: "3–5 min",
    seconds: 300,
    desc: "Change position. Drink water (cold if available). 3 slow breaths: inhale nose, exhale mouth. Place both feet on the floor.",
    rationale:
      "Postural change interrupts proprioceptive feedback. Hydration addresses dehydration-driven sympathetic activation. Slow breathing activates vagal tone.",
    noInput: false,
  },
  {
    level: 2,
    name: "Sensory Weight",
    time: "15–20 min",
    seconds: 1200,
    desc: "Weighted blanket, heavy hoodie, or lap pad. Apply firm pressure — palms together, squeeze arms, press back into wall. If tolerated: cold water on wrists.",
    rationale:
      "Deep pressure activates parasympathetic response through proprioceptive loading. Cold input triggers the mammalian dive reflex.",
    noInput: true,
  },
  {
    level: 3,
    name: "Cognitive Loop Interruption",
    time: "10–15 min",
    seconds: 900,
    desc: "Count backwards from 100 by 7s. Name objects by category (all blue things, all wooden things). Describe a physical object in exact detail.",
    rationale:
      "Not calming — redirecting. Reroutes cognitive resources maintaining the loop toward external structured tasks.",
    loopInput: true,
  },
  {
    level: 4,
    name: "Rhythmic Override",
    time: "10–20 min",
    seconds: 1200,
    desc: "Walking (any pace, rhythmic, continuous). Rocking. Bilateral tapping — alternate tapping knees or shoulders. Drumming at steady beat. Let the body choose its rhythm.",
    rationale:
      "Pattern interrupts at the motor cortex level. Vestibular and proprioceptive input competes with the cognitive loop.",
    noInput: false,
  },
  {
    level: 5,
    name: "Sensory Containment",
    time: "20–30 min",
    seconds: 1800,
    desc: "Darken room. Noise-cancelling headphones or silence. Functional language only. No questions about feelings. No reassurance loops. Containment, not engagement.",
    rationale:
      "When the system hasn't responded to increased input, reduce total sensory load. The system is overwhelmed by input volume — including regulatory input.",
    noInput: true,
  },
  {
    level: 6,
    name: "Time-Based Holding",
    time: "20–30 min",
    seconds: 1800,
    desc: "Set timer. Stay present. No interventions. No fixing. No techniques. Maintain physical safety. Allow the body to reach natural discharge on its own timeline.",
    rationale:
      "Some activations cannot be shortened. The intervention is structural: a safe container in which activation can discharge without producing harm. Containment is a valid endpoint, not a failure state.",
    noInput: true,
  },
];

export const MANUAL_SECTIONS = [
  {
    id: "what",
    title: "What this is",
    content:
      "This is an operating manual for your nervous system. Not a wellness guide. Not coping strategies. It's a structured, decision-gated protocol that tells your body what to do, in what order, and under what conditions. Every step has a physiological rationale. Every transition has a decision gate. You follow a decision tree that branches based on what your body actually does.",
  },
  {
    id: "how",
    title: "How your nervous system works",
    content:
      "Your nervous system constantly measures threat, safety, and capacity — before you're consciously aware of it (neuroception). By the time you think 'I need to calm down,' your nervous system has already decided whether calming down is safe. The body must be addressed first.\n\nThree states: Ventral vagal (safe, social, breathing easy). Sympathetic (fight/flight, heart rate up, scanning for threat). Dorsal vagal (shutdown, collapsed, numb, disconnected). A neurodivergent nervous system isn't broken — it operates under higher baseline load with fewer built-in recovery opportunities.",
  },
  {
    id: "why",
    title: "Why neurodivergent systems need this",
    content:
      "Standard regulation advice assumes: moderate sensory load, intact executive function, reliable interoception, and an environment that doesn't actively drain capacity. Neurodivergent systems often have none of these defaults. Interoception may be unreliable. Executive function may already be depleted. Sensory load may be invisible. This protocol doesn't require you to identify emotions or choose from a menu. It requires you to follow a sequence and let the body's response determine what happens next.",
  },
  {
    id: "loop",
    title: "The regulation loop (Steps 1–7)",
    content:
      "Step 1: Pause (10 seconds). Step 2: Breathe (3 breaths, in 4 counts, out 6). Step 3: Orient visually (name 3 colours). Step 4: Body scan (notice sensations, name without interpreting). Step 5: Walk 10 slow steps or rock gently. Step 6: Second body scan (notice what changed). Step 7: Decision gate — did anything change? Yes → journal. No → repeat once. Still no → escalate to DGAEP.\n\nCore principle: No body change = no next step. The body is the authority.",
  },
  {
    id: "journal",
    title: "Journaling rules",
    content:
      "Journaling is storage, not understanding. Rules: Describe, don't analyse. No decisions while journaling. No re-reading immediately after. If the body worsens while writing, stop. The purpose is to signal the nervous system that content has been stored and no longer needs active monitoring.",
  },
  {
    id: "domains",
    title: "The five load domains",
    content:
      "1. Cognitive — processing demands, head pressure, fog, 'too many tabs open.'\n2. Emotional — felt and unfelt emotion, masking suppression, chest tightness, throat.\n3. Sensory — total sensory channel input, skin crawling, irritability, filtering difficulty.\n4. Social — interaction processing, masking, post-social exhaustion, rehearsal.\n5. Executive — planning, initiating, transitioning, paralysis, decision fatigue, the 'wall.'\n\nA person can be within capacity in four domains and overloaded in one — and that single domain can bring down the system.",
  },
  {
    id: "dgaep",
    title: "Escalation protocol (DGAEP)",
    content:
      "When the regulation loop fails twice, escalation is not failure — it is the next step. Six levels, in order: 1) Postural reset & breathing (5 min). 2) Sensory weight — blanket, pressure, cold (20 min). 3) Cognitive loop interruption — not calming, redirecting (15 min). 4) Rhythmic override — walking, rocking, tapping (20 min). 5) Sensory containment — dark room, silence, no input (30 min). 6) Time-based holding — no interventions, containment as valid endpoint (30 min).\n\nThe same decision gate operates at every level. Containment is a valid outcome, not failure.",
  },
  {
    id: "success",
    title: "What success looks like",
    content:
      "Daily: The loop produces a body change more often than not. Some days it won't work. The pattern matters.\n\nWeekly: The reset identifies at least one recurring pattern.\n\nMonthly: Baseline HRV and resting HR trend favourably.\n\nQuarterly: Higher load tolerance before the gate's 'no change' branch. Window of tolerance widened through sustained regulation.\n\nThe protocol does not cure anything. It manages load. You do not stop maintaining a bridge because it has not collapsed yet.",
  },
];
