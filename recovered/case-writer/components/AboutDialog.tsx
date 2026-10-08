// The user-facing half of the content & integrity policy. The policy doc
// requires this to be visible in the app, not just in the repo.

export default function AboutDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet narrow" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-bar">
          <strong>About CaseForge</strong>
          <div className="sheet-actions">
            <button className="btn small ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="prose">
          <p>
            CaseForge helps you draft, format, and refine a Public Forum
            constructive. You write the case; the AI coach gives feedback on
            wording, persuasion, tone, and argument logic.
          </p>

          <h3>What the coach will not do</h3>
          <ul>
            <li>
              <strong>It won't write your case.</strong> There is no
              "generate a case from the topic" button — feedback only applies to
              text you have already written.
            </li>
            <li>
              <strong>It won't invent evidence.</strong> It will tell you where a
              claim needs a source, but it will never produce a statistic,
              study, or quotation for you. Anything that looks like a citation
              from an AI should be assumed false until you verify it.
            </li>
            <li>
              <strong>It won't replace your voice.</strong> Rewrites refine your
              own wording; every suggestion is yours to accept or dismiss.
            </li>
          </ul>

          <h3>Your responsibility</h3>
          <p>
            Debate leagues and tournaments set their own rules on AI assistance,
            and they differ. Check yours before using AI-assisted prep in a
            round. Verify every source you cite — you are accountable for what
            you read out loud.
          </p>

          <h3>Limits</h3>
          <p>
            The coach has a daily budget per person, shown in the toolbar. If
            you reach it, coaching pauses until tomorrow — the editor, your
            cases, and exporting all keep working normally.
          </p>

          <h3>Your data</h3>
          <ul>
            <li>
              <strong>No account, no database.</strong> Your cases are stored
              only in this browser. Clearing site data deletes them, so use
              <em> Export → Backup (.json)</em> to keep a copy.
            </li>
            <li>
              <strong>When you ask for feedback</strong>, that section's text is
              sent to the AI provider to generate a response. It isn't stored by
              this site. Don't paste anything confidential.
            </li>
          </ul>

          <p className="dim">
            CaseForge is a study aid, not a substitute for a coach or your own
            research.
          </p>
        </div>
      </div>
    </div>
  )
}
