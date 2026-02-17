"use client";

import { C } from "./constants";
import { Btn } from "./BaseComponents";
import { daysAgo } from "./utils";

// ═══════════════════════════════════════════════════════════════
// RED LINE MONITOR (cross-day persistent alerts)
// ═══════════════════════════════════════════════════════════════

export function RedLineMonitor({ redlines, onDismiss }) {
  if (!redlines || redlines.length === 0) return null;

  const activeRedlines = redlines.filter((r) => !r.dismissed);
  if (activeRedlines.length === 0) return null;

  return (
    <div
      role="alert"
      style={{
        background: `linear-gradient(135deg, ${C.redSoft}, ${C.amberSoft})`,
        border: `3px solid ${C.red}`,
        borderRadius: 14,
        padding: "20px 22px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2.5,
          color: C.red,
          marginBottom: 8,
        }}
      >
        ⚠ Red Line Alert
      </div>
      {activeRedlines.map((redline, idx) => (
        <div
          key={idx}
          style={{
            background: C.white,
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: idx < activeRedlines.length - 1 ? 12 : 0,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.text,
              marginBottom: 4,
            }}
          >
            {redline.type}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textMuted,
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            {redline.description}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              color: C.textLight,
            }}
          >
            <span>
              Active for {daysAgo(redline.date)} day
              {daysAgo(redline.date) !== 1 ? "s" : ""}
            </span>
            <Btn
              small
              variant="ghost"
              onClick={() => onDismiss?.(redline.id)}
              ariaLabel={`Dismiss ${redline.type} alert`}
            >
              Dismiss
            </Btn>
          </div>
        </div>
      ))}
      <p
        style={{
          fontSize: 13,
          color: C.text,
          marginTop: 14,
          lineHeight: 1.6,
          fontStyle: "italic",
          margin: "14px 0 0",
        }}
      >
        Red lines persist across days until explicitly dismissed. They are not
        forgotten by the system.
      </p>
    </div>
  );
}
