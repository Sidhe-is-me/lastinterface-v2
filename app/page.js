'use client'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>The Last Interface</h1>
            <p className="tagline">The nervous system is the last interface.</p>
            <p className="subtitle">
              A neurodiversity-informed framework treating nervous system dysregulation
              as a bioelectrical communication disability requiring capacity-based
              accommodations rather than optimisation approaches.
            </p>
            <div className="cta-buttons">
              <a href="/documents" className="btn btn-primary">
                Explore Documents
              </a>
              <a href="/nsom-app" className="btn btn-secondary">
                Try NSOM Protocol
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What This Is */}
      <section className="section">
        <div className="container">
          <h2>What This Is</h2>
          <p>
            This is the project site for <strong>The Last Interface</strong> (thelastinterface.com) —
            the public-facing home of the <strong>Neurodiversity-Informed Nervous System
            Regulation Architecture</strong>, an original body of work by Yve Bergeron.
          </p>
          <p>
            The framework treats nervous system dysregulation not as a personal failing
            requiring optimisation, but as a bioelectrical communication disability
            requiring structured, capacity-based accommodations.
          </p>
        </div>
      </section>

      {/* Framework Overview */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)' }}>
        <div className="container">
          <h2>Framework Architecture</h2>
          <p>
            The framework operates in five layers. Each builds on the ones below it.
            Everything connects back to one principle: <strong>reduce load, defer cognition,
            let the body lead, externalise structure.</strong>
          </p>

          <div className="layers">
            <div className="card">
              <h3>Layer 1: Theory</h3>
              <p className="muted">
                Neurodiversity paradigms, polyvagal theory, cognitive load theory,
                embodied cognition, somatic symptom reframing, EDS as bioelectrical
                communication failure, systemic critique of compliance-first models.
              </p>
              <span className="badge badge-draft">Strong Draft</span>
            </div>

            <div className="card">
              <h3>Layer 2: Core Protocol</h3>
              <p className="muted">
                Decision-gated regulation loop (NSOM), structured journaling,
                escalation ladder (DGAEP), mode separation (capture / process / decide).
              </p>
              <span className="badge badge-complete">Polished / Complete</span>
            </div>

            <div className="card">
              <h3>Layer 3: Applied Tools</h3>
              <p className="muted">
                Body Reset Map (kids), Family Pack, Burnout Recovery Manual,
                Burnout Operating Manual (Mode C), parent/child lock-screen maps.
              </p>
              <span className="badge badge-complete">Complete</span>
            </div>

            <div className="card">
              <h3>Layer 4: Material Design</h3>
              <p className="muted">
                Material Coherence Regulation Framework (MCRF / clothing as somatic interface),
                Mythic Minimalism wardrobe system, Seasonal Home Décor Framework.
              </p>
              <span className="badge badge-draft">Strong Draft</span>
            </div>

            <div className="card">
              <h3>Layer 5: Ethics &amp; Philosophy</h3>
              <p className="muted">
                Ethical implications (education, work, parenting), When Regulation Becomes Harm
                (systemic critique), Nervous System Accessibility Manifesto, IP/authorship positioning.
              </p>
              <span className="badge badge-partial">Strong Draft / Partial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Innovation */}
      <section className="section">
        <div className="container">
          <h2>The Core Innovation</h2>
          <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <h3>Decision Gate</h3>
            <p>
              Binary checkpoint: did the body change? <strong>Yes → proceed. No → escalate.</strong>
            </p>
            <p className="muted">
              This simple mechanism transforms nervous system regulation from willpower-based
              optimisation into a structured, repeatable protocol. The decision gate is not
              about whether you feel better. It's about whether the autonomic nervous system
              responded to the intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Biometric Validation */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)' }}>
        <div className="container">
          <h2>Biometric Validation</h2>
          <p>
            4.5 years of continuous HRV data (SDNN via Apple Watch, 1,700+ days). Key findings:
          </p>
          <ul className="validation-list">
            <li>
              <strong>Pre-protocol:</strong> HRV sustained at 16–25 ms for six consecutive weeks
            </li>
            <li>
              <strong>Protocol adoption:</strong> Step-function jump from 20–25 ms to 33–38 ms within one week
            </li>
            <li>
              <strong>Sustained recovery:</strong> Five months at 42–58 ms (highest readings in entire dataset)
            </li>
            <li>
              <strong>Protocol disruption:</strong> Collapse from 42.9 ms to 20.4 ms within 48 hours
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Get Started</h2>
          <p>
            The <strong>Nervous System Operating Manual (NSOM)</strong> is available
            as a free download. The decision-gated protocol takes 15–20 minutes daily.
          </p>
          <div className="cta-buttons" style={{ marginTop: '2rem' }}>
            <a href="/documents" className="btn btn-primary">
              Browse Documents
            </a>
            <a href="/framework" className="btn btn-secondary">
              Explore Framework
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, var(--bg-warm) 0%, var(--bg-deep) 100%);
          padding: 6rem 0;
          border-bottom: 1px solid var(--border);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .hero h1 {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: var(--text);
        }

        .tagline {
          font-size: 1.5rem;
          font-style: italic;
          color: var(--accent);
          margin-bottom: 1.5rem;
        }

        .subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-primary {
          background-color: var(--accent);
          color: var(--white);
          border: 2px solid var(--accent);
        }

        .btn-primary:hover {
          background-color: var(--accent-soft);
          border-color: var(--accent-soft);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--accent);
          border: 2px solid var(--accent);
        }

        .btn-secondary:hover {
          background-color: var(--accent);
          color: var(--white);
          transform: translateY(-2px);
        }

        .layers {
          display: grid;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .validation-list {
          list-style: none;
          margin-top: 1.5rem;
        }

        .validation-list li {
          padding: 1rem;
          margin-bottom: 0.75rem;
          background-color: var(--white);
          border-left: 4px solid var(--green);
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.5rem;
          }

          .tagline {
            font-size: 1.2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </>
  )
}
