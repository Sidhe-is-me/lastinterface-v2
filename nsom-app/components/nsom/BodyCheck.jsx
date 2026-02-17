"use client";

import { useState } from "react";
import { C, SENSATIONS } from "./constants";
import { Btn, Chip } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// BODY CHECK (mid-journaling body awareness)
// ═══════════════════════════════════════════════════════════════

export function BodyCheck({ onComplete }) {
  const [selected, setSelected] = useState([]);

  function toggle(s) {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleContinue() {
    onComplete?.(selected);
  }

  return (
    <div
      style={{
        background: C.white,
        border: `2px solid ${C.borderLight}`,
        borderRadius: 12,
        padding: "20px 22px",
        marginTop: 16,
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
        Body check
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
        What sensations are present right now? Select all that apply.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {SENSATIONS.map((s) => (
          <Chip
            key={s}
            label={s}
            active={selected.includes(s)}
            onClick={() => toggle(s)}
          />
        ))}
      </div>
      <Btn
        onClick={handleContinue}
        ariaLabel="Continue journaling"
        disabled={selected.length === 0}
      >
        Continue →
      </Btn>
    </div>
  );
}
