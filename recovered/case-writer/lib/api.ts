import type { ToneId } from './tone'

export interface Suggestion {
  type: 'wording' | 'argument'
  severity: 'low' | 'medium' | 'high'
  span: string
  issue: string
  suggestion: string
  rewrite?: string
  // Set when the server withheld a rewrite that invented a source or figure.
  note?: string
}

export interface Budget {
  requestsLeft: number
  requestsPerDay: number
  tokensLeft: number
  tokensPerDay: number
  // False when the server has no shared counter store, so the figure is
  // indicative rather than a cap that actually binds.
  enforced?: boolean
}

export interface FeedbackResult {
  summary: string
  suggestions: Suggestion[]
  budget?: Budget
}

interface Ctx {
  section?: string
  resolution?: string
  side?: string
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as any)?.error || 'The coach is unavailable right now.')
  }
  return data as T
}

export function getFeedback(
  input: { text: string; kind: 'wording' | 'argument' } & Ctx,
): Promise<FeedbackResult> {
  return postJson<FeedbackResult>('/api/feedback', input)
}

export function getRewrite(
  input: { text: string; tone: ToneId } & Ctx,
): Promise<{ options: string[]; budget?: Budget }> {
  return postJson<{ options: string[]; budget?: Budget }>('/api/rewrite', input)
}
