# Teaching lab: first bounded experiment

Status: local experimental foundation, not deployed. This does not replace or recover the original DeepSeek simulator. The existing site is an early prototype, not the final product.

## Run and inspect

Run `npm ci` if dependencies are missing, then `npm run dev`. Open `http://localhost:5173/lab.html`. Production build includes a separate `lab.html` entry. `npm run check`, `npm test`, and `npm run build` validate the project. `node scripts/qa-teaching.mjs` checks this experiment while the development server is running.

## What this establishes

- A single rebuttal lesson with three animated emphasis states and a full text equivalent.
- Optional browser speech synthesis. Voice quality/availability depends on the browser/OS; its speech service may use a network. No app-managed audio or LLM service is connected.
- Playback pauses for prepared questions, manual diagram inspection, and tab hiding. Resuming restarts the current chapter, including narration. The map is a proposed interpretation rather than a factual verdict.
- Choice-specific prepared feedback followed by original and revised writing. No keyword-based grading or purported assessment of the student's free writing.
- Explicit tab-only state and downloadable reflection JSON with lesson version and feedback provenance. No browser persistence, student uploads, or database writes.
- No additional packages or paid services.

## Architecture and adjustment

`shared/teaching.ts` owns content and a pure state reducer; `app/TeachingLab.tsx` owns interaction and speech lifecycle; `app/teaching-lab.css` owns visual presentation. Change scripts, questions, nodes, and feedback in the content module. The present player supports the current three-node linear map; branching graphs require a renderer extension. This is an animated web lesson, not generated MP4 video.

Future live tutor boundary: send lesson ID/version, current chapter, approved source IDs, explicit student question, and only necessary recent context to a server endpoint. Accept validated output containing explanation text, existing node IDs to highlight, source IDs, and a follow-up question. Do not accept executable model-generated JavaScript or Python into the player. Preserve a prepared explanation fallback when the service fails. API secrets remain on the server; measure latency and cost before enabling broader access.

## Next evidence before expansion

1. Founder reviews the interpretation, examples, script, and feedback, then records revisions and rationale.
2. A fellow judge/teacher checks plausible alternative readings. Do not mark legitimate disagreement wrong.
3. A few consenting learners try it, explain the unstated assumption in their own words, and attempt a different argument.
4. Record confusion, revisions, and ability to transfer the skill, not merely clicks or completion.
5. Only then choose between richer authored animation, one bounded live question endpoint, or simulator integration.

No accounts, payments, continuous voice, automatic scores, new courses, or public deployment are part of this experiment. Recover and evaluate the original simulator separately before integrating it.
