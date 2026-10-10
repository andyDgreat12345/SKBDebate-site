# SKB learning app: milestone 1

Planning update: the founder requested a deeper educational redesign after this milestone. See [the learning-design blueprint](learning-design/README.md); it supersedes the feature-first next steps below. The implementation described here remains a sandbox.

Updated 2026-10-10. Experimental branch: `codex/interactive-teaching-foundation`.

## Repository inventory

- React/TypeScript multipage app: existing platform and isolated lab entry.
- Lab: three authored chapters, browser narration, argument map, prepared feedback, optional server-side DeepSeek adapter.
- Existing platform: Worker/D1 and authentication-related tests. These are not yet connected to lab learning records.
- Codespaces launcher builds a Safari 15-targeted bundle and serves port 5173. Real Safari execution is not verified by this workspace's browser tests.
- Original paid DeepSeek mock-round system remains unverified; this milestone does not claim to recover it.
- No model credentials are configured in this workspace. Browser tutor checks use explicit mock responses.

## Implemented

Learn → initial attempt → lesson and revision → independent transfer attempt → self-review → downloadable record.

Initial and transfer responses become read-only after submission. Navigation preserves writing and pauses playback; leaving the lesson unmounts the tutor and aborts pending requests. Initial work is optional so visitors can explore. Returning to Learn after exploring does not establish a valid pre-instruction baseline; exports are reflective records, not controlled assessments. All content remains a teaching draft awaiting founder/educator review.

No durable persistence: reload clears the session. JSON export includes prompt text, lesson version, initial and revised lesson responses, baseline/transfer drafts and submission flags, self-review, and reflection. Exercise writing is not sent to the model.

## Teaching specification

Objective: identify an unstated assumption and write a fair, relevant objection.

- Initial example: voluntary study-group attendance and grades.
- Guided example: phone distraction and broad versus narrower restrictions.
- Transfer example: cycling, well-being, and a bicycle subsidy.
- Review criteria: fair interpretation, specific assumption, justified objection without invented evidence, and openness to evidence.

These examples involve different inference types. Review whether the guided lesson gives novices enough causal-reasoning support before treating results as comparable. Do not infer learning gains from checkbox counts or use these exercises as a validated test.

## Next milestones

1. Founder reviews examples and observes one manual teaching session; record misunderstandings.
2. Reusable animated scenes with progressive argument construction and text equivalents.
3. Bounded tutor feedback on explicitly submitted exercises, evaluated against reviewed examples.
4. Authenticated D1 progress, ownership/version checks, privacy choices, and durable usage limits before external pilot.
5. Five-to-ten learner pilot, then refine curriculum and consider simulation integration.

## Validation

`npm run check`, `npm test`, `npm run build`.
With the app running on port 5173: `node scripts/qa-journey.mjs`, `node scripts/qa-teaching.mjs`, `node scripts/qa-live-tutor.mjs`.

Browser checks use Chromium desktop and 390px mobile viewport, not a physical iPad. Live tutor checks use a mock provider; no paid inference is verified. No public site deployment is performed.
