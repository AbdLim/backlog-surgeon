---
doc: spec
status: approved
---

# Backlog Surgeon — Technical Spec

## How This Works, In Plain Language

Backlog Surgeon is a single Next.js web application. There are no databases, no user accounts, and no background services — just a browser talking to your own server code.

Here is what happens when you use it:

1. The browser shows you an input form. You type or paste a product idea, or click a sample prompt to fill the textarea.
2. When you click "Analyze Scope", your browser sends the raw text to a small piece of server code living inside the same Next.js app — a **Route Handler** at `POST /api/analyze`.
3. That server code validates your input, then calls OpenAI's API with a carefully engineered **triage prompt** and a strict **JSON schema**. OpenAI is constrained to return exactly the structure we defined — not freeform prose.
4. The server validates the returned data against that schema using **Zod** (a TypeScript validation library), then sends the clean result back to your browser.
5. Your browser renders the structured diagnosis: core problem, riskiest assumption, smallest MVP, success criteria, and three triage columns (Build Now, Build Later, Don't Build) with a short reason for every classified feature.
6. You can copy the result as Markdown or click "Triage Another" to start fresh.

Nothing is saved anywhere. When you close the tab, the session is gone. The OpenAI API key never leaves the server.

This shape — browser → your server → OpenAI → your server → browser — is the standard pattern for keeping AI keys private while building a web tool. The added server hop is why the key isn't exposed.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`

```
User types/pastes idea in textarea
        │
        ▼
[Browser] "Analyze Scope" clicked
  → validates textarea is non-empty (button disabled otherwise)
  → sets UI state to "analyzing"
  → POST /api/analyze  { input: "..." }
        │
        ▼
[Route Handler: app/api/analyze/route.ts]
  → validates request body (non-empty string, rejects gibberish via prompt logic)
  → builds system prompt + user message
  → calls OpenAI Responses API
      model: gpt-5.6-luna
      text.format: { type: "json_schema", schema: TriageSchema, strict: true }
  → receives complete structured JSON response
  → validates against Zod schema
  → returns { ok: true, data: TriageResult } or { ok: false, error: ErrorPayload }
        │
        ▼
[Browser] receives response
  → if ok: transitions UI state to "results", renders diagnosis
  → if error: transitions UI state to "error", shows error message + Retry action
```

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Established preference; server-side route handlers keep the API key private; Vercel deployment is first-class |
| Language | TypeScript | Established preference |
| AI Provider | OpenAI Responses API | Structured output enforcement (`text.format` + `strict: true`), fast, low cost |
| AI Model | `gpt-5.6-luna` | Cost-efficient, fast, sufficient for constrained product analysis; fallback: `gpt-5.6-terra` if triage quality is too shallow |
| Schema Validation | Zod | Runtime validation of OpenAI response before sending to client; prevents malformed data reaching the UI |
| OpenAI SDK | `openai` npm package (latest) | Official TypeScript SDK with Responses API support |
| Styling | Vanilla CSS (CSS custom properties) | No framework dependency; full control over the clinical dark aesthetic |
| Fonts | Inter (primary) + system monospace or Geist Mono (accents) | Matches the Linear/Railway developer-tool aesthetic specified in the PRD |
| Deployment | Vercel | Chosen deployment target; zero-config Next.js deployment; provides a public live URL for the demo video and optional judge access |

## Where It Runs and How Someone Tries It

**Local development:**
```bash
npm install
# create .env.local with OPENAI_API_KEY=sk-...
npm run dev
# open http://localhost:3000
```

**Vercel deployment (chosen target):**
The Devpost submission requires a public GitHub repository and a demo video. Vercel is our chosen deployment target because it provides a public live URL, makes demo recording easier, and gives judges an optional way to try the application directly.
- Push the repository to GitHub (public).
- Import the repository in the Vercel dashboard.
- Add `OPENAI_API_KEY` as an environment variable in Vercel project settings.
- Deploy. Vercel auto-detects Next.js and requires no additional build configuration.
- The live URL is used for the demo video recording.

**Demo recording guidance (for `6-ship`):**
Use the deployed Vercel URL. Show the full journey: paste the multi-bank fintech example → click Analyze Scope → analyzing state → structured result → Copy Result.

**Environment variables required:**
- `OPENAI_API_KEY` — OpenAI secret key, server-side only, never exposed to the browser.

## Look and Feel
Carries forward `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.

**Implementation direction for the build:**
- **Background:** `#0a0a0b` or equivalent near-black (not pure black — avoid harsh contrast)
- **Surface/card background:** `#111113` with a subtle `1px` border at `rgba(255,255,255,0.07)`
- **Primary text:** `#e8e8ea` — off-white, high contrast against dark backgrounds
- **Secondary/muted text:** `#6b6b7a` — for labels, supporting copy, rationale text
- **Accent — Build Now:** `#22c55e` (emerald-500) as a left border, badge dot, or label — not a filled card background
- **Accent — Build Later:** `#f59e0b` (amber-500) — same restrained usage
- **Accent — Don't Build:** `#f43f5e` (rose-500) — same restrained usage
- **Font stack:** `Inter, system-ui, sans-serif` for body; `'Geist Mono', 'Fira Code', monospace` for badges and labels
- **No decorative gradients, glowing blobs, or chatbot bubble styling.**
- **Interface copy tone:** Direct, clinical, product-reviewer voice matching the tool's persona.

## Components

### `<TriageApp />` — Root State Machine
Top-level client component that holds the UI state (`input | analyzing | results | error`) and owns the transition logic. Renders one of three views based on current state.
PRD ref: `prd.md > Screens and Layout`, `prd.md > States and Boundaries`

### `<InputView />` — Input State
Renders the landing surface: headline, tagline, sample prompt pills, textarea, and "Analyze Scope" button.
- Textarea value is controlled state.
- "Analyze Scope" button `disabled` attribute is bound to `input.trim().length === 0`.
- Clicking a sample prompt pill sets textarea value; does not trigger analysis.
- On submit: validates non-empty, transitions `TriageApp` to `analyzing`, fires `POST /api/analyze`.
PRD ref: `prd.md > Sample Prompt Population`, `prd.md > Features and Behavior > 1`, `prd.md > States and Boundaries > Input State`

### `<AnalyzingView />` — Analyzing State
Shown during the in-flight request. Renders a surgical scanning pulse animation and cycles through status messages every ~2 seconds:
1. "Finding the core problem..."
2. "Identifying the value-proving action..."
3. "Cutting premature features..."
4. "Testing the smallest useful MVP..."
PRD ref: `prd.md > Processing State Presentation`, `prd.md > Features and Behavior > 3`

### `<ResultsView />` — Results State
Renders the complete structured diagnosis:
- **Action bar:** "Copy Result" (copies Markdown to clipboard, shows "Copied!" feedback for 2s) and "Triage Another" (resets `TriageApp` to `input` state with cleared data).
- **Diagnostic Summary Grid:** Four cards — Core Problem, Riskiest Assumption, Smallest Useful MVP, Success Criteria.
- **Feature Triage Section:** Three columns/groups with semantic accents — Build Now (emerald), Build Later (amber), Don't Build (rose). Each item: feature name + rationale text.
- **Original Input:** Collapsed/compact display of the raw input text for reference.
PRD ref: `prd.md > Structured Results & Copy Action`, `prd.md > Features and Behavior > 2 & 4`

### `<ErrorView />` — Error State
Shown when `POST /api/analyze` returns `ok: false`. Displays the appropriate message and a "Try Again" button that returns to the input state with the original text preserved.
PRD ref: `prd.md > States and Boundaries > Error State`

### Route Handler: `app/api/analyze/route.ts`
Server-side POST handler. Responsibilities:
1. Parse and validate the request body: reject if missing, empty, or non-string.
2. Build the OpenAI system prompt (triage persona, classification rules, output contract).
3. Call OpenAI Responses API with model `gpt-5.6-luna` and `text.format` structured output schema.
4. Validate the response with Zod against `TriageResultSchema`.
5. Return `{ ok: true, data: TriageResult }` on success.
6. Return `{ ok: false, error: { code: string, message: string } }` on any failure (invalid input, OpenAI error, schema mismatch).
PRD ref: `prd.md > Scope Analysis & Triage Engine`, `prd.md > Features and Behavior > 2`

## Data Model

**No persistent storage.** All data is ephemeral React state within `<TriageApp />`.

### `TriageResultSchema` (Zod, also used as the OpenAI JSON schema)

```typescript
const FeatureItemSchema = z.object({
  feature: z.string(),    // Feature or capability name
  rationale: z.string(),  // Why it belongs in this tier (opinionated, 1–2 sentences)
});

const TriageResultSchema = z.object({
  coreProblem: z.string(),           // The single primary user problem
  riskiestAssumption: z.string(),    // The assumption most likely to invalidate the idea
  smallestMVP: z.string(),           // The minimum useful version of the product
  successCriteria: z.string(),       // How you'd know the MVP is working
  buildNow: z.array(FeatureItemSchema),
  buildLater: z.array(FeatureItemSchema),
  dontBuild: z.array(FeatureItemSchema),
  insufficientContext: z.boolean(),  // true if input lacks enough product context to triage
  refusalReason: z.string().optional(), // populated only when insufficientContext is true
});
```

**State shape in `<TriageApp />`:**
```typescript
type AppState =
  | { phase: 'input'; inputText: string }
  | { phase: 'analyzing'; inputText: string }
  | { phase: 'results'; inputText: string; result: TriageResult }
  | { phase: 'error'; inputText: string; errorMessage: string };
```

### Insufficient Context Handling
When the input contains text but lacks product context ("hello", "asdf", a single word), the AI is instructed to return `insufficientContext: true` with a `refusalReason` rather than fabricating a scope. The route handler detects this and returns an appropriate `error` payload, which `<ErrorView />` displays as the insufficient-context message.
PRD ref: `prd.md > States and Boundaries > Insufficient Context State`

## File Structure

```
backlog-surgeon/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # POST /api/analyze — triage route handler
│   ├── globals.css               # CSS custom properties, base reset, typography
│   ├── layout.tsx                # Root layout, font loading, metadata/SEO
│   └── page.tsx                  # Single route — renders <TriageApp />
├── components/
│   ├── TriageApp.tsx             # Root state machine, owns AppState
│   ├── InputView.tsx             # Input phase: textarea, samples, submit
│   ├── AnalyzingView.tsx         # Analyzing phase: animation, cycling messages
│   ├── ResultsView.tsx           # Results phase: diagnosis cards, triage columns
│   └── ErrorView.tsx             # Error phase: message, retry action
├── lib/
│   ├── schema.ts                 # Zod TriageResultSchema + TypeScript types
│   ├── prompt.ts                 # OpenAI system prompt + triage instructions
│   └── markdown.ts               # Formats TriageResult as Markdown for clipboard copy
├── devpost/                      # Planning docs (learner-profile, scope, prd, spec)
├── .env.local                    # OPENAI_API_KEY (local dev, git-ignored)
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

## External Services and Dependencies

### OpenAI Responses API
- **SDK call:** `openai.responses.create(...)` — confirmed method name in the current `openai` npm package
- **Endpoint:** `POST https://api.openai.com/v1/responses` (via the `openai` npm SDK)
- **Model:** `gpt-5.6-luna` — confirmed available on the Responses API with Structured Outputs support
- **Structured output:** `text.format: { type: "json_schema", json_schema: { name: "triage_result", schema: ..., strict: true } }` — confirmed parameter location for the Responses API
- **Auth:** `Authorization: Bearer $OPENAI_API_KEY` — server-side only
- **Rate limits & cost:** Check current `gpt-5.6-luna` pricing and RPM limits at [platform.openai.com/docs/models](https://platform.openai.com/docs/models) before the first test run.
- **Docs:** [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses) | [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)

### Vercel (Deployment)
- **Target:** Vercel Hobby (free tier is sufficient for a hackathon PoC)
- **Deploy method:** GitHub integration — push to `main` triggers an automatic deploy
- **Environment variable:** Set `OPENAI_API_KEY` under Project Settings → Environment Variables
- **Docs:** [vercel.com/docs](https://vercel.com/docs)

## Important Failure Modes

- **OpenAI API error or timeout** → Route handler catches the exception and returns `{ ok: false, error: { code: "api_error", message: "..." } }`. Browser shows `<ErrorView />` with *"The surgery didn't go as planned. Your idea is untouched. Try the analysis again."* and a "Try Again" button. Input text is preserved.
- **Zod schema validation failure** (OpenAI returns structurally unexpected output despite `strict: true`) → Treated as an `api_error`, same error view. Unlikely with schema enforcement, but a safety net.
- **Insufficient product context in input** → OpenAI returns `insufficientContext: true`; route handler maps this to `{ ok: false, error: { code: "insufficient_context" } }`. Browser shows the insufficient-context message: *"This doesn't contain enough product context to triage..."*.

## What Was Simplified and Why

- **No database or persistence** instead of session/project storage — ephemeral in-memory React state is sufficient to prove the triage kernel. Adding storage would require infra that doesn't improve the demo.
- **No streaming** instead of token-by-token streaming — waiting for the complete structured JSON guarantees a coherent result view without layout shifts or partial triage columns appearing mid-render.
- **Single `POST /api/analyze` route** instead of a separate backend service — the Next.js Route Handler keeps the stack minimal and Vercel deployable with no additional infrastructure.
- **`insufficientContext` flag inside the schema** instead of a separate pre-analysis classifier — delegates the "is this a real product idea?" judgment to the model, which already has context about the input, rather than adding a second OpenAI call.

## Decisions and Open Issues

### Decisions Made
- **OpenAI Responses API over Chat Completions** — user's explicit preference for current API patterns; `text.format` structured output enforcement is available.
- **`gpt-5.6-luna` as default model** — cost-efficient and fast; architectural switchover to `gpt-5.6-terra` requires only a one-line model ID change in `lib/prompt.ts` or an environment variable.
- **Route Handler over Server Action** — cleaner isolation for testing, easier to add rate-limiting or error normalization, and closer to the production pattern if this product grows.
- **Vanilla CSS over a utility framework** — full control over the clinical dark aesthetic without fighting framework defaults; no Tailwind purge configuration needed for Vercel.
- **Vercel deployment** — chosen deployment target providing a public live URL; zero additional infrastructure for a Next.js app. Submission artifacts (repository + demo video) do not require deployment, but deployment improves the demo recording and gives judges a live URL to try.

### One Genuine Uncertainty (Resolved Before Spec Approval)
The exact Responses API call shape in the `openai` npm SDK was flagged as requiring verification. This has now been confirmed: use `openai.responses.create(...)` with structured output specified under `text.format` (not `response_format`). `gpt-5.6-luna` is confirmed available on the Responses API with Structured Outputs support. No further investigation needed before writing `route.ts`.

### Open Issues
- None blocking the build. All product behaviors, error states, component responsibilities, and deployment steps are defined.
