export interface SamplePrompt {
  id: string
  label: string
  text: string
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'finance',
    label: 'Multi-bank finance app',
    text: 'I want to build a banking app that connects all your Nigerian bank accounts, lets you see balances and transactions, send money, create virtual cards, manage budgets, pay merchants through QR codes, split bills, get AI spending advice, support crypto, track subscriptions, and eventually support businesses too.',
  },
  {
    id: 'edtech',
    label: 'AI study platform',
    text: 'An AI study assistant for college students. Students upload lecture slides, PDFs, and syllabi. The app auto-generates summaries, interactive flashcards, spaced repetition quizzes, an AI tutor bot with voice chat, study group collaboration rooms, peer progress leaderboards, calendar sync for exam dates, and a Notion-style markdown notes editor.',
  },
  {
    id: 'devtool',
    label: 'Developer productivity SaaS',
    text: 'A dev productivity platform that connects GitHub, Jira, and Slack. It provides real-time sprint dashboards, AI code review summaries, automated daily standup reports, blocker alerts, PR merge velocity analytics, developer satisfaction surveys, custom workflow automations, and team permission tiers.',
  },
]
