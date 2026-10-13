# In-slide demos

Since 13.10 (Ivan): the demos run inside the deck, not in a separate window. «Один раз старт и далее в автономном режиме почти полностью, максимум несколько кликов с нашей стороны, чтобы сделать пояснения или отмотать назад частично». One press starts a demo; it then plays by itself to the end. Either speaker can pause it to explain, resume it, or rewind it by a beat.

Prototypes live in `slides/demos.md` (`npm run demos`) until the speakers approve them; then each moves onto its demo slide in the deck. Demo 1 is a prototype (13.10); demo 2 is not built yet.

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
- **Time.** A replay clock shows the real date and time at the top right. Quiet stretches without events are squeezed and marked «пропуск N ч без событий»; days are dashed lines on the time axis.
- **Story.** Four or five beats. Each changes the caption by itself, and every number in a caption is computed from the data. The last beat dims everything except its point.
- **Length.** About 70 s from one press: an intro of 3.5 s, 56 s of replay and 9 s on the last beat. That leaves the speaker time to talk over it inside a 3-minute slot.
- **Honesty.** A script builds the data from logs. Ids are anonymous; there are no names and no message text. A claim the data does not show stays off the demo.

## Demo 1: «Разработка по логам»

`slides/components/DemoRun.vue`, with data from `.scripts/demo-run.mjs`, which reads one epic of a task board into `slides/demo/run.json`.

- **Board.** Columns for the phases: queue, analysis, development, review, integration, done. Each task is a square that moves between columns as its status changed. White with a purple ring means a subagent is working on it now. An orange flash means review sent it back. Lime means done.
- **Lanes.** The human's messages to the orchestrator, the orchestrator's own wake-ups, and the runs by role (analyst, implementer, reviewer). Each bar is a run; its colour is the model. Counters sit at the right end of each lane.
- **Beats.**
  1. The epic and its size.
  2. The orchestrator hands out tasks.
  3. Review returns tasks.
  4. Runs go in parallel, by day and by night.
  5. How often the human wrote, against how often the orchestrator woke up by itself.
- **Prototype data** (13.10): an epic of the task board itself, from the mini's infra-exit worktree, 8–11.10. It has 36 tasks, 84 runs, 22 returns from review, 4 models, 33 messages from the human and 930 wake-ups of the orchestrator; 2 tasks reached done.
  - The notes' line «человек появляется только в начале и в конце» does not hold for this run.
  - Alexey's tetris run may fit it better. Swap the data with one run of the script when it is available.

## Demo 2: «Оркестраторы в Matrix» (to build)

Planned in the same style. Three machines as frames, with orchestrators as points inside. Messages fly as comets: lilac for requests and answers, lime for decisions, orange for questions to a human, which wait in a queue at the person. Subagent spawns show as sparks. A three-week timeline with days and nights runs along the bottom.

Data needed:

- a full export of the a2a rooms (`a2a archive all`) from an agent that is in every room;
- the run ledgers of all three machines.

## Review

- **CI.** The Build workflow renders `slides/demos.md`:
  - the `demo-frames` artifact holds frames at fixed moments, a contact sheet and `demo.webm`, the autoplay from one press;
  - `slides-audit/audit-demos` holds the static audit.
- **Locally.** `npm run demos`, or `npm run present` for the shared clicker.
