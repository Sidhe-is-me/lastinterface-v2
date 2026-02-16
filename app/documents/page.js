export const metadata = {
  title: 'Document Registry — The Last Interface',
  description: 'Complete inventory of framework documents, academic papers, and applied tools with version tracking and download links.',
}

export default function DocumentsPage() {
  return (
    <>
      <section className="hero-small">
        <div className="container">
          <h1>Document Registry</h1>
          <p className="subtitle">
            Complete inventory of framework documents, academic papers, and applied
            tools with version tracking and download links.
          </p>
        </div>
      </section>

      {/* Core Protocol Documents */}
      <section className="section">
        <div className="container">
          <h2>Core Protocol Documents</h2>
          <p className="muted">
            The foundational documents that define the decision-gated regulation architecture.
          </p>

          <div className="doc-grid">
            <div className="card doc-card">
              <div className="doc-header">
                <h3>Nervous System Operating Manual (NSOM)</h3>
                <span className="badge badge-complete">Complete</span>
              </div>
              <p className="muted">31 pages</p>
              <p>
                The flagship daily regulation protocol. Decision-gated loop for nervous
                system regulation. 15–20 minutes daily. Five load domains, structured
                journaling, binary decision gates.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download PDF</a>
                <a href="#" className="btn-link">View Online</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Decision-Gated Autonomic Escalation Protocol (DGAEP)</h3>
                <span className="badge badge-complete">Complete</span>
              </div>
              <p className="muted">19 pages</p>
              <p>
                Six-level escalation protocol for when regulation fails. Structured
                response ladder from Level 0 (regulated) to Level 5 (immediate safety).
                Binary gates at each level.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download PDF</a>
                <a href="#" className="btn-link">View Online</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Material Coherence Regulation Framework (MCRF)</h3>
                <span className="badge badge-draft">Strong Draft</span>
              </div>
              <p className="muted">In development</p>
              <p>
                Clothing as nervous system regulation infrastructure. Somatic interface
                design, sensory coherence mapping, wardrobe as accommodation system.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link text-muted">Coming Soon</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Documents */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)' }}>
        <div className="container">
          <h2>Supporting Documents</h2>

          <div className="doc-table">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Pages</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Global References</strong></td>
                  <td>27</td>
                  <td><span className="badge badge-complete">Complete</span></td>
                  <td><a href="#" className="btn-link">Download</a></td>
                </tr>
                <tr>
                  <td>123 references across 24 categories</td>
                  <td colSpan="3" className="muted">
                    Comprehensive bibliography covering polyvagal theory, neurodiversity,
                    cognitive science, occupational therapy, and design theory.
                  </td>
                </tr>
                <tr>
                  <td><strong>About Yve Bergeron</strong></td>
                  <td>7</td>
                  <td><span className="badge badge-complete">Complete</span></td>
                  <td><a href="#" className="btn-link">Download</a></td>
                </tr>
                <tr>
                  <td><strong>Biometric Validation Briefing</strong></td>
                  <td>—</td>
                  <td><span className="badge badge-complete">Complete</span></td>
                  <td><a href="#" className="btn-link">View</a></td>
                </tr>
                <tr>
                  <td>Integrated into NSOM</td>
                  <td colSpan="3" className="muted">
                    4.5 years of HRV data demonstrating protocol efficacy.
                  </td>
                </tr>
                <tr>
                  <td><strong>IP &amp; Strategy Brief</strong></td>
                  <td>—</td>
                  <td><span className="badge badge-complete">Complete</span></td>
                  <td><a href="#" className="btn-link">Download</a></td>
                </tr>
                <tr>
                  <td><strong>Project Plan</strong></td>
                  <td>19</td>
                  <td><span className="badge badge-complete">Complete</span></td>
                  <td><a href="#" className="btn-link">Download</a></td>
                </tr>
                <tr>
                  <td><strong>Editorial Style Guide</strong></td>
                  <td>—</td>
                  <td><span className="badge badge-complete">Complete</span></td>
                  <td><a href="#" className="btn-link">Download</a></td>
                </tr>
                <tr>
                  <td><strong>Master Framework Map</strong></td>
                  <td>—</td>
                  <td><span className="badge badge-draft">Needs Update</span></td>
                  <td><a href="#" className="btn-link text-muted">Pending</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Academic Papers */}
      <section className="section">
        <div className="container">
          <h2>Academic Papers</h2>
          <p className="muted">
            Peer-reviewed publications and submissions in development.
          </p>

          <div className="doc-grid">
            <div className="card doc-card">
              <div className="doc-header">
                <h3>Cognitive Scaffolding for High-Complexity Nervous Systems</h3>
                <span className="badge badge-complete">Polished</span>
              </div>
              <p className="muted">Target: Frontiers in Psychology</p>
              <p>
                Theoretical framework for treating nervous system regulation as
                a cognitive architecture problem requiring structured external scaffolding.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download Draft</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Understanding Nervous System Saturation</h3>
                <span className="badge badge-complete">Polished</span>
              </div>
              <p className="muted">Target: Applied Psychophysiology</p>
              <p>
                Load domain analysis and saturation thresholds in neurodivergent nervous systems.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download Draft</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Somatic Symptoms Paradigm Shift</h3>
                <span className="badge badge-draft">Strong Draft</span>
              </div>
              <p className="muted">Target: Frontiers in Psychiatry</p>
              <p>
                Reframing somatic symptoms from psychiatric diagnosis to bioelectrical
                communication attempts.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download Draft</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>When Regulation Becomes Harm</h3>
                <span className="badge badge-outline">Outline Only</span>
              </div>
              <p className="muted">Target: Disability &amp; Society</p>
              <p>
                Systemic critique of compliance-first regulation approaches in
                educational and workplace settings.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link text-muted">In Development</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>HRV Case Study Paper</h3>
                <span className="badge badge-partial">Data Exists</span>
              </div>
              <p className="muted">Target: Applied Psychophysiology &amp; Biofeedback</p>
              <p>
                Single-subject longitudinal analysis. 4.5 years of continuous HRV data
                demonstrating protocol efficacy.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link text-muted">Paper Not Written</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applied Tools */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)' }}>
        <div className="container">
          <h2>Family / Applied Tools</h2>
          <p className="muted">
            Practical regulation tools for children, families, and burnout recovery.
          </p>

          <div className="doc-grid">
            <div className="card doc-card">
              <div className="doc-header">
                <h3>My Body Reset Map</h3>
                <span className="badge badge-complete">Complete</span>
              </div>
              <p className="muted">Ages 7+, multiple versions</p>
              <p>
                Visual regulation map for children. Body-first approach, decision gates
                adapted for developmental stage. Parent-supported structure.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download Bundle</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Nervous System Operating Tools Family Pack</h3>
                <span className="badge badge-complete">Complete</span>
              </div>
              <p className="muted">Multi-document toolkit</p>
              <p>
                Complete family implementation guide. Parent tools, child tools,
                household structure templates, escalation protocols.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download Pack</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Burnout Operating Manual (Mode C)</h3>
                <span className="badge badge-complete">Complete</span>
              </div>
              <p className="muted">Crisis protocol</p>
              <p>
                Minimal-cognition protocol for operating in severe burnout. Mode C
                assumes no executive function capacity. Pre-built decision trees.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download PDF</a>
              </div>
            </div>

            <div className="card doc-card">
              <div className="doc-header">
                <h3>Burnout Recovery Manual</h3>
                <span className="badge badge-complete">Complete</span>
              </div>
              <p className="muted">Recovery protocol</p>
              <p>
                Structured pathway from burnout to sustainable baseline. Capacity-based
                pacing, load reduction strategies, re-entry protocols.
              </p>
              <div className="doc-actions">
                <a href="#" className="btn-link">Download PDF</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Materials */}
      <section className="section">
        <div className="container">
          <h2>Book Materials</h2>

          <div className="card doc-card">
            <div className="doc-header">
              <h3>Embodied Neurodiversity</h3>
              <span className="badge badge-complete">Complete</span>
            </div>
            <p className="muted">Book proposal — 8 pages</p>
            <p>
              20 chapters across 5 parts. Comprehensive integration of framework theory,
              protocol implementation, applied tools, material design, and ethical critique.
            </p>
            <ul className="book-structure">
              <li><strong>Part I:</strong> Theoretical foundations</li>
              <li><strong>Part II:</strong> Core protocols (NSOM, DGAEP)</li>
              <li><strong>Part III:</strong> Applied tools and case studies</li>
              <li><strong>Part IV:</strong> Material design (MCRF)</li>
              <li><strong>Part V:</strong> Ethics, philosophy, systemic critique</li>
            </ul>
            <div className="doc-actions">
              <a href="#" className="btn-link">Download Proposal</a>
            </div>
          </div>
        </div>
      </section>

      {/* Download Information */}
      <section className="section" style={{ backgroundColor: 'var(--bg-deep)', textAlign: 'center' }}>
        <div className="container">
          <h2>Download &amp; Distribution</h2>
          <p>
            All core protocol documents are available for free download.
            Applied tools are available through Gumroad with pay-what-you-can pricing.
          </p>
          <div className="cta-buttons" style={{ marginTop: '2rem' }}>
            <a href="#" className="btn btn-primary">
              Download NSOM (Free)
            </a>
            <a href="#" className="btn btn-secondary">
              Browse Gumroad Store
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-small {
          background: linear-gradient(135deg, var(--bg-warm) 0%, var(--bg-deep) 100%);
          padding: 4rem 0;
          border-bottom: 1px solid var(--border);
        }

        .hero-small h1 {
          margin-bottom: 1rem;
        }

        .subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 800px;
        }

        .doc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .doc-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .doc-header h3 {
          margin: 0;
          flex: 1;
        }

        .doc-actions {
          margin-top: auto;
          padding-top: 1rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-link {
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .btn-link:hover {
          color: var(--accent-soft);
          text-decoration: underline;
        }

        .btn-link.text-muted {
          color: var(--text-light);
          cursor: not-allowed;
        }

        .doc-table {
          margin-top: 2rem;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--white);
          border-radius: 8px;
          overflow: hidden;
        }

        th {
          background-color: var(--bg-warm);
          color: var(--text);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 600;
          text-align: left;
          padding: 1rem;
          border-bottom: 2px solid var(--border);
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }

        tr:last-child td {
          border-bottom: none;
        }

        .book-structure {
          list-style: none;
          margin: 1rem 0;
          padding: 0;
        }

        .book-structure li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
        }

        .book-structure li:last-child {
          border-bottom: none;
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

        @media (max-width: 768px) {
          .doc-grid {
            grid-template-columns: 1fr;
          }

          .doc-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  )
}
