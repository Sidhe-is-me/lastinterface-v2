"use client";

import { useState } from "react";
import { C, focusStyle } from "./constants";
import { Btn, ProgressIndicator } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// WEEKLY RESET FLOW (5-step guided protocol)
// ═══════════════════════════════════════════════════════════════

const RESET_STEPS = [
  {
    title: "Review the week",
    prompt:
      "Look back at your entries from the past 7 days. What patterns do you notice?",
  },
  {
    title: "Identify load domains",
    prompt:
      "Which areas created the most activation? (Work, social, sensory, etc.)",
  },
  {
    title: "Note what worked",
    prompt: "Which regulation strategies were most effective this week?",
  },
  {
    title: "Note what didn't",
    prompt:
      "Which approaches failed to produce body change? No judgment, just data.",
  },
  {
    title: "Set one intention",
    prompt:
      "Choose ONE small adjustment for next week. Not a goal. An experiment.",
  },
];

export function WeeklyResetFlow({ onComplete, entries }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState(Array(5).fill(""));

  function handleResponseChange(text) {
    const updated = [...responses];
    updated[step] = text;
    setResponses(updated);
  }

  function handleNext() {
    if (step < RESET_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete?.({
        responses,
        timestamp: new Date().toISOString(),
        entriesReviewed: entries?.length || 0,
      });
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function applyFocus(e) {
    Object.assign(e.target.style, focusStyle);
  }
  function removeFocus(e) {
    e.target.style.outline = "none";
    e.target.style.outlineOffset = "";
  }

  const currentStep = RESET_STEPS[step];

  return (
    <div>
      <div
        style={{
          background: C.white,
          borderRadius: 12,
          padding: "20px 22px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2.5,
            color: C.accent,
            marginBottom: 8,
          }}
        >
          Weekly Reset Protocol
        </div>
        <ProgressIndicator
          current={step + 1}
          total={RESET_STEPS.length}
          label="Reset progress"
        />
      </div>

      <div
        style={{
          background: C.white,
          border: `2px solid ${C.accent}`,
          borderRadius: 12,
          padding: "24px 26px",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            color: C.text,
            marginBottom: 10,
          }}
        >
          Step {step + 1}: {currentStep.title}
        </div>
        <p
          style={{
            fontSize: 15,
            color: C.textMuted,
            lineHeight: 1.7,
            marginBottom: 16,
            margin: "0 0 16px",
          }}
        >
          {currentStep.prompt}
        </p>

        {step === 0 && entries && entries.length > 0 && (
          <div
            style={{
              background: C.bgDeep,
              borderRadius: 8,
              padding: 14,
              marginBottom: 16,
              fontSize: 13,
              color: C.textMuted,
            }}
          >
            You completed {entries.length} session
            {entries.length !== 1 ? "s" : ""} this week.
          </div>
        )}

        <textarea
          value={responses[step]}
          onChange={(e) => handleResponseChange(e.target.value)}
          placeholder="Write your reflection here..."
          aria-label={currentStep.title}
          style={{
            width: "100%",
            minHeight: 120,
            padding: 14,
            border: `2px solid ${C.borderLight}`,
            borderRadius: 8,
            fontSize: 15,
            fontFamily: "'Source Serif 4', Georgia, serif",
            color: C.text,
            background: C.bg,
            resize: "vertical",
            lineHeight: 1.7,
            boxSizing: "border-box",
            marginBottom: 16,
          }}
          onFocus={applyFocus}
          onBlur={removeFocus}
        />

        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          {step > 0 && (
            <Btn
              variant="secondary"
              onClick={handleBack}
              ariaLabel="Go back to previous step"
            >
              ← Back
            </Btn>
          )}
          <Btn
            onClick={handleNext}
            ariaLabel={
              step < RESET_STEPS.length - 1
                ? "Continue to next step"
                : "Complete weekly reset"
            }
            disabled={responses[step].trim().length === 0}
            style={{ marginLeft: step === 0 ? "auto" : undefined }}
          >
            {step < RESET_STEPS.length - 1 ? "Next →" : "Complete reset"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
