# The Last Interface — Project Site

The public-facing home of the **Neurodiversity-Informed Nervous System Regulation Architecture** by Yve Bergeron.

## What This Is

This is the project site for **thelastinterface.com** — serving as document registry with version tracking, publication pipeline tracker, framework architecture visualisation, public-facing overview pages, changelog/provenance timeline, and downloads hub.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** CSS Modules with custom design system
- **Charts:** Recharts
- **Hosting:** Vercel
- **Domain:** thelastinterface.com

## Design System

### Typography
- **Headings:** Cormorant Garamond (Google Fonts)
- **Body:** Source Serif 4 (Google Fonts)
- **Monospace:** System default

### Colour Palette
Warm earth tones, intentionally calming and non-clinical:
- Background: #F7F3EE
- Text: #3D3229
- Accent: #B8845C
- Success: #7A9E7E
- Warning: #C4964A

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── layout.js          # Root layout with navigation and footer
├── page.js            # Homepage
├── documents/         # Document registry
│   └── page.js
├── framework/         # Framework architecture overview
│   └── page.js
└── about/             # About Yve Bergeron
    └── page.js
```

## Deployment

Automatically deploys to Vercel from the main branch.

## Conventions

- British English spelling (behaviour, organise, colour)
- Oxford comma: yes
- Em dashes: spaced ( — ) not unspaced (—)
- Tone: authoritative but warm, clinical precision without clinical coldness
- Git commits: imperative mood, lowercase

## Attribution

Yve Bergeron — Neurodiversity & Autism Studies, University College Cork

The nervous system is the last interface.
