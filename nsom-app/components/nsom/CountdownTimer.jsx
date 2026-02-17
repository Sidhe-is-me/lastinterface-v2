"use client";

import { useState, useEffect, useRef } from "react";
import { C } from "./constants";
import { Btn } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// COUNTDOWN TIMER
// ═══════════════════════════════════════════════════════════════

export function CountdownTimer({ duration, label, onComplete }) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, onComplete]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = ((duration - remaining) / duration) * 100;

  return (
    <div
      role="timer"
      aria-label={`${label}: ${mins} minutes ${secs} seconds remaining`}
      style={{
        background: C.white,
        border: `2px solid ${C.borderLight}`,
        borderRadius: 10,
        padding: "16px 20px"
      }}
    >
      <div style={{ fontSize: 14, color: C.textLight, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36,
            fontWeight: 700,
            color: remaining === 0 ? C.green : C.text,
            minWidth: 95,
            fontVariantNumeric: "tabular-nums"
          }}
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            height: 8,
            background: C.bgDeep,
            borderRadius: 4,
            overflow: "hidden"
          }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: remaining === 0 ? C.greenDeco : C.accentDeco,
                borderRadius: 4,
                transition: "width 1s linear"
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {remaining === 0 ? (
            <Btn
              small
              variant="green"
              onClick={() => {
                setRemaining(duration);
              }}
              ariaLabel="Timer complete, reset"
            >
              Complete
            </Btn>
          ) : running ? (
            <Btn
              small
              variant="secondary"
              onClick={() => setRunning(false)}
              ariaLabel="Pause timer"
            >
              Pause
            </Btn>
          ) : (
            <>
              <Btn
                small
                onClick={() => setRunning(true)}
                ariaLabel={remaining < duration ? "Resume timer" : "Start timer"}
              >
                {remaining < duration ? "Resume" : "Start"}
              </Btn>
              {remaining < duration && (
                <Btn
                  small
                  variant="ghost"
                  onClick={() => {
                    setRunning(false);
                    setRemaining(duration);
                  }}
                  ariaLabel="Reset timer"
                >
                  Reset
                </Btn>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
