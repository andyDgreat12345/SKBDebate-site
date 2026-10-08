# SKB Debate platform

A restored speech and debate learning platform: free video teaching, a full Public Forum practice room, structured case preparation, private saved work, and moderated resource sharing.

## What runs

- **PF practice:** all eleven standard speech/crossfire segments, side independent of speaking order, 3-minute team prep banks, deadline-based timers, flow notes, speech outlines, local microphone recording, prepared opposing arguments/questions, and a human-entered ballot.
- **Free video teaching:** six original AI-authored lessons, rendered to narrated MP4, English captions, transcripts, exercises, and validated completion questions. Videos use synthesized Flite speech; there is no paid AI service dependency.
- **Case workshop:** recovered CaseForge document/block model and Markdown/backup exports, source fields, legacy-case migration, word/time estimates, and cloud saves.
- **Resources:** ten editorial templates/guides/links, searching, format filters, downloads, attribution, community submissions, editorial approval/rejection, and reporting.
- **Accounts:** dispatch-owned ChatGPT sign-in, private user-owned documents with version checks, lesson progress, contributor profiles, account data export/deletion, and founder moderation.

This release does **not** implement an adaptive live AI opponent, automatic audio transcription/scoring, payments, multiplayer video calls, or a migration of the original Manus database. Prepared practice material is explicitly labeled. See [recovery](docs/RECOVERY.md) and [product roadmap](docs/PRODUCT.md).

## Develop

Node 22+ recommended. Run `npm ci`, `npm run db:generate` only after schema changes, then `npm run build`.

For local development, create ignored `.dev.vars` containing `LOCAL_DEV=true`, apply migrations with `npx wrangler d1 migrations apply DB --local`, then run `npm run preview`. This simulates a local founder only on loopback hosts. It is never configured in production. `npm run dev` serves the Vite frontend and proxies `/api` to the local Worker on port 8787.

Validation: `npm run check`, `npm test`, and `node scripts/qa.mjs` (the QA script currently uses the available workspace Chromium/Playwright installation; adjust the import/executable for another machine).

## Hosting and identity

The Sites manifest is `.openai/hosting.json`. `npm run build` emits the Worker at `dist/server/index.js`, static assets at `dist/client`, and Wrangler metadata. Drizzle migrations are schema-only, versioned, and immutable after application.

Production receives trusted `oai-authenticated-user-id` and email headers from the Sites dispatcher. Anonymous reading/practice is supported when the site's audience is public. Saves and contributions require sign-in. Do not expose this Worker directly on another host without replacing the trusted identity boundary. `ADMIN_EMAILS` is configured as a runtime value, not in source. No first-user admin claim exists.

When moving to a commercial host, use a suitable verified external identity provider and replace the small `identity()` adapter; preserve server-side ownership and editorial authorization.

## Lesson assets

Lesson scripts live in `shared/courses.ts`. Regenerate using `npx tsx -e "import {LESSONS} from './shared/courses.ts'; import fs from 'node:fs'; fs.writeFileSync('/tmp/skb-lessons.json',JSON.stringify(LESSONS));"` and `python scripts/render-lessons.py /tmp/skb-lessons.json public/lessons`. The renderer needs Pillow, FFmpeg with Flite, and ffprobe. Captions and posters are generated with the videos.

## Recovery provenance

Original source remains in `SKBDebate-Organization` and `Ai-case-writer-tool`. This repository preserves the recovered CaseForge source under `recovered/case-writer` and its original MIT license. Private community source and database-query metadata have not been copied into the public repository. Full Git history bundles were created separately for the owner.
