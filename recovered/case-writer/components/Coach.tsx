import { useState } from 'react'
import { getFeedback, getRewrite, type Suggestion, type Budget } from '../lib/api'
import type { ToneId } from '../lib/tone'

interface CoachProps {
  // Which actions to offer for this field.
  actions: Array<'wording' | 'argument' | 'rewrite'>
  section: string
  text: string
  tone: ToneId
  resolution?: string
  side?: string
  onApply: (newText: string) => void
  onBudget?: (b: Budget) => void
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'feedback'; summary: string; suggestions: Suggestion[] }
  | { kind: 'rewrite'; options: string[] }

export default function Coach(props: CoachProps) {
  const [state, setState] = useState<State>({ kind: 'idle' })

  const ctx = {
    section: props.section,
    resolution: props.resolution,
    side: props.side,
  }

  async function runFeedback(kind: 'wording' | 'argument') {
    setState({ kind: 'loading' })
    try {
      const r = await getFeedback({ text: props.text, kind, ...ctx })
      if (r.budget) props.onBudget?.(r.budget)
      setState({ kind: 'feedback', summary: r.summary, suggestions: r.suggestions })
    } catch (e: any) {
      setState({ kind: 'error', message: e?.message ?? 'Something went wrong.' })
    }
  }

  async function runRewrite() {
    setState({ kind: 'loading' })
    try {
      const r = await getRewrite({ text: props.text, tone: props.tone, ...ctx })
      if (r.budget) props.onBudget?.(r.budget)
      setState({ kind: 'rewrite', options: r.options })
    } catch (e: any) {
      setState({ kind: 'error', message: e?.message ?? 'Something went wrong.' })
    }
  }

  const disabled = !props.text.trim() || state.kind === 'loading'

  return (
    <div className="coach">
      <div className="coach-bar">
        {props.actions.includes('wording') && (
          <button className="btn small ghost" disabled={disabled} onClick={() => runFeedback('wording')}>
            ✎ Writing feedback
          </button>
        )}
        {props.actions.includes('argument') && (
          <button className="btn small ghost" disabled={disabled} onClick={() => runFeedback('argument')}>
            ⚖ Argument feedback
          </button>
        )}
        {props.actions.includes('rewrite') && (
          <button className="btn small ghost" disabled={disabled} onClick={runRewrite}>
            ✦ Rewrite ({props.tone})
          </button>
        )}
        {state.kind !== 'idle' && (
          <button className="btn small ghost dim" onClick={() => setState({ kind: 'idle' })}>
            clear
          </button>
        )}
      </div>

      {state.kind === 'loading' && <div className="coach-note">Coach is thinking…</div>}

      {state.kind === 'error' && <div className="coach-note err">{state.message}</div>}

      {state.kind === 'feedback' && (
        <div className="coach-result">
          {state.summary && <p className="coach-summary">{state.summary}</p>}
          {state.suggestions.length === 0 && (
            <p className="coach-note">No changes suggested — this reads well.</p>
          )}
          {state.suggestions.map((s, i) => (
            <div className={`sugg sev-${s.severity}`} key={i}>
              <div className="sugg-top">
                <span className="sev-dot" /> <span className="sugg-issue">{s.issue}</span>
              </div>
              {s.span && <div className="sugg-span">“{s.span}”</div>}
              <div className="sugg-fix">{s.suggestion}</div>
              {s.note && <div className="sugg-note">⚠ {s.note}</div>}
              {s.rewrite && (
                <div className="sugg-rewrite">
                  <span>{s.rewrite}</span>
                  <button
                    className="btn small"
                    onClick={() => {
                      const next = s.span && props.text.includes(s.span)
                        ? props.text.replace(s.span, s.rewrite!)
                        : s.rewrite!
                      props.onApply(next)
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {state.kind === 'rewrite' && (
        <div className="coach-result">
          {state.options.map((opt, i) => (
            <div className="rewrite-opt" key={i}>
              <span>{opt}</span>
              <button className="btn small" onClick={() => props.onApply(opt)}>
                Use this
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
