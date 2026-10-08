import type { CaseDoc } from '../lib/caseDoc'
import { speakableText, wordCount, estimateSeconds, formatDuration, BLOCK_LABELS } from '../lib/caseDoc'

// A clean, high-contrast reading view for printing or speaking from.
export default function SpeechView({ doc, onClose }: { doc: CaseDoc; onClose: () => void }) {
  const words = wordCount(speakableText(doc))
  const seconds = estimateSeconds(words)

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-bar no-print">
          <strong>Speech view</strong>
          <span className="sheet-meta">
            {words} words · ~{formatDuration(seconds)}
          </span>
          <div className="sheet-actions">
            <button className="btn small" onClick={() => window.print()}>
              Print / Save PDF
            </button>
            <button className="btn small ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <article className="speech" id="printable">
          <h1>{doc.title || 'Untitled case'}</h1>
          {doc.resolution && (
            <p className="speech-res">
              <em>{doc.resolution}</em> — <strong>{doc.side}</strong>
            </p>
          )}

          {doc.framework.trim() && (
            <section>
              <h2>Framework</h2>
              <p>{doc.framework}</p>
            </section>
          )}

          {doc.definitions.length > 0 && (
            <section>
              <h2>Definitions</h2>
              <ul>
                {doc.definitions.map((d, i) => (
                  <li key={i}>
                    <strong>{d.term || '—'}:</strong> {d.definition}
                    {d.source && <em> ({d.source})</em>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {doc.contentions.map((c, i) => (
            <section key={c.id}>
              <h2>
                Contention {i + 1}
                {c.title ? `: ${c.title}` : ''}
              </h2>
              {c.claim.trim() && (
                <p>
                  <strong>Claim.</strong> {c.claim}
                </p>
              )}
              {c.blocks.map((b) =>
                !b.text.trim() ? null : b.type === 'evidence' ? (
                  <p className="speech-ev" key={b.id}>
                    {b.text}
                    {b.citation && <em> ({b.citation})</em>}
                  </p>
                ) : (
                  <p key={b.id}>
                    <strong>{BLOCK_LABELS[b.type]}.</strong> {b.text}
                  </p>
                ),
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
