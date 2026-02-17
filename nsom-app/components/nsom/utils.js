// ═══════════════════════════════════════════════════════════════
// NSOM Utility Functions
// ═══════════════════════════════════════════════════════════════

export function formatDate(d) {
  return d.toISOString().split("T")[0];
}

export function todayStr() {
  return formatDate(new Date());
}

export function friendlyDate(ds) {
  return new Date(ds + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

export function daysAgo(dateStr) {
  const then = new Date(dateStr + "T12:00:00");
  const now = new Date();
  const diffTime = Math.abs(now - then);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function timeOfDay() {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
}

// Call Claude API via server-side route
export async function callClaude(systemPrompt, userMessage) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, userMessage }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    const data = await response.json();
    return data.text || "No response received.";
  } catch (error) {
    console.error("Claude API error:", error);
    return "Unable to connect to analysis. Please try again.";
  }
}
