"use client";

import { C } from "./constants";

// ═══════════════════════════════════════════════════════════════
// RED LINES REFERENCE
// ═══════════════════════════════════════════════════════════════

const RED_LINES = [
  {
    category: "Physical",
    lines: [
      "Sleep < 4 hours for 2 consecutive nights",
      "No food for > 16 hours (unintentional)",
      "Persistent physical pain that prevents regulation",
    ],
  },
  {
    category: "Cognitive",
    lines: [
      "Suicidal ideation present",
      "Dissociation lasting > 2 hours",
      "Unable to complete basic self-care tasks",
    ],
  },
  {
    category: "Social",
    lines: [
      "Zero social contact for 3+ days (when not intentional)",
      "Conflict that persists unresolved for > 48 hours",
      "Isolation that feels involuntary",
    ],
  },
  {
    category: "Capacity",
    lines: [
      "DGAEP escalation 3+ times in one week",
      "Gate failed 5+ times in 7 days",
      "Regulation loop ineffective for 72 hours",
    ],
  },
];

export function RedLinesReference() {
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
            fontSize: 22,
            fontWeight: 700,
            color: C.text,
            marginBottom: 8,
          }}
        >
          Red Lines Reference
        </div>
        <p
          style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Red lines are system-wide alerts that persist across days. When
          crossed, they indicate capacity has been exceeded and escalation is
          required.
        </p>
      </div>

      {RED_LINES.map((category, idx) => (
        <div
          key={idx}
          style={{
            background: C.white,
            border: `2px solid ${C.borderLight}`,
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              marginBottom: 10,
            }}
          >
            {category.category}
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              listStyleType: "disc",
            }}
          >
            {category.lines.map((line, lineIdx) => (
              <li
                key={lineIdx}
                style={{
                  fontSize: 14,
                  color: C.textMuted,
                  lineHeight: 1.7,
                  marginBottom: lineIdx < category.lines.length - 1 ? 8 : 0,
                }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div
        style={{
          marginTop: 16,
          padding: "16px 18px",
          background: C.redSoft,
          border: `2px solid ${C.red}`,
          borderRadius: 10,
          fontSize: 13,
          color: C.text,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.red }}>Important:</strong> Red lines are not
        judgments. They are system alerts. When a red line is crossed, it means
        the nervous system needs support beyond what self-regulation can
        provide.
      </div>
    </div>
  );
}
