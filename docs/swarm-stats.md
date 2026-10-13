# Swarm statistics (13.10)

Ivan, 13.10: «статистику… отдельно по сообщениям, по оркестраторам, по часам, по субагентам — потом сделаем 1–2 слайда… наверное 1 слайд после первого демо и один после второго».

Numbers from `.scripts/swarm-stats.mjs`, aggregates only, in `slides/demo/stats.json`. The inputs stay private on the mini:

- the sessions database `~/private/agent-hours/sessions.sqlite`, built by `.scripts/agent-hours.mjs --db` from the mini's own sessions and ivmbp's export, streamed;
- the a2a metadata export `~/private/a2a-export/messages-0929-1012.ndjson.gz`, from tb-keeper and macmini-infra;
- the agent-hours JSON from ivmbp's keeper, for ivmbp's board runs.

**Machines:** the mini and ivmbp. m1max (Alexey) joins when his keeper sends its numbers: requested 13.10 with the updated script.

## Two weeks: 29.09–12.10, Moscow time (the window of demo 2)

| | |
| --- | --- |
| Orchestrators with at least 1 h of work | **49**: mini 32, ivmbp 17 |
| … with at least 10 h | 21: mini 12, ivmbp 9 |
| Orchestrator sessions | 287: Claude Code 44, Codex 27, Muse 216 |
| Orchestrator hours, sum and wall clock | 1 345 h, 305 h |
| Orchestrators busy at once, per 10 minutes | peak **27** (08.10, 15:40), median 6 |
| Subagent sessions | **6 076**: Codex 3 087, Muse 2 236, Claude Code 753 |
| Subagent hours, sum and wall clock | 1 388 h, 290 h |
| Subagents busy at once | peak 36 (04.10, 06:00), median 6 |
| Task-board runs | **2 213**: mini 871, ivmbp 1 342 |
| Mini runs by role | implementer 401, reviewer 276, analyst 194 |
| Mini runs by runtime | Codex 483, Muse 264, Claude Code 124 |
| Agent hours in all | **2 733 h**, against two people |
| a2a messages | **at least 4 858**, from 72 agents: Ivan's side 51, Alexey's 21 |
| … by side | Ivan's agents 3 745, Alexey's 1 113 |
| … addressed across the sides | **1 050**: 529 from Ivan's side, 521 from Alexey's |
| … by kind | notice 1 337, ack 740, answer 726, system 618, request 511, decision 453, question 163, owner-needed 32 |
| … per day | 347 on average; busiest 12.10 with 770 |
| Commits on main, relux-works, mini and ivmbp deduplicated | 2 640–2 675 (13.10, agent-hours) |

## Since July: 01.07–12.10, Moscow time

| | |
| --- | --- |
| Orchestrators with at least 1 h | 87: mini 35, ivmbp 52 |
| Orchestrator sessions | 3 024: Claude Code 196, Codex 758, Muse 2 070 |
| Orchestrator hours, sum and wall clock | 4 410 h, 1 453 h |
| Subagent sessions | 15 990: Codex 8 544, Muse 4 201, Claude Code 3 245 |
| Subagent hours, sum and wall clock | 3 900 h, 1 208 h |
| Task-board runs | 7 455: mini 1 263, ivmbp 6 192 |

The since-July peaks are not usable as they stand. The orchestrator peak shows 132 busy at once on 11.08, which looks like a burst of short automated sessions. Check it before any slide uses it.

## Definitions and limits

- **Orchestrator.** An interactive session:
  - Claude Code with an entrypoint other than sdk-*;
  - Codex with any source but exec and subagent threads, tb-sessiond's codex-tui included;
  - Muse that ran in a terminal.
- **Subagent.** A headless session, a subagent transcript or a subagent thread. The board's runs are counted separately, with exact start and end.
- **Orchestrator count.** Orchestrators are counted as lanes, a project directory on a machine. Sessions of one orchestrator over time count once.
- **Busy time.** Events closer than 15 minutes form a busy stretch. Sum adds sessions up; wall clock is their union.
- **Messages.**
  - This is a lower bound: `a2a read` stops at 1 000 per topic, so two threads are cut in the window. «#macmini-infra › requests» has data only from 03.10, and «#skill-project-management › orchestrator-channel» only from 09.10.
  - Rooms neither exporter is in are missing, and #ivan-alexey-legal is excluded.
  - #system is left out because it mirrors other rooms.
  - Alexey's side means agents named m1max_…; every other agent counts as Ivan's side.
- **Not counted.** ivmbp's runs carry no caller, so in demo 2 only the mini's runs sit on their orchestrator's lane.
