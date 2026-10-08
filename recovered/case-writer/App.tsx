import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type CaseDoc,
  type Contention,
  type Block,
  type BlockType,
  type Side,
  newCase,
  newContention,
  newBlock,
  speakableText,
  wordCount,
  estimateSeconds,
  formatDuration,
  BLOCK_LABELS,
  BLOCK_HINTS,
  BLOCK_SECTIONS,
} from './lib/caseDoc'
import { loadAll, upsert, remove, saveAll } from './lib/storage'
import {
  toMarkdown,
  toPlainText,
  toBackupJson,
  parseBackupJson,
  download,
  safeFilename,
} from './lib/export'
import { TONES, DEFAULT_TONE, type ToneId } from './lib/tone'
import { starterCase } from './lib/templates'
import Coach from './components/Coach'
import type { Budget } from './lib/api'
import SpeechView from './components/SpeechView'
import AboutDialog from './components/AboutDialog'

export default function App() {
  const [docs, setDocs] = useState<CaseDoc[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [showSpeech, setShowSpeech] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [budget, setBudget] = useState<Budget | null>(null)
  const timer = useRef<number | null>(null)
  const fileInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const all = loadAll()
    if (all.length === 0) {
      const first = newCase()
      setDocs(upsert(first))
      setCurrentId(first.id)
    } else {
      setDocs(all)
      setCurrentId(all[0].id)
    }
  }, [])

  const current = useMemo(
    () => docs.find((d) => d.id === currentId) ?? null,
    [docs, currentId],
  )

  // Optimistic in-memory update + debounced persist to localStorage.
  function update(patch: Partial<CaseDoc>) {
    if (!current) return
    const next = { ...current, ...patch }
    setDocs((prev) => prev.map((d) => (d.id === next.id ? next : d)))
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setDocs(upsert(next))
      setSavedAt(new Date().toLocaleTimeString())
    }, 600)
  }

  function updateContention(id: string, patch: Partial<Contention>) {
    if (!current) return
    update({
      contentions: current.contentions.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    })
  }

  function updateBlock(cid: string, bid: string, patch: Partial<Block>) {
    const c = current?.contentions.find((x) => x.id === cid)
    if (!c) return
    updateContention(cid, {
      blocks: c.blocks.map((b) => (b.id === bid ? { ...b, ...patch } : b)),
    })
  }

  function addBlock(cid: string, type: BlockType) {
    const c = current?.contentions.find((x) => x.id === cid)
    if (!c) return
    updateContention(cid, { blocks: [...c.blocks, newBlock(type)] })
  }

  function removeBlock(cid: string, bid: string) {
    const c = current?.contentions.find((x) => x.id === cid)
    if (!c) return
    updateContention(cid, { blocks: c.blocks.filter((b) => b.id !== bid) })
  }

  function moveBlock(cid: string, index: number, delta: number) {
    const c = current?.contentions.find((x) => x.id === cid)
    if (!c) return
    const target = index + delta
    if (target < 0 || target >= c.blocks.length) return
    const blocks = [...c.blocks]
    ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
    updateContention(cid, { blocks })
  }

  function createDoc() {
    const doc = newCase()
    setDocs(upsert(doc))
    setCurrentId(doc.id)
  }

  function createFromTemplate() {
    const doc = starterCase()
    setDocs(upsert(doc))
    setCurrentId(doc.id)
  }

  function deleteDoc(id: string) {
    if (!confirm('Delete this case? This cannot be undone.')) return
    const remaining = remove(id)
    setDocs(remaining)
    if (currentId === id) setCurrentId(remaining[0]?.id ?? null)
  }

  // Restore merges by id so a backup never silently wipes newer local work.
  function importBackup(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const incoming = parseBackupJson(String(reader.result))
        const existing = loadAll()
        const byId = new Map(existing.map((d) => [d.id, d]))
        for (const d of incoming) byId.set(d.id, d)
        const merged = [...byId.values()]
        saveAll(merged)
        setDocs(merged)
        setCurrentId(incoming[0].id)
        alert(`Restored ${incoming.length} case${incoming.length === 1 ? '' : 's'}.`)
      } catch (e: any) {
        alert(e?.message ?? 'Could not read that backup file.')
      }
    }
    reader.readAsText(file)
  }

  const words = current ? wordCount(speakableText(current)) : 0
  const seconds = estimateSeconds(words)
  const target = current?.settings.targetWordCount ?? 750
  const overTarget = words > target
  const tone = (current?.settings.tone as ToneId) ?? DEFAULT_TONE

  function setTone(t: ToneId) {
    if (!current) return
    update({ settings: { ...current.settings, tone: t } })
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="logo">◆</span> CaseForge
        </div>
        <button className="btn primary block" onClick={createDoc}>
          + New case
        </button>
        <button className="btn block small" onClick={createFromTemplate}>
          Start from template
        </button>
        <div className="doc-list">
          {docs.map((d) => (
            <div
              key={d.id}
              className={`doc-item ${d.id === currentId ? 'active' : ''}`}
              onClick={() => setCurrentId(d.id)}
            >
              <div className="doc-title">{d.title || 'Untitled case'}</div>
              <div className="doc-meta">
                {d.side} · {d.contentions.length} contention
                {d.contentions.length === 1 ? '' : 's'}
              </div>
              <button
                className="doc-del"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteDoc(d.id)
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="sidebar-tools">
          <button
            className="btn small block"
            onClick={() => download('caseforge-backup.json', toBackupJson(loadAll()), 'application/json')}
          >
            ⭳ Back up all cases
          </button>
          <button className="btn small block" onClick={() => fileInput.current?.click()}>
            ⭱ Restore backup
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importBackup(f)
              e.target.value = ''
            }}
          />
        </div>
        <div className="sidebar-foot">
          Work is saved in this browser only.{' '}
          <button className="linkish" onClick={() => setShowAbout(true)}>
            About &amp; integrity
          </button>
        </div>
      </aside>

      <main className="main">
        {!current ? (
          <div className="empty">
            <p>No case selected.</p>
            <button className="btn primary" onClick={createDoc}>
              Create your first case
            </button>
          </div>
        ) : (
          <>
            <header className="topbar">
              <input
                className="title-input"
                value={current.title}
                placeholder="Case title"
                onChange={(e) => update({ title: e.target.value })}
              />
              <div className="topbar-right">
                <label className="tone-select" title="Tone used by the AI coach">
                  Tone:
                  <select value={tone} onChange={(e) => setTone(e.target.value as ToneId)}>
                    {TONES.map((t) => (
                      <option key={t.id} value={t.id} title={t.hint}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                {budget && budget.enforced !== false && (
                  <span
                    className={`budget ${budget.requestsLeft <= 5 ? 'low' : ''}`}
                    title={`Coach requests left today: ${budget.requestsLeft} of ${budget.requestsPerDay}`}
                  >
                    ✦ {budget.requestsLeft}/{budget.requestsPerDay}
                  </span>
                )}
                <span className={`counter ${overTarget ? 'over' : ''}`}>
                  {words} words · ~{formatDuration(seconds)}
                  <span className="counter-sub"> / target {target}</span>
                </span>
                <button className="btn" onClick={() => setShowSpeech(true)}>
                  Speech view
                </button>
                <div className="menu-wrap">
                  <button className="btn" onClick={() => setShowExport((v) => !v)}>
                    Export ▾
                  </button>
                  {showExport && (
                    <>
                      <div className="menu-backdrop" onClick={() => setShowExport(false)} />
                      <div className="menu">
                        <button
                          onClick={() => {
                            download(`${safeFilename(current)}.md`, toMarkdown(current), 'text/markdown')
                            setShowExport(false)
                          }}
                        >
                          Markdown (.md)
                        </button>
                        <button
                          onClick={() => {
                            download(`${safeFilename(current)}.txt`, toPlainText(current))
                            setShowExport(false)
                          }}
                        >
                          Plain text (.txt)
                        </button>
                        <button
                          onClick={() => {
                            download(
                              `${safeFilename(current)}-backup.json`,
                              toBackupJson([current]),
                              'application/json',
                            )
                            setShowExport(false)
                          }}
                        >
                          Backup this case (.json)
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <span className="saved">
                  {savedAt ? `Saved ${savedAt}` : 'Autosaves'}
                </span>
              </div>
            </header>

            <div className="editor">
              <section className="card">
                <div className="row">
                  <label className="field grow">
                    <span className="label">Resolution / topic</span>
                    <textarea
                      rows={2}
                      value={current.resolution}
                      placeholder="Resolved: ..."
                      onChange={(e) => update({ resolution: e.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span className="label">Side</span>
                    <select
                      value={current.side}
                      onChange={(e) => update({ side: e.target.value as Side })}
                    >
                      <option value="PRO">PRO</option>
                      <option value="CON">CON</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="card">
                <h2>Framework</h2>
                <p className="hint">
                  Your weighing mechanism / standard — how the judge should
                  evaluate the round.
                </p>
                <textarea
                  rows={3}
                  value={current.framework}
                  placeholder="We value... The standard is..."
                  onChange={(e) => update({ framework: e.target.value })}
                />
                <Coach
                  actions={['wording', 'rewrite']}
                  section="framework / weighing standard"
                  text={current.framework}
                  tone={tone}
                  resolution={current.resolution}
                  side={current.side}
                  onApply={(t) => update({ framework: t })}
                  onBudget={setBudget}
                />
              </section>

              <section className="card">
                <div className="card-head">
                  <h2>Definitions</h2>
                  <button
                    className="btn small"
                    onClick={() =>
                      update({
                        definitions: [
                          ...current.definitions,
                          { term: '', definition: '' },
                        ],
                      })
                    }
                  >
                    + Add
                  </button>
                </div>
                {current.definitions.length === 0 && (
                  <p className="hint">No definitions yet.</p>
                )}
                {current.definitions.map((d, i) => (
                  <div className="row def-row" key={i}>
                    <input
                      className="field-sm"
                      placeholder="Term"
                      value={d.term}
                      onChange={(e) =>
                        update({
                          definitions: current.definitions.map((x, j) =>
                            j === i ? { ...x, term: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <input
                      className="field-sm grow"
                      placeholder="Definition (+ source)"
                      value={d.definition}
                      onChange={(e) =>
                        update({
                          definitions: current.definitions.map((x, j) =>
                            j === i ? { ...x, definition: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <button
                      className="btn small ghost"
                      onClick={() =>
                        update({
                          definitions: current.definitions.filter(
                            (_, j) => j !== i,
                          ),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </section>

              {current.contentions.map((c, ci) => (
                <section className="card contention" key={c.id}>
                  <div className="card-head">
                    <h2>Contention {ci + 1}</h2>
                    {current.contentions.length > 1 && (
                      <button
                        className="btn small ghost"
                        onClick={() =>
                          update({
                            contentions: current.contentions.filter((x) => x.id !== c.id),
                          })
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    className="field-sm"
                    placeholder="Contention title"
                    value={c.title}
                    onChange={(e) => updateContention(c.id, { title: e.target.value })}
                  />

                  <label className="field">
                    <span className="label">Claim</span>
                    <textarea
                      rows={2}
                      placeholder="What you are arguing."
                      value={c.claim}
                      onChange={(e) => updateContention(c.id, { claim: e.target.value })}
                    />
                  </label>

                  {c.blocks.map((b, bi) => (
                    <div className={`block block-${b.type}`} key={b.id}>
                      <div className="block-head">
                        <select
                          className="block-type"
                          value={b.type}
                          onChange={(e) =>
                            updateBlock(c.id, b.id, { type: e.target.value as BlockType })
                          }
                        >
                          {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
                            <option key={t} value={t}>
                              {BLOCK_LABELS[t]}
                            </option>
                          ))}
                        </select>
                        <span className="block-hint">{BLOCK_HINTS[b.type]}</span>
                        <div className="block-actions">
                          <button
                            className="icon-btn"
                            title="Move up"
                            disabled={bi === 0}
                            onClick={() => moveBlock(c.id, bi, -1)}
                          >
                            ↑
                          </button>
                          <button
                            className="icon-btn"
                            title="Move down"
                            disabled={bi === c.blocks.length - 1}
                            onClick={() => moveBlock(c.id, bi, 1)}
                          >
                            ↓
                          </button>
                          <button
                            className="icon-btn"
                            title="Remove"
                            onClick={() => removeBlock(c.id, b.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={b.type === 'evidence' ? 2 : 3}
                        placeholder={BLOCK_HINTS[b.type]}
                        value={b.text}
                        onChange={(e) => updateBlock(c.id, b.id, { text: e.target.value })}
                      />

                      {b.type === 'evidence' ? (
                        <>
                          <input
                            className="field-sm grow"
                            placeholder="Citation (author, date, outlet)"
                            value={b.citation ?? ''}
                            onChange={(e) =>
                              updateBlock(c.id, b.id, { citation: e.target.value })
                            }
                          />
                          <p className="block-note">
                            Quoted material. The coach never rewrites evidence — altering a
                            source is falsifying it.
                          </p>
                        </>
                      ) : (
                        <Coach
                          actions={['wording', 'argument', 'rewrite']}
                          section={BLOCK_SECTIONS[b.type]}
                          text={b.text}
                          tone={tone}
                          resolution={current.resolution}
                          side={current.side}
                          onApply={(t) => updateBlock(c.id, b.id, { text: t })}
                          onBudget={setBudget}
                        />
                      )}
                    </div>
                  ))}

                  <div className="block-add">
                    {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
                      <button
                        key={t}
                        className="btn small ghost"
                        onClick={() => addBlock(c.id, t)}
                      >
                        + {BLOCK_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </section>
              ))}

              <button
                className="btn block dashed"
                onClick={() =>
                  update({
                    contentions: [...current.contentions, newContention()],
                  })
                }
              >
                + Add contention
              </button>

              <p className="footnote">
                CaseForge gives feedback on work you write — it never writes your
                case or invents sources. Check your league/tournament rules on AI
                assistance, and verify every source you cite.{' '}
                <button className="linkish" onClick={() => setShowAbout(true)}>
                  Read more
                </button>
              </p>
            </div>
          </>
        )}
      </main>

      {showSpeech && current && (
        <SpeechView doc={current} onClose={() => setShowSpeech(false)} />
      )}
      {showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}
    </div>
  )
}
