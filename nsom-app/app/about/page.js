"use client";

import Link from "next/link";

const colors = {
  bg: "#F0F5F4",
  bgDeep: "#E2ECEB",
  white: "#FFFFFF",
  text: "#1A2F2E",
  textMuted: "#3D5C5A",
  accent: "#1B7A72",
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

export default function AboutPage() {
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
      <main id="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 24,
            margin: "0 0 24px",
          }}
        >
          About The Last Interface
        </h1>

        <section style={{ marginBottom: 48 }}>
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
            What This Is
          </h2>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            The Last Interface is a neurodiversity-informed nervous system regulation architecture. It applies accessibility engineering principles to autonomic regulation for people whose bodies and brains don't fit the default.
          </p>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            The nervous system is the last interface. Everything else — sensory processing, executive function, emotional regulation, social reciprocity — runs on top of it. If the autonomic layer is dysregulated, nothing built on top of it will function as intended.
          </p>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            This is not therapy. It is not self-help. It is engineering. It is the application of accessibility principles to the body — designing for edge cases, building in decision gates, and validating against real-world data.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
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
            The Protocol
          </h2>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            The NSOM (Nervous System Operating Manual) is a decision-gated daily regulation protocol. It does not ask you to calm down. It does not ask you to feel better. It asks: <em>did the body change?</em>
          </p>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            No body change = no next step. The body is the authority, not the mind, not the schedule, not the therapist, and not the protocol itself.
          </p>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            When first-line regulation fails, the protocol escalates through DGAEP (Decision-Gated Autonomic Escalation Protocol) — six levels of progressively different input, from postural reset to time-based holding. Escalation is not failure. It is the next step.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
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
          <div
            style={{
              background: colors.bgDeep,
              borderRadius: 12,
              padding: "28px 32px",
              borderLeft: `4px solid ${colors.accent}`,
            }}
          >
            <p
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 1.8,
                marginBottom: 14,
                margin: "0 0 14px",
              }}
            >
              <strong>17+ years accessibility engineering</strong> — WCAG, ARIA, semantic HTML, assistive technology testing. Accessibility is not an afterthought. It is a design constraint that produces better systems for everyone.
            </p>
            <p
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 1.8,
                marginBottom: 14,
                margin: "0 0 14px",
              }}
            >
              <strong>19 years somatic bodywork</strong> — Deep tissue, myofascial release, nervous system regulation through hands-on work. The body does not lie. It will tell you what it needs if you know how to listen.
            </p>
            <p
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 1.8,
                marginBottom: 14,
                margin: "0 0 14px",
              }}
            >
              <strong>Neurodiversity & Autism Studies, University College Cork</strong> — Academic grounding in neurodivergence, disability studies, and the social model of disability.
            </p>
            <p
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              <strong>4.5 years continuous HRV validation data</strong> — Daily HRV tracking across cognitive, sensory, emotional, social, and executive load domains. This protocol is not theoretical. It is tested.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
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
            Who This Is For
          </h2>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            This is for people whose nervous systems don't respond to "just breathe" or "think positive thoughts." It is for people who have been told they are too sensitive, too intense, too rigid, too dysregulated — when the actual problem is that the tools they were given were built for bodies that are not theirs.
          </p>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            It is for autistic people, ADHD people, PDA people, trauma survivors, people with CPTSD, people with dysautonomia, people whose bodies live in permanent threat response. It is for people who need structure, not reassurance. Decision gates, not open-ended exploration.
          </p>
          <p
            style={{
              fontSize: 17,
              color: colors.text,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            It is for people who need their tools to be as rigorous as they are.
          </p>
        </section>

        <section>
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
            What Success Looks Like
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { period: "Daily", desc: "The regulation loop produces a body change more often than it does not. Some days it will not work. The pattern matters." },
              { period: "Weekly", desc: "The weekly reset identifies at least one recurring pattern. You begin to see the system's habits rather than being caught in them." },
              { period: "Monthly", desc: "Baseline HRV and resting HR trend favorably. More time in ventral vagal, less in sustained sympathetic or dorsal vagal." },
              { period: "Quarterly", desc: "Higher load tolerance before the gate's 'no change' branch. Window of tolerance widened through sustained regulation." },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: colors.white,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: 10,
                  padding: "18px 22px",
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: colors.accent,
                    marginBottom: 6,
                    margin: "0 0 6px",
                  }}
                >
                  {item.period}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: colors.text,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: 16,
              color: colors.textMuted,
              lineHeight: 1.7,
              fontStyle: "italic",
              marginTop: 24,
              padding: "20px 24px",
              background: colors.bgDeep,
              borderRadius: 10,
              margin: "24px 0 0",
            }}
          >
            The protocol does not cure anything. It manages load. This is not dependency — it is maintenance. You do not stop maintaining a bridge because it has not collapsed yet.
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
