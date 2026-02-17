"use client";

import { C, SESSION_TYPES, focusStyle } from "./constants";
import { SectionHead } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// SESSION TYPE SELECTOR
// ═══════════════════════════════════════════════════════════════

export function SessionTypeSelector({ onSelect }) {
  return (
    <div
      role="region"
      aria-label="Choose session type"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <SectionHead
        title="What does the body need?"
        subtitle="Choose the session type that matches right now."
      />
      {SESSION_TYPES.map((st) => (
        <button
          key={st.id}
          onClick={() => onSelect(st.id)}
          aria-label={`${st.label}: ${st.desc}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 22px",
            minHeight: 68,
            borderRadius: 12,
            border: `2px solid ${C.borderLight}`,
            background: C.white,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = C.accent;
            e.currentTarget.style.boxShadow = `0 2px 12px ${C.accentGlow}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = C.borderLight;
            e.currentTarget.style.boxShadow = "none";
          }}
          onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontSize: 26, width: 44, textAlign: "center" }}
          >
            {st.icon}
          </span>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: C.text,
                fontFamily: "'Cormorant Garamond', Georgia, serif"
              }}
            >
              {st.label}
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.4,
                marginTop: 2
              }}
            >
              {st.desc}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
