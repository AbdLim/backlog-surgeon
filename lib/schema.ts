import { z } from 'zod'

// ─── Feature item ────────────────────────────────────────────────────────────

export const FeatureItemSchema = z.object({
  feature: z.string(),   // Feature or capability name
  rationale: z.string(), // Opinionated reason it belongs in this tier (1–2 sentences)
})

export type FeatureItem = z.infer<typeof FeatureItemSchema>

// ─── Full triage result ──────────────────────────────────────────────────────

export const TriageResultSchema = z.object({
  coreProblem: z.string(),              // The single primary user problem
  riskiestAssumption: z.string(),       // The assumption most likely to invalidate the idea
  smallestMVP: z.string(),              // The minimum useful version of the product
  successCriteria: z.string(),          // How you'd know the MVP is working
  buildNow: z.array(FeatureItemSchema), // Essential features — proof of core value
  buildLater: z.array(FeatureItemSchema), // Useful but deferrable
  dontBuild: z.array(FeatureItemSchema),  // Premature complexity or off-kernel features
  insufficientContext: z.boolean(),     // true when input lacks enough product context to triage
  refusalReason: z.string().optional(), // Populated only when insufficientContext is true
})

export type TriageResult = z.infer<typeof TriageResultSchema>

// ─── App UI state ────────────────────────────────────────────────────────────

export type AppState =
  | { phase: 'input'; inputText: string }
  | { phase: 'analyzing'; inputText: string }
  | { phase: 'results'; inputText: string; result: TriageResult }
  | { phase: 'error'; inputText: string; errorMessage: string }

// ─── API response shapes ─────────────────────────────────────────────────────

export type AnalyzeSuccess = { ok: true; data: TriageResult }
export type AnalyzeError = { ok: false; error: { code: string; message: string } }
export type AnalyzeResponse = AnalyzeSuccess | AnalyzeError

// ─── JSON schema for OpenAI structured output ────────────────────────────────
// Derived from TriageResultSchema — used in text.format for the Responses API.
// Must stay in sync with TriageResultSchema above.

export const TRIAGE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    coreProblem: { type: 'string' },
    riskiestAssumption: { type: 'string' },
    smallestMVP: { type: 'string' },
    successCriteria: { type: 'string' },
    buildNow: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          feature: { type: 'string' },
          rationale: { type: 'string' },
        },
        required: ['feature', 'rationale'],
        additionalProperties: false,
      },
    },
    buildLater: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          feature: { type: 'string' },
          rationale: { type: 'string' },
        },
        required: ['feature', 'rationale'],
        additionalProperties: false,
      },
    },
    dontBuild: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          feature: { type: 'string' },
          rationale: { type: 'string' },
        },
        required: ['feature', 'rationale'],
        additionalProperties: false,
      },
    },
    insufficientContext: { type: 'boolean' },
    refusalReason: { type: 'string' },
  },
  required: [
    'coreProblem',
    'riskiestAssumption',
    'smallestMVP',
    'successCriteria',
    'buildNow',
    'buildLater',
    'dontBuild',
    'insufficientContext',
    'refusalReason', // Required by OpenAI strict mode; empty string when context is sufficient
  ],
  additionalProperties: false,
} as const
