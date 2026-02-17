import "./globals.css";

export const metadata = {
  title: "The Last Interface — Neurodiversity-Informed Nervous System Regulation",
  description:
    "Applying accessibility engineering principles to autonomic regulation for people whose bodies and brains don't fit the default. By Yve Bergeron.",
  openGraph: {
    title: "The Last Interface",
    description:
      "Neurodiversity-Informed Nervous System Regulation Architecture — decision-gated protocol with HRV tracking, DGAEP escalation, and pattern analysis.",
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
