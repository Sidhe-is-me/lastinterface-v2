"use client";

import { useState } from "react";
import { C, SENSATIONS, CONTEXTS, focusStyle } from "./constants";
import { Btn, Chip } from "./BaseComponents";
import { AudioRecorder } from "./AudioRecorder";
import { BodyCheck } from "./BodyCheck";

// ═══════════════════════════════════════════════════════════════
// JOURNALING SECTION
// ═══════════════════════════════════════════════════════════════

export function JournalingSection({ onSave, sessionType }) {
  const [step, setStep] = useState("transcript");
  const [transcript, setTranscript] = useState("");
  const [bodySensations, setBodySensations] = useState([]);
  const [contexts, setContexts] = useState([]);
  const [burnoutRating, setBurnoutRating] = useState(null);
  const [notes, setNotes] = useState("");

  function handleTranscript(text) {
    setTranscript(text);
  }

  function handleBodyCheckComplete(sensations) {
    setBodySensations(sensations);
    setStep("contexts");
  }

  function handleContextsComplete() {
    setStep("burnout");
  }

  function toggleContext(c) {
    setContexts((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function handleBurnoutComplete() {
    setStep("notes");
  }

  function handleSave() {
    const entry = {
      transcript,
      bodySensations,
      contexts,
      burnoutRating,
      notes,
      timestamp: new Date().toISOString(),
      sessionType,
    };
    onSave?.(entry);
  }

  function applyFocus(e) {
    Object.assign(e.target.style, focusStyle);
  }
  function removeFocus(e) {
    e.target.style.outline = "none";
    e.target.style.outlineOffset = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {step === "transcript" && (
        <div>
          <AudioRecorder onTranscript={handleTranscript} />
          {transcript && (
            <div style={{ marginTop: 16 }}>
              <Btn onClick={() => setStep("bodycheck")} ariaLabel="Continue to body check">
                Continue to body check →
              </Btn>
            </div>
          )}
        </div>
      )}

      {step === "bodycheck" && (
        <BodyCheck onComplete={handleBodyCheckComplete} />
      )}

      {step === "contexts" && (
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
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              marginBottom: 8,
            }}
          >
            Context
          </div>
          <p
            style={{
              fontSize: 14,
              color: C.textMuted,
              lineHeight: 1.6,
              marginBottom: 14,
              margin: "0 0 14px",
            }}
          >
            What contexts were active? Select all that apply.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {CONTEXTS.map((c) => (
              <Chip
                key={c}
                label={c}
                active={contexts.includes(c)}
                onClick={() => toggleContext(c)}
              />
            ))}
          </div>
          <Btn
            onClick={handleContextsComplete}
            ariaLabel="Continue to burnout rating"
            disabled={contexts.length === 0}
          >
            Continue →
          </Btn>
        </div>
      )}

      {step === "burnout" && (
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
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              marginBottom: 8,
            }}
          >
            Burnout index
          </div>
          <p
            style={{
              fontSize: 14,
              color: C.textMuted,
              lineHeight: 1.6,
              marginBottom: 14,
              margin: "0 0 14px",
            }}
          >
            Rate your current burnout level from 1 (minimal) to 10 (severe).
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setBurnoutRating(n)}
                aria-label={`Rate burnout as ${n} out of 10`}
                aria-pressed={burnoutRating === n}
                style={{
                  padding: "12px",
                  border: `2px solid ${
                    burnoutRating === n ? C.accent : C.borderLight
                  }`,
                  borderRadius: 8,
                  background: burnoutRating === n ? C.accentGlow : C.white,
                  color: burnoutRating === n ? C.accent : C.text,
                  fontSize: 16,
                  fontWeight: burnoutRating === n ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
                onFocus={applyFocus}
                onBlur={removeFocus}
              >
                {n}
              </button>
            ))}
          </div>
          <Btn
            onClick={handleBurnoutComplete}
            ariaLabel="Continue to notes"
            disabled={burnoutRating === null}
          >
            Continue →
          </Btn>
        </div>
      )}

      {step === "notes" && (
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
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              marginBottom: 8,
            }}
          >
            Additional notes (optional)
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional observations..."
            aria-label="Additional notes"
            style={{
              width: "100%",
              minHeight: 100,
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
          <Btn onClick={handleSave} ariaLabel="Save journal entry">
            Save entry
          </Btn>
        </div>
      )}
    </div>
  );
}
