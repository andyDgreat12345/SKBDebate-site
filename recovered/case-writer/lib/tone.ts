// Fixed tone set, mirrored from the backend. Keep in sync with api/_lib/prompts.

export const TONES: { id: ToneId; label: string; hint: string }[] = [
  { id: 'analytical', label: 'Analytical', hint: 'Measured, logical, evidence-first' },
  { id: 'persuasive', label: 'Persuasive', hint: 'Warm, vivid, framing-driven' },
  { id: 'assertive', label: 'Assertive', hint: 'Punchy, confident, direct' },
  { id: 'formal', label: 'Formal', hint: 'Polished, restrained, lay-friendly' },
]

export type ToneId = 'analytical' | 'persuasive' | 'assertive' | 'formal'

export const DEFAULT_TONE: ToneId = 'analytical'
