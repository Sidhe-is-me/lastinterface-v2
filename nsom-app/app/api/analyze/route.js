import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// Server-side API route for Claude analysis
// Keeps API key secure on the server
// ═══════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { systemPrompt, userMessage } = await request.json();

    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: "Missing systemPrompt or userMessage" },
        { status: 400 }
      );
    }

    // API key should be in environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text =
      data.content?.map((b) => b.text || "").join("\n") ||
      "No response received.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Unable to connect to analysis service" },
      { status: 500 }
    );
  }
}
