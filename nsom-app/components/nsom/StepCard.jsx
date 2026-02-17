"use client";

import { C } from "./constants";

// ═══════════════════════════════════════════════════════════════
// STEP CARD
// ═══════════════════════════════════════════════════════════════

export function StepCard({ number, title, why, children, active, completed }) {
  return (
    <div
      role="region"
      aria-label={`Step ${number}: ${title}`}
      style={{
        background: completed ? C.greenSoft : active ? C.white : C.bgDeep,
        border: `2px solid ${active ? C.accent : completed ? C.green : C.borderLight}`,
        borderRadius: 14,
        padding: "20px 24px",
        transition: "all 0.25s ease",
        opacity: !active && !completed ? 0.5 : 1,
        boxShadow: active ? `0 2px 20px ${C.accentGlow}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: completed ? C.greenBtn : active ? C.accentBtn : C.bgWarm,
            color: completed || active ? C.white : C.textMuted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {completed ? "✓" : number}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
              marginBottom: 4
            }}
          >
            {title}
          </div>
          {active && (
            <>
              <p
                style={{
                  fontSize: 14,
                  color: C.textMuted,
                  lineHeight: 1.7,
                  marginBottom: children ? 14 : 0,
                  margin: 0,
                  marginTop: 4
                }}
              >
                {why}
              </p>
              <div style={{ marginTop: 12 }}>{children}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
