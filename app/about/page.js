export const metadata = {
  title: 'About Yve Bergeron — The Last Interface',
  description: 'Senior Accessibility Consultant at CGI, currently studying Neurodiversity & Autism Studies at University College Cork. Neurodivergent (AuDHD), 17+ years in accessibility.',
}

export default function AboutPage() {
  return (
    <>
      <section className="hero-small">
        <div className="container">
          <h1>About Yve Bergeron</h1>
          <p className="subtitle">
            Senior Accessibility Consultant, CGI (17+ years) · Neurodiversity &amp; Autism
            Studies, University College Cork · Neurodivergent (AuDHD) · 19 years bodywork experience
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="section">
        <div className="container">
          <div className="bio-content">
            <div className="card">
              <h2>Professional Background</h2>
              <p>
                Yve Bergeron is a Senior Accessibility Consultant at CGI with over 17 years
                of experience in digital accessibility, WCAG compliance, and inclusive design.
                Currently pursuing graduate studies in Neurodiversity &amp; Autism Studies at
                University College Cork.
              </p>
              <p>
                With 19 years of professional bodywork experience, Yve brings a unique
                perspective that bridges somatic practice, accessibility consulting, and
                neurodiversity research. This interdisciplinary foundation informs the
                embodied, systems-level approach of The Last Interface framework.
              </p>
            </div>

            <div className="card">
              <h2>Framework Development</h2>
              <p>
                The Neurodiversity-Informed Nervous System Regulation Architecture emerged
                from direct lived experience with nervous system dysregulation, combined
                with professional expertise in accessibility and systems architecture.
              </p>
              <p>
                The framework is original integrative work. Individual components draw from
                polyvagal theory, occupational therapy, somatic experiencing, and cognitive
                science. The decision-gated architecture, capacity-based accommodation approach,
                and accessibility-first framing are original contributions.
              </p>
            </div>

            <div className="card">
              <h2>Research &amp; Validation</h2>
              <p>
                The protocol is validated through 4.5 years of continuous biometric data
                (HRV/SDNN via Apple Watch, 1,700+ days) demonstrating measurable efficacy:
              </p>
              <ul>
                <li>Step-function jump from 20–25 ms to 33–38 ms within one week of protocol adoption</li>
                <li>Sustained recovery period of five months at 42–58 ms (highest readings in entire dataset)</li>
                <li>Reversibility demonstrated: collapse from 42.9 ms to 20.4 ms within 48 hours of protocol disruption</li>
              </ul>
              <p className="muted">
                This single-subject longitudinal data forms the basis of an academic case
                study paper currently in development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Focus */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)' }}>
        <div className="container">
          <h2>Academic Focus Areas</h2>
          <div className="focus-grid">
            <div className="focus-card">
              <h3>Neurodiversity Paradigm</h3>
              <p>
                Moving beyond deficit models to capacity-based accommodation frameworks.
                Treating nervous system differences as communication interfaces requiring
                structured support, not personal failings requiring correction.
              </p>
            </div>

            <div className="focus-card">
              <h3>Embodied Cognition</h3>
              <p>
                Integration of somatic practice with cognitive science. The body is not
                a vessel for the mind — it is the nervous system's primary communication
                channel and must be centred in regulation protocols.
              </p>
            </div>

            <div className="focus-card">
              <h3>Accessibility as Systems Architecture</h3>
              <p>
                Accessibility is not retrofitting. It is foundational systems design.
                The framework applies this principle to nervous system regulation:
                accommodation-first, not optimisation-first.
              </p>
            </div>

            <div className="focus-card">
              <h3>Systemic Critique</h3>
              <p>
                Examining when regulation approaches become harm. Compliance-first models
                in education, workplace productivity culture, and parent-child dynamics
                that prioritise neurotypical comfort over neurodivergent capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publication Pipeline */}
      <section className="section">
        <div className="container">
          <h2>Publication &amp; Dissemination</h2>
          <p>
            Active publication pipeline targeting peer-reviewed journals, academic conferences,
            and practitioner venues:
          </p>

          <div className="pipeline-list">
            <div className="card">
              <h4>Peer-Reviewed Journals</h4>
              <ul>
                <li><strong>Frontiers in Psychology</strong> — Cognitive scaffolding paper (polished)</li>
                <li><strong>Applied Psychophysiology</strong> — Nervous system saturation (polished)</li>
                <li><strong>Frontiers in Psychiatry</strong> — Somatic symptoms paradigm shift (strong draft)</li>
                <li><strong>Disability &amp; Society</strong> — When regulation becomes harm (outline)</li>
                <li><strong>Applied Psychophysiology &amp; Biofeedback</strong> — HRV case study (data exists)</li>
              </ul>
            </div>

            <div className="card">
              <h4>Conference Targets</h4>
              <ul>
                <li>CSUN Assistive Technology Conference</li>
                <li>Inclusive Design 24</li>
                <li>Axe-con (Deque)</li>
                <li>ASSETS (ACM)</li>
                <li>AutismEurope / INSAR</li>
                <li>OT conferences (AOTA, WFOT)</li>
              </ul>
            </div>

            <div className="card">
              <h4>Book Project</h4>
              <p>
                <strong>Embodied Neurodiversity</strong> — comprehensive integration of framework
                theory, protocol implementation, applied tools, material design, and ethical critique.
                20 chapters across 5 parts. Book proposal complete (8 pages).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)', textAlign: 'center' }}>
        <div className="container">
          <h2>Connect</h2>
          <p>
            For academic collaboration, speaking engagements, or professional enquiries:
          </p>
          <div className="contact-links">
            <a href="mailto:contact@thelastinterface.com" className="btn btn-primary">
              Email
            </a>
            <a href="https://www.linkedin.com/in/yvebergeron" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
          <p className="muted" style={{ marginTop: '2rem' }}>
            The nervous system is the last interface.
          </p>
        </div>
      </section>

      <style jsx>{`
        .hero-small {
          background: linear-gradient(135deg, var(--bg-warm) 0%, var(--bg-deep) 100%);
          padding: 4rem 0;
          border-bottom: 1px solid var(--border);
        }

        .subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          max-width: 800px;
          line-height: 1.8;
        }

        .bio-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .focus-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .focus-card {
          background-color: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2rem;
        }

        .focus-card h3 {
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .focus-card p {
          margin: 0;
          color: var(--text-muted);
        }

        .pipeline-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .pipeline-list ul {
          margin-top: 1rem;
          padding-left: 1.5rem;
        }

        .pipeline-list li {
          margin-bottom: 0.75rem;
          color: var(--text-muted);
        }

        .contact-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
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

        @media (max-width: 768px) {
          .focus-grid {
            grid-template-columns: 1fr;
          }

          .contact-links {
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
