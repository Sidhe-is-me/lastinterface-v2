import "./globals.css";

export const metadata = {
  title: "NSOM — Nervous System Operating Manual",
  description:
    "A decision-gated daily regulation protocol for neurodivergent nervous systems. By Yve Bergeron.",
  openGraph: {
    title: "The Nervous System Operating Manual",
    description:
      "A decision-gated regulation protocol for neurodivergent nervous systems — with HRV tracking, DGAEP escalation timers, and AI-powered pattern analysis.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
