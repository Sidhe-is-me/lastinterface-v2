// ═══════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════

/**
 * Get today's date as YYYY-MM-DD
 * @returns {string} Date string
 */
export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Format date string to friendly format
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Mon, Jan 15")
 */
export function friendlyDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get current time of day
 * @returns {string} "Morning", "Afternoon", or "Evening"
 */
export function timeOfDay() {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
}

/**
 * Get current time as formatted string
 * @returns {string} Time string (e.g., "2:45 PM")
 */
export function timeNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Generate placeholder/sample data for demonstration
 * @returns {Array} Array of sample entries
 */
export function generatePlaceholder() {
  const domains = [
    "Cognitive",
    "Emotional",
    "Sensory",
    "Social",
    "Executive",
  ];
  const sensOpts = [
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
  ];
  const data = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const passed = Math.random() > 0.25;
    const esc = !passed && Math.random() > 0.5;
    const sens = sensOpts.filter(() => Math.random() > 0.6);

    data.push({
      date: ds,
      timeOfDay: ["Morning", "Afternoon", "Evening"][
        Math.floor(Math.random() * 3)
      ],
      gatePassed: passed,
      escalated: esc,
      attempts: passed ? (Math.random() > 0.6 ? 2 : 1) : 2,
      journal: passed
        ? [
            "Chest was tight. Shoulders dropped after walk.",
            "Head foggy. Cleared slightly after breathing.",
            "Racing thoughts slowed. Belly tension remains.",
            "Numbness in hands. Tingling shifted after steps.",
            "",
          ][Math.floor(Math.random() * 5)]
        : null,
      scan1: {
        head: Math.random() > 0.5 ? ["Pressure", "Foggy"] : [],
        chest: Math.random() > 0.5 ? ["Tight"] : [],
        belly: Math.random() > 0.5 ? ["Heavy"] : [],
      },
      scan2: {
        head: Math.random() > 0.5 ? ["Foggy"] : [],
        chest: [],
        belly: Math.random() > 0.5 ? ["Heavy"] : [],
      },
      sensations: sens,
      loadDomain: domains[Math.floor(Math.random() * domains.length)],
      hrv: Math.round(28 + Math.random() * 25 + (13 - i) * 0.4),
      hr: Math.round(62 + Math.random() * 14),
      notes:
        ["After meeting", "Morning routine", "Post-lunch dip", "End of day", ""][
          Math.floor(Math.random() * 5)
        ] || null,
      context: ["Work", "Sensory environment", "Sleep debt"].filter(
        () => Math.random() > 0.5
      ),
      escalationLevel: esc ? Math.floor(Math.random() * 3) + 2 : null,
      redLine: false,
      source: "loop",
    });
  }

  return data;
}
