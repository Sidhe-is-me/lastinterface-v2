// ═══════════════════════════════════════════════════════════
// Client-side API utilities
// Calls server-side API route to keep API key secure
// ═══════════════════════════════════════════════════════════

/**
 * Call Claude API via server-side route
 * @param {string} systemPrompt - System prompt for Claude
 * @param {string} userMessage - User message
 * @returns {Promise<string>} Response text from Claude
 */
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
