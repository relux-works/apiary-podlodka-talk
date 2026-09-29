# Deck v4 brief: after the first run with the Podlodka hosts (2026-09-29)

For the session "apiary-podlodka", from tb-keeper.

## Sources

Two recorded conversations of 2026-09-29:
- the speakers' own review of the v2/v3 deck, Ivan and Alexey, before the run;
- the first run with the two Podlodka hosts, including the hosts' feedback.

The hosts will also send written notes via Telegram; integrate them when the operator forwards them.

Save this brief as `plan/deck-v4-brief.md`, fill the «Итоги» of `meetings/2026-09-29-podlodka.md` from sections 1 and 2, and rewrite `plan/slides-plan.ru.md` to the new structure; the plan is yours to rewrite. Slide titles below are those of main at 54b3169.

## 1. Global decisions

1. **Length.**
   - About 45 minutes, hard ceiling 50: opening 2–3 min together, Alexey about 20 min, Ivan about 20 min, recap 1–2 min.
   - Questions only at the end. There is no seam question slide.
   - The run showed that Alexey's part took ~30 min unedited and must shrink by about a third; Ivan's part was a 6-minute speedrun and needs a real 20.
2. **Construct over mechanics.** Explain what we built and why. Cut implementation details: session-park internals, entry points, FIDO and cryptography details, dreams.
3. **Every chapter runs problem → solution.** Open each chapter with the problem slide, then the construct, then the demo or example. Make the transition between the two explicit; the reviewers lost the thread where a problem slide and a construct slide were mixed.
4. **Opening (hosts' feedback, the top priority).**
   - Who we are and why we tell this. We work in big tech and see enterprise coordination pain: parallel teams, hanging merge requests, old processes. We also build our own projects with little time.
   - What the listener gets, within the first 2–3 minutes: the problem, what we will show, and what they leave with, which is how to build orchestration above any agent harness, plus the links we will open.
   - An agenda slide with the chapters.
   - Early, show that the system is generic, not enterprise-only: a cafe, a family calendar, a court case, a dog-training project. Each one is "express your own workflow".
5. **Closing.** A recap slide with the conclusions, before «Где мы» and the links.
6. **Speaker split is explicit.** Put the speaker on each chapter opener and in the notes. No overlaps and no interruptions.
   - Alexey: epochs, the board and autonomy, cross-harness with routing, communication on one machine.
   - Ivan: the context manager (proposal below), processes as configuration, the root orchestrator, cross-machine messaging, the swarm and its security, the future.
7. **Branding.**
   - The title slide carries three logos: RWB, MTS and Relux Works. All other slides are neutral, with no corporate logos.
   - Keep the purple and black palette (Podlodka Crew's style).
   - Open, for the hosts: how multi-company talks handle corporate style.
8. **Title.** «От чат-ботов к пасеке» is under review. Keep it as a placeholder and put 3 alternative titles in the notes for the speakers to choose from.
9. **Terminology.**
   - Slides use technical terms: главный оркестратор, суборкестраторы, воркеры, задачи, проекты, недоверенные внешние агенты.
   - Remove the beekeeping names (пасека, точка, улей, матка, соты, пчела, дикие пчёлы) from slide bodies. The Apiary brand may appear at most in the title and the closing; the speakers decide.
10. **Text.**
    - No "Claude-speak" colon titles: «Цели: у каждого агента своя» → «У каждого агента своя цель».
    - Rewrite every title as a plain statement.
    - Clean the bottom takeaway bubbles: each one says something true and useful, or it goes.
    - No text walls. Nobody reads them, and the speaker will not read them aloud.
11. **No status pills on slides.** Remove `<Status>` from slide bodies; the speakers found them everywhere and distracting. Keep claim status honest in the speaker notes. Mark a whole vision chapter once, in its opener.
12. **Diagrams.** Replace architecture diagrams with simple visuals or click animations (a few boxes, big words), or drop them. Keep only graphics that carry the point, such as orchestrators on one machine talking, or two machines.
13. **Runs are presented from the browser**, with animations (a hosted `npm run dev` or static build), not from the PDF.

## 2. Hosts' feedback, verbatim intent

- There is no introduction to the problem, and no "who we are and why".
- There is no statement of what the listener gets in the first minutes.
- Add an agenda: the many slides make people lose track.
- Add a recap at the end.
- Divide the parts cleanly between the speakers.
- Show early that the system is not enterprise-only, or people switch off after 10 minutes.

## 3. Chapter by chapter

### Part 1. Эпохи (Alexey, 4–5 min)
- Keep the content ("всё правильно написано"); run it at about 30 s per slide.
- **Introduce roles early**, at «Эпоха 4: пробки» or «Эпоха 5»: one agent and one model for everything leads to splitting the work into roles (producer, reviewer, and so on). Later slides assume roles are known.

### Part 2. Доска и автономия (Alexey)
- «task-board: доска как граф задач»: keep the DAG, dependency escalation, the critical path, waves and phases.
- «Цикл продюсер → ревьюер»: keep. Each stage has its roles, with meta-profiles and skills.
- «Change Request и приземление»: drop the unclear line «набор проверок задаёт проект, без него интеграция отказывает». Keep the flow: a worktree per piece of work, then Change Request, review, CI and landing.
- «Цели: у каждого агента своя» → «У каждого агента своя цель».
- «Автономия на практике», reframed:
  - the human moves to the start (vision, spec, decomposition) and to the end;
  - no more interrupted attention (approving, waiting, switching);
  - cumulative agent-hours: ~440 h on one project in a month, or N h over 4 months for two people, and "try that without an orchestrator";
  - why not 720 h: key decisions stay with people;
  - weeks of autonomous work.
  Keep the numbers sourced in the notes.
- «Разработка по логам» (demo 1): keep the slot. The demo is a JS visualization of a real project run from its spec, showing:
  - decomposition into epics, stories and tasks;
  - the DAG and the critical path;
  - parallel and sequential phases;
  - which roles were spawned;
  - producer↔reviewer iterations per task (median and maximum);
  - wall-clock time.
  Building the visualization is a separate deliverable. Propose a project and a data plan: the board's `.activity` streams and the run ledgers.
- «Эксплуатация: что ломается» and «Рестарт хоста: сегодня и в спеке» become ONE slide, «Мы переживаем падения»:
  - sessions restart, CLIs crash, hosts reboot;
  - the board is the single source of truth, so the orchestrator restarts and continues where it stopped;
  - only the session summary does not carry over yet (in development; say it, do not print it).
  Move the session-control angle to part 3.

### Parts 3 and 4 merge: «Без привязки к вендору» (Alexey)
The speakers agreed that cross-harness and no lock-in are the same chapter.
- **Problem opener: «Четыре привязки к вендору»** (context, launch, session, model), animated: first bound, then unbound on click. Add the problem "one model for everything": expensive tokens on easy tasks, a weak model on hard ones. Take this from «Токены по цене дорогой модели», which stops being its own slide.
- «Один оркестратор, любые среды»: the construct is one more layer of abstraction.
  - unified protocols for sessions, choosing environment and model, spawning workers and reviewers;
  - the orchestrator can be Claude, Codex, Muse or a local model.
- **Security review as problem → solution → demo 2**; fix the logical link between the slides.
  - «Секьюрити-ревью в три вкладки»: the human carries buckets between three tabs.
  - «Секьюрити-ревью одной командой»: dependent tasks on one board:
    - a local uncensored model does the primary review first. This is the trick: Claude refuses a security review when it has none before it;
    - then Claude and Codex review concurrently;
    - then the results merge (map-reduce);
    - the human only decides.
- **Routing, NEW emphasis, 1–2 slides.** This is a real industry pain.
  - A dynamic, runtime-configurable spawn policy: budgets, subscriptions and their limits, local-model windows (overnight), free promo weeks of new models.
  - Two audiences: corporations, where Opus for everything does not scale, and individuals, whose subscriptions shrink.
  - "Why not the built-in orchestrator of Claude or Codex?" Because it is vendor lock-in.
  - Add a QR code or link to Ivan's Podlodka iOS Crew talk on local models.
- «Модели меняются каждую неделю»: keep. There are plugins per harness, model and vendor.
- Session control («Звонок в живую сессию» and the old restart slide): at most one simple slide. We control live sessions: inject messages, manage goals, hand over between Claude and Codex, fix Codex's problems. The development status goes in the speech. Otherwise drop it.
- «Одна точка сборки запуска»: keep.
- «Два входа: curator и task-board»: REMOVE.
- «Нам не нужна своя агентская среда» becomes the explicit SUMMARY of Alexey's part («Итог первой части»): abstraction everywhere.

### NEW: communication on one machine (Alexey, end of his part)
- **Problem.** A real project is several repositories and modules: mobile, frontend, backend, CI. One orchestrator per repository means the human again coordinates orchestrators; at this level the system is single-threaded again.
- **Solution.** Orchestrators talk to each other, harness-neutral, first on one machine. A simple graphic: one machine, several orchestrators exchanging messages. Ivan later takes this across the internet.
- **Optional live illustration:** Alexey already has orchestrators talking over Matrix (rooms, pub/sub, events pushed into sessions). Ask Alexey.

### NEW section: «Менеджер агентского контекста» (proposal: it opens Ivan's part)
Built from «Curator: контекст на агента», «Скилл с командой», «Установка — это цепочка проверок» and «Кому мы доверяем», compressed to 2–3 slides. The profiles and skills built here are the blocks roles are made of, so it bridges naturally into processes. The speakers confirm the placement.
- **Problem.** Contexts (root instructions, skills, MCP) are global to the machine or local to a project, which is chaos. Skills are programs for LLMs, and today that is the wild west: prompt injections, bundled scripts.
- **Solution.**
  - A profile is the new unit: instructions, skills, MCP and tools. Claude or Codex launches with a profile, and subagents launch with their role's profile.
  - Package-manager semantics: dependency resolution, a security audit (static plus LLM), a registry of audited skills, a lockfile with hashes, reproducibility.
  - Nothing is broken, because everything sits on existing standards.

### Part 5. Processes as configuration (Ivan)
- **Make the abstraction obvious.** "We took the development flow you just saw (roles, stages, producer/reviewer, checks) and extracted it into configuration." Then:
  - roles are skills;
  - composition: a base process plus the project's differences, for example iOS adds a QA phase;
  - validation that the flow graph is complete and executable.
- Rewrite the empty titles, for example «Проект пишет только отличия» → «Команда расширяет готовый процесс».
- «Та же машинка ведёт кафе» becomes **demo 3**: the same machinery with a swapped flow. A procurement agent, a manager agent and the cafe's CRM through a CLI tool. Show the flow swap.
- REMOVE, or move to backup: «Клип за 19 часов как плейбук», «Длинные промпты уже несут процесс», «Ревью кадров ловит пропуски проверок», «Сны», «Имена: пасека, точка, улей».
- **Root orchestrator**, replacing «Кипер: главный цикл точки» and «keeper: вход человека на пасеку».
  - Use technical terms: one main orchestrator on the machine manages domain orchestrators, one per process (project development, a family calendar, the cafe). They talk to each other and to the main one.
  - Composition: the core (task-board validates tasks against the process), the context manager (profiles), and the main orchestrator as the operator's interface.
  - Use a simple graphic, not a diagram.
- «Подтверждает только человек»: simplify. Spending money and security acts need a person's approval, and we can verify that a person gave it. No FIDO or cryptography detail.

### Part 6. Across machines, and the swarm (Ivan)
- **Problem.** My orchestrator and Alexey's manage overlapping modules on different machines.
- **waggle**: verifiable signed messages over any carrier (Telegram, Slack, IRC, XMPP, Matrix). «Подпись важнее канала»: keep.
- Replace the everyday examples with a technical one:
  - one big enterprise project: iOS, Android, services, a web client;
  - every developer's orchestrator in one network, the person still the operator of their own domain;
  - leverage: fewer conflicts, easier merges into main, less CI.
  Remove the schemes and charts.
- «Две точки, одна пасека» and «Аренда и один писатель» fold into the above, one slide at most.
- «Рой над одной средой»:
  - goals beyond one team's resources: an OS kernel needs tens of thousands of subagents;
  - the orchestrator delegates into an external environment through a remote toolchain;
  - the external agents are untrusted;
  - the sandbox is still missing; say so in the speech.
- «Безопасность роя»: KEEP and strengthen; it is the first question the audience will ask.
  - a one-way channel against prompt injection;
  - independent review cycles on more trusted nodes;
  - different model families.
- «Картинка будущего»:
  - people donate unused subscription quota overnight;
  - tens of thousands of agents on an OS kernel, a proof, a drug search;
  - a strict protocol, not stochastic emergence.

### Part 7
- A NEW recap slide.
- «Что работает и что дальше».
- Links and contacts (placeholders until the operator decides what opens).
- «Спасибо».
- The backup slides stay.

## 4. Open questions for the speakers
Record these in open-questions.md.
1. The title.
2. Who presents the context-manager section, and where.
3. What opens, and what the listener takes away (repositories, links).
4. Demo 1: the project and the data.
5. Demo 3: building the cafe flow swap.
6. Whether Alexey's Matrix setup becomes an illustration.
7. For the hosts: logo and style rules for multi-company speakers, the deadlines, and the hosts' written notes when they arrive.

## 5. Definition of done for v4
- `npm run verify` is green: no overflow, no clipping, a clean console.
- `npm run timing` lands at 40–45 min.
- The plan and open questions are updated, and the meeting outcome is filled in.
- One PR per chapter group, or one PR for all, your choice; signed commits, fast-forward landing.
- Then tell both speakers that v4 is ready for their next internal run from the browser.
