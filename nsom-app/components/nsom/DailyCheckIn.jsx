"use client";

import { useState } from "react";
import { C, focusStyle } from "./constants";
import { Btn } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// DAILY CHECK-IN (sleep, appetite, social)
// ═══════════════════════════════════════════════════════════════

export function DailyCheckIn({ onComplete, existing }) {
  const [sleep, setSleep] = useState(existing?.sleep ?? null);
  const [appetite, setAppetite] = useState(existing?.appetite ?? null);
  const [social, setSocial] = useState(existing?.social ?? null);

  function handleSubmit() {
    if (sleep !== null && appetite !== null && social !== null) {
      onComplete?.({ sleep, appetite, social });
    }
  }

  function applyFocus(e) {
    Object.assign(e.target.style, focusStyle);
  }
  function removeFocus(e) {
    e.target.style.outline = "none";
    e.target.style.outlineOffset = "";
  }

  const isComplete = sleep !== null && appetite !== null && social !== null;

  return (
    <div
      style={{
        background: C.white,
        border: `2px solid ${C.borderLight}`,
        borderRadius: 12,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: C.text,
          marginBottom: 8,
        }}
      >
        Daily check-in
      </div>
      <p
        style={{
          fontSize: 14,
          color: C.textMuted,
          lineHeight: 1.6,
          marginBottom: 18,
          margin: "0 0 18px",
        }}
      >
        Track three daily baseline markers.
      </p>

      {/* Sleep Quality */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 600,
            color: C.text,
            marginBottom: 10,
          }}
        >
          Sleep quality last night
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {["Poor", "Fair", "Good", "Excellent"].map((option, idx) => (
            <button
              key={option}
              onClick={() => setSleep(idx + 1)}
              aria-label={`Rate sleep as ${option}`}
              aria-pressed={sleep === idx + 1}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: `2px solid ${
                  sleep === idx + 1 ? C.accent : C.borderLight
                }`,
                borderRadius: 8,
                background: sleep === idx + 1 ? C.accentGlow : C.white,
                color: sleep === idx + 1 ? C.accent : C.textMuted,
                fontSize: 14,
                fontWeight: sleep === idx + 1 ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onFocus={applyFocus}
              onBlur={removeFocus}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Appetite */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 600,
            color: C.text,
            marginBottom: 10,
          }}
        >
          Appetite today
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {["Low", "Reduced", "Normal", "Strong"].map((option, idx) => (
            <button
              key={option}
              onClick={() => setAppetite(idx + 1)}
              aria-label={`Rate appetite as ${option}`}
              aria-pressed={appetite === idx + 1}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: `2px solid ${
                  appetite === idx + 1 ? C.accent : C.borderLight
                }`,
                borderRadius: 8,
                background: appetite === idx + 1 ? C.accentGlow : C.white,
                color: appetite === idx + 1 ? C.accent : C.textMuted,
                fontSize: 14,
                fontWeight: appetite === idx + 1 ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onFocus={applyFocus}
              onBlur={removeFocus}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Social Contact */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 600,
            color: C.text,
            marginBottom: 10,
          }}
        >
          Social contact today
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {["None", "Minimal", "Moderate", "High"].map((option, idx) => (
            <button
              key={option}
              onClick={() => setSocial(idx + 1)}
              aria-label={`Rate social contact as ${option}`}
              aria-pressed={social === idx + 1}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: `2px solid ${
                  social === idx + 1 ? C.accent : C.borderLight
                }`,
                borderRadius: 8,
                background: social === idx + 1 ? C.accentGlow : C.white,
                color: social === idx + 1 ? C.accent : C.textMuted,
                fontSize: 14,
                fontWeight: social === idx + 1 ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onFocus={applyFocus}
              onBlur={removeFocus}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Btn
        onClick={handleSubmit}
        ariaLabel="Complete daily check-in"
        disabled={!isComplete}
      >
        Complete check-in
      </Btn>
    </div>
  );
}
