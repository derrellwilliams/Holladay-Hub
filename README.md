# Holladay Digest

A tool for browsing Holladay City meeting minutes with AI-generated summaries.

The scraper pulls meeting PDFs from the city's website, extracts the text, and uses Claude to generate structured summaries. A GitHub Actions workflow runs nightly to check for new minutes and automatically update the site. The Next.js app lets you browse, filter, and search those summaries in a clean dashboard.

![Holladay Digest Screenshot](screenshot.png)

## Features

- Browse City Council and Planning Commission meeting minutes
- Filter by meeting type, year, and month
- Search across all summaries with highlighted matches
- AI-generated structured summaries with key topics, decisions, and votes
- Links to original PDF for each meeting
- Automatically updates nightly when new minutes are posted

## Stack

- **Scraper** — Python, pdfplumber, Anthropic Claude API
- **Automation** — GitHub Actions (nightly cron)
- **Web app** — Next.js 15, Tailwind CSS, better-sqlite3
- **Storage** — SQLite (`meeting_summaries.db`, committed to repo)
- **Hosting** — Vercel (auto-deploys on DB update)

## How it works

```
Nightly (midnight MT)
  → GitHub Actions checks the city website for new minutes PDFs
  → If new: downloads PDF, extracts text, summarizes with Claude
  → Commits updated database to main
  → Vercel detects the push and redeploys the site
```

No API calls are made if nothing is new — zero cost on empty runs.

## Setup

### 1. Scraper (local / initial population)

Install dependencies:
```bash
pip3 install anthropic pdfplumber requests beautifulsoup4
```

Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Run the full historical scrape (2020 onwards):
```bash
python3 scraper.py
```

Or check only the last 90 days:
```bash
python3 scraper.py --recent
```

The scraper uses the database itself to track what's been processed — re-running is safe, no duplicates.

### 2. Web App (local)

```bash
cd next-app
npm install
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001).

### 3. Automated updates (GitHub Actions)

Add your Anthropic API key as a repository secret:

**GitHub repo → Settings → Secrets and variables → Actions → New repository secret**
- Name: `ANTHROPIC_API_KEY`
- Value: your key

The workflow (`.github/workflows/scrape.yml`) runs automatically every night.
You can also trigger it manually from the **Actions** tab.

## Project Structure

```
HolladayHub/
├── scraper.py                    # Scrapes PDFs, summarizes with Claude, saves to SQLite
├── meeting_summaries.db          # SQLite database (committed to repo)
├── pdfs/                         # Downloaded PDFs (git-ignored, transient)
├── .github/workflows/scrape.yml  # Nightly automation
└── next-app/
    ├── app/
    │   ├── page.tsx                  # Dashboard
    │   └── meetings/[id]/page.tsx    # Meeting detail
    ├── components/
    │   ├── MeetingCard.tsx
    │   └── Sidebar.tsx
    └── lib/
        ├── db.ts                     # SQLite queries
        ├── meetingColors.ts          # Type labels
        └── utils.ts                  # Shared utilities (formatDate)
```

## Notes

- Only City Council and Planning Commission meetings have minutes PDFs on the city website. Other meeting types (Arts Council, Tree Committee, etc.) only publish agendas.
- Node.js 20.x is required (pinned in `package.json`) for `better-sqlite3` compatibility on Vercel.
