import { TriageResult } from './schema'

/**
 * Formats a structured TriageResult as clean GitHub-flavored Markdown.
 */
export function formatTriageMarkdown(result: TriageResult, originalInput?: string): string {
  const sections: string[] = [
    '# Backlog Surgeon — Scope Triage Report',
    '',
    '## 1. Diagnostic Summary',
    `- **Core Problem:** ${result.coreProblem}`,
    `- **Riskiest Assumption:** ${result.riskiestAssumption}`,
    `- **Smallest Useful MVP:** ${result.smallestMVP}`,
    `- **Success Criteria:** ${result.successCriteria}`,
    '',
    '## 2. Feature Triage',
    '',
    '### 🟢 Build Now (Essential Kernel)',
  ]

  if (result.buildNow.length === 0) {
    sections.push('_None specified._')
  } else {
    for (const item of result.buildNow) {
      sections.push(`- **${item.feature}:** ${item.rationale}`)
    }
  }

  sections.push('', '### 🟡 Build Later (Deferrable Enhancements)')
  if (result.buildLater.length === 0) {
    sections.push('_None specified._')
  } else {
    for (const item of result.buildLater) {
      sections.push(`- **${item.feature}:** ${item.rationale}`)
    }
  }

  sections.push('', '### 🔴 Don’t Build (Premature Complexity / Out of Scope)')
  if (result.dontBuild.length === 0) {
    sections.push('_None specified._')
  } else {
    for (const item of result.dontBuild) {
      sections.push(`- **${item.feature}:** ${item.rationale}`)
    }
  }

  if (originalInput && originalInput.trim().length > 0) {
    sections.push('', '---', '', '### Raw Input Evaluated', `> ${originalInput.trim().replace(/\n/g, '\n> ')}`)
  }

  return sections.join('\n')
}
