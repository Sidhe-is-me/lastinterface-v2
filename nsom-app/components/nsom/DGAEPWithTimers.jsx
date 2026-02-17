"use client";

import { useState } from "react";
import { C } from "./constants";
import { Btn, ProgressIndicator } from "./BaseComponents";
import { CountdownTimer } from "./CountdownTimer";

// ═══════════════════════════════════════════════════════════════
// DGAEP WITH TIMERS (6-level escalation protocol)
// ═══════════════════════════════════════════════════════════════

const DGAEP_LEVELS = [
  {
    level: 1,
    title: "Lie down with legs elevated",
    why: "Blood flow to torso activates vagal brake. 10 minutes minimum.",
    duration: 600,
  },
  {
    level: 2,
    title: "Cold water on face",
    why: "Mammalian dive reflex. Activates parasympathetic immediately. 30 seconds minimum.",
    duration: 30,
  },
  {
    level: 3,
    title: "Weighted blanket or compression",
    why: "Deep pressure proprioception. Tells the body it is held. 15 minutes.",
    duration: 900,
  },
  {
    level: 4,
    title: "Vocalisation or humming",
    why: "Vocal vibration stimulates vagus directly. Hum one song or speak aloud for 5 minutes.",
    duration: 300,
  },
  {
    level: 5,
    title: "Call your protocol contact",
    why: "Social co-regulation is the most powerful intervention. Not texting. Voice.",
    duration: 600,
  },
  {
    level: 6,
    title: "Crisis escalation",
    why: "The protocol has been exhausted. Medical or crisis support is indicated.",
    duration: 0,
  },
];

export function DGAEPWithTimers({ onComplete }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const level = DGAEP_LEVELS[currentLevel];

  function handleStartTimer() {
    setTimerActive(true);
  }

  function handleTimerComplete() {
    setTimerActive(false);
  }

  function handleContinue() {
    if (currentLevel < DGAEP_LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setTimerActive(false);
    } else {
      onComplete?.({ levelsCompleted: currentLevel + 1 });
    }
  }

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
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2.5,
            color: C.amber,
            marginBottom: 8,
          }}
        >
          Decision-Gated Autonomic Escalation Protocol
        </div>
        <ProgressIndicator
          current={currentLevel + 1}
          total={DGAEP_LEVELS.length}
          label="DGAEP progress"
        />
      </div>

      <div
        style={{
          background: C.white,
          border: `3px solid ${C.amber}`,
          borderRadius: 14,
          padding: "24px 26px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 6,
            background: C.amberSoft,
            color: C.amber,
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          Level {level.level}
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24,
            fontWeight: 700,
            color: C.text,
            marginBottom: 10,
          }}
        >
          {level.title}
        </div>
        <p
          style={{
            fontSize: 15,
            color: C.textMuted,
            lineHeight: 1.7,
            marginBottom: 20,
            margin: "0 0 20px",
          }}
        >
          {level.why}
        </p>

        {level.duration > 0 && !timerActive && (
          <Btn
            onClick={handleStartTimer}
            ariaLabel={`Start ${level.duration} second timer for level ${level.level}`}
          >
            Start timer
          </Btn>
        )}

        {level.duration > 0 && timerActive && (
          <CountdownTimer
            duration={level.duration}
            label={level.title}
            onComplete={handleTimerComplete}
          />
        )}

        {level.level === 6 && (
          <div
            role="alert"
            style={{
              background: C.redSoft,
              border: `2px solid ${C.red}`,
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.red,
                marginBottom: 8,
              }}
            >
              Protocol exhausted
            </div>
            <p
              style={{
                fontSize: 14,
                color: C.text,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Five escalation levels have been attempted without body change.
              This indicates activation beyond self-regulation capacity. Contact
              your crisis support system or emergency services.
            </p>
          </div>
        )}

        {((level.duration > 0 && !timerActive) || level.level === 6) && (
          <div style={{ marginTop: 20 }}>
            <Btn
              variant="secondary"
              onClick={handleContinue}
              ariaLabel={
                level.level < 6
                  ? "Move to next DGAEP level"
                  : "Complete DGAEP protocol"
              }
            >
              {level.level < 6 ? "Next level →" : "End protocol"}
            </Btn>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: "14px 18px",
          background: C.bgDeep,
          borderRadius: 10,
          fontSize: 13,
          color: C.textMuted,
          lineHeight: 1.6,
          fontStyle: "italic",
        }}
      >
        <strong>Core principle:</strong> Complete each level fully before
        moving to the next. The body is the authority on whether to escalate.
      </div>
    </div>
  );
}
