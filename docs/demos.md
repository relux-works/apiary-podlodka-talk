# In-slide demos

Since 13.10 (Ivan): the demos run inside the deck, not in a separate window. «Один раз старт и далее в автономном режиме почти полностью, максимум несколько кликов с нашей стороны, чтобы сделать пояснения или отмотать назад частично». One press starts a demo; it then plays by itself to the end. Either speaker can pause it to explain, resume it, or rewind it by a beat.

Prototypes live in `slides/demos.md` (`npm run demos`) until the speakers approve them; then each moves onto its demo slide in the deck. Demo 1 is on its slide since 13.10 (Ivan: «берем как вариант визуализации точно»); demo 2 is a prototype in `slides/demos.md`.

## Controls

On the demo's slide, in any window (the shared screen or either presenter window), with the keyboard or a clicker's two buttons:

| Key | Before the start | While it plays or is paused | After the end |
| --- | --- | --- | --- |
| → · Space · PageDown | start | pause, or resume | next slide |
| ← · PageUp | previous slide | back to the start of the current beat; within its first 2 s, of the previous beat | back into the last beat |
| R | start | restart | restart |

The state sits in the deck's dev server (`server-reactive:demo`, `slides/vite.config.ts`), next to Slidev's own position, so every window shows the same moment. A window counts from the moment it learned of a command, not from the sender's clock, so two laptops whose clocks differ still agree. The static build and the PDF have no server and show the last frame. `?demo-t=<ms>` before the hash holds the demo at one moment, for renders and review.

## Shared style (13.10, for the speakers to approve)

- **Canvas.** The black `demo` layout with `live: true`: the label «Демо N» and the title on one line, the visualisation below it across the full width, 908 × 414. Of the layout's squares only the orange corner one stays.
- **Colours keep the deck's meaning.**
  - Lime: done or a success.
  - Orange: a problem, such as a review that sent the work back, a blocked task or a cancelled run.
  - Purple: orchestration and agents at work.
  - Lilac: the replay clock and the playhead.
  - Grey: waiting.
  - Model colours, when a demo needs them: lilac, purple, light grey, white.
- **Type.** The caption is one line of Inter at 18 px; labels are JetBrains Mono at 13 px, with column heads in capitals. Numbers are white, words secondary grey.
- **Time.** A replay clock shows the real date and time at the top right, in Moscow time on every machine. Quiet stretches without events are squeezed and marked «пропуск N ч без событий»; days are dashed lines on the time axis.
- **Story.** Four or five beats. Each changes the caption by itself, and every number in a caption is computed from the data. The last beat dims everything except its point.
- **Length.** About 70 s from one press: an intro of 3.5 s, 56 s of replay and 9 s on the last beat. That leaves the speaker time to talk over it inside a 3-minute slot. Demo 1 with `finish` adds a 4.5 s finale before the last beat, about 73 s in all.
- **Honesty.** A script builds the data from logs. Ids are anonymous; there are no names and no message text. A claim the data does not show stays off the demo.
  - One exception (Ivan, 16.10: «давай просто синтетически доведем слайд что все задачи дошли до готовности»): demo 1's `finish` finale on the infra-exit run moves every task that is not done when the log ends into done. It is not in the logs. The slide's notes say so; the speakers do not say it aloud (Ivan, 16.10).

## Demo 1: «Разработка по логам»

`slides/components/DemoRun.vue`, with data from `.scripts/demo-run.mjs`, which reads one epic of a task board into `slides/demo/run.json`. Since 16.10 demo 1 is two runs in a row (Ivan: «сделай обе версии последовательно»): slide 28 plays `run.json` (the tetris), slide 29 plays `<DemoRun run="infra-exit" finish />`. Each run has its own clock, so → on slide 29 starts that run from the beginning.

- **Board.** Columns for the phases: queue, analysis, development, review, integration, done. Each task is a square that moves between columns as its status changed. White with a purple ring means a subagent is working on it now. An orange flash means review sent it back. Lime means done.
- **Lanes.** The human's messages to the orchestrator, the orchestrator's own wake-ups, and the runs by role (analyst, implementer, reviewer). Each bar is a run; its colour is the model. Counters sit at the right end of each lane.
- **Beats.**
  1. The epic and its size.
  2. The orchestrator hands out tasks.
  3. Review returns tasks.
  4. Runs go in parallel, by day and by night.
  5. With `finish`: every task reaches done (synthetic, see «Honesty»).
  6. How often the human wrote, against how often the orchestrator woke up by itself.
- **Data** (16.10): Alexey's tetris board on m1max, epics foundation, backend and web-client, 11–13.09, one Claude Code orchestrator. 20 tasks, 82 runs, 8 review returns, all 20 reach done; the orchestrator woke by itself 64 times; the person wrote 37 times: 7 messages refine the tetris spec, 30 are about other things. All 37 are the person's, so all count (Ivan, 16.10: honest numbers on screen whenever a person wrote them); the board's `task-board run` notices are system messages and count as wakes.
  - Both datasets, tetris and Ivan's earlier infra-exit epic (36 tasks, 2 done by the log), are in `slides/demo/demo-1/` with their provenance in its README. `slides/demo/run.json` plays on slide 28; `infra-exit.json` plays on slide 29 with the synthetic finale.

## Demo 2: the swarm at scale (prototype, 13.10)

`slides/components/DemoSwarm.vue`, data from `.scripts/demo-swarm.mjs` over the private sessions database of `.scripts/agent-hours.mjs --db` and the a2a metadata export (anonymous lanes into `slides/demo/swarm.json`). Ivan, 13.10: «показать работу нашего роя… где больше 20 оркестраторов… в похожем стиле, но так, чтобы был понятен масштаб»; then: contrasting vendor colours, no near-empty orchestrators, the orchestrator and its subagents apart, and «не понятно в какие моменты было вмешательство человека».

- **Lanes.** One per orchestrator with at least 10 h of work in the window, grouped in a frame per machine («12 из 14»). The top track is the orchestrator itself, the bottom track its subagents. Subagents are the board runs it launched, found through the run's caller session, and worker sessions in its project. The colour is the vendor. A lime mark at the playhead means busy now; a thin lime pin is a moment a person wrote to that orchestrator, and the pins stay as the history.
- **People and Matrix.** Rows for the person (Ivan; Alexey with m1max's data), Ivan's agents, the messages between the sides, and Alexey's agents. Messages are counted per 30 minutes by kind: work grey, decisions lime, questions orange.
- **River.** Distinct orchestrators (purple) and subagent sessions (lilac) busy in each 10-minute slot; the peak is marked.
- **Beats.**
  1. The swarm's size.
  2. What a lane is.
  3. The peak.
  4. Ivan's and Alexey's agents writing to each other.
  5. The person's pins and the longest stretch without one.
  6. Two people against the agents' hours.
- **Prototype data** (29.09–12.10, mini and ivmbp): 31 orchestrators with at least an hour, 21 lanes, peak 26 at once. Subagent sessions reach 36 at once, with 2 213 board runs. A person wrote 882 times, and the longest stretch without one is 16 h. Messages: at least 4 858 from 72 agents, 1 050 of them across the sides. Numbers and definitions: `docs/swarm-stats.md`.

## Demo 2: «Оркестраторы в Matrix» (earlier plan)

Planned in the same style. Three machines as frames, with orchestrators as points inside. Messages fly as comets: lilac for requests and answers, lime for decisions, orange for questions to a human, which wait in a queue at the person. Subagent spawns show as sparks. A three-week timeline with days and nights runs along the bottom.

Data needed:

- a full export of the a2a rooms (`a2a archive all`) from an agent that is in every room;
- the run ledgers of all three machines.

## Review

- **CI.** The Build workflow renders `slides/demos.md`:
  - the `demo-frames` artifact holds frames at fixed moments, a contact sheet and `demo.webm`, the autoplay from one press;
  - `slides-audit/audit-demos` holds the static audit.
- **Locally.** `npm run demos`, or `npm run present` for the shared clicker.
