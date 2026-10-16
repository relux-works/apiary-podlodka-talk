# Demo 1 datasets

Datasets for demo 1 «Разработка по логам» (`slides/components/DemoRun.vue`). The demo plays `slides/demo/run.json`. To put a dataset on stage, copy it there:

```bash
cp slides/demo/demo-1/tetris.json slides/demo/run.json
```

Every file here is built by `.scripts/demo-run.mjs`: anonymous task ids, status changes, runs, and the times the person wrote and the orchestrator woke up. No names, no paths, no message text.

| File | Board and orchestrator | Tasks | Runs | Review returns | Done | Person wrote | Orchestrator woke |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `infra-exit.json` | skill-project-management, epic in the infra-exit worktree on the mini, 8–11.10, orchestrator orch-infra-exit (Ivan, 13.10) | 36 | 84 | 22 | 2 | 33 | 930 |
| `infra-exit-smoothed.json` | the same epic with a synthetic ending (`.scripts/demo-smooth.mjs`, Alexey 16.10): every open task reaches done, evenly over the run; plays on slide 29 | 36 | 84 | 22 | 36 | 33 | 930 |
| `tetris.json` | tetris (Alexey's m1max), epics foundation, backend and web-client, 11–13.09, one Claude Code orchestrator | 20 | 82 | 8 | 20 | 7 | 64 |

## infra-exit.json

This is the dataset on stage from 13.10 to 16.10, as it was on main. It was built before the status fix below, so 26 of its tasks stop in review or integration. Its inputs are on the quarantined mini, so it cannot be rebuilt here.

## tetris.json

Built on m1max on 16.10:

```bash
node .scripts/demo-run.mjs --repo ~/src/tetris \
  --epic EPIC-260911-3pyx8s,EPIC-260911-29crov,EPIC-260911-3ngjz9 \
  --session ~/src/agent-sessions-backup/data/anthropic/claude-code/projects/-Users-alexis-src-tetris/840ae5a3-0186-44f8-8519-652dadf48ca3.jsonl \
  --skip-human "$(cat slides/demo/demo-1/tetris-skip-human.txt)" \
  --out slides/demo/demo-1/tetris.json
```

- The orchestrator session comes from the agent-sessions backup. Claude Code had already deleted its own copy.
- The fourth epic, board-infra-tooling, has no runs.
- **Person wrote = 7: only the messages that refine the tetris spec** (Alexey, 16.10). These are the critical path and concurrent development, `make` as the entry point, e2e scripts in `.scripts`, e2e as acceptance, an e2e with two parallel sessions, start instructions in the README, and a description of the Makefile.
- The other 30 messages in the window are listed by transcript timestamp in `tetris-skip-human.txt` and left out. They cover the task-board skill's goal and worktree bugs, status questions, estimates, the git remote, agents-infra, and a Claude Code Remote Control error.

## Script fixes made for tetris (16.10)

- `worktree.integrate` moves a task from integrating to done with an `aggregation` event. The script used to read only `progress` events, so every landed task stayed in integration.
- Boards of 09.2026 wake the orchestrator with a plain `task-board run RUN-…` notice. These now count as wakes, not as the person.
- `--epic` takes several epics, and `--skip-human` drops the person's entries at given timestamps.
- `DemoRun.vue` keeps one day mark where a squeezed quiet stretch puts several midnights on one spot.
