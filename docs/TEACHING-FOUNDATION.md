# Teaching lab: first bounded experiment

Status: local experimental foundation, not deployed. This does not replace or recover the original DeepSeek simulator. The existing site is an early prototype, not the final product.

## Live-question experiment (implemented; provider not connected)

The lab now includes an open-ended question form and `/api/tutor`. Successful responses update the map and supply an explanation and follow-up. The endpoint uses DeepSeek chat completions with validated JSON, a 30-second timeout, 1,600 output-token cap, three prior exchanges, one concurrent local request, and 30 attempted calls per process per hour. These are development safeguards, not a production billing limit. The server refuses all non-loopback or non-LOCAL_DEV access, even with a configured key.

To connect: append `DEEPSEEK_API_KEY` and a currently supported `DEEPSEEK_MODEL` to the ignored `.dev.vars` file (see `.dev.vars.example`); keep real keys out of chat and Git. Build with `npm run build`, start the API with `npm run preview`, and run `npm run dev` in a second terminal. Open `http://127.0.0.1:5173/lab.html`. Restart the API after changing credentials. No provider key was available during implementation, so all generative response tests used mocks.

Only explicit submission sends a question, map, chapter, and limited conversation to DeepSeek. Exercise drafts are not sent. Server does not intentionally persist conversations; provider retention terms still apply. Responses are rendered as plain text, not executable code. Format checks do not establish factual or pedagogical correctness. Invalid responses leave the previous map intact. Cancel, replay, and chapter changes discard pending results; aborting may not prevent provider charges already incurred. Returning to authored content clears the local tutor exchange history. Generated responses are text and diagram updates; generated speech synchronization is not implemented.

Run `node scripts/qa-live-tutor.mjs` for mock-provider browser checks. Paid live inference and teaching quality remain unverified until credentials are configured and the founder reviews real responses. A static downloaded HTML alone cannot run this server-dependent tutor.

## Run and inspect

Run `npm ci` if dependencies are missing, then `npm run dev`. Open `http://localhost:5173/lab.html`. Production build includes a separate `lab.html` entry. `npm run check`, `npm test`, and `npm run build` validate the project. `node scripts/qa-teaching.mjs` checks this experiment while the development server is running.

## What this establishes

- A single rebuttal lesson with three animated emphasis states and a full text equivalent.
- Optional browser speech synthesis. Voice quality/availability depends on the browser/OS; its speech service may use a network. No app-managed audio service is connected; the optional model adapter is described above.
- Playback pauses for prepared questions, manual diagram inspection, and tab hiding. Resuming restarts the current chapter, including narration. The map is a proposed interpretation rather than a factual verdict.
- Choice-specific prepared feedback followed by original and revised writing. No keyword-based grading or purported assessment of the student's free writing.
- Explicit tab-only state and downloadable reflection JSON with lesson version and feedback provenance. No browser persistence, student uploads, or database writes.
- No additional packages or paid services.

## Architecture and adjustment

`shared/teaching.ts` owns content and a pure state reducer; `app/TeachingLab.tsx` owns interaction and speech lifecycle; `app/teaching-lab.css` owns visual presentation. Change scripts, questions, nodes, and feedback in the content module. The present player supports the current three-node linear map; branching graphs require a renderer extension. This is an animated web lesson, not generated MP4 video.

Implemented live tutor boundary (source references remain future work): send lesson ID/version, current chapter, approved source IDs, explicit student question, and only necessary recent context to a server endpoint. Accept validated output containing explanation text, existing node IDs to highlight, source IDs, and a follow-up question. Do not accept executable model-generated JavaScript or Python into the player. Preserve a prepared explanation fallback when the service fails. API secrets remain on the server; measure latency and cost before enabling broader access.

## Next evidence before expansion

1. Founder reviews the interpretation, examples, script, and feedback, then records revisions and rationale.
2. A fellow judge/teacher checks plausible alternative readings. Do not mark legitimate disagreement wrong.
3. A few consenting learners try it, explain the unstated assumption in their own words, and attempt a different argument.
4. Record confusion, revisions, and ability to transfer the skill, not merely clicks or completion.
5. Only then choose between richer authored animation, one bounded live question endpoint, or simulator integration.

No accounts, payments, continuous voice, automatic scores, new courses, or public deployment are part of this experiment. Recover and evaluate the original simulator separately before integrating it.

## Learning journey milestone (2026-10-10)

The lab now opens on Learn, with an optional first attempt before the lesson. My Progress contains an independent transfer exercise, self-review, and a combined downloadable record. See [BUILD-PROGRESS.md](BUILD-PROGRESS.md) for the inventory, teaching specification, limitations, and next milestones. Session-only storage and the local tutor boundary remain unchanged.
