# Internal instructional design review

10 October 2026. Conducted through document and code inspection with AI assistance. These are design findings and authored counterexamples, not observations from students, an independent educator, or live model evaluation.

## Decisions resolved

| Question | Decision | Consequence |
| --- | --- | --- |
| Broad speech/debate audience or PF-first? | Common speaking/listening/reasoning foundation | PF simulation becomes a later track; no novice assumption of debate jargon |
| Video library or adaptive learning? | Authored explanation embedded in repeated performance and revision | Every studio must contain an actual learner task |
| Copy a workshop or author a course? | Original course with selected permitted adaptations | A rights record precedes any third-party content ingestion |
| Avatar or instructional visuals? | Voice plus persistent diagrams | Production effort goes to clear examples, timing, and responsive feedback |
| Unlimited tutor conversation? | One goal and one useful next teaching action per turn | The tutor does not distract from the current practice |
| Automatic ability score? | Task-specific evidence and reviewer provenance | Self-checks and viewing never imply mastery |
| Human reviewer required for every free visitor? | No; support level is explicit | Cohort teaching has allocated human capacity; self-study remains honest |
| What counts as independent? | Fresh task, no answer-generating assistance, recorded mode | Assistance remains welcome, but its use is visible |

## Rehearsal against authored cases

The JSON review set contains 14 synthetic cases with expected behavior and a failure to avoid. It has not been run against a live provider. Its purpose is to make future evaluation concrete rather than judging whether an answer merely sounds helpful.

- Repeated approval: the teacher should request a separate reason.
- An implied link: the teacher should ask for the explanation, without discarding the valid reason.
- A complete response: the teacher should stop overcoaching and offer new application.
- A different proposed solution: assess its justification rather than conformity.
- Nonstandard English with a clear link: accept the reasoning; language support is optional.
- A question about the library: answer it as a question, not as a failed speech.
- Unsupported grade improvement: narrow the claim without inventing a contrary fact.
- A learner correcting the teacher: recheck and correct the record if appropriate.

These cases exposed four defects in the earlier plan, now corrected:

1. The rubric's highest scope level could imply that every novice must volunteer caveats. It now requires avoiding unsupported claims, not exhaustive qualification.
2. A language-support branch could incorrectly treat nonstandard grammar as unclear reasoning. The paired case requires the same reasoning judgment when meaning is clear.
3. Question-answering and performance feedback were not explicitly separated. The request contract now identifies the interaction kind before judging a response.
4. The animation specification could reveal a model connection before the learner's checkpoint. Its timing now explicitly places that attempt before the explanatory narration.

## Independence and assistance scenarios

| Sequence | Correct record |
| --- | --- |
| Student opens a new task and submits without help | Unassisted on that task; not proof of general mastery |
| Student asks for a hint, then submits | Supported practice |
| Student sees a model, navigates away, and returns | Prior exposure retained; cannot reset to fresh |
| Student edits a submitted response | New revision linked to the original attempt |
| Student types a strong speech | Written evidence of structure/reasoning; delivery unassessed |
| Student reports practicing aloud alone | Self-reported spoken rehearsal; no listener observation implied |
| Model claims the student has mastered the skill | Reject the permanent status claim; store provisional feedback only |
| Learner disputes feedback | Preserve original response; route recheck; mark superseded judgment if corrected |

## Studio 1 must teach the prerequisite

Before lesson 02, introduce how a speaker helps a listener identify a main point. A concrete 10–15-minute manual session:

1. Invite the learner to explain a familiar activity in 30 seconds to someone new to it. Permit planning notes and private rehearsal.
2. Ask the listener to write one sentence about the message, rather than rate confidence or charisma.
3. Compare two original mini-explanations: a list of facts about a school club versus a clear statement of what happens at a meeting followed by two relevant details. Keep content benign and invented.
4. Model a revision that puts the main point first and groups details around it. Do not imply every effective speech must use the same opening formula.
5. Have the learner retry and ask the listener what became clearer. If no listener is available, label the self-review honestly.
6. Offer a fresh explanation prompt; preserve the attempt and assistance history.

Suggested model narration: “Your listener cannot reread a spoken sentence while you keep talking. Give them a clear idea to follow. For example: ‘Our club helps beginners learn one simple game each week.’ Now the details about meetings and practice have a job: they explain that main idea. Try your explanation again. What should your listener understand at the end?”

This prerequisite needs founder/educator review and learner observation; those have not occurred. It is specified here so lesson 02 does not silently assume a skill the course never taught.

## Engineering translation

Current `shared/teaching.ts` mixes authored content with a small playback reducer. `shared/tutor.ts` accepts a fixed three-node map and has no attempt, rubric, or request-kind contract. `server/tutor.ts` is a bounded local question endpoint, not an assessment engine. The new package is not compatible without a deliberate adapter; do not merely inject it into the existing prompt.

First implementation slice:

1. Versioned content loader for a reviewed studio package; validate IDs and allowed actions.
2. Player with explicit checkpoint-before/after timing and a transcript/static equivalent.
3. Attempt records separated from playback state; drafts versus submitted snapshots; server-derived assistance/exposure.
4. Coaching endpoint with request kind, observed excerpt, allowed next move, and prepared fallback.
5. Honest progress view and a correction route.

For recurring external use, add authenticated D1 saves, ownership/version checks, usage caps, and actual device verification. Keep the previous lab runnable until the replacement passes its affected browser flows. Do not build the entire CMS, public community, or payment system in this slice.

## What was checked now

- Lesson, task, scene, checkpoint, rubric, and coaching identifiers are internally consistent.
- Review cases refer to allowed teaching moves and the matching lesson version.
- Narrative decisions and rubric wording were reconciled with the structured package.
- Relative documentation links resolve.

No paid model calls, live teaching sessions, independent reviews, speech recordings, or production changes occurred. Remaining validation is explicit because mechanical consistency cannot establish educational usefulness.
