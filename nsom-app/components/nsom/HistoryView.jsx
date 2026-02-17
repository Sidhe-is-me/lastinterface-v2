"use client";

import { useState } from "react";
import { C } from "./constants";
import { Btn, Chip } from "./BaseComponents";
import { friendlyDate } from "./utils";

// ═══════════════════════════════════════════════════════════════
// HISTORY VIEW (with locked journal entries)
// ═══════════════════════════════════════════════════════════════

export function HistoryView({ entries }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (!entries || entries.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "44px 22px",
          color: C.textLight,
        }}
      >
        <div aria-hidden="true" style={{ fontSize: 30, marginBottom: 10 }}>
          ◉
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18,
            color: C.textMuted,
          }}
        >
          No entries yet
        </div>
        <div style={{ fontSize: 14, marginTop: 6 }}>
          Complete your first session to begin tracking.
        </div>
      </div>
    );
  }

  if (selectedEntry) {
    const entry = selectedEntry;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Btn
            variant="ghost"
            onClick={() => setSelectedEntry(null)}
            ariaLabel="Back to history list"
          >
            ← Back to list
          </Btn>
        </div>
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                {friendlyDate(entry.date)}
              </div>
              <div style={{ fontSize: 14, color: C.textMuted, marginTop: 2 }}>
                {entry.timeOfDay} · {entry.sessionType || "regulation"}
              </div>
            </div>
            {entry.locked && (
              <div
                style={{
                  fontSize: 20,
                  color: C.textLight,
                }}
                aria-label="This entry is locked"
              >
                🔒
              </div>
            )}
          </div>

          {entry.gatePassed !== undefined && (
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 6,
                background: entry.gatePassed ? C.greenSoft : C.amberSoft,
                color: entry.gatePassed ? C.green : C.amber,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {entry.gatePassed ? "Gate passed ✓" : "Escalated to DGAEP"}
            </div>
          )}

          {entry.transcript && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 6,
                }}
              >
                Transcript
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: C.text,
                  lineHeight: 1.7,
                  fontFamily: "'Source Serif 4', Georgia, serif",
                }}
              >
                {entry.transcript}
              </div>
            </div>
          )}

          {entry.bodySensations && entry.bodySensations.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 8,
                }}
              >
                Body sensations
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {entry.bodySensations.map((s) => (
                  <Chip key={s} label={s} active={false} />
                ))}
              </div>
            </div>
          )}

          {entry.contexts && entry.contexts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 8,
                }}
              >
                Contexts
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {entry.contexts.map((c) => (
                  <Chip key={c} label={c} active={false} />
                ))}
              </div>
            </div>
          )}

          {entry.burnoutRating !== undefined && entry.burnoutRating !== null && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 6,
                }}
              >
                Burnout index
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>
                {entry.burnoutRating}/10
              </div>
            </div>
          )}

          {entry.notes && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 6,
                }}
              >
                Notes
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: C.text,
                  lineHeight: 1.7,
                  fontFamily: "'Source Serif 4', Georgia, serif",
                }}
              >
                {entry.notes}
              </div>
            </div>
          )}

          {entry.locked && (
            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: C.bgDeep,
                borderRadius: 8,
                fontSize: 13,
                color: C.textMuted,
                fontStyle: "italic",
              }}
            >
              This entry was locked 24 hours after creation and cannot be
              edited.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {entries
        .slice()
        .reverse()
        .map((entry, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedEntry(entry)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              background: C.white,
              border: `2px solid ${C.borderLight}`,
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = C.accent;
              e.currentTarget.style.boxShadow = `0 2px 12px ${C.accentGlow}`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = C.borderLight;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: 4,
                }}
              >
                {friendlyDate(entry.date)}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                {entry.timeOfDay} · {entry.sessionType || "regulation"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {entry.locked && (
                <span style={{ fontSize: 16, color: C.textLight }}>🔒</span>
              )}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: entry.gatePassed ? C.green : C.amber,
                }}
              >
                {entry.gatePassed !== undefined
                  ? entry.gatePassed
                    ? "Gate ✓"
                    : "DGAEP"
                  : "—"}
              </span>
            </div>
          </button>
        ))}
    </div>
  );
}
