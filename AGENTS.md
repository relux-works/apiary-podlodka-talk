# Agent guide

This repository is the working space for a paired Podlodka talk by Alexey Grigoryev and Ivan Oparin (Relux Works), about 45 minutes (ceiling 50) since v4 of 29.09: an opening together, Alexey's half (epochs, the board and autonomy, no vendor lock-in with routing and one-machine communication), Ivan's half (the agent context manager, processes as configuration, across machines and the swarm), a recap together, questions at the end. The plan is `plan/slides-plan.ru.md`, the decisions behind it `plan/deck-v4-brief.md`.

Read this file first, then [`docs/sources.md`](docs/sources.md) and [`docs/deck-workflow.md`](docs/deck-workflow.md) before touching slides.

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
| `npm run theme:rwb-tech`, `theme:rwb-minimal` | theme showcases | http://localhost:3030 |
| `.scripts/check-recording.sh <file>` | a demo recording has video, an audio track, and the track is not silence | stdout |

## Definition of done for a deck change

1. `npm run verify` exits 0: no overflow, no text outside its frame, no clipped code, clean console.
2. Look at `.temp/audit/sheet.png` (the whole deck in one image), then at `slide-NN.png` for every slide you changed.
3. Every number or outside fact on a slide has a source in the speaker notes or in `open-questions.md`. Nothing is invented.
4. Signed commit on a branch, pull request, land by fast-forward of the reviewed head. Both speakers work this way.

## Rules that are easy to miss

- Russian for talk content, English for repository docs.
- No personal data, credentials or business topics.
- The active theme is `rwb-tech`. Since v4 (29.09) corporate logos — RWB, MTS, Relux Works — appear only on the title slide (`logos:` in its frontmatter); every other slide is neutral (`themeConfig.logo: false`).
- The v4 plan is ≈45 minutes, ceiling 50: `plan/slides-plan.ru.md`, brief `plan/deck-v4-brief.md`. `npm run timing` must land at 40–45 min.
- Claim status goes in the speaker notes, not on slides; a vision chapter is marked once on its opener.
