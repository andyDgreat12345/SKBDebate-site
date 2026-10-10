# Production, technology, and pilot operations

Proposed operating plan, not a deployed capability list. English beginner course; no new subscriptions, plugins, purchases, or public deployment are required to review this plan.

## 1. How a workshop becomes an interactive lesson

Do not start by cutting a one-hour lecture into arbitrary clips. First identify what the learner should be able to do, then select the smallest explanation and demonstration that supports that performance.

| Step | Work product | Owner and release condition |
| --- | --- | --- |
| Source intake | Exact source/section, rights record, intended objective | Founder/content editor; permission clear before adaptation |
| Instructional design | Objective, prerequisite, example, likely misunderstandings, independent task | Founder drafts with AI; educator checks alignment |
| Script | Approximately 350–500 spoken words across short segments, plus checkpoints | Founder reads aloud; remove jargon and unnecessary concepts |
| Storyboard | Every sentence linked to a visual action or deliberate still frame | AI assists; human checks that motion clarifies meaning |
| Narration | Reviewed human or licensed synthetic audio | Check pronunciation, emphasis, pauses, and terminology |
| Scene production | Reusable visual objects and an authored timeline | Engineering builds; no arbitrary model-generated code at runtime |
| Interaction | Authored branches plus bounded open questions | Educator reviews correct, partial, alternative, and confused responses |
| Access and device QA | Captions, text equivalent, touch/keyboard controls, reduced motion, audio fallback | Actual iPad Safari and a second browser tested |
| Learner trial | Observed attempts and specific confusion notes | Revise before widening access |
| Publication | Versioned lesson with sources, reviewer/date, and known limits | Named human releases; previous version remains identifiable |

Suggested lesson folder: specification, script, storyboard, source ledger, media manifest, checkpoints, sample responses, review notes. Keep rights evidence and private learner records out of the public repository. Public source URLs and attribution can live with the curriculum.

An asset manifest records file, creator/provider, license, script version, duration, caption file, and any source material. A lesson version links the script, media, exercises, rubric, and tutor context together; changing an example should not silently invalidate an old learner record.

## 2. Build versus reuse

| Option | What it gives us | What still needs doing | Decision |
| --- | --- | --- | --- |
| H5P Interactive Video / Branching Scenario | Existing authored video questions, pauses, and branches | Hosting/integration, progress mapping, AI context, and custom responsive diagrams | Useful benchmark or alternative if low-code authoring becomes the priority; do not add a second platform yet |
| Existing React app + SVG scenes | Direct control of diagrams, state, and iPad layout | Timeline, authoring structure, assessment logic, and media synchronization | Recommended first implementation because the foundation exists |
| Pre-rendered motion video | Predictable playback and reusable downloadable lesson media | Generating/exporting approved media, captions, and interactive checkpoints around it | Use for stable explanations; preserve a separate interactive diagram layer |
| Fully generated video per student question | Potentially novel visuals | Rendering, error repair, long delays, cost control, and instructional validation | Defer; unnecessary for the first learning promise |

H5P's documented interactions are authored adaptivity, not automatically an AI teacher. See [Interactive Video](https://h5p.org/interactive-video) and [Branching Scenario](https://h5p.org/branching-scenario). No plugin installation is needed to establish the curriculum or write the worked lesson.

Production recommendation: build one reusable browser scene renderer, author stable lesson timelines, and cache approved narration. Offer video export later if reuse outside the app warrants the render service. Do not require MP4 generation to answer a learner's question.

## 3. Minimum technical architecture

- **Client:** existing React/TypeScript, touch-friendly SVG scenes, captions/transcript, exercises, and a clear save indicator.
- **Lesson content:** versioned structured files at first; schema includes objective, prerequisites, source IDs, scenes, media cues, exercises, rubric, and permitted tutor actions.
- **Server:** existing Worker layer, authenticated request handling, validated tutor responses, per-user/cohort limits, and durable spending counters. The current local-only tutor is not a ready public endpoint.
- **Durable state:** D1 for accounts/ownership, attempt revisions, progress, feedback provenance, consent records, and content metadata. Immutable attempt snapshots plus optimistic version checks protect work across tabs.
- **Media:** an object-storage service for approved audio/video; D1 stores metadata and ownership. Optional student audio is private, with access checks and a retention/deletion policy.
- **Model:** hosted API with an approved context packet. No fine-tuning or self-hosted GPU needed for this release. Do not send an entire private course to a model merely because it can be read in a browser.
- **Production hosting:** a stable deployed web app. Codespaces remains development infrastructure; learners should not depend on the founder keeping a development server awake.

Core records: LessonVersion, SourcePermission, ExerciseVersion, Attempt, Feedback, Revision, CohortMembership, ReviewAssignment, MediaAsset, UsageEvent. A score must refer to an exercise and rubric version; model, peer, self, and educator feedback have distinct labels.

Playback states: ready → playing → checkpoint / question → feedback → learner chooses resume → complete. Cancel stale generation when leaving or changing scenes. Audio and visuals follow the same timeline; playback progress is different from learning progress.

If the model fails, prepared explanations and exercises still work. If audio fails, the transcript and scenes still work. If saving fails, show “not saved,” keep the visible draft, and offer export; never falsely confirm persistence. Text and static visuals should remain practical on a weak connection.

## 4. AI teacher contract and evaluation

The request contains the current goal, exact prompt, relevant student response, allowed reference material, visible scene, and recent relevant turns. Send speech to transcription only after explicit submission and disclosure; let the student correct the transcript before reasoning feedback. The current prototype does not do this yet.

The response contains: observed strength; one specific issue or clarification; a reason grounded in the response; one next action; and optional allowed scene action. It must distinguish a relevant alternative from an error. Knowledge outside the approved lesson is identified as unverified or deferred to a human/source lookup.

Build a small review set before enabling external AI feedback. Proposed first set: 30 original responses covering clear answers, partial links, repetition, irrelevant support, alternative interpretations, requests for fabricated evidence, off-topic requests, and disputed teacher feedback. Include varied English expression. Review at least two outputs for each case to expose variability.

Acceptance criteria are release targets, not measured results: no invented source/quotation in the set; no rejection solely for differing wording or a legitimate position; feedback identifies the actual response issue; output format and cancellation work; uncertain cases invite clarification. If these fail, keep prepared feedback and human review available while changing the prompt or scope. Automated checks cannot establish teaching quality.

A later reviewer can blind-score feedback for correctness, relevance, actionability, and fairness. Record disagreements rather than hiding them in an average. Do not implement a purported truth or confidence percentage for normative debate positions.

## 5. Human workload and cost model

Planning estimates, not vendor quotes or guaranteed timelines:

- First complete 3–4-minute animated studio: roughly 12–25 person-hours across scripting, review, visual design, engineering, and QA. Initial renderer work may add substantial time; measure rather than assume it disappears with AI.
- Later studios using stable templates: roughly 5–10 person-hours each, adjusted after the first two.
- External instructional review: plan 45–90 minutes per studio plus time to resolve issues; ask a coach about availability and compensation.
- For a 12-learner cohort, one 6-minute substantive review per learner each week is 72 minutes. Add a 45-minute workshop, 30 minutes preparation, and 30 minutes support: approximately 3 hours weekly before course production or engineering.

Founder weekly availability is unknown. These estimates define a capacity question, not a commitment. With limited time, reduce the cohort or release fewer studios; do not silently replace promised human feedback with AI.

Illustrative API workload for a complete eight-studio cohort:

- 12 learners × 8 studios × 6 tutor requests = 576 requests.
- At assumed averages of 2,500 input and 200 output tokens: 1.44 million input and 115,200 output tokens. Measure real context sizes, retries, and provider reasoning/billing behavior.
- At an optional average of 30 seconds of generated speech per request: 288 audio minutes. This is a separate assumption, not implied by the token count.
- Authored narration is generated and cached once per approved version; eight studios at 3–4 minutes is 24–32 minutes before retakes.

Cost worksheet: model input/output (plus any provider-specific billable usage) + TTS/STT usage + storage/egress + hosting + reviewer fees + subscriptions. Fill current provider prices only when choosing services. Set actual daily/monthly server-side spending caps before inviting learners. A client-only limit or per-process counter is insufficient. Human time may exceed API costs.

If spending rises, reduce optional generated voice and long context first while preserving free authored instruction. Paid advanced preparation remains a later business test; free core lessons should continue to function when a learner reaches an AI quota.

## 6. Pilot recruitment and operation

Start with three usability/teaching volunteers, then one supervised group of 8–12 beginners. This is proposed recruitment; no partner is secured. Use a school club, teacher, or established youth organization appropriate to the learner group. Do not claim access to underserved students before confirming whom the partner serves and what barriers they face.

Invitation describes the real benefit: guided practice and feedback during a clearly stated pilot period. Explain what is experimental, who facilitates, actual support hours, and what data is collected. Offer text/low-bandwidth access and an oral practice alternative to uploaded recordings. The appropriate age, guardian, organizational, and jurisdiction-specific arrangements must be settled with the partner before collecting children's accounts or voices.

Default pilot design: no public student profiles, recordings, or direct messages. Students choose whether work is shared with the assigned reviewer; publication of a testimonial or work sample is a separate choice. Collect only what is needed. Establish a deletion date for raw pilot audio, an export/deletion route, and named responsibility for access requests before recording begins.

Weekly operation: publish preparation → run supervised workshop → review selected submissions → address reports → revise next instruction. Promise a feedback turnaround only after allocating capacity; a possible pilot target is three school days, subject to the actual facilitator schedule.

## 7. Measure learning without overstating impact

Primary question: can students produce a clearer supported point and respond more accurately to another speaker on a fresh task?

- Before instruction: a short comparable speaking task, listening paraphrase, and an optional self-report of prior access to coaching.
- During: record attempts, assistance, revisions, technical failures, and workshop attendance. Watching is an exposure measure.
- After: alternate but comparable tasks, same instructions and rubric, plus a delayed check 1–2 weeks later.
- Have a second reviewer score a subset without knowing timing where feasible. Calibrate against examples and retain disagreements.
- Report all enrolled learners, actual completers, paired assessments, missing data, and individual patterns. Do not exclude struggling learners to improve the result.

A small uncontrolled pilot can show feasibility and promising change; it cannot isolate app effects from workshops, practice, selection, or outside coaching. If we later test whether motion itself helps, compare versions with the same content, tasks, and feedback rather than comparing a polished course with no instruction.

Suggested operational decisions after the pilot: fix any repeated access blocker; reteach any concept several students misinterpret; review each substantial AI error; expand only if delivery workload is sustainable and learner work shows the intended skill. These are practical decisions, not validated statistical thresholds.

The founder's portfolio should include curriculum versions, workshop preparation, consented/anonymized work, reviewer feedback, and a candid report. Attribute AI and collaborator contributions. Social impact is the work students can now do and the access they gained, not the volume of generated media.

## 8. Implementation work orders

| Order | Concrete deliverable | Dependency / acceptance |
| --- | --- | --- |
| A. Curriculum review | Revised lesson 02 and studio 1 outline | Founder and coach review recorded; resolve audience/age and task difficulty |
| B. Manual teaching test | Three observed attempts, confusion notes, revised prompts | Appropriate volunteer arrangements; no app build required |
| C. Motion sample | One 60–90-second scene and one meaningful checkpoint | Approved script; captions and static alternative; actual iPad check |
| D. Two complete studios | End-to-end practice, hints, replay, and reflection | Learners understand the tasks; permit legitimate alternative answers |
| E. Persistence and pilot access | Authenticated saves, ownership tests, media choices, durable usage caps | No silent save failures or cross-account access; production host configured |
| F. Pilot delivery | Defined cohort, schedule, reviewer, support, baseline and follow-up | Capacity confirmed and participant arrangements ready |
| G. Revise and expand | Next studios plus a transparent pilot report | Evidence supports the teaching pattern; unresolved failures addressed |

Near-term deliverables in this planning package are A's draft materials, not completed reviews. Do not automatically generate all eight videos from unreviewed text. Review and teach first; use the first two studios to learn what production and support actually cost.
