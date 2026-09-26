---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. End-to-end triage works: paste → analyze → see structured results**
  Becomes usable: A running app where a user pastes a messy product idea, clicks Analyze Scope, waits through the clinical analyzing state, and sees a structured opinionated diagnosis (Build Now / Build Later / Don't Build + diagnostics). The full kernel is proven.
  Why now: The triage engine is the entire product. Verifying the API contract and rendering pipeline on step 1 means every later slice lands on a known-good foundation. Sub-checkpoints (1.1–1.9) keep each risky layer verified before the next depends on it.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behavior > 1–3`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`, `spec.md > File Structure`, `spec.md > External Services and Dependencies`, `spec.md > Look and Feel`
  Build:
    1.1 Initialize Next.js app (TypeScript, App Router, no Tailwind, no src/, no ESLint) + install `openai` and `zod`. Create `.env.local` placeholder — learner fills in the actual key.
    1.2 Create `lib/schema.ts` — Zod TriageResultSchema + TypeScript types. Dev server still starts clean.
    1.3 Create `lib/prompt.ts` — OpenAI system prompt with triage persona, classification heuristics, and output contract.
    1.4 Implement `app/api/analyze/route.ts` — full OpenAI Responses API call with schema-constrained structured output. Verify the raw response shape with a curl or fetch test before any UI depends on it.
    1.5 Build `components/InputView.tsx` + `components/ResultsView.tsx` + `components/TriageApp.tsx` wired to a hardcoded mock `TriageResult`. UI renders correct structure without a live API call.
    1.6 Connect `<InputView />` submit to `POST /api/analyze`; remove the mock. Real analysis renders in `<ResultsView />`.
    1.7 Add `components/AnalyzingView.tsx` (cycling messages, pulse animation) and `components/ErrorView.tsx` (error + retry preserving input). Full state machine: input → analyzing → results | error.
    1.8 Apply clinical dark styling: `app/globals.css` with all CSS custom properties per `spec.md > Look and Feel`. Semantic accent colors, typography, card surfaces.
    1.9 Learner checkpoint: run the multi-bank fintech example end-to-end on the live dev server.
  Verify (mechanical): `npm run dev` starts with no TypeScript or runtime errors. `POST /api/analyze` with the multi-bank example returns a valid `TriageResult` JSON. The results view renders all seven fields. The analyzing state cycles messages. A short/gibberish input triggers the insufficient-context error view.
  Learner check: Open http://localhost:3000. Click the "Multi-bank finance app" sample pill, click Analyze Scope, watch the analyzing state cycle, and confirm the structured result appears with Build Now / Build Later / Don't Build columns and correct color accents. Note anything that looks wrong or off before we continue to Slice 2.
  Commit: `feat: end-to-end triage — input, analysis, and results`

- [ ] **2. Copy Result and Triage Another**
  Becomes usable: From the results view, the user can copy the complete diagnosis as Markdown to their clipboard and return to a clean input state.
  Why now: These are the two essential post-result actions that complete the demo story per `prd.md > The Core Journey` step 6. Small, isolated, safe to do after the kernel is confirmed working.
  PRD ref: `prd.md > Structured Results & Copy Action`, `prd.md > Features and Behavior > 4`
  Spec ref: `spec.md > Components > <ResultsView />`, `spec.md > File Structure > lib/markdown.ts`
  Build: Create `lib/markdown.ts` — formats `TriageResult` as clean GitHub-flavored Markdown. Wire "Copy Result" in `<ResultsView />` to copy the formatted output to the clipboard and show "Copied!" feedback for 2 seconds. Wire "Triage Another" to reset `TriageApp` state to `input` with cleared result.
  Verify (mechanical): After a successful analysis, clicking "Copy Result" writes Markdown to the clipboard (paste into a text editor to confirm). Clicking "Triage Another" returns to the clean input state with the textarea empty and the button disabled.
  Learner check: Try the full loop — analyze an idea, copy the result, paste it somewhere to confirm the Markdown is clean. Then click Triage Another and confirm the interface resets correctly.
  Commit: `feat: copy result to clipboard and triage another reset`

- [ ] **3. SEO, README, and Vercel deployment**
  Becomes usable: The app is publicly accessible at a Vercel URL with correct metadata. The repository is demo-ready.
  Why now: The PoC is working — this step makes it accessible for the demo video, judge review, and Devpost submission.
  PRD ref: `prd.md > What We're Building`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It > Vercel deployment`
  Build: Add `app/layout.tsx` metadata (title: "Backlog Surgeon", description, og:title, og:description). Write `README.md` with project description and local setup instructions (`npm install`, `.env.local`, `npm run dev`). Push to a public GitHub repository. Import into Vercel, add `OPENAI_API_KEY` env var, deploy.
  Verify (mechanical): Vercel build succeeds with no errors. The deployed URL loads the app and the full triage flow works against the live OpenAI key. `<title>` and meta description are correct in page source.
  Learner check: Open the Vercel URL in a fresh browser tab (not localhost), run the multi-bank fintech example end-to-end, and confirm it works identically to local dev.
  Commit: `feat: SEO metadata, README, and Vercel deployment`

## Hands-on Checkpoints

- [ ] Early checkpoint — after Slice 1.9: full core journey on localhost with multi-bank example; learner reports triage quality and visual issues before Slice 2
- [ ] Final kick-the-tires exploration and feedback completed — on deployed Vercel URL after Slice 3

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
