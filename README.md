# Backlog Surgeon 🩺

> **Surgical Scope Triage for Product Ideas**
> An opinionated, clinical product scoping tool that triages messy, over-scoped product ideas into a defensible MVP for founders, developers, and small teams.

---

## The Problem

Most product planning tools and AI assistants are **agreeable**. When you paste an ambitious, 15-feature product wish-list, they summarize it, organize it into polite bullet points, and encourage you to build all of it.

The result is scope creep, bloated architectures, and delayed launches.

**Backlog Surgeon** takes the opposite approach: it is a ruthless, opinionated product scope reviewer. It challenges your assumptions, identifies your single value-proving user action, and cuts premature complexity before you write a single line of code.

---

## How It Works

```
[Browser Form] User inputs messy idea (or selects a sample)
      │
      ▼
[Next.js Route Handler: POST /api/analyze]
      │
      ▼
[OpenAI Responses API — gpt-5.6-luna]
  Strict Structured Outputs enforcement (text.format)
      │
      ▼
[Zod Schema Validation & Boundary Checks]
      │
      ▼
[Browser Diagnosis]
  ├─ Diagnostic Summary Grid (Problem, Risk, MVP Kernel, Success Metric)
  ├─ 🟢 Build Now (2–3 essential capabilities proving core value)
  ├─ 🟡 Build Later (natural extensions of the validated loop)
  └─ 🔴 Don't Build (regulatory domains, different user types, speculative AI)
```

---

## Key Features

- **Clinical Triage Engine:** Powered by OpenAI `gpt-5.6-luna` using strict Structured Outputs so responses conform to the expected schema before rendering.
- **Strict Scope Boundaries:**
  - **Build Now (Emerald):** Capped at 2–3 core features that prove the single value-proving hypothesis.
  - **Build Later (Amber):** Deferrable extensions of the same validated loop.
  - **Don't Build (Rose):** Aggressive rejection of off-kernel complexity, separate regulatory domains (e.g. card issuance, crypto, merchant rails), distinct customer personas, and decorative AI.
- **Surgical Rationale for Every Item:** Explicit 1–2 sentence reasoning for every classified capability.
- **Zero-Friction Sharing:** One-click **Copy Result** formats the diagnosis into GitHub-flavored Markdown for pasting into PRDs, Jira tickets, or team chat.
- **Linear/Railway Developer-Tool Aesthetic:** Clinical dark mode, crisp typography, and focused animations.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **AI Engine:** OpenAI Responses API (`gpt-5.6-luna`) with Structured Outputs (`strict: true`)
- **Validation:** Zod
- **Styling:** Native Vanilla CSS with CSS Custom Properties (zero-dependency design system)
- **Deployment:** Vercel

---

## Hackathon Build

This project was built for the **Devpost Learn AI Basics** hackathon using a plan-first workflow. The complete product definition and technical architecture documents are tracked in the repository:

- `devpost/scope.md` — Problem framing, target user, core loop, and MVP boundary
- `devpost/prd.md` — Product requirements, behaviors, states, and acceptance criteria
- `devpost/spec.md` — Technical specification, API contract, schemas, and component architecture

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <TODO: YOUR_GITHUB_REPOSITORY_URL>
   cd backlog-surgeon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`:
   ```ini
   OPENAI_API_KEY=sk-proj-...
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Under **Project Settings → Environment Variables**, add:
   - `OPENAI_API_KEY`: Your OpenAI API secret key.
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js application.

---

## License

MIT
