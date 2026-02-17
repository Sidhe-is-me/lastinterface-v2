"use client";

import { useState } from "react";
import { C, focusStyle } from "./constants";
import { Btn, OptionButton } from "./BaseComponents";
import { todayStr } from "./utils";

// ═══════════════════════════════════════════════════════════════
// DAILY CHECK-IN (v4 - simplified)
// ═══════════════════════════════════════════════════════════════

export function DailyCheckIn({ checkins, onSave }) {
  const todayCheckIn = checkins.find(c => c.date === todayStr());
  const [sleep, setSleep] = useState(todayCheckIn?.sleep ?? "");
  const [ate, setAte] = useState(todayCheckIn?.ate ?? null);
  const [social, setSocial] = useState(todayCheckIn?.social ?? null);
  const [saved, setSaved] = useState(!!todayCheckIn);

  function applyFocus(e) { Object.assign(e.target.style, focusStyle); }
  function removeFocus(e) { e.target.style.outline = "none"; e.target.style.outlineOffset = ""; }

  if (saved) {
    return (
      <div style={{ background: C.greenSoft, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>✓ Check-in complete</span>
        <Btn small variant="ghost" onClick={() => setSaved(false)}>Edit</Btn>
      </div>
    );
  }

  return (
    <div style={{ background: C.white, border: `2px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 22px" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Daily Check-In</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label htmlFor="slp" style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>Hours of sleep</label>
          <input
            id="slp"
            type="number"
            step="0.5"
            value={sleep}
            onChange={e => setSleep(e.target.value)}
            placeholder="6.5"
            style={{
              width: 120,
              padding: "12px 14px",
              minHeight: 44,
              borderRadius: 8,
              border: `2px solid ${C.borderLight}`,
              fontSize: 15,
              fontFamily: "inherit",
              color: C.text,
              background: C.bg,
              boxSizing: "border-box",
            }}
            onFocus={applyFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Did you eat today?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false].map(v => (
              <OptionButton
                key={String(v)}
                label={v ? "Yes" : "No"}
                selected={ate === v}
                onClick={() => setAte(v)}
              />
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Social contact today?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false].map(v => (
              <OptionButton
                key={String(v)}
                label={v ? "Yes" : "No"}
                selected={social === v}
                onClick={() => setSocial(v)}
              />
            ))}
          </div>
        </div>

        <Btn
          small
          onClick={() => {
            onSave({ date: todayStr(), sleep: sleep ? Number(sleep) : null, ate, social });
            setSaved(true);
          }}
        >
          Save
        </Btn>
      </div>
    </div>
  );
}
