# Swarm statistics (13.10)

Ivan, 13.10: «статистику… отдельно по сообщениям, по оркестраторам, по часам, по субагентам — потом сделаем 1–2 слайда… наверное 1 слайд после первого демо и один после второго».

Numbers from `.scripts/swarm-stats.mjs`, aggregates only, in `slides/demo/stats.json`. The inputs stay private on the mini:

- the sessions database `~/private/agent-hours/sessions.sqlite`, built by `.scripts/agent-hours.mjs --db` from the mini's own sessions and ivmbp's export, streamed;
- the a2a metadata export `~/private/a2a-export/messages-0929-1012.ndjson.gz`, from tb-keeper and macmini-infra;
- the agent-hours JSON from ivmbp's keeper, for ivmbp's board runs.

**Machines:** the mini and ivmbp. m1max (Alexey) joins with one file from `.scripts/host-export.mjs` (see «Adding a machine» below).

**After the mini incident (15.10).** The mini's private inputs stay on the quarantined mini; nothing is fetched from it. The mini's part of every number below comes from the aggregates already in `slides/demo/stats.json` and `slides/demo/swarm.json`. ivmbp's sessions database was rebuilt on ivmbp on 15.10 (`agent-hours.mjs --db`, kept under `.temp/`) and matches the export the numbers were built from: 415 prompts, the same lanes and the same busy time on them.

## Two weeks: 29.09–12.10, Moscow time (the window of demo 2)

| | |
| --- | --- |
| Orchestrators with at least 1 h of work | **31**: mini 14, ivmbp 17 |
| … with at least 10 h | 21: mini 12, ivmbp 9 |
| Orchestrator sessions | 72: Claude Code 44, Codex 27, Muse 1 |
| Orchestrator hours, sum and wall clock | 1 291 h, 304 h |
| Orchestrators busy at once, per 10 minutes | peak **26** (08.10, 15:40), median 5 |
| Subagent sessions | **6 291**: Codex 3 087, Muse 2 451, Claude Code 753 |
| Subagent hours, sum and wall clock | 1 443 h, 293 h |
| Subagents busy at once | peak 36 (04.10, 06:00), median 6 |
| Task-board runs | **2 213**: mini 871, ivmbp 1 342 |
| Mini runs by role | implementer 401, reviewer 276, analyst 194 |
| Mini runs by runtime | Codex 483, Muse 264, Claude Code 124 |
| Agent hours in all | **2 734 h** |
| People's time writing into orchestrators | **67.8–69.0 h**, on the slide 68 h, about 40 times less than the agents: ivmbp 36.2 h, the mini 39.0–40.2 h, one timeline |
| A person wrote into an orchestrator | **882 times**, about 63 a day: mini 467, ivmbp 415 |
| … longest stretch with no person | **16 h** (from 02.10, 19:51), then 13.8 h and 12.8 h |
| a2a messages | **at least 4 858**, from 72 agents: Ivan's side 51, Alexey's 21 |
| … by side | Ivan's agents 3 745, Alexey's 1 113 |
| … addressed across the sides | **1 050**: 529 from Ivan's side, 521 from Alexey's |
| … by kind | notice 1 337, ack 740, answer 726, system 618, request 511, decision 453, question 163, owner-needed 32 |
| … per day | 347 on average; busiest 12.10 with 770 |
| Commits on main, relux-works, mini and ivmbp deduplicated | 2 640–2 675 (13.10, agent-hours) |

## Since July: 01.07–12.10, Moscow time

| | |
| --- | --- |
| Orchestrators with at least 1 h | 69: mini 17, ivmbp 52 |
| Orchestrator sessions | 972 |
| Orchestrator hours, sum and wall clock | 3 665 h, 1 385 h |
| Subagent sessions | 18 042 |
| Subagent hours, sum and wall clock | 4 646 h, 1 281 h |
| Task-board runs | 7 455: mini 1 263, ivmbp 6 192 |
| Orchestrators busy at once | peak 26 (08.10), the same moment as in the two weeks |

## Definitions and limits

- **Orchestrator.** An interactive session:
  - Claude Code with an entrypoint other than sdk-*;
  - Codex with any source but exec and subagent threads, tb-sessiond's codex-tui included;
  - Muse that ran in a terminal and took two or more prompts. A terminal Muse session with one prompt is a one-task run in a pane and counts as a subagent (13.10: on the mini every terminal Muse session in October had one prompt).
- **A person wrote.** A user entry in an orchestrator session that opens in Russian, or an interrupt. Left out as automatic:
  - injected blocks (tags, Markdown headings: goal and instruction blocks);
  - tb-sessiond's auto-continue nudge «Continue unless you are blocked…»;
  - English relays and machine notices, such as a role's launch prompt, «Relaunched by macmini-infra», «The Mac mini was rebooted… restored», «Login refreshed», task-board run notices and probes;
  - on the mini, anything tb-sessiond delivered to a session it hosts up to 10 s before (its sessiond.log: goal activations, goal binds, notices). ivmbp's export has no tb-sessiond logs, so there the text rules alone apply.
- **People's hours** (Alexey's review and Ivan, 15.10: «10-минутки»). The 10-minute buckets in which a person wrote into an orchestrator (the prompts above), times 10 minutes. One person's machines share one timeline: a bucket with prompts on two of them counts once; different people add up. `.scripts/people-hours.mjs` computes it from the sessions database; for the mini it takes demo 2's data, where 453 of the mini's 467 prompts are exact to the second and the other 14 are known to their half hour, hence the range. It is a floor: reading, review, Matrix and calls are not in it, and a person's English prompts are not counted. Today it is Ivan's two machines only.
- **Subagent.** A headless session, a subagent transcript or a subagent thread. The board's runs are counted separately, with exact start and end.
- **Orchestrator count.** Orchestrators are counted as lanes, a project directory on a machine. Sessions of one orchestrator count once, over time and at the same moment.
- **Busy time.** Events closer than 15 minutes form a busy stretch. Sum adds sessions up; wall clock is their union.
- **Messages.**
  - This is a lower bound: `a2a read` stops at 1 000 per topic, so two threads are cut in the window. «#macmini-infra › requests» has data only from 03.10, and «#skill-project-management › orchestrator-channel» only from 09.10.
  - Rooms neither exporter is in are missing, and #ivan-alexey-legal is excluded.
  - #system is left out because it mirrors other rooms.
  - Alexey's side means agents named m1max_…; every other agent counts as Ivan's side.
- **Not counted.** ivmbp's runs carry no caller, so in demo 2 only the mini's runs sit on their orchestrator's lane.

## Adding a machine (m1max)

On that machine, in a clone of this repository at the current main (`git pull && npm ci`):

```bash
npm run host-export -- --host m1max
```

It builds the machine's private sessions database (`.temp/host-export/m1max.sqlite`, never sent), runs `swarm-stats.mjs` and `demo-swarm.mjs` on it, and writes `.temp/host-export/m1max-export.json`: the two weeks' aggregates, demo 2's anonymous lanes, the busy counts per 10 minutes, the board runs' start times and the times a person wrote into an orchestrator. No project names, paths, session ids, prompts or message text; the script refuses to write a file that contains the home directory or a transcript path. It prints the file's sha256; send the file and the hash to Ivan (not over a2a while Matrix is down).

On Ivan's side, after checking the hash:

```bash
node .scripts/merge-host.mjs --export m1max-export.json --person alexey --people-db .temp/human-hours/ivmbp.sqlite
npm run verify
```

`merge-host.mjs` adds the machine to `twoWeeks` in `stats.json` and to `swarm.json`: lanes, sums, runs and prompts add up; the peaks and medians of busy orchestrators and subagents are recounted from the merged 10-minute series; people's hours add the new person's own buckets; the longest stretch with no person is recounted if the new prompts fall inside it (`--people-db` is needed only then). Wall-clock hours cannot be rebuilt from sums and stay those of the old machines (`wallHosts`). Demo 2 then labels the people row «люди». Tested on 15.10 with ivmbp's own export relabelled as m1max: 30 lanes on three machines, the longest stretch recounted to 13.8 h when a prompt was put inside the 16 h one.

