// The document the editor edits, and the shape export / AI consume.

export type Side = 'PRO' | 'CON'

// A contention is a sequence of blocks the debater arranges freely, so a
// contention can carry several warrants, interleaved evidence, sub-points,
// and more than one impact — rather than one fixed slot for each.
export type BlockType = 'warrant' | 'evidence' | 'impact' | 'analysis'

export interface Block {
  id: string
  type: BlockType
  text: string
  citation?: string // evidence only
  url?: string // evidence only
}

export interface Contention {
  id: string
  title: string
  claim: string
  blocks: Block[]
}

export interface Definition {
  term: string
  definition: string
  source?: string
}

export interface CaseDoc {
  id: string
  title: string
  resolution: string
  side: Side
  createdAt: string
  updatedAt: string
  framework: string
  definitions: Definition[]
  contentions: Contention[]
  settings: { targetWordCount: number; tone?: string }
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  warrant: 'Warrant',
  evidence: 'Evidence',
  impact: 'Impact',
  analysis: 'Analysis',
}

export const BLOCK_HINTS: Record<BlockType, string> = {
  warrant: 'Why the claim is true — the reasoning.',
  evidence: 'A card, stat, or quote. Quoted material — the coach will not rewrite it.',
  impact: 'Why it matters and how it weighs.',
  analysis: 'A sub-point, link step, or response to an anticipated answer.',
}

// What the coach is told a block is, so feedback is debate-aware.
export const BLOCK_SECTIONS: Record<BlockType, string> = {
  warrant: 'warrant (reasoning that proves the claim)',
  evidence: 'evidence (quoted source material)',
  impact: 'impact (why it matters and how it weighs)',
  analysis: 'analysis (a sub-point or link step in the argument)',
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function newBlock(type: BlockType): Block {
  return type === 'evidence'
    ? { id: newId(), type, text: '', citation: '' }
    : { id: newId(), type, text: '' }
}

export function newContention(): Contention {
  return {
    id: newId(),
    title: '',
    claim: '',
    blocks: [newBlock('warrant'), newBlock('impact')],
  }
}

export function newCase(): CaseDoc {
  const now = new Date().toISOString()
  return {
    id: newId(),
    title: 'Untitled case',
    resolution: '',
    side: 'PRO',
    createdAt: now,
    updatedAt: now,
    framework: '',
    definitions: [],
    contentions: [newContention()],
    settings: { targetWordCount: 750, tone: 'analytical' },
  }
}

// --- Migration --------------------------------------------------------------
// Cases saved before contentions became block-based used fixed
// warrant / evidence[] / impact fields. Convert them in place on load so no
// existing work (or older backup file) is lost.

function migrateContention(c: any): Contention {
  if (c && Array.isArray(c.blocks)) {
    return {
      id: typeof c.id === 'string' ? c.id : newId(),
      title: String(c.title ?? ''),
      claim: String(c.claim ?? ''),
      blocks: c.blocks
        .filter((b: any) => b && typeof b === 'object')
        .map((b: any) => ({
          id: typeof b.id === 'string' ? b.id : newId(),
          type: (['warrant', 'evidence', 'impact', 'analysis'] as const).includes(b.type)
            ? b.type
            : 'analysis',
          text: String(b.text ?? ''),
          ...(b.citation !== undefined ? { citation: String(b.citation) } : {}),
          ...(b.url !== undefined ? { url: String(b.url) } : {}),
        })),
    }
  }

  const blocks: Block[] = []
  if (typeof c?.warrant === 'string' && c.warrant.trim()) {
    blocks.push({ id: newId(), type: 'warrant', text: c.warrant })
  }
  for (const e of Array.isArray(c?.evidence) ? c.evidence : []) {
    blocks.push({
      id: newId(),
      type: 'evidence',
      text: String(e?.text ?? ''),
      citation: String(e?.citation ?? ''),
      ...(e?.url ? { url: String(e.url) } : {}),
    })
  }
  if (typeof c?.impact === 'string' && c.impact.trim()) {
    blocks.push({ id: newId(), type: 'impact', text: c.impact })
  }
  if (blocks.length === 0) blocks.push(newBlock('warrant'), newBlock('impact'))

  return {
    id: typeof c?.id === 'string' ? c.id : newId(),
    title: String(c?.title ?? ''),
    claim: String(c?.claim ?? ''),
    blocks,
  }
}

export function migrateDoc(d: any): CaseDoc {
  return {
    ...d,
    framework: String(d?.framework ?? ''),
    definitions: Array.isArray(d?.definitions) ? d.definitions : [],
    contentions: (Array.isArray(d?.contentions) ? d.contentions : []).map(migrateContention),
    settings: {
      targetWordCount: Number(d?.settings?.targetWordCount) || 750,
      tone: d?.settings?.tone ?? 'analytical',
    },
  }
}

// --- Derived ----------------------------------------------------------------

// Everything a debater would actually say out loud, for word/time estimates.
export function speakableText(doc: CaseDoc): string {
  const parts: string[] = [doc.framework]
  for (const c of doc.contentions) {
    parts.push(c.title, c.claim, ...c.blocks.map((b) => b.text))
  }
  return parts.filter(Boolean).join(' ')
}

export function wordCount(text: string): number {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}

// ~150 words per minute is a reasonable spoken-debate pace.
export function estimateSeconds(words: number): number {
  return Math.round((words / 150) * 60)
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
