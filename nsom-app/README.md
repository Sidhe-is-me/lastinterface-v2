# NSOM — Nervous System Operating Manual

**A decision-gated daily regulation protocol for neurodivergent nervous systems.**

By Yve Bergeron — Neurodiversity & Autism Studies, University College Cork

---

## What This Is

A full-stack web application implementing the Nervous System Operating Manual (NSOM) and Decision-Gated Autonomic Escalation Protocol (DGAEP). Features include:

- **Interactive regulation loop** with guided breathing animation and decision gate
- **DGAEP escalation protocol** with built-in countdown timers at all six levels
- **HRV trend charting** (Recharts) with resting heart rate overlay
- **Claude-powered load domain detection** — describe your state, get domain-specific interventions
- **Claude-powered weekly pattern analysis** — AI surfaces recurring patterns from your logged entries
- **Persistent tracking** via localStorage (all data stays on your device)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18, Recharts
- **AI:** Anthropic Claude API (Sonnet) via server-side API route
- **Storage:** Browser localStorage (no database required)
- **Hosting:** Vercel (free tier)

---

## Deploy to Vercel (Step by Step)

### Prerequisites

- A GitHub account (free)
- A Vercel account (free — sign up at vercel.com with your GitHub)
- An Anthropic API key (for the AI features — get one at console.anthropic.com)

### Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `nsom-app`)
2. Upload or push all project files to the repository:

```bash
cd nsom-app
git init
git add .
git commit -m "Initial commit — NSOM regulation protocol app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nsom-app.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `nsom-app` repository
4. Vercel auto-detects Next.js — no build configuration needed

### Step 3: Add Your API Key

1. In the Vercel project setup screen (before deploying), expand **Environment Variables**
2. Add one variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your API key (starts with `sk-ant-`)
3. Click **Deploy**

### Step 4: Done

Vercel builds and deploys automatically. You'll get a URL like `nsom-app.vercel.app`. The app is live.

### Step 5 (Optional): Custom Domain

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add your domain (e.g., `app.thelastinterface.com`)
3. Vercel provides DNS instructions — add the records at your domain registrar
4. SSL is automatic

---

## Running Locally

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## Project Structure

```
nsom-app/
├── app/
│   ├── api/
│   │   └── claude/
│   │       └── route.js        # Server-side API proxy (keeps key secure)
│   ├── globals.css              # Global styles + font imports
│   ├── layout.js                # Root layout with metadata
│   └── page.js                  # Main page entry
├── components/
│   └── NsomApp.jsx              # Complete application component
├── lib/
│   └── storage.js               # localStorage wrapper
├── public/                      # Static assets (add favicon, OG image here)
├── .env.example                 # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## Configuration Notes

### API Key Security

The Anthropic API key is **never exposed to the browser**. All Claude requests go through `/api/claude/route.js`, which runs server-side on Vercel's edge functions. The key is stored as an environment variable.

### Data Privacy

All regulation log data is stored in the user's browser via localStorage. No data is sent to any server except:

- Claude API calls for load domain detection and weekly pattern analysis (these send the user's description or log entries to the Anthropic API for processing)
- No data is stored server-side

### Without an API Key

The app works without an API key — the regulation loop, DGAEP timers, HRV chart, and tracking all function normally. Only the Analysis tab (load domain detection and weekly pattern analysis) requires the API key. If no key is configured, those features display an error message.

---

## Embedding in Notion

To embed this app on your Notion site (thelastinterface.com):

1. Deploy to Vercel (steps above)
2. In Notion, type `/embed`
3. Paste your Vercel URL (e.g., `https://nsom-app.vercel.app`)
4. The app renders inline on your Notion page

Note: Some Notion embed restrictions may apply. If the embed doesn't render, link to the app URL directly instead.

---

## Credits

The Nervous System Operating Manual and Decision-Gated Autonomic Escalation Protocol were developed by Yve Bergeron. Informed by 19 years of bodywork practice, 17+ years of accessibility engineering, and validated with 4.5 years of continuous HRV biometric data.

*The nervous system is the last interface.*
