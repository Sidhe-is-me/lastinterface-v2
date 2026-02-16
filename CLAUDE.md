# CLAUDE.md — The Last Interface Project

## Project Owner

**Yve Bergeron** — Senior Accessibility Consultant, CGI (17+ years). Currently studying Neurodiversity & Autism Studies at University College Cork. 19 years of bodywork experience. Neurodivergent (AuDHD).

## What This Project Is

This is the project site for **The Last Interface** (thelastinterface.com) — the public-facing home of the **Neurodiversity-Informed Nervous System Regulation Architecture**, an original body of work treating nervous system dysregulation as a bioelectrical communication disability requiring capacity-based accommodations rather than optimisation approaches.

The project site serves as: document registry with version tracking, publication pipeline tracker, framework architecture visualisation, public-facing overview pages, changelog/provenance timeline, and downloads hub.

## Framework Architecture

The framework operates in five layers. Each builds on the ones below it. Everything connects back to one principle: **reduce load, defer cognition, let the body lead, externalise structure.**

### Layer 1: Theory
Neurodiversity paradigms, polyvagal theory, cognitive load theory, embodied cognition, somatic symptom reframing, EDS as bioelectrical communication failure, systemic critique of compliance-first models. Status: **Strong Draft**.

### Layer 2: Core Protocol
Decision-gated regulation loop (NSOM), structured journaling, escalation ladder (DGAEP), mode separation (capture / process / decide). Status: **Polished / Complete**.

### Layer 3: Applied Tools
Body Reset Map (kids), Family Pack, Burnout Recovery Manual, Burnout Operating Manual (Mode C), parent/child lock-screen maps. Status: **Complete**.

### Layer 4: Material Design
Material Coherence Regulation Framework (MCRF / clothing as somatic interface), Mythic Minimalism wardrobe system, Seasonal Home Décor Framework. Status: **Strong Draft**.

### Layer 5: Ethics & Philosophy
Ethical implications (education, work, parenting), When Regulation Becomes Harm (systemic critique), Nervous System Accessibility Manifesto, IP/authorship positioning. Status: **Strong Draft / Partial**.

## Document Inventory

### Core Protocol Documents
| Document | Pages | Status |
|---|---|---|
| Nervous System Operating Manual (NSOM) | 31 | **COMPLETE** |
| Decision-Gated Autonomic Escalation Protocol (DGAEP) | 19 | **COMPLETE** |
| Material Coherence Regulation Framework (MCRF) | — | **STRONG DRAFT** |

### Supporting Documents
| Document | Pages | Status |
|---|---|---|
| Global References | 27 | **COMPLETE** (123 refs, 24 categories) |
| About Yve Bergeron | 7 | **COMPLETE** |
| Biometric Validation Briefing | — | **COMPLETE** (integrated into NSOM) |
| IP & Strategy Brief | — | **COMPLETE** |
| Project Plan | 19 | **COMPLETE** |
| Master Framework Map | — | **NEEDS UPDATE** |
| Editorial Style Guide | — | **COMPLETE** |

### Book Materials
| Document | Pages | Status |
|---|---|---|
| Embodied Neurodiversity (book proposal) | 8 | **COMPLETE** (20 chapters, 5 parts) |

### Academic Papers
| Document | Status | Target Venue |
|---|---|---|
| Cognitive Scaffolding for High-Complexity Nervous Systems | **Polished** | Frontiers in Psychology |
| Understanding Nervous System Saturation | **Polished** | Applied Psychophysiology |
| Somatic Symptoms Paradigm Shift | **Strong Draft** | Frontiers in Psychiatry |
| When Regulation Becomes Harm | **OUTLINE ONLY** | Disability & Society |
| HRV Case Study Paper | **DATA EXISTS** | Applied Psychophysiology & Biofeedback |

### Family / Applied Tools (PDFs)
| Document | Status |
|---|---|
| My Body Reset Map (Kids, ages 7+) | **Complete** (multiple versions, needs bundling) |
| Nervous System Operating Tools Family Pack | **Complete** |
| Burnout Operating Manual (Mode C) | **Complete** |
| Burnout Recovery Manual | **Complete** |

### Pending Documents
| Document | Status |
|---|---|
| The Last Interface (bridge piece / conference talk) | **Concept defined, script drafted** |
| HRV Case Study Paper | **Data exists, paper not written** |

## Publication Pipeline

### Academic Targets
| Document | Target Venue | Type | Notes |
|---|---|---|---|
| DGAEP | Autism in Adulthood | Peer-reviewed | Neurodiversity-affirming, no PhD required |
| DGAEP (alt) | Frontiers in Psychology | Peer-reviewed | Open-access, broad reach |
| DGAEP (lower bar) | The OT Practice | Professional | Practice-focused, shorter |
| HRV Case Study | Applied Psychophysiology & Biofeedback | Peer-reviewed | Single-subject designs accepted |
| MCRF | Design Issues (MIT Press) | Peer-reviewed | Design theory |
| MCRF (alt) | Disability & Society | Peer-reviewed | Social model framing |
| Somatic Symptoms | Frontiers in Psychiatry | Peer-reviewed | Paradigm-challenging |
| Bridge piece | Interactions (ACM) | Magazine | Design + HCI |

### Conference Targets
- CSUN Assistive Technology Conference
- Inclusive Design 24
- Axe-con (Deque)
- M-Enabling Summit
- ASSETS (ACM)
- AutismEurope / INSAR
- OT conferences (AOTA, WFOT)

### Digital Distribution
- Gumroad: Family Toolkit ($15–25), Biometric Tracking Guide ($10–15)
- Substack: Free/paid newsletter, bridge pieces, audience building
- Personal website (this site): NSOM free download, framework overview
- NSOM React app: Deployed on Vercel, embeddable

## Biometric Validation

4.5 years of continuous HRV data (SDNN via Apple Watch, 1,700+ days). Key findings:
- Pre-protocol: HRV sustained at 16–25 ms for six consecutive weeks
- Protocol adoption: Step-function jump from 20–25 ms to 33–38 ms within one week
- Sustained recovery: Five months at 42–58 ms (highest readings in entire dataset)
- Protocol disruption: Collapse from 42.9 ms to 20.4 ms within 48 hours

## Design System

### Typography
- **Headings:** Cormorant Garamond (Google Fonts)
- **Body:** Source Serif 4 (Google Fonts)
- **Monospace/code:** System default

### Colour Palette
| Token | Hex | Usage |
|---|---|---|
| bg | #F7F3EE | Page background |
| bgDeep | #EDE7DF | Card/section backgrounds |
| bgWarm | #E8DFD4 | Subtle emphasis |
| text | #3D3229 | Primary text |
| textMuted | #8B7D6F | Secondary text |
| textLight | #A69888 | Tertiary/labels |
| accent | #B8845C | Primary accent, buttons, links |
| accentSoft | #D4A97A | Hover states, gradients |
| green | #7A9E7E | Success, gate passed |
| amber | #C4964A | Warning, escalation |
| red | #B85C5C | Error, red lines |
| white | #FFFFFF | Cards, overlays |
| border | #DDD4C8 | Borders |
| blue | #6B8EAE | Cognitive domain, info |

### Design Principles
- Warm earth tones — intentionally calming, non-clinical
- Generous whitespace — reducing visual cognitive load
- Minimal decoration — content is the interface
- Accessibility-first — this is an accessibility project, the site must model it

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** CSS Modules or Tailwind (warm palette, not default blue)
- **Charts:** Recharts
- **AI features:** Anthropic Claude API via server-side API route
- **Hosting:** Vercel (free tier, auto-deploy from main branch)
- **Domain:** thelastinterface.com

## Key Terminology

- **NSOM** — Nervous System Operating Manual. The flagship daily regulation protocol.
- **DGAEP** — Decision-Gated Autonomic Escalation Protocol. Six-level escalation for when regulation fails.
- **MCRF** — Material Coherence Regulation Framework. Clothing as nervous system regulation infrastructure.
- **Decision Gate** — Binary checkpoint: did the body change? Yes → proceed. No → escalate. The core innovation.
- **Load Domains** — Five categories of nervous system load: Cognitive, Emotional, Sensory, Social, Executive.
- **Red Lines** — Non-negotiable system boundaries requiring immediate protective action.
- **Capacity-based accommodation** — The core framing: treating dysregulation as a disability requiring accommodation, not optimisation.

## Project Conventions

- British English spelling (behaviour, organise, colour, practise/practice distinction)
- Oxford comma: yes
- Em dashes: spaced ( — ) not unspaced (—)
- Tone: authoritative but warm. Clinical precision without clinical coldness.
- The tagline is: "The nervous system is the last interface."
- Attribution line: "Yve Bergeron — Neurodiversity & Autism Studies, University College Cork"
- The framework is original integrative work. Individual components draw from polyvagal theory, OT, somatic experiencing, and cognitive science. The decision-gated architecture, capacity-based accommodation approach, and accessibility-first framing are original contributions.

## Git Conventions

- Commit messages: imperative mood, lowercase ("add document registry page", not "Added Document Registry Page")
- Branch naming: feature/description, fix/description
- Main branch deploys automatically to Vercel
- Meaningful commits — one logical change per commit

## What Not to Do

- Do not use clinical/medical blue colour schemes. This is warm, grounded, human.
- Do not use language implying the user is broken. The system is the accommodation, not a fix.
- Do not describe the protocol as "wellness" or "self-care." It is systems architecture.
- Do not skip the decision gate in any representation of the protocol. It is the core innovation.
