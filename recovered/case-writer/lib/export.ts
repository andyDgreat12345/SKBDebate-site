import { type CaseDoc, BLOCK_LABELS, migrateDoc } from './caseDoc'

export function toMarkdown(doc: CaseDoc): string {
  const lines: string[] = []
  lines.push(`# ${doc.title || 'Untitled case'}`)
  lines.push('')
  lines.push(`**Resolution:** ${doc.resolution || '—'}`)
  lines.push('')
  lines.push(`**Side:** ${doc.side}`)
  lines.push('')

  if (doc.framework.trim()) {
    lines.push('## Framework')
    lines.push('')
    lines.push(doc.framework)
    lines.push('')
  }

  if (doc.definitions.length) {
    lines.push('## Definitions')
    lines.push('')
    for (const d of doc.definitions) {
      const src = d.source ? ` _(${d.source})_` : ''
      lines.push(`- **${d.term || '—'}:** ${d.definition}${src}`)
    }
    lines.push('')
  }

  doc.contentions.forEach((c, i) => {
    lines.push(`## Contention ${i + 1}${c.title ? `: ${c.title}` : ''}`)
    lines.push('')
    if (c.claim.trim()) {
      lines.push(`**Claim.** ${c.claim}`)
      lines.push('')
    }
    for (const b of c.blocks) {
      if (!b.text.trim()) continue
      if (b.type === 'evidence') {
        const cite = b.citation ? ` (${b.citation})` : ''
        lines.push(`> ${b.text}${cite}`)
      } else {
        lines.push(`**${BLOCK_LABELS[b.type]}.** ${b.text}`)
      }
      lines.push('')
    }
  })

  return lines.join('\n').trim() + '\n'
}

// Plain text, formatted for reading aloud rather than for a document.
export function toPlainText(doc: CaseDoc): string {
  const lines: string[] = []
  lines.push((doc.title || 'Untitled case').toUpperCase())
  if (doc.resolution) lines.push(`Resolution: ${doc.resolution}`)
  lines.push(`Side: ${doc.side}`)
  lines.push('')

  if (doc.framework.trim()) {
    lines.push('FRAMEWORK')
    lines.push(doc.framework)
    lines.push('')
  }

  if (doc.definitions.length) {
    lines.push('DEFINITIONS')
    for (const d of doc.definitions) {
      lines.push(`  ${d.term || '—'}: ${d.definition}${d.source ? ` (${d.source})` : ''}`)
    }
    lines.push('')
  }

  doc.contentions.forEach((c, i) => {
    lines.push(`CONTENTION ${i + 1}${c.title ? `: ${c.title}` : ''}`)
    if (c.claim.trim()) lines.push(`  Claim: ${c.claim}`)
    for (const b of c.blocks) {
      if (!b.text.trim()) continue
      const cite = b.type === 'evidence' && b.citation ? ` (${b.citation})` : ''
      lines.push(`  ${BLOCK_LABELS[b.type]}: ${b.text}${cite}`)
    }
    lines.push('')
  })

  return lines.join('\n').trim() + '\n'
}

// --- Backup / restore -------------------------------------------------------
// The only safety net for a login-free tool: browser storage can be cleared.

export function toBackupJson(docs: CaseDoc[]): string {
  return JSON.stringify({ app: 'caseforge', version: 1, exportedAt: new Date().toISOString(), docs }, null, 2)
}

// Returns the docs from a backup file, or throws with a readable message.
export function parseBackupJson(raw: string): CaseDoc[] {
  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error("That file isn't valid JSON.")
  }
  const docs = Array.isArray(data) ? data : data?.docs
  if (!Array.isArray(docs)) throw new Error("That file doesn't look like a CaseForge backup.")
  const valid = docs.filter(
    (d: any) => d && typeof d.id === 'string' && Array.isArray(d.contentions),
  )
  if (!valid.length) throw new Error('No cases found in that file.')
  return (valid as any[]).map(migrateDoc)
}

export function download(filename: string, content: string, type = 'text/plain'): void {
  const blob = new Blob([content], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function safeFilename(doc: CaseDoc): string {
  return (doc.title || 'case').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'case'
}
