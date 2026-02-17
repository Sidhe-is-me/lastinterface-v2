"use client";

import { C } from "./constants";
import { Btn } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// DECISION GATE
// ═══════════════════════════════════════════════════════════════

export function DecisionGate({ onYes, onNo, attempt }) {
  return (
    <div
      role="alertdialog"
      aria-label="Decision Gate"
      style={{
        background: `linear-gradient(135deg, ${C.amberSoft}, ${C.accentGlow})`,
        border: `3px solid ${C.amber}`,
        borderRadius: 16,
        padding: "28px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2.5,
          color: C.amber,
          marginBottom: 10
        }}
      >
        Decision Gate{attempt > 1 ? ` — Attempt ${attempt}` : ""}
      </div>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22,
          fontWeight: 700,
          color: C.text,
          marginBottom: 8,
          margin: 0
        }}
      >
        Did the body show any change?
      </h3>
      <p
        style={{
          fontSize: 15,
          color: C.textMuted,
          marginBottom: 22,
          lineHeight: 1.6,
          margin: "8px 0 22px"
        }}
      >
        Any change counts: breathing slightly slower, shoulders slightly lower, thoughts
        slightly less loud. Even "not worse" is a valid change.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        <Btn
          variant="green"
          onClick={onYes}
          ariaLabel="Yes, something shifted"
        >
          Yes — something shifted
        </Btn>
        <Btn
          variant="secondary"
          onClick={onNo}
          ariaLabel="No change detected"
        >
          No change
        </Btn>
      </div>
    </div>
  );
}
