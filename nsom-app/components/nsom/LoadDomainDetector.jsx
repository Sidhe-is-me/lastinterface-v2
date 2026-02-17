"use client";

import { useState } from "react";
import { C, LOAD_DOMAINS } from "./constants";
import { Btn, Chip } from "./BaseComponents";
import { callClaude } from "./utils";

// ═══════════════════════════════════════════════════════════════
// LOAD DOMAIN DETECTOR (AI-powered analysis)
// ═══════════════════════════════════════════════════════════════

export function LoadDomainDetector({ entries, onAnalysisComplete }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [domains, setDomains] = useState([]);
  const [analysis, setAnalysis] = useState("");

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      const recentEntries = entries.slice(-7);
      const prompt = `Analyze these journal entries and identify the primary load domains (cognitive, sensory, social, physical, emotional) that are creating nervous system activation. Provide a brief analysis (2-3 sentences) and list the top 2-3 load domains.

Entries:
${recentEntries.map((e, i) => `${i + 1}. ${e.transcript || "No transcript"}`).join("\n")}

Format your response as:
ANALYSIS: [your analysis]
DOMAINS: [comma-separated list of domains]`;

      const response = await callClaude(prompt);

      // Parse response
      const analysisMatch = response.match(/ANALYSIS:\s*(.+?)(?=DOMAINS:|$)/s);
      const domainsMatch = response.match(/DOMAINS:\s*(.+)/);

      if (analysisMatch) {
        setAnalysis(analysisMatch[1].trim());
      }

      if (domainsMatch) {
        const detectedDomains = domainsMatch[1]
          .split(",")
          .map((d) => d.trim())
          .filter((d) => LOAD_DOMAINS.includes(d));
        setDomains(detectedDomains);
      }

      onAnalysisComplete?.({ domains: domains, analysis: analysis });
    } catch (error) {
      setAnalysis("Analysis unavailable. Please try again later.");
    }
    setAnalyzing(false);
  }

  return (
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
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: C.text,
          marginBottom: 8,
        }}
      >
        Load Domain Analysis
      </div>
      <p
        style={{
          fontSize: 14,
          color: C.textMuted,
          lineHeight: 1.6,
          marginBottom: 16,
          margin: "0 0 16px",
        }}
      >
        AI analysis of your recent entries to identify primary sources of
        nervous system load.
      </p>

      {!analysis && (
        <Btn
          onClick={handleAnalyze}
          disabled={analyzing || !entries || entries.length === 0}
          ariaLabel="Analyze load domains"
        >
          {analyzing ? "Analyzing..." : "Analyze patterns"}
        </Btn>
      )}

      {analysis && (
        <div>
          <div
            style={{
              background: C.bgDeep,
              borderRadius: 8,
              padding: "14px 16px",
              marginBottom: 14,
              fontSize: 14,
              color: C.text,
              lineHeight: 1.6,
            }}
          >
            {analysis}
          </div>

          {domains.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 8,
                }}
              >
                Identified load domains
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {domains.map((domain) => (
                  <Chip key={domain} label={domain} active={true} />
                ))}
              </div>
            </div>
          )}

          <Btn
            variant="secondary"
            onClick={() => {
              setAnalysis("");
              setDomains([]);
            }}
            ariaLabel="Run new analysis"
          >
            Run new analysis
          </Btn>
        </div>
      )}

      {entries && entries.length === 0 && (
        <div
          style={{
            fontSize: 13,
            color: C.textLight,
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          Complete at least one journal entry to enable analysis.
        </div>
      )}
    </div>
  );
}
