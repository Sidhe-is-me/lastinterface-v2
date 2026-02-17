"use client";

import Link from "next/link";

const colors = {
  bg: "#F0F5F4",
  bgDeep: "#E2ECEB",
  white: "#FFFFFF",
  text: "#1A2F2E",
  textMuted: "#3D5C5A",
  accent: "#1B7A72",
  accentSoft: "#2A9D93",
  accentGlow: "rgba(27, 122, 114, 0.1)",
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

function ExternalLinkCard({ href, title, description, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: colors.white,
        border: `2px solid ${colors.borderLight}`,
        borderRadius: 12,
        padding: "28px 32px",
        textDecoration: "none",
        transition: "border-color 0.2s, transform 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.accent;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.borderLight;
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
        e.currentTarget.style.outlineOffset = "0";
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: 36,
          marginBottom: 16,
          color: colors.accent,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 24,
          fontWeight: 700,
          color: colors.text,
          marginBottom: 10,
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 16,
          color: colors.textMuted,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {description}
      </p>
      <div
        style={{
          marginTop: 16,
          fontSize: 14,
          color: colors.accent,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Visit →
      </div>
    </a>
  );
}

export default function ConnectPage() {
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

      {/* Main Content */}
      <main id="main-content" style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 16,
            margin: "0 0 16px",
          }}
        >
          Connect
        </h1>
        <p
          style={{
            fontSize: 18,
            color: colors.textMuted,
            lineHeight: 1.7,
            marginBottom: 48,
            margin: "0 0 48px",
          }}
        >
          Find me on LinkedIn for professional connections or Gumroad for additional resources and tools.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ExternalLinkCard
            href="https://www.linkedin.com/in/yve-bergeron/"
            title="LinkedIn"
            description="Professional background in accessibility engineering, somatic bodywork, and neurodiversity research. Connect for collaboration, consulting, or professional inquiries."
            icon="◈"
          />
          <ExternalLinkCard
            href="https://yvebergeron.gumroad.com/"
            title="Gumroad"
            description="Digital products, extended protocols, and in-depth resources for nervous system regulation and neurodiversity-informed accessibility."
            icon="◆"
          />
        </div>

        <section
          style={{
            marginTop: 60,
            padding: "28px 32px",
            background: colors.bgDeep,
            borderRadius: 12,
            borderLeft: `4px solid ${colors.accent}`,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: colors.text,
              marginBottom: 12,
              margin: "0 0 12px",
            }}
          >
            Consulting & Speaking
          </h2>
          <p
            style={{
              fontSize: 16,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 10,
              margin: "0 0 10px",
            }}
          >
            Available for consulting on:
          </p>
          <ul
            style={{
              fontSize: 16,
              color: colors.text,
              lineHeight: 1.8,
              paddingLeft: 24,
              margin: "0 0 16px",
            }}
          >
            <li>WCAG 2.2 AAA accessibility implementation</li>
            <li>Neurodiversity-informed product design</li>
            <li>Nervous system regulation protocol development</li>
            <li>Somatic approaches for neurodivergent bodies</li>
          </ul>
          <p
            style={{
              fontSize: 15,
              color: colors.textMuted,
              lineHeight: 1.7,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Reach out via LinkedIn for inquiries.
          </p>
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
