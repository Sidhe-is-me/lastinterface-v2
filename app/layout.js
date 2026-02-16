import './globals.css'

export const metadata = {
  title: 'The Last Interface — Neurodiversity-Informed Nervous System Regulation',
  description: 'The nervous system is the last interface. A capacity-based framework treating nervous system dysregulation as a bioelectrical communication disability.',
  keywords: 'neurodiversity, nervous system regulation, accessibility, polyvagal theory, autism, ADHD, embodied cognition',
  authors: [{ name: 'Yve Bergeron' }],
  openGraph: {
    title: 'The Last Interface',
    description: 'Neurodiversity-Informed Nervous System Regulation Architecture',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <a href="/" className="logo">
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>The Last Interface</h1>
              </a>
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/documents">Documents</a></li>
                <li><a href="/framework">Framework</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container">
            <p className="muted">
              Yve Bergeron — Neurodiversity &amp; Autism Studies, University College Cork
            </p>
            <p className="text-light" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              The nervous system is the last interface.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
