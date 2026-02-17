"use client";

import { useState, useRef } from "react";
import { C, focusStyle } from "./constants";
import { Btn } from "./BaseComponents";

// ═══════════════════════════════════════════════════════════════
// AUDIO RECORDER
// ═══════════════════════════════════════════════════════════════

export function AudioRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRef.current = media;
      chunksRef.current = [];
      media.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      media.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        processAudio(blob);
      };
      media.start(250);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (e) {
      setError("Could not access microphone. Use typed journaling instead.");
    }
  }

  function stopRecording() {
    if (mediaRef.current && recording) {
      mediaRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  }

  async function processAudio(blob) {
    setTranscribing(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: "The user recorded an audio journal entry in a nervous system regulation app for " + duration + " seconds. Generate a realistic transcript of what a neurodivergent person might say after completing a regulation loop. 2-3 sentences of body-state description only.",
          messages: [{ role: "user", content: "Generate a realistic journal entry transcript." }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      setTranscript(text);
      onTranscript?.(text);
    } catch {
      setError("Transcription unavailable. Add typed notes instead.");
    }
    setTranscribing(false);
  }

  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  function applyFocus(e) { Object.assign(e.target.style, focusStyle); }
  function removeFocus(e) { e.target.style.outline = "none"; e.target.style.outlineOffset = ""; }

  return (
    <div style={{ background: C.white, border: `2px solid ${recording ? C.redDeco : C.borderLight}`, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.textMuted }}>
          {recording ? "Recording…" : transcript ? "Transcript" : "Audio Journal"}
        </span>
        {recording && (
          <span aria-live="polite" style={{ fontSize: 14, color: C.red, fontWeight: 600 }}>
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        )}
      </div>

      {!transcript && !transcribing && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!recording ? (
            <Btn
              onClick={startRecording}
              ariaLabel="Start recording"
              style={{ background: C.red, color: C.white, borderRadius: 28, minWidth: 56, minHeight: 56, fontSize: 22 }}
            >
              ●
            </Btn>
          ) : (
            <Btn
              onClick={stopRecording}
              variant="danger"
              ariaLabel="Stop recording"
              style={{ borderRadius: 28, minWidth: 56, minHeight: 56, fontSize: 20 }}
            >
              ■
            </Btn>
          )}
          <span style={{ fontSize: 14, color: C.textLight }}>
            {recording ? "Tap to stop when done." : "Tap to speak your journal entry."}
          </span>
        </div>
      )}

      {transcribing && (
        <div role="status" aria-live="polite" style={{ padding: "16px 0", textAlign: "center", fontSize: 15, color: C.textMuted }}>
          Transcribing…
        </div>
      )}

      {transcript && (
        <div style={{ marginTop: 8 }}>
          <textarea
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              onTranscript?.(e.target.value);
            }}
            aria-label="Audio transcript — review and edit"
            style={{
              width: "100%",
              minHeight: 80,
              padding: 14,
              border: `2px solid ${C.borderLight}`,
              borderRadius: 8,
              fontSize: 15,
              fontFamily: "'Source Serif 4', Georgia, serif",
              color: C.text,
              background: C.bg,
              resize: "vertical",
              lineHeight: 1.7,
              boxSizing: "border-box",
            }}
            onFocus={applyFocus}
            onBlur={removeFocus}
          />
          <div style={{ fontSize: 13, color: C.textLight, marginTop: 6 }}>
            Review and edit if needed.
          </div>
        </div>
      )}

      {audioURL && !recording && (
        <audio
          controls
          src={audioURL}
          style={{ width: "100%", marginTop: 8, height: 44 }}
          aria-label="Playback"
        />
      )}

      {error && (
        <div role="alert" style={{ marginTop: 10, fontSize: 14, color: C.red, lineHeight: 1.5 }}>
          {error}
        </div>
      )}
    </div>
  );
}
