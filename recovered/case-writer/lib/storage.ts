// Login-free v1: cases live in the browser only. No server, no accounts.

import { type CaseDoc, migrateDoc } from './caseDoc'

const KEY = 'caseforge.docs.v1'

export function loadAll(): CaseDoc[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    // Older saves used fixed warrant/evidence/impact fields.
    return (JSON.parse(raw) as any[]).map(migrateDoc)
  } catch {
    return []
  }
}

export function saveAll(docs: CaseDoc[]): void {
  localStorage.setItem(KEY, JSON.stringify(docs))
}

export function upsert(doc: CaseDoc): CaseDoc[] {
  const docs = loadAll()
  const updated: CaseDoc = { ...doc, updatedAt: new Date().toISOString() }
  const i = docs.findIndex((d) => d.id === doc.id)
  if (i >= 0) docs[i] = updated
  else docs.unshift(updated)
  saveAll(docs)
  return docs
}

export function remove(id: string): CaseDoc[] {
  const docs = loadAll().filter((d) => d.id !== id)
  saveAll(docs)
  return docs
}
