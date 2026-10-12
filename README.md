# apiary-podlodka-talk

Private working repository for the Podlodka talk by Alexey and Ivan (Relux Works): from chatbots to the Apiary. The talk is planned for about 45 minutes, with a 50-minute ceiling. Talk content is in Russian; repository documentation is in English.

## Experimental branch (2026-10-12)

- `rework-narrative-oct12` restructures the first half around growing system complexity and the evolution of agent development workflows. It remains a review version and must not land in `main` yet.
- The deck has 91 pages: 61 in the main flow and 30 backup pages. Ivan's opener at page 36, his following sections, and all backup pages are unchanged.
- The new order and discussion choices are in [`plan/deck-v6-draft.ru.md`](plan/deck-v6-draft.ru.md); the slide index is [`plan/slides-plan.ru.md`](plan/slides-plan.ru.md). The timing estimate is 41.7 minutes including the three demos; this is not a rehearsal measurement.
- Theme: `rwb-tech`; corporate logos appear on the title only. Sources and implementation status remain in speaker notes. The proposed product Keeper/meta-Keeper hierarchy and the Qwen review scenario still need discussion and verification.

## Speakers

| Part | Speaker |
| --- | --- |
| Pages 2–35: system growth, agent workflows, security-review example, product coordination | Alexey |
| Context management, configurable processes, multiple machines and swarm | Ivan |
| Final recap and questions | both |

## Layout

| Path | What |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Start here when working with an agent: sources of truth, commands, definition of done |
| [`slides/`](slides/) | The deck (`slides.md`), the diagram gallery (`diagrams.md`), stage diagrams in `components/`, rehearsal-mode setup, `public/` |
| [`themes/`](themes/) | Two Slidev themes, `rwb-tech` and `rwb-minimal`, with their style guides |
| [`docs/sources.md`](docs/sources.md) | Where every outside source lives, by part of the talk, and how to use them |
| [`docs/deck-workflow.md`](docs/deck-workflow.md) | How we build the deck: conventions, known traps, verification, delivery |
| [`plan/deck-v6-draft.ru.md`](plan/deck-v6-draft.ru.md) | Page-by-page first-half rework and open discussion choices |
| [`plan/slides-plan.ru.md`](plan/slides-plan.ru.md) | The working plan: timing, every slide's theses, demos, what to prepare, sources |
| [`open-questions.md`](open-questions.md) | Open questions for the organizers and for us, and what is decided |
| [`meetings/`](meetings/) | Agendas and outcomes of meetings with the organizers |
| [`notes/discussions.ru.md`](notes/discussions.ru.md) | The talk-related parts of our discussions of 27–28 September |
| [`text/`](text/) | The blog post the slides follow, Russian and English |
| [`diagrams/`](diagrams/) | Diagram renders and which slide uses which |
| [`cases/music-video/`](cases/music-video/) | The 19-hour music video expressed as a playbook (backup material) |
| [`research/video-pipelines-synthesis.md`](research/video-pipelines-synthesis.md) | Published AI video pipelines against the playbook model; demo candidates |

## Sources and freshness

Copied files name their source and commit at the top or in their folder's README:

- the post comes from relux-works/blog at 4ecb7fa;
- the diagrams and the research synthesis come from relux-works/wiki at a4850ca;
- the music-video case comes from relux-works/curator-playbook at e10436a.

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
| `.scripts/timing.py` | spoken minutes per part from the speaker notes; re-run after every notes change and after a rehearsal | `npm run timing` | stdout |
| Slidev export | PDF | `npm run export` | `.temp/export/apiary-podlodka-talk.pdf` |
| Diagram gallery | the stage versions of all diagrams, one per slide | `npm run diagrams` | http://localhost:3030 |
| Theme showcases | every layout and component of a theme | `npm run theme:rwb-tech`, `npm run theme:rwb-minimal` | http://localhost:3030 |
| `.scripts/check-recording.sh` | a demo recording has an audio track that is not silence | `.scripts/check-recording.sh <file>` | stdout |
| GitHub Actions `Build` | lint, verify the deck, the diagram gallery and both showcases, PDF, on every push and pull request | automatic | artifacts `slides-pdf`, `slides-audit` |
| GitHub Actions `Release` | on a `v*` tag: HTML archive with `HOW_TO_RUN.md` and PDF as a GitHub Release | `git tag -s vX.Y.Z && git push origin vX.Y.Z` | release assets |

`.temp/`, `dist/` and `node_modules/` are gitignored.
