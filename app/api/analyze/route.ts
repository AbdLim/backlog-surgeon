import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { TriageResultSchema, TRIAGE_JSON_SCHEMA, AnalyzeResponse } from '@/lib/schema'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompt'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  // ── 1. Parse and validate request body ──────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'invalid_request', message: 'Request body must be valid JSON.' } },
      { status: 400 },
    )
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('input' in body) ||
    typeof (body as Record<string, unknown>).input !== 'string'
  ) {
    return NextResponse.json(
      { ok: false, error: { code: 'invalid_request', message: 'Request must include an "input" string field.' } },
      { status: 400 },
    )
  }

  const input = ((body as Record<string, unknown>).input as string).trim()

  if (input.length === 0) {
    return NextResponse.json(
      { ok: false, error: { code: 'invalid_request', message: 'Input must not be empty.' } },
      { status: 400 },
    )
  }

  // ── 2. Call OpenAI Responses API with schema-constrained structured output ──
  let rawOutput: string
  try {
    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',
      input: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(input) },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'triage_result',
          schema: TRIAGE_JSON_SCHEMA,
          strict: true,
        },
      },
    })

    rawOutput = response.output_text
  } catch (err) {
    console.error('[analyze] OpenAI call failed:', err)
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'api_error',
          message: 'The surgery didn\'t go as planned. Your idea is untouched. Try the analysis again.',
        },
      },
      { status: 502 },
    )
  }

  // ── 3. Parse and Zod-validate the structured response ───────────────────────
  let parsed: unknown
  try {
    parsed = JSON.parse(rawOutput)
  } catch {
    console.error('[analyze] Failed to parse OpenAI JSON output:', rawOutput)
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'api_error',
          message: 'The surgery didn\'t go as planned. Your idea is untouched. Try the analysis again.',
        },
      },
      { status: 502 },
    )
  }

  const validated = TriageResultSchema.safeParse(parsed)
  if (!validated.success) {
    console.error('[analyze] Zod validation failed:', validated.error.format())
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'api_error',
          message: 'The surgery didn\'t go as planned. Your idea is untouched. Try the analysis again.',
        },
      },
      { status: 502 },
    )
  }

  const result = validated.data

  // ── 4. Handle insufficient context ──────────────────────────────────────────
  if (result.insufficientContext) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'insufficient_context',
          message:
            result.refusalReason ||
            "This doesn't contain enough product context to triage. Describe what you're trying to build, who it's for, and any features you're considering.",
        },
      },
      { status: 422 },
    )
  }

  // ── 5. Return validated result ───────────────────────────────────────────────
  return NextResponse.json({ ok: true, data: result })
}
