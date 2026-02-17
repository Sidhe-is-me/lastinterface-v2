"use client";

import { C, focusStyle, srOnly } from "./constants";

// ═══════════════════════════════════════════════════════════════
// BASE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

export function Btn({ children, onClick, variant = "primary", disabled, small, style, ariaLabel, type = "button" }) {
  const base = {
    padding: small ? "10px 18px" : "14px 28px",
    minHeight: 44,
    minWidth: 44,
    borderRadius: 8,
    fontSize: small ? 14 : 15,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit",
    border: "none",
    transition: "background 0.2s, outline-color 0.2s",
    lineHeight: 1.3,
    letterSpacing: "0.01em",
    ...style,
  };

  const variants = {
    primary: {
      background: disabled ? C.bgWarm : C.accentBtn,
      color: disabled ? C.textLight : C.white
    },
    secondary: {
      background: "transparent",
      color: C.textMuted,
      border: `2px solid ${C.border}`
    },
    green: { background: C.greenBtn, color: C.white },
    amber: { background: C.amberBtn, color: C.white },
    ghost: {
      background: "transparent",
      color: C.textMuted,
      padding: small ? "10px 14px" : "12px 20px"
    },
    danger: { background: C.red, color: C.white },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => {
        e.target.style.outline = "none";
        e.target.style.outlineOffset = "";
      }}
    >
      {children}
    </button>
  );
}

export function SectionHead({ icon, title, subtitle, id }) {
  return (
    <div style={{ marginBottom: 16 }} role="heading" aria-level="2">
      <h2
        id={id}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 26,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.2,
          margin: 0
        }}
      >
        {icon && <span aria-hidden="true" style={{ marginRight: 10 }}>{icon}</span>}
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: 15,
          color: C.textMuted,
          marginTop: 6,
          margin: 0,
          lineHeight: 1.5
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Callout({ children, type = "info", role = "note" }) {
  const styles = {
    info: { bg: C.amberSoft, border: C.amber, color: C.text },
    success: { bg: C.greenSoft, border: C.green, color: C.text },
    warning: { bg: C.redSoft, border: C.red, color: C.text },
    neutral: { bg: C.bgDeep, border: C.accent, color: C.text },
  };
  const s = styles[type];

  return (
    <div
      role={role}
      style={{
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
        borderRadius: 10,
        padding: "16px 20px",
        color: s.color,
        fontSize: 15,
        lineHeight: 1.7
      }}
    >
      {children}
    </div>
  );
}

export function Chip({ label, selected, onClick, ariaLabel }) {
  return (
    <button
      role="checkbox"
      aria-checked={selected}
      aria-label={ariaLabel || label}
      onClick={onClick}
      style={{
        padding: "10px 16px",
        minHeight: 44,
        borderRadius: 22,
        border: `2px solid ${selected ? C.accent : C.borderLight}`,
        background: selected ? C.accentGlow : "transparent",
        color: selected ? C.accent : C.textMuted,
        fontSize: 14,
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: selected ? 700 : 500,
        transition: "all 0.15s",
        lineHeight: 1.2,
      }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => { e.target.style.outline = "none"; }}
    >
      {label}
    </button>
  );
}

export function ProgressIndicator({ current, total, label }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: C.textMuted,
        marginBottom: 6
      }}>
        <span>{label}</span>
        <span>Step {current} of {total}</span>
      </div>
      <div style={{
        height: 6,
        background: C.bgWarm,
        borderRadius: 3,
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: C.accentDeco,
          borderRadius: 3,
          transition: "width 0.4s ease"
        }} />
      </div>
    </div>
  );
}
