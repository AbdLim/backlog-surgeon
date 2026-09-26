---
doc: scope
status: approved
---

# Backlog Surgeon

An opinionated AI-powered product scoping tool that triages messy, over-scoped product ideas into a defensible MVP.

## The Unique Kernel
Backlog Surgeon acts as a ruthless product reviewer performing surgical triage—not an assistant trying to preserve everything the user asked for. Its explicit bias is toward proving value with the smallest possible footprint:
- Pinpoints the single primary user problem and the single value-proving user action.
- Ruthlessly classifies every proposed feature against that primary action.
- Actively challenges and disagrees with bloated scope, aggressively pushing non-essential features (premature auth, roles, dashboards, vanity AI, integrations) into "Build Later" or "Don't Build" with clear justifications.

## Who It's For
Founders, solo developers, tech leads, and small product teams wrestling with scope creep, feature bloat, or unstructured braindumps, who need an objective outside perspective to cut their ideas down to a launchable MVP.

## The Core Loop
1. **Input:** User pastes raw notes, meeting minutes, a feature wish-list, or an over-scoped product description.
2. **Analysis:** The AI analyzes the input through the lens of minimal validation and ruthless triage.
3. **Structured Review:** The user receives a clear, visually structured diagnosis:
   - Core User Problem
   - Riskiest Assumption
   - Smallest Useful MVP
   - Suggested Success Criteria
   - Triage Categories with reasoning: **Build Now**, **Build Later**, and **Don't Build**

## Inspiration & Identity
- **Tone:** Direct, analytical, authoritative yet constructive—like a veteran startup advisor or staff engineer conducting scope triage.
- **Aesthetic:** Clean, fast, modern, and information-dense; an opinionated diagnosis dashboard rather than a chat interface.

## Why This Matters to the Learner
To practice using AI coding agents as disciplined collaborators that challenge weak assumptions and maintain tight scope, and to validate how effective a plan-first workflow is on a self-contained product tool.

## What "Working" Looks Like
In the 1-minute demo video:
1. The user pastes an intentionally oversized, messy multi-feature pitch (e.g. an all-in-one multi-bank aggregator with crypto, budgeting, QR payments, and virtual cards).
2. The user clicks "Analyze".
3. Backlog Surgeon renders a clean, structured scope breakdown:
   - Slices the wall of ideas into 2–3 "Build Now" essentials, deferring or rejecting the rest with crisp rationales.
   - Highlights the core problem, riskiest assumption, smallest useful MVP, and a measurable success criterion.
4. The user clicks "Copy Result" to grab the formatted breakdown for their notes or pitch.
5. The output is immediately legible, defensible, and actionable without conversational back-and-forth.

## The POC Boundary
A single Next.js web application with a simple, robust flow:
- Single input screen for raw idea text.
- Analysis triggered via server action/API route calling an LLM with a tailored triage prompt.
- Single structured results screen presenting the breakdown.
- Pre-loaded example prompts for instant testing and demonstration.
- One-click "Copy Result" action to copy the structured triage as Markdown to clipboard.

## Later
- Exporting scope summaries to PDF or structured JSON download.
- Direct sync to issue trackers (Linear, Jira, GitHub Issues).
- Editing or manually overriding individual classification cards.
- Project history and shareable diagnostic links.
- Interactive multi-turn chat to debate specific cuts.

## Explicitly Cut
- **Authentication & User Accounts:** Unnecessary friction for the core triage experiment.
- **Database / Persistent Storage:** Local state or session memory is sufficient for proof of concept.
- **Multi-turn Chat & Conversational UI:** Dilutes the fast, visual, opinionated diagnostic experience.
- **Jira / Linear / GitHub Integrations:** Premature third-party dependencies before the core triage is proven.
- **File Uploads & Background Processing Jobs:** Synchronous text analysis handles the PoC demo requirements cleanly.
- **Mobile App:** Web application is sufficient.
