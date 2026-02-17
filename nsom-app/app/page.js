"use client";

import Link from "next/link";
import { useState } from "react";

const colors = {
  bg: "#F0F5F4",
  bgDeep: "#E2ECEB",
  bgWarm: "#D5E3E1",
  white: "#FFFFFF",
  text: "#1A2F2E",
  textMuted: "#3D5C5A",
  accent: "#1B7A72",
  accentSoft: "#2A9D93",
  accentGlow: "rgba(27, 122, 114, 0.1)",
  green: "#1A6B4A",
  border: "#B8CCC9",
  borderLight: "#CDDAD8",
  focusRing: "#0E5A54",
};

const focusStyle = {
  outline: `3px solid ${colors.focusRing}`,
  outlineOffset: "2px",
};

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        color: colors.textMuted,
        textDecoration: "none",
        fontSize: 15,
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: 6,
        transition: "color 0.2s, background 0.2s",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        e.target.style.color = colors.accent;
        e.target.style.background = colors.accentGlow;
      }}
      onMouseLeave={(e) => {
        e.target.style.color = colors.textMuted;
        e.target.style.background = "transparent";
      }}
      onFocus={(e) => {
        Object.assign(e.target.style, focusStyle);
        e.target.style.color = colors.accent;
      }}
      onBlur={(e) => {
        e.target.style.outline = "none";
        e.target.style.outlineOffset = "0";
        e.target.style.color = colors.textMuted;
      }}
    >
      {children}
    </Link>
  );
}

function PrimaryButton({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        padding: "14px 32px",
        background: colors.accent,
        color: colors.white,
        textDecoration: "none",
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 600,
        transition: "background 0.2s",
        minHeight: 44,
        minWidth: 44,
      }}
      onMouseEnter={(e) => {
        e.target.style.background = colors.accentSoft;
      }}
      onMouseLeave={(e) => {
        e.target.style.background = colors.accent;
      }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => {
        e.target.style.outline = "none";
        e.target.style.outlineOffset = "0";
      }}
    >
      {children}
    </Link>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <article
      style={{
        background: colors.white,
        border: `1px solid ${colors.borderLight}`,
        borderRadius: 12,
        padding: "24px 26px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.borderLight;
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: 32,
          marginBottom: 12,
          color: colors.accent,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: colors.text,
          marginBottom: 8,
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 15,
          color: colors.textMuted,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {description}
      </p>
    </article>
  );
}

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Skip navigation */}
      <a
        href="#main-content"
        style={{
          ...srOnly,
          position: "absolute",
          top: 0,
          left: 0,
          background: colors.accent,
          color: colors.white,
          padding: "12px 20px",
          zIndex: 100,
          fontSize: 14,
        }}
        onFocus={(e) => {
          e.target.style.position = "static";
          e.target.style.clip = "auto";
          e.target.style.width = "auto";
          e.target.style.height = "auto";
          e.target.style.margin = "0";
          e.target.style.overflow = "visible";
          e.target.style.whiteSpace = "normal";
        }}
        onBlur={(e) => Object.assign(e.target.style, srOnly)}
      >
        Skip to main content
      </a>

      {/* Header Navigation */}
      <header
        style={{
          borderBottom: `1px solid ${colors.border}`,
          padding: "20px 24px",
          background: colors.white,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: colors.text,
              textDecoration: "none",
            }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => {
              e.target.style.outline = "none";
              e.target.style.outlineOffset = "0";
            }}
          >
            The Last Interface
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <NavLink href="/nsom">NSOM Tool</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/connect">Connect</NavLink>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main id="main-content">
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 60px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 52,
              fontWeight: 700,
              color: colors.text,
              lineHeight: 1.2,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            The Last Interface
          </h1>
          <p
            style={{
              fontSize: 22,
              color: colors.textMuted,
              fontStyle: "italic",
              marginBottom: 32,
              maxWidth: 720,
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Neurodiversity-Informed Nervous System Regulation Architecture
          </p>
          <p
            style={{
              fontSize: 18,
              color: colors.text,
              lineHeight: 1.8,
              maxWidth: 800,
              margin: "0 auto 40px",
            }}
          >
            Applying accessibility engineering principles to autonomic
            regulation for people whose bodies and brains don't fit the default.
          </p>
          <PrimaryButton href="/nsom">
            Open NSOM Regulation Tool →
          </PrimaryButton>
        </section>

        {/* Principles Section */}
        <section
          style={{
            background: colors.white,
            borderTop: `1px solid ${colors.border}`,
            borderBottom: `1px solid ${colors.border}`,
            padding: "60px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 36,
                fontWeight: 700,
                color: colors.text,
                textAlign: "center",
                marginBottom: 48,
                margin: "0 0 48px",
              }}
            >
              Core Architecture
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              <FeatureCard
                icon="○"
                title="Decision-Gated Protocol"
                description="No body change = no next step. The body is the authority, not the mind, not the schedule, not the therapist, and not the protocol itself."
              />
              <FeatureCard
                icon="↑"
                title="Structured Escalation"
                description="When first-line regulation fails, escalation is not failure — it is the next step. DGAEP provides a 6-level autonomic escalation pathway."
              />
              <FeatureCard
                icon="◆"
                title="Pattern Recognition"
                description="HRV tracking, load domain detection, and weekly pattern analysis. The pattern matters, not the individual day."
              />
              <FeatureCard
                icon="◎"
                title="Working Memory Support"
                description="Autonomic dysregulation compromises working memory. The tool remembers for you — tracking steps, states, and changes when cognition is overloaded."
              />
              <FeatureCard
                icon="⊗"
                title="Red Line Thresholds"
                description="Non-negotiable structural load limits. Crossing a red line is not failure — it is the system signaling that protective action is required."
              />
              <FeatureCard
                icon="∞"
                title="Continuous Validation"
                description="Built on 4.5 years of continuous HRV data, tested across cognitive, sensory, emotional, social, and executive load domains."
              />
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "60px 24px",
          }}
        >
          <div
            style={{
              background: colors.bgDeep,
              borderRadius: 12,
              padding: "32px 36px",
              borderLeft: `4px solid ${colors.accent}`,
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 28,
                fontWeight: 700,
                color: colors.text,
                marginBottom: 16,
                margin: "0 0 16px",
              }}
            >
              Yve Bergeron
            </h2>
            <p
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 1.8,
                marginBottom: 12,
                margin: "0 0 12px",
              }}
            >
              17+ years accessibility engineering · 19 years somatic bodywork ·
              Neurodiversity & Autism Studies, University College Cork · 4.5
              years continuous HRV validation data
            </p>
            <p
              style={{
                fontSize: 15,
                color: colors.textMuted,
                lineHeight: 1.7,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              The nervous system is the last interface. Everything else —
              sensory processing, executive function, emotional regulation,
              social reciprocity — runs on top of it. If the autonomic layer is
              dysregulated, nothing built on top of it will function as
              intended.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            background: colors.white,
            borderTop: `1px solid ${colors.border}`,
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 700,
                color: colors.text,
                marginBottom: 16,
                margin: "0 0 16px",
              }}
            >
              Start Your Regulation Loop
            </h2>
            <p
              style={{
                fontSize: 17,
                color: colors.textMuted,
                lineHeight: 1.8,
                marginBottom: 32,
                margin: "0 0 32px",
              }}
            >
              The NSOM Daily Regulation Protocol is a structured, decision-gated
              approach to nervous system regulation. It includes step-by-step
              tracking, countdown timers, body state capture, and HRV analysis.
            </p>
            <PrimaryButton href="/nsom">Open the Tool →</PrimaryButton>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: "24px 24px",
          textAlign: "center",
          background: colors.white,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: colors.textMuted,
            margin: "0 0 8px",
          }}
        >
          The Last Interface — Yve Bergeron
        </p>
        <p
          style={{
            fontSize: 12,
            color: colors.textMuted,
            fontStyle: "italic",
            margin: 0,
          }}
        >
          Neurodiversity & Autism Studies, University College Cork
        </p>
      </footer>
    </div>
  );
}
