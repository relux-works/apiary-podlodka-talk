# apiary-podlodka-talk

Private working repository for the Podlodka talk by Alexey and Ivan (Relux Works): from chatbots to the Apiary. It is a paired evening talk planned for 90 minutes. The talk and its materials are in Russian; repository docs are in English.

## Status (2026-09-29)

- The plan exists: 41 slides in seven parts, three demos, questions at the speaker switch and at the end, and cut versions for 60 and 45 minutes.
- The toolchain is in place: Slidev deck in `slides/` (a skeleton: title, seven part openers, one example slide, final), two themes in `themes/`, a verification gate and CI. Slides are filled from the plan next. The conference template has not arrived; until it does, the deck uses the `rwb-tech` theme with the RWB logo.
- The first meeting with the Podlodka advisor is on 2026-09-29 at 14:00 MSK. A review follows about a week later; the conference date is still open.

## Speakers

| Part | Speaker |
| --- | --- |
| 1–4: epochs, the board and autonomy, cross-harness, no vendor lock-in (the mechanics) | Alexey |
| 5–6: the Apiary, the distributed Apiary and the swarm | Ivan |
| 7 and questions | both |

## Layout

| Path | What |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Start here when working with an agent: sources of truth, commands, definition of done |
| [`slides/`](slides/) | The deck (`slides.md`), the diagram gallery (`diagrams.md`), stage diagrams in `components/`, rehearsal-mode setup, `public/` |
| [`themes/`](themes/) | Two Slidev themes, `rwb-tech` and `rwb-minimal`, with their style guides |
| [`docs/sources.md`](docs/sources.md) | Where every outside source lives, by part of the talk, and how to use them |
| [`docs/deck-workflow.md`](docs/deck-workflow.md) | How we build the deck: conventions, known traps, verification, delivery |
| [`plan/slides-plan.ru.md`](plan/slides-plan.ru.md) | The working plan: timing, every slide's theses, demos, what to prepare, sources |
| [`open-questions.md`](open-questions.md) | Open questions for the organizers and for us, and what is decided |
| [`meetings/`](meetings/) | Agendas and outcomes of meetings with the organizers |
| [`notes/discussions.ru.md`](notes/discussions.ru.md) | The talk-related parts of our discussions of 27–28 September |
| [`text/`](text/) | The blog post the slides follow, Russian and English |
| [`diagrams/`](diagrams/) | Diagram renders and which slide uses which |
| [`cases/music-video/`](cases/music-video/) | The 19-hour music video expressed as a playbook (slide 28) |
| [`research/video-pipelines-synthesis.md`](research/video-pipelines-synthesis.md) | Published AI video pipelines against the playbook model; demo candidates |

## Sources and freshness

Copied files name their source and commit at the top or in their folder's README:

- the post comes from relux-works/blog at 0070a5f;
- the diagrams and the research synthesis come from relux-works/wiki at a4850ca;
- the music-video case comes from relux-works/curator-playbook at 648dc54.

The specifications are linked from the plan, not copied, with their versions as of 2026-09-29. Refresh a copy from its source rather than editing it here.

## Working agreement

- Both speakers edit with agents on short-lived branches and land through pull requests; commits are signed.
- Russian for talk content, English for repository docs.
- No personal data, credentials or business topics in this repository.

## Tools

Node.js 20+ and Python 3. `npm install` brings Slidev and headless Chromium (Playwright); nothing else is needed.

| Tool | What for | Run | Output |
| --- | --- | --- | --- |
| Slidev | live deck with clicks | `npm run dev` | http://localhost:3030 |
| Slidev, rehearsal mode | every slide whole, no click steps | `npm run dev:flat` | http://localhost:3030 |
| `.scripts/check-frontmatter.py` | YAML traps in slide frontmatter | `npm run lint` | stdout |
| `.scripts/verify.sh` | lint, offline build, slide audit, contact sheet; exits non-zero on any finding | `npm run verify` | `.temp/dist-offline/`, `.temp/audit/` |
| `.scripts/audit-overflow.mjs` | measures every slide in Chromium: overflow, text outside frames, clipped code, console errors | called by `verify` | `.temp/audit/slide-NN.png`, `audit.json` |
| `.scripts/contact-sheet.mjs` | the whole deck in one image | called by `verify` | `.temp/audit/sheet.png` |
| `.scripts/serve-static.py` | static server for the audit; the stock `http.server` refuses parallel module requests | called by `verify` | — |
| Slidev export | PDF | `npm run export` | `.temp/export/apiary-podlodka-talk.pdf` |
| Diagram gallery | the stage versions of all diagrams, one per slide | `npm run diagrams` | http://localhost:3030 |
| Theme showcases | every layout and component of a theme | `npm run theme:rwb-tech`, `npm run theme:rwb-minimal` | http://localhost:3030 |
| `.scripts/check-recording.sh` | a demo recording has an audio track that is not silence | `.scripts/check-recording.sh <file>` | stdout |
| GitHub Actions `Build` | lint, verify the deck, the diagram gallery and both showcases, PDF, on every push and pull request | automatic | artifacts `slides-pdf`, `slides-audit` |
| GitHub Actions `Release` | on a `v*` tag: HTML archive with `HOW_TO_RUN.md` and PDF as a GitHub Release | `git tag -s vX.Y.Z && git push origin vX.Y.Z` | release assets |

`.temp/`, `dist/` and `node_modules/` are gitignored.
