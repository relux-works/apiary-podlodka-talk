# Agent guide

This repository is the working space for a paired Podlodka talk by Alexey Grigoryev and Ivan Oparin (Relux Works): «От чат-ботов к пасеке», 90 minutes, 41 slides in seven parts, three demos. Alexey presents parts 1–4 (the mechanics: board, autonomy, cross-harness, no vendor lock-in); Ivan presents parts 5–6 (the Apiary, the distributed Apiary and the swarm); part 7 and questions are joint.

Read this file first, then [`docs/deck-workflow.md`](docs/deck-workflow.md) before touching slides.

## Where the truth lives

| What | File | Rule |
| --- | --- | --- |
| Theses and wording | [`text/from-buckets-to-apiary.ru.md`](text/from-buckets-to-apiary.ru.md) | A copy of relux-works/blog. Change it at the source, then re-copy. Slides follow its chapters. |
| Slide list, timing, demos | [`plan/slides-plan.ru.md`](plan/slides-plan.ru.md) | Slide numbers everywhere refer to this plan. |
| Open items and decisions | [`open-questions.md`](open-questions.md) | Living list. Anything unverified, estimated or waiting on a person goes here. |
| The deck | [`slides/slides.md`](slides/slides.md) | Slidev. Speaker notes hold the full spoken text. |
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
| `npm run export` | PDF | `.temp/export/apiary-podlodka-talk.pdf` |
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
- The active theme is `rwb-tech` with the RWB logo switched off (`themeConfig.logo: false`): the talk is Relux Works, not RWB. The Podlodka template may replace our themes; see `open-questions.md`.
- Mark vision slides as vision («видение» or «в спеке, предложено»), as the plan's tone section requires.
