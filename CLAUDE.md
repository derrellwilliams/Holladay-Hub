# Holladay Hub — Claude Guidelines

Behavioral guidelines for this project. Based on Karpathy-inspired principles.

**Tradeoff:** These bias toward caution over speed. Use judgment on trivial tasks.

---

## 1. Think Before Coding

**Don't assume. Surface tradeoffs.**

- State assumptions explicitly before implementing. If uncertain, ask.
- If multiple approaches exist, name them — don't pick silently.
- If something is unclear, stop and ask rather than guess.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No error handling for impossible scenarios.
- No `Promise.resolve()` wrapping sync functions.
- No `useCallback` unless passed to a memoized child component.

## 3. Surgical Changes

**Touch only what you must.**

- Don't improve adjacent code, comments, or formatting.
- Don't refactor working code unless asked.
- Match existing style even if you'd do it differently.
- If you notice pre-existing dead code, **flag it — don't delete it** without an explicit ask.
- Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Name what "done" looks like before starting.**

For any non-trivial change, state success criteria first:
- "Mobile layout → verify: logo stays natural width, search fills row, filters hidden on mobile"
- "Font fix → verify: Instrument Serif loads on Vercel detail and card pages"

---

## Project-Specific Context

### Stack
- **Next.js 15** App Router — server components by default, `'use client'` only when needed
- **better-sqlite3** — synchronous, call directly in server components (no `Promise.resolve()` wrapping)
- **Tailwind CSS** with custom tokens: `alabaster`, `dust`, `ash`, `granite`, `gunmetal`
- **Fonts**: Instrument Serif (`var(--font-serif)`) + Instrument Sans (`var(--font-sans)`) via `next/font/google`
- **Node 20.x** pinned in `package.json` `engines` field — required for better-sqlite3 on Vercel

### Architecture
- `lib/db.ts` — all SQLite queries, exports `getMeetings`, `getMeeting`, `getMeetingTypes`, `getMeetingYears`, `getMeetingMonths`
- `lib/meetingColors.ts` — `getCanonicalType`, `getSubtype`
- `lib/utils.ts` — `formatDate(dateStr, long?)` shared across components
- `components/Sidebar.tsx` — client component, handles all filter + search routing via URL params, 300ms debounced search
- `components/MeetingCard.tsx` — server-safe, search highlighting via `<mark>`
- `app/page.tsx` — server component, calls db functions directly
- `app/meetings/[id]/page.tsx` — server component, `renderSummary` parses markdown-like AI summaries

### Deployment
- Vercel, root directory set to `next-app`
- Database (`meeting_summaries.db`) is committed to the repo — no external DB
- Remote: `https://github.com/derrellwilliams/Holladay-Digest.git`

### Conventions
- Badges: hardcoded `style={{ backgroundColor: '#EFEFEF' }}` — not dynamic Tailwind classes
- Card shadows: defined in `globals.css` via `.meeting-card` and `.meeting-card:hover`
- Mobile: sidebar is `flex-row` (logo + search only), desktop: `flex-col` with all filters
- No `Co-Authored-By: Claude` in commit messages
