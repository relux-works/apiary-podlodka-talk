# Agent guide

This repository is the working space for a paired Podlodka talk by Alexey Grigoryev and Ivan Oparin (Relux Works), 40–45 minutes (ceiling 50). Since v6 of 12.10: Alexey's half (how projects grow, epochs, autonomy through orchestration with demo 1), Ivan's half (coordination of orchestrators with Curator and demo 2, processes as configuration, external agents in open projects), the closing together, questions at the end. The plan is `plan/slides-plan.ru.md`; the decisions behind it are `plan/deck-v4-brief.md` (29.09), `plan/deck-v5-brief.md` (10.10) and `plan/deck-v6-brief.md` (12.10, how projects grow — it supersedes v5's parallelism through-line).

Read this file first, then [`docs/sources.md`](docs/sources.md) and [`docs/deck-workflow.md`](docs/deck-workflow.md) before touching slides.

Rehearsing or presenting? [`docs/run-the-deck.md`](docs/run-the-deck.md): the deck with clicks and the live demos on a laptop, from a release, or together on the shared server.

Taking over the repository? Start with [`docs/HANDOFF.md`](docs/HANDOFF.md): the state, the toolchain, the delivery steps, the speakers' standing rules and the open items with dates (08.10).

## Where the truth lives

| What | File | Rule |
| --- | --- | --- |
| Where every outside source lives | [`docs/sources.md`](docs/sources.md) | Read before filling slides. Truth order: a repository's spec or code, then the wiki, then the post. No links to private repositories on slides. |
| Theses and wording | [`text/from-buckets-to-apiary.ru.md`](text/from-buckets-to-apiary.ru.md) | A copy of relux-works/blog. Change it at the source, then re-copy. Slides follow its chapters. |
| Slide list, timing, demos | [`plan/slides-plan.ru.md`](plan/slides-plan.ru.md) | Slide numbers everywhere refer to this plan. |
| Open items and decisions | [`open-questions.md`](open-questions.md) | Living list. Anything unverified, estimated or waiting on a person goes here. |
| The deck | [`slides/slides.md`](slides/slides.md) | Slidev. Speaker notes hold the full spoken text. |
| Diagrams on slides | [`slides/components/Diag*.vue`](slides/components/), gallery [`slides/diagrams.md`](slides/diagrams.md) | Stage versions of `diagrams/`: Russian, theme tokens, one per slide thesis. Use these, not the PNGs. |
| Look and layout vocabulary | [`themes/<theme>/STYLE.md`](themes/) | Read the active theme's guide before changing layouts. |
| Diagrams, cases, research | `diagrams/`, `cases/`, `research/` | Copies from the wiki and curator-playbook. Do not edit; refresh from source. |

## Start of a session

```bash
git fetch origin && git switch main && git merge --ff-only origin/main
git switch -c <short-topic-branch>
npm install
npm run dev          # http://localhost:3030, slide N: /#/N, click state: ?clicks=K
```

Then read `open-questions.md` and the part of the plan you are working on.

## Commands

| Command | Does | Output |
| --- | --- | --- |
| `npm run dev` | live deck with clicks | http://localhost:3030 |
| `npm run dev:flat` | rehearsal mode: every slide whole, arrows move by slides | http://localhost:3030 |
| `npm run lint` | frontmatter traps (`: ` and ` #` in unquoted values) | stdout |
| `npm run verify` | lint → offline build → every slide measured in Chromium → contact sheet | `.temp/audit/sheet.png`, `slide-NN.png`, `audit.json` |
| `npm run timing` | spoken minutes per part from the speaker notes (130 wpm, demos at the plan's length; backup not summed) | stdout |
| `npm run export` | PDF | `.temp/export/apiary-podlodka-talk.pdf` |
| `npm run diagrams` | gallery of all stage diagrams | http://localhost:3030 |
| `npm run demos` | the in-slide demo prototypes (`slides/demos.md`): → starts a demo, → pauses and resumes, ← rewinds a beat, R restarts (`docs/demos.md`) | http://localhost:3030 |
| `node .scripts/demo-run.mjs --repo <dir> --epic <EPIC> --session <orchestrator.jsonl>` | demo 1's data from one epic's board logs, run ledgers and the orchestrator's session: anonymous ids, no names or text | `slides/demo/run.json` |
| `node .scripts/static-demos.mjs <url of a served build> [deck.md]` | the live demos in the static build, as the release HTML plays them: start, pause, rewind, restart, the viewer and presenter tabs in step (also in CI, after the deck's verify) | stdout |
| `node .scripts/demo-frames.mjs --video` | a demo in headless Chromium: frames at fixed moments and a video of the autoplay (also in CI, artifact `demo-frames`) | `.temp/demo-frames/` |
| `npm run theme:rwb-tech`, `theme:rwb-minimal` | theme showcases | http://localhost:3030 |
| `.scripts/check-recording.sh <file>` | a demo recording has video, an audio track, and the track is not silence | stdout |
| `npm run present` · `present:status` · `present:stop` | the deck's dev server in the background, localhost only, in present mode (a window that opens joins the live slide; titles «ЭКРАН» and «ЗАМЕТКИ»), for the shared clicker over SSH (`docs/shared-clicker.md`) | http://localhost:3030, `.temp/present/` |
| `npm run join` · `npm run join -- --ivan` | on a speaker's laptop, always through the Mac mini (`administrator@relux-macmini`; `--host <alias>` once to override): starts the deck there if it is down, holds the SSH tunnel and reconnects it, opens «ЗАМЕТКИ»; with `--ivan` (or `--share`) also «ЭКРАН», for the speaker who shares the screen | http://localhost:3030, `.temp/join/` |
| `npm run check:sync` | the shared clicker in headless Chromium: windows follow each other, a new or reloaded window joins the live slide (also in CI) | stdout |
| `npm run agent-hours -- --days 14 --json <host>.json` | busy hours of orchestrators and workers (Claude Code, Codex with the tb-sessiond homes, Muse), task-board runs and commits on main on this machine. `--archive <export.tar.zst> --archive-host <name>` streams another machine's session export without extracting it; `--db <file>` writes a private SQLite database, `--report <file>` the table for any window; `--merge a.json b.json:runs,landings` sums machines | stdout, JSON, SQLite |
| `npm run host-export -- --host m1max` | on another machine: its share of the statistics and demo 2 in one file, aggregates and timestamps only (`docs/swarm-stats.md`, «Adding a machine») | `.temp/host-export/<host>-export.json` |
| `node .scripts/merge-host.mjs --export <file> --person alexey` | folds that file into `slides/demo/stats.json` and `slides/demo/swarm.json` | the two data files |
| `node .scripts/people-hours.mjs … --write slides/demo/stats.json` | people's hours on «Работа агентов за две недели» (10-minute buckets, one timeline per person) | `slides/demo/stats.json` |

## Definition of done for a deck change

1. `npm run verify` exits 0: no overflow, no text outside its frame, no clipped code, clean console.
2. Look at `.temp/audit/sheet.png` (the whole deck in one image), then at `slide-NN.png` for every slide you changed.
3. Every number or outside fact on a slide has a source in the speaker notes or in `open-questions.md`. Nothing is invented.
4. Signed commit on a branch, pull request, land by fast-forward of the reviewed head. Both speakers work this way.

## Rules that are easy to miss

- Russian for talk content, English for repository docs.
- No personal data, credentials or business topics.
- The active theme is `rwb-tech`. Since v4 (29.09) corporate logos — RWB, MTS, Relux Works — appear only on the title slide (`logos:` in its frontmatter); every other slide is neutral (`themeConfig.logo: false`).
- The v6 plan is 40–45 minutes, ceiling 50: `plan/slides-plan.ru.md`, brief `plan/deck-v6-brief.md`. `npm run timing` must land at 40–45 min (demos: 1 = two runs of 2 min each since 16.10, 2 = 2 min, 3 = 1.5 min; the two mini-demos count by their notes).
- Claim status goes in the speaker notes only. Since v5 (10.10) no status pill or label anywhere, backup and diagrams included; the speakers say the status aloud.
- Since v5 (10.10): titles are strict technical noun phrases, every chapter's problem slide is titled «Проблема — …» (one exception since 15.10, Alexey's review: slide 31 «Человек между оркестраторами» names the situation and leaves the problem to its orange plaque; whether the other problem slides follow is open in `open-questions.md`), and beekeeping names and «Кипер» stay off slides and stage diagrams (главный оркестратор, мета-оркестратор, оркестратор проекта); «Кипер» is fine aloud.
- Since v6 (12.10): a problem is orange (`card orange`, `lead orange` «Новая проблема — …»), a solution or achievement is lime (`card lime`, `lead lime`), everywhere; an aim we want but do not have yet is yellow (`card yellow`, `lead yellow`), worded «хотим, чтобы…», not as a claim (Ivan, 13.10). Each slide ends with the next problem; the next slide solves it. The bottom plaque is only a problem or a success (Ivan, 13.10): no purple `lead` in the main flow; on a «Проблема — …» slide the orange plaque has no prefix. Demos use the black `demo` layout (a demo closes a chapter); purple is for chapter openers only. The backup holds only slides someone may ask about.
