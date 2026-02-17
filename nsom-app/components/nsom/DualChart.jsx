"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { C } from "./constants";
import { friendlyDate } from "./utils";

// ═══════════════════════════════════════════════════════════════
// DUAL CHART (HRV + Burnout)
// ═══════════════════════════════════════════════════════════════

export function DualChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: C.white,
          borderRadius: 12,
          padding: "40px 22px",
          textAlign: "center",
          color: C.textMuted,
        }}
      >
        <div style={{ fontSize: 15 }}>No data to display yet.</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>
          Complete sessions with HRV and burnout tracking to see trends.
        </div>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.map((entry) => ({
    date: friendlyDate(entry.date),
    hrv: entry.hrv || null,
    burnout: entry.burnoutRating || null,
  }));

  return (
    <div
      style={{
        background: C.white,
        borderRadius: 12,
        padding: "20px 18px",
        border: `2px solid ${C.borderLight}`,
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: C.text,
          marginBottom: 16,
        }}
      >
        HRV & Burnout Trends
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
          <XAxis
            dataKey="date"
            tick={{ fill: C.textMuted, fontSize: 12 }}
            stroke={C.border}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: "HRV",
              angle: -90,
              position: "insideLeft",
              style: { fill: C.textMuted, fontSize: 12 },
            }}
            tick={{ fill: C.textMuted, fontSize: 12 }}
            stroke={C.border}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Burnout",
              angle: 90,
              position: "insideRight",
              style: { fill: C.textMuted, fontSize: 12 },
            }}
            tick={{ fill: C.textMuted, fontSize: 12 }}
            stroke={C.border}
            domain={[0, 10]}
          />
          <Tooltip
            contentStyle={{
              background: C.white,
              border: `2px solid ${C.borderLight}`,
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 13,
              color: C.textMuted,
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="hrv"
            stroke={C.green}
            strokeWidth={2}
            dot={{ fill: C.greenBtn, r: 4 }}
            name="HRV"
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="burnout"
            stroke={C.amber}
            strokeWidth={2}
            dot={{ fill: C.amber, r: 4 }}
            name="Burnout Index"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      <p
        style={{
          fontSize: 13,
          color: C.textMuted,
          marginTop: 14,
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        Higher HRV (green) indicates better nervous system capacity. Higher
        burnout (amber) indicates reduced capacity.
      </p>
    </div>
  );
}
