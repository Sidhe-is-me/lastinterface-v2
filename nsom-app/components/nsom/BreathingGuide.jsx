"use client";

import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { C } from "./constants";

// ═══════════════════════════════════════════════════════════════
// BREATHING GUIDE with Audio Cues
// ═══════════════════════════════════════════════════════════════

export function BreathingGuide({ active, onComplete, audioEnabled }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [breathNum, setBreathNum] = useState(0);
  const timerRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setPhase("ready");
      setCount(0);
      setBreathNum(0);
      return;
    }
    if (phase === "ready") {
      setPhase("inhale");
      setCount(4);
      setBreathNum(1);
    }
  }, [active]);

  // Audio cue on phase change
  useEffect(() => {
    if (!audioEnabled || phase === "ready" || phase === "done") return;
    try {
      if (!synthRef.current) {
        synthRef.current = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.3, decay: 0.5, sustain: 0.3, release: 1 },
          volume: -20
        }).toDestination();
      }
      if (phase === "inhale") synthRef.current.triggerAttackRelease("C4", "0.6");
      if (phase === "exhale") synthRef.current.triggerAttackRelease("G3", "0.8");
    } catch (e) {
      /* Audio not available */
    }
  }, [phase, audioEnabled]);

  useEffect(() => {
    if (!active || phase === "ready" || phase === "done") return;
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          if (phase === "inhale") {
            setPhase("exhale");
            return 6;
          }
          if (phase === "exhale") {
            if (breathNum >= 3) {
              setPhase("done");
              clearInterval(timerRef.current);
              setTimeout(() => onComplete?.(), 800);
              return 0;
            }
            setBreathNum((b) => b + 1);
            setPhase("inhale");
            return 4;
          }
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, active, breathNum, onComplete]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, []);

  if (!active || phase === "ready") return null;

  const circleSize = phase === "inhale" ? 120 : phase === "exhale" ? 60 : 90;
  const prefersReduced = typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <div
      role="timer"
      aria-live="assertive"
      aria-label={`Breathing guide. ${
        phase === "done"
          ? "Complete"
          : `${phase}, ${count} seconds. Breath ${Math.min(breathNum, 3)} of 3`
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "24px 0"
      }}
    >
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentGlow} 0%, rgba(25,82,82,0.25) 100%)`,
          border: `3px solid ${C.accentDeco}`,
          transition: prefersReduced ? "none" : "all 1s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            color: C.accent,
            fontWeight: 700
          }}
        >
          {phase === "done" ? "✓" : count}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 18,
          color: C.textMuted,
          fontStyle: "italic"
        }}
      >
        {phase === "inhale"
          ? "Breathe in through the nose…"
          : phase === "exhale"
          ? "Breathe out through the mouth…"
          : "Complete"}
      </span>
      <span style={{ fontSize: 14, color: C.textLight }}>
        Breath {Math.min(breathNum, 3)} of 3
      </span>
    </div>
  );
}
