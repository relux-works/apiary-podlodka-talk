# Sources

What the Apiary project is and where every source lives, for anyone filling slides. Context pack from tb-keeper (the operator's design session and main orchestrator), 2026-09-29. Every link below was checked on 2026-09-29; **P** marks a public repository, everything else is private to relux-works.

In this repository already: the narrative spine [`text/from-buckets-to-apiary.ru.md`](../text/from-buckets-to-apiary.ru.md), the plan [`plan/slides-plan.ru.md`](../plan/slides-plan.ru.md) (41 slides, 90 minutes), [`open-questions.md`](../open-questions.md), [`notes/discussions.ru.md`](../notes/discussions.ru.md), [`meetings/`](../meetings/), [`cases/music-video/`](../cases/music-video/) and [`research/video-pipelines-synthesis.md`](../research/video-pipelines-synthesis.md). Everything below is outside the repository. The `gh` CLI reads the private relux-works repositories; read through `gh api` or a fresh clone under `.temp/`, and do not edit other sessions' checkouts.

## How to use the sources

- **Truth order:** a repository's own spec or code, then the wiki, then the blog post.
- **Every claim keeps its status:** working today, decided, proposed or open. The technical note and the specs mark each statement; carry that to the slide as «видение» or «в спеке, предложено», as the plan's tone requires.
- **Numbers only from a source,** cited in the speaker notes.
- **Private repositories:** module names are fine on slides. No links to them and no screenshots of their content on slides until the operator decides what opens (`open-questions.md`, «Что открываем к дате доклада»).
- **No competitor products** beyond the plan's OpenClaw-style positioning. Mutation testing and seeded defects stay out, as decided on 2026-09-28.
- **When a source contradicts the plan,** or a claim's status is unclear, ask tb-keeper.

## Start here: the whole picture

1. **Wiki map by plane**, the best one-page architecture: [wiki/README.md](https://github.com/relux-works/wiki/blob/main/README.md). Use «Map by plane» and «How the planes fit». Some rows are older than the newer repositories below.
2. **Technical note**, the ecosystem A to Z as of 2026-09-25, every statement marked with its status: [apiary-technical-note.ru.pdf](https://github.com/relux-works/wiki/blob/main/book/apiary-technical-note.ru.pdf), chapter sources in [book/ru](https://github.com/relux-works/wiki/tree/main/book/ru). Chapters onto parts:

   | Chapter | Talk |
   | --- | --- |
   | 02 ядро сегодня | part 2 |
   | 03 процессы | part 5 |
   | 04 модели и деньги | part 3 |
   | 05 доверие | slide 33 |
   | 06 curator | part 4 |
   | 07 запуск и session host | slides 21–22 |
   | 08 кипер | slide 32 |
   | 09 память, 10 сны | slide 34 |
   | 11 waggle, 12 несколько машин | part 6 |
   | 14 где мы | part 7 |
   | 15 словарь | the terms |

3. **Names on slides:** [naming.md](https://github.com/relux-works/wiki/blob/main/naming.md) (apiary, yard, keeper, hive, queen, comb, bee, wild bees, nuc, with their technical terms; the mapping approved 2026-09-25) and [glossary.ru.md](https://github.com/relux-works/wiki/blob/main/glossary.ru.md). The Russian [naming.ru.md](https://github.com/relux-works/wiki/blob/main/naming.ru.md) was re-translated from that mapping on 2026-09-29 (wiki 447cb2c).
4. **What is decided and in which order:**
   - decisions: [decisions.md](https://github.com/relux-works/wiki/blob/main/decisions.md), sections by date, the newest 2026-09-28 and 2026-09-29;
   - roadmap: [roadmap/ecosystem-roadmap.ru.md](https://github.com/relux-works/wiki/blob/main/roadmap/ecosystem-roadmap.ru.md);
   - open questions: [open-questions.md](https://github.com/relux-works/wiki/blob/main/open-questions.md).
5. **The earlier ecosystem post,** epoch by epoch, predating the Keeper and playbook decisions: [posts/2026-09-24-agent-ecosystem.ru.md](https://github.com/relux-works/wiki/blob/main/posts/2026-09-24-agent-ecosystem.ru.md).
6. **The swarm over one environment,** the foundation for part 6: apiary-docs, the whitepaper «Разработка ПО роем автономных агентов над единой средой исполнения» and the engineering guide «Рой над единой средой». PDFs in [release v3.2.0](https://github.com/relux-works/apiary-docs/releases/tag/v3.2.0): `apiary-paper-v3.2.0.pdf`, `apiary-engineering-guide-v3.2.0.pdf`. It dates from 2026-09-07, before the Keeper, playbook, trust and waggle v5 decisions; where it conflicts with the specs below, the specs win. The operator plans to update it.
7. **Call digests behind the talk:** [call-digest-2026-09-24.md](https://github.com/relux-works/wiki/blob/main/research/call-digest-2026-09-24.md), [call-digest-2026-09-keeper-concept.md](https://github.com/relux-works/wiki/blob/main/research/call-digest-2026-09-keeper-concept.md), [call-digest-2026-09-28.md](https://github.com/relux-works/wiki/blob/main/research/call-digest-2026-09-28.md). Memory and dreams: [memory-resolution-ladder.md](https://github.com/relux-works/wiki/blob/main/research/memory-resolution-ladder.md).

## Sources by part

All specs are drafts unless stated.

### Part 2 — the board and autonomy

skill-project-management (task-board): [README](https://github.com/relux-works/skill-project-management/blob/main/README.md), [SKILL.md](https://github.com/relux-works/skill-project-management/blob/main/SKILL.md), [SPEC.md](https://github.com/relux-works/skill-project-management/blob/main/SPEC.md); spawns, goals, Story worktrees: [references/tracked-background-spawn.md](https://github.com/relux-works/skill-project-management/blob/main/references/tracked-background-spawn.md); goal runtimes: [docs/claude-goal-runtime.md](https://github.com/relux-works/skill-project-management/blob/main/docs/claude-goal-runtime.md), [docs/codex-goal-runtime.md](https://github.com/relux-works/skill-project-management/blob/main/docs/codex-goal-runtime.md).

Demo metrics: board events in `.task-board/.activity/<ID>/events.ndjson`, runs in `.temp/spawn-runs/RUN-*/`.

### Part 3 — cross-harness

- skill-agents-management **P**, the one place launches are built (model registry, one plugin per harness, limits): [SKILL.md](https://github.com/relux-works/skill-agents-management/blob/main/SKILL.md), [docs/architecture.md](https://github.com/relux-works/skill-agents-management/blob/main/docs/architecture.md), [docs/shipped-state.md](https://github.com/relux-works/skill-agents-management/blob/main/docs/shipped-state.md).
- Routing and its four questions: [curator-model-router spec/model-routing.md](https://github.com/relux-works/curator-model-router/blob/main/spec/model-routing.md).
- Several subscriptions on one machine: [curator-network-profiles spec/network-profiles.md](https://github.com/relux-works/curator-network-profiles/blob/main/spec/network-profiles.md).
- Local engines: [curator-inference-manager spec/inference-plane.md](https://github.com/relux-works/curator-inference-manager/blob/main/spec/inference-plane.md).

### Part 4 — no vendor lock-in

- Curator **P**, v0.15.0-rc.2 (latest tag on 2026-09-29; the pack named rc.1), profiles and managed homes: [README](https://github.com/relux-works/curator/blob/main/README.md), [docs/cli.md](https://github.com/relux-works/curator/blob/main/docs/cli.md), [docs/environment-config.md](https://github.com/relux-works/curator/blob/main/docs/environment-config.md).
- The protocol, curator-spec **P**, v1.0.0-rc.13 (latest tag on 2026-09-29; the pack named rc.12): [protocol/core.md](https://github.com/relux-works/curator-spec/blob/main/protocol/core.md), [protocol/environments.md](https://github.com/relux-works/curator-spec/blob/main/protocol/environments.md).
- `curator run`, curator-agent-launcher **P**: [SPEC.md](https://github.com/relux-works/curator-agent-launcher/blob/main/SPEC.md).
- Session host, DRAFT v0.3 (goals and the doorbell across Claude, Codex, Muse, agy, Pi, Qwen): [agent-session-host spec/session-host.md](https://github.com/relux-works/agent-session-host/blob/main/spec/session-host.md).
- ax, the session manager across hosts **P**: [agent-session-manager](https://github.com/relux-works/agent-session-manager), spec **P**: [agent-session-manager-spec SPEC.md](https://github.com/relux-works/agent-session-manager-spec/blob/main/SPEC.md).

### Part 5 — the Apiary

- Process configuration, DRAFT v4.8: [curator-playbook spec/process-configuration.md](https://github.com/relux-works/curator-playbook/blob/main/spec/process-configuration.md). `Playbook.json`; `extends` §7; dreams §6.13; tools, budgets and review quality §6.11–6.16.
- Examples for slides 25–28: [curator-playbook examples](https://github.com/relux-works/curator-playbook/tree/main/examples) — dev-cycle, scrum, cafe, bug-hunt, prove2me-style, music-video.
- Keeper, DRAFT v0.5.1 (`keeper up`, KP1 terminal-only, memory §13.4): [curator-keeper spec/keeper.md](https://github.com/relux-works/curator-keeper/blob/main/spec/keeper.md).
- Trust, DRAFT v0.4 — only its principles go outward: [curator-trust spec/trust.md](https://github.com/relux-works/curator-trust/blob/main/spec/trust.md).

### Part 6 — the distributed Apiary and the swarm

- waggle **P**, DRAFT v5.2 (SSHSIG envelopes, scope leases, quorum, carriers): [spec/waggle.md](https://github.com/relux-works/waggle/blob/main/spec/waggle.md).
- apiary-docs, item 6 above.
- Older runtime design, optional: [curator-agent-runtime .spec/apiary-runtime-design.md](https://github.com/relux-works/curator-agent-runtime/blob/main/.spec/apiary-runtime-design.md).

### Part 7 — where we are

- The landing tool: [skill-delivery README](https://github.com/relux-works/skill-delivery/blob/main/README.md).
- relux-agents-infra **P** is deprecated, a residual being exited now.
- The post: relux-works/blog **P**, `posts/from-buckets-to-apiary.*.md`, still `draft: true`.

## Talks

Ivan's earlier talks on local models, public recordings, QR codes on «Роутер моделей», the iOS Crew one also on «Ссылки и контакты» (addresses from Ivan, 15.10; both pages checked on 15.10):

- «Локальные модели для кодинга», Podlodka AI Engineers club, 23.07.2026, «можно смотреть без регистрации»: https://club.podlodka.ai/share/cmv55xwm10001ru01b7pkpqaw
- «Локальные модели для разработки под iOS на Apple Silicon», Podlodka iOS Crew, recording on the Podlodka Crew YouTube channel, 14.09.2026: https://www.youtube.com/watch?v=6FFApxRm2Ok

The QR codes are generated from these URLs at build time (`slides/components/Qr.vue`, the `qrcode` package); a changed URL changes the code.

## What the Apiary is made of

| Element | Repository | State |
| --- | --- | --- |
| profiles, skills, managed homes | curator, curator-spec **P** | release candidates |
| launch construction | skill-agents-management **P**, curator-agent-launcher **P** | shipped / draft contract |
| session hosting | agent-session-host; ax: agent-session-manager **P** | draft design / foundation |
| the comb (board) and bees (runs) | skill-project-management | in use, in maintenance |
| the hive's process | curator-playbook | draft v4.8 |
| the keeper | curator-keeper | draft v0.5.1 |
| trust | curator-trust | draft v0.4 |
| routing, network, local engines | curator-model-router, curator-network-profiles, curator-inference-manager | draft design |
| orchestrators talking | waggle **P** | draft v5.2 |
| the swarm protocol | apiary-docs | paper and guide v3.2 |
| delivery | skill-delivery | new |

## Fresh facts as of 2026-09-29

- Sonnet 5.5 is the worker model, Opus 5.5 the orchestrator, Luna never the orchestrator.
- The agents-infra exit (Gate A/B) and the Muse slice are in progress.
- The process-configuration spec is at v4.8.
- The first network-communication demo is targeted for mid-October; do not promise the date.

These change weekly. Re-check them against the wiki's `decisions.md` before the review and before the talk.
