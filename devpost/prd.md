---
doc: prd
status: approved
---

# Backlog Surgeon — Product Requirements

An opinionated, clinical product scoping tool that triages messy, over-scoped product ideas into a defensible MVP for founders, developers, and small teams.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`

## The Core Journey
1. **Arrival:** The user arrives at a clean, single-page dark interface featuring a sharp headline, explanatory subtext, three sample prompt buttons, and a prominent input area with the "Analyze Scope" button disabled.
2. **Input Selection:** The user either clicks one of the three sample prompts (populating the textarea for inspection) or pastes/types their own messy idea, feature list, or meeting notes. Entering non-whitespace text immediately enables the "Analyze Scope" button.
3. **Execution:** The user clicks "Analyze Scope".
4. **Triage Transition:** The interface smoothly transitions into an active analyzing state with a subtle scanning visual and rotating clinical status messages.
5. **Diagnostic Review:** When the analysis completes, the view transitions into a structured product diagnosis report displaying:
   - Core User Problem
   - Riskiest Assumption
   - Smallest Useful MVP
   - Suggested Success Criteria
   - Three clear triage columns/sections with justifications: **Build Now** (emerald), **Build Later** (amber), and **Don't Build** (rose)
   - A compact, unobtrusive summary of the original raw input for reference
6. **Action / Reset:** The user clicks "Copy Result" to copy a clean Markdown summary to their clipboard, or clicks "Triage Another" to clear the session and return to the input state.

## Screens and Layout
A single-route web surface (`/`) containing a centered, focused container that transitions smoothly through three explicit UI states without page reloads:
- **Input State:**
  - Header with product name, tag ("Surgical Scope Triage"), and an explanatory tagline emphasizing that Backlog Surgeon challenges scope rather than summarizing.
  - Three sample prompt trigger pills: "Multi-bank finance app", "AI study platform", and "Developer productivity SaaS".
  - Large monospace/sans-serif textarea with placeholder guidance.
  - Primary "Analyze Scope" action button (disabled when textarea is empty or whitespace-only; enabled upon non-whitespace input) and helper note.
- **Analyzing State:**
  - The input container transitions to a focused, distraction-free scanning card.
  - Minimal surgical scanning pulse animation.
  - Rotating status indicators showing progress phase (no simulated percentages).
- **Results State:**
  - Action bar with "Copy Result" (Markdown to clipboard with visual confirmation) and "Triage Another" (resets to Input state).
  - Diagnostic Summary Section: Grid of 4 cards (Core Problem, Riskiest Assumption, Smallest Useful MVP, Success Criteria).
  - Feature Triage Section: Three categorized groups (Build Now, Build Later, Don't Build). Each feature item displays the feature name and a concise, opinionated rationale explaining why it belongs in that tier.
  - Collapsible / compact "Original Input" card at the bottom for quick reference.

## Look and Feel
- **Visual Aesthetic:** Dark, clinical, developer-tool aesthetic inspired by Linear and Railway. Serious, disciplined, and utilitarian.
- **Color Palette:**
  - Background: Deep neutral dark (charcoal/slate dark tones).
  - Surfaces & Cards: Subtle elevated card backgrounds with crisp, low-contrast neutral borders.
  - Accents: Restrained semantic indicators rather than saturated blocks:
    - *Build Now:* Emerald / Green accent
    - *Build Later:* Amber / Warm Yellow accent
    - *Don't Build:* Rose / Crimson accent
- **Typography:**
  - Primary UI: Modern clean sans-serif (Inter or system sans-serif) with high-contrast text hierarchy.
  - Metadata & Accents: Monospace font for category badges, status labels, and timestamps.
- **Anti-Patterns / Avoid:**
  - No purple gradient glows or decorative AI blobs.
  - No chatbot conversation bubbles or conversational fluff.
  - No generic colorful consumer styling.

## Features and Behavior

### 1. Sample Prompt Population
Source: `scope.md > The POC Boundary`
- Three sample prompts are provided on arrival:
  1. *Multi-bank finance app:* Over-scoped consumer fintech with crypto, budgeting, QR codes, and virtual cards.
  2. *AI study platform:* Feature-bloated edtech app with multi-modal AI, flashcards, tutor bots, and social feeds.
  3. *Developer productivity SaaS:* Complex devtool packed with integrations, team permissions, dashboards, and automated workflows.
- Clicking any sample populates the textarea immediately so the user can inspect or modify the text before submitting.
- Acceptance criteria:
  - [ ] Clicking a sample button populates the textarea with the designated text.
  - [ ] The user can freely edit the populated sample text prior to analysis.
  - [ ] Clicking a sample does NOT auto-submit the form.

### 2. Scope Analysis & Triage Engine
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`
- Submitting valid text triggers a structured analysis against opinionated scoping heuristics:
  - Identifies the single primary problem and single value-proving user action.
  - Classifies features strictly into Build Now (core essentials), Build Later (deferrable), and Don't Build (premature complexity/distractions).
  - Produces an explicit rationale for every classified feature.
  - Surfaces the riskiest assumption, smallest useful MVP, and suggested success criteria.
- Acceptance criteria:
  - [ ] Analysis returns complete structured data containing all required diagnostic fields.
  - [ ] Every classified item contains both a feature title and a non-empty rationale.
  - [ ] Non-essential complexity (premature auth, settings, multi-tenancy, integrations) is aggressively pushed out of Build Now.
  - [ ] Interface waits for complete valid structured response before rendering the results state.

### 3. Processing State Presentation
Source: `scope.md > The POC Boundary`
- Displays a dedicated analyzing screen during request execution.
- Displays rotating clinical status messages:
  - "Finding the core problem..."
  - "Identifying the value-proving action..."
  - "Cutting premature features..."
  - "Testing the smallest useful MVP..."
- Acceptance criteria:
  - [ ] The input form is hidden while analysis is in progress.
  - [ ] Status text cycles every ~2 seconds.
  - [ ] No fake progress bars or arbitrary percentages are displayed.

### 4. Structured Results & Copy Action
Source: `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`
- Results view renders the diagnosis cards and three triage columns with clear visual separation.
- "Copy Result" formats the entire diagnostic report as clean, GitHub-flavored Markdown and copies it to the user's system clipboard, showing temporary "Copied!" feedback.
- "Triage Another" resets state to a clean input view.
- Acceptance criteria:
  - [ ] Results cards render with correct semantic badge colors (emerald, amber, rose).
  - [ ] "Copy Result" writes formatted Markdown to clipboard and displays transient confirmation.
  - [ ] "Triage Another" clears current result and returns the user to the input state.

## States and Boundaries

- **Input State (First Use / Clean):** Empty or sample-populated textarea. "Analyze Scope" button is disabled until non-whitespace text is entered.
- **Analyzing State (In Flight):** Form hidden, clinical scanning spinner/animation active, rotating status copy.
- **Results State (Success):** Full structured diagnostic report displayed with copy and reset actions.
- **Validation State (Input Validation):** The "Analyze Scope" button remains disabled while input is empty or whitespace-only, preventing accidental empty submissions.
- **Insufficient Context State (Gibberish / Trivial Input):** Submitting text without discernible product context (e.g. "hello", "asdf") returns an opinionated diagnostic refusal:
  *"This doesn't contain enough product context to triage. Describe what you're trying to build, who it's for, and any features you're considering."*
- **Error State (API Failure):** If the LLM call fails or times out, displays:
  *"The surgery didn't go as planned. Your idea is untouched. Try the analysis again."* with an explicit "Try Again" action that preserves the user's input.
- **Session Boundary:** No persistence. Refreshing the browser or clicking "Triage Another" resets the view.

## Product Decisions
- **Single container state transitions over split screen:** Focuses attention entirely on the current phase (typing vs waiting vs evaluating results) without visual clutter.
- **No streaming of partial results:** Waiting for the complete structured JSON response prevents jarring layout shifts and half-baked triage categories.
- **Sample click populates without auto-submitting:** Allows the user to inspect what constitutes a good messy prompt and tweak it if desired.
- **No in-place editing of generated items:** Keeps the PoC lightweight, defensible, and opinionated; the tool delivers a verdict rather than acting as a collaborative kanban board.
- **Markdown clipboard copy over file exports:** Zero dependencies, instant utility for dropping into READMEs, Jira tickets, or team chat.

## What We're Building
- A Next.js web application with a single responsive route.
- An input view with 3 sample prompts and validation.
- A transitional analyzing view with cycling clinical status indicators.
- A structured result view with diagnostic summary cards and Build Now / Build Later / Don't Build columns.
- Clipboard copy formatting utility and session reset.
- Server-side analysis route integrating structured LLM output with surgical prompt engineering.

## Deferred From the POC
- **Editing or reclassifying generated cards:** Requires interactive state management and drag-and-drop; out of scope for proof of concept.
- **Exporting to PDF/PNG or syncing to Linear/GitHub:** Adds third-party OAuth and export pipelines; clipboard Markdown handles immediate sharing needs.
- **Project persistence / history:** Requires database and storage schemas; ephemeral single-session triage proves the concept cleanly.
- **Multi-turn debate chat:** Dilutes the opinionated triage model into a generic chat interface.

## Possible Later Enhancements
- Visual comparison diff between original input feature count and post-surgery MVP feature count.
- One-click export to GitHub Issues or Linear backlog.
- Shareable read-only diagnostic URLs.

## Non-Goals
- Will not act as an agreeable brainstorming assistant that accommodates every requested feature.
- Will not generate boilerplate application code, user stories, or database schemas.
- Will not provide multi-user collaboration or project management tracking.

## Open Questions
- None blocking the technical spec. All behavioral boundaries, states, error messages, and visual guidelines are resolved.
