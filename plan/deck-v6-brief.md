# Deck v6 brief: how projects grow (2026-10-12)

For the deck orchestrator on the Mac mini (`macmini_apiary-podlodka-talk_orch`), from the speakers' slide-by-slide pass over deck v5.2 on 2026-10-12. Ivan handed over the full transcript and asked for a new iteration: «погнали делать новую итерацию на основе нашего с алексеем разговора». The digest is in [`../meetings/2026-10-12-ivan-alexey-call.md`](../meetings/2026-10-12-ivan-alexey-call.md); the slide list and timing are in [`slides-plan.ru.md`](slides-plan.ru.md). Everything in the v4 and v5 briefs that is not changed below still holds. Ivan, in the call: «Нам нужно каркас выстроить» — v6 is the new skeleton; Ivan reworks his part on top of it.

## 1. Decisions (Ivan and Alexey, 12.10)

1. **The through-line is how projects grow, not parallelism in runtimes.** The four opening slides on parallelism («Оркестрация как параллелизм», «Закон Брукса», «Параллелизм в рантайме», «Те же задачи у агентов») go. Alexey: «вот эту штуку про языки программирования и параллелизм не затрагивал… очень спекулятивная тема». In their place, four slides in the style of the epoch slides: one person, a team with modules, a product of several projects with a project manager as the orchestrator, distributed teams. Agents later climb the same ladder. This supersedes v5 decisions 1, 4 and 5 (`deck-v5-brief.md` §1).
2. **Brooks's law stays, as a card** on the «product of several projects» slide: independent teams, many channels, nothing works without hard processes; with agents, «больше агентов не значит быстрее».
3. **Epochs 0–4.** Epochs 3 and 4 merge: «Агенты», then a second slide of the same epoch showing who does what (spec, architecture, review, testing — the same model). The second slide loses its solution and ends with an orange «Новая проблема».
4. **Colours everywhere:** problem red or orange, solution green («проблему подсвечиваем красным, а решение — зелёным»). Implemented as orange and lime cards and the new `lead orange` and `lead lime` bars (theme `rwb-tech`).
5. **Every slide ends with the next problem;** the next slide gives the solution and its new problem.
6. **Short theses** on slides, understandable without the speaker «додумывать» them.
7. **Titles must read well** (Ivan: «названия — просто позор!»). Strict technical noun phrases remain the rule.
8. **Demos are black, not purple:** a demo is the summary of a chapter, not a chapter («Демо — это не глава, демо — это итог»). The existing `demo` layout is already black; it stays.
9. **Chapter 2** is renamed («может, Автономия через оркестрацию»), absorbs the vendor chapter (the opener «Без привязки к вендору» goes) and is reordered: memory in notes → board and spec → managed parallelism → orchestrator, producer and reviewer → own spawns in any environment (old 25) → isolation and landing (old backup 63 replaces old 18: «он красивее») → goals → router (old backup 69 merged with old 29 and the security-review example) → achievements in green: autonomy, resilience, hand-off between environments, vendor independence (old 24 as before/after) → demo 1 → the overload problem (old 33 plus a click with products B, C, D).
10. **Removed from Alexey's part:** old 15, 21 (moved to the end of the chapter), 23, 26–28, 30, 31, 34, 35; old 32 (Curator) moves to Ivan's part.
11. **Ivan's part opens with coordination:** the opener is «Координация оркестраторов» (not «Менеджер агентского контекста»). Channel → main orchestrator (in speech, Keeper) → two people with private and shared projects («красные не пересекаются, зеленые пересекаются») → communication between machines over Matrix → trust, mentioned briefly («просто заикнуться, что это важная штука») → contexts → Curator with the project profile and the managed home → skills as packages → one entry point (meta-orchestrator) → demo 2.
12. **Demo 2 is new:** a JavaScript visualisation of two to three weeks of our Matrix traffic — orchestrators spawning subagents and talking to each other. **Demo 3 (café) is removed:** «у нас нет кафе». Ivan builds demo 1 too: «это на мне будет».
13. **Processes stay, shortened;** status said aloud as design and prototype («где мы сейчас»). «Not only development» is one line: a small business with a CRM, chats and policies. «Главный оркестратор машины» moves earlier and uses development examples only (no café, family calendar or OpenClaw). «Подтверждение человеком»: short or out — out.
14. **External agents:** the scalability limit → open source is broken by agent-made pull requests → contribution as donated agent time → two parties that do not trust each other → the workplace with a boundary on both sides → donated agent time for open projects (the Friday example). Removed: old 49, 51, 54, 56; from old 55 only the one-way channel stays. Implementation details only if the paper is published before the talk (Alexey).
15. **Closing:** what works today, what is in development, an invitation to contribute ideas and review the paper, a link to the paper on «Ссылки и контакты»; Alexey: «в завершение показать Roadmap и где мы сейчас».
16. **Backup almost empty:** «ты устанешь искать среди такой презы нужный слайд». Kept: «Состав скилла у агента», «Установка скилла — цепочка проверок», «Кафе как плейбук», «Вход внешнего агента в рой».
17. **Statistics of autonomy** to be rebuilt: agent hours of orchestrators and main orchestrators (one cohort), worker hours, landings, over two weeks or a month, idle time excluded, on all three machines. Alexey: «Скрипт подготовь». Until then, no numbers on the autonomy slide.
18. **A shared clicker:** the deck runs on a server, both speakers advance it, one shares the screen; access over SSH, no public address.
19. **Two QR codes** to Ivan's talks on local models next to the router.
20. **Title (Ivan, 13.10):** «Рой над одной средой» («название доклада у нас "Рой над одной средой"»). It replaces the title of 10.10 (`deck-v5-brief.md` §1 item 13) on the title slide and in the footer of every slide.
21. **The MWS logo next to Alexey's name** on the title slide (Ivan, 13.10: «можешь это лого еще добавить там где алексей»); the bottom row of three logos stays.

## 2. What changed in the deck

| Where | Change |
| --- | --- |
| Title | `event` is «PODLODKA»; «Relux Works» above the title removed; the MTS Web Services logo is Alexey's commit 7101e7e |
| Opening | «Кто мы»: right column «Идей много / Рук мало / Времени мало»; four new slides on how projects grow (`DiagV6Growth`, strip `DiagP12Epochs` with `names` and `start`) |
| Epochs | five epochs 0–4 (`DiagP12Epochs` default names); «Эпоха 3 — агенты» and «Эпоха 3 — один агент на всё» (`DiagP12Jam` now shows roles); epoch 4 ends with vendor lock-in in orange |
| Chapter 2 | 15 slides as in decision 9; new `DiagV6Router`, `DiagV6Autonomy`, `DiagV6Handoff`, `DiagV6Overload`; `DiagP12Landing` gets `brief` (no machine block); 91 of 162 is inline small text; notes gain the tetris goal story, the router's four questions and the validation binding |
| Chapter 3 (Ivan) | 11 slides as in decision 11; new `DiagV6Coord` (stage 1 and 2), `DiagV6Shared`, `DiagV6Link`, `DiagV6ProfileFlow`, `DiagV6Meta`; trust reuses `DiagV4DSigned`; skills as packages kept |
| Chapter 4 | processes: problem, Playbook.json, extends, validation; café examples replaced by a small business; the refuter story in the validation notes |
| Chapter 5 | six slides as in decision 14; `DiagV4DSwarm`, `DiagV4DWorkplace` and `DiagV4DFuture` relabelled («время своего агента», «без локальных инструментов»); the METR incident moves to «две недоверяющие стороны» |
| Closing | «Где мы сейчас» (three columns and an invitation), «Ссылки и контакты» (paper card, QR in the contacts card), «Спасибо»; «Выводы доклада» removed |
| Backup | four slides (decision 16) |
| Theme | `p.lead.orange` and `p.lead.lime` in `themes/rwb-tech/styles/base.css`; `STYLE.md` updated |
| Parts | `0-opening`, `1-epochs`, `2-orchestration`, `3-coordination`, `4-processes`, `5-external-agents`, `6-where-we-are`, `7-backup`; the old part files are removed (history in git) |
| Timing | 40.2 min at 130 wpm with demos 3 + 2 (`npm run timing`) |

## 3. Judgement calls the call left open

- **The distributed-teams step is kept** (Alexey: «можно этот шаг вообще опустить… не настаиваю»): it is the step that Ivan's part mirrors.
- **«Выводы доклада» is removed.** The call described the closing as roadmap plus links; its lead returned to the runtime path, which is gone. The project-growth recap is one paragraph in the notes of «Где мы сейчас».
- **Backups 68, 74 and 75** («Парковка через цель», «Цепочка доверия при установке скилла», «Анатомия Playbook.json») were not named in the call and are removed under the general rule; restore from git if wanted.
- **Module zones on «Пересечение проектов»** are the orchestrator's layout: personal projects are «Работа в RWB», «Работа в МТС» and «Свои проекты»; the shared project shows Доска задач, Роутер моделей, Curator, Связь агентов without owners. The speakers assign the zones.
- **«Keeper» stays off the slides** (v5 rule): «главный оркестратор» and «мета-оркестратор» on slides, «Кипер» allowed aloud.
- **Communication between machines is presented as working today** (our a2a swarm on Matrix), unlike v5 where chapter 6 said no message crossed machines; waggle and the signed-envelope format remain drafts.
- **Hand-off between environments is presented as today's practice** (board, goal, hand-over note; a2a has a `handover` kind); the session host's hand-off package is a proposal. The speakers confirm the wording «поддерживаем handoff и takeover».
- **The Curator project profile** (manifest → verified project profile merged with the company profile → managed home → launch from any directory, repository directories never read) is Ivan's new design from the call; profiles, lock files and managed homes work today. Ivan confirms what is built.
- **The router's status** follows Ivan in the call: «я уже роутер там сделал, там сейчас режим теста»; the spec still calls it decided design (milestone M8).
- **Donor wording** follows ivan-network-profiles' review of 12.10: «донор отдаёт проекту время своего агента; подписка и ключи остаются у него», not «отдаёт лимиты»; «физически не может» only for deployment variants B and C.
- **The second QR code** on the router slide is a placeholder: which talk it is, is open.
- **The paper:** the Swarma book v0.9 exists, a published paper does not (ivan-network-profiles, 12.10). The slides keep a placeholder card and a conditional line in «Где мы сейчас».

## 4. v6.2 (13.10): Ivan's review of v0.6.0

Ivan reviewed the v0.6.0 PDF («в целом преза стала намного приличней выглядеть») and asked for edits and more consistency. Done:

- **Plaques:** «здесь обычно проблематику или успех пишем — ломается юх презы». Every purple plaque in the main flow became orange (problem) or lime (success): «Кто мы», contexts, skills as packages, the process problem, Playbook.json, extends, validation, the scalability limit, two distrusting sides, «Где мы сейчас»; Curator's plaque now names the next problem (skills cannot be trusted blindly). On «Проблема — …» slides the plaque drops the prefix.
- **Wording:** the process «должен стать… конфигурацией, а не кодом ядра» (not «данными»); Playbook.json and extends got plain plaques («какие еще отличия проекта остаются?»); the «Отвязка от вендора» cards («немного мутные карточки») say what changed in plain words.
- **Session host is done** (Ivan: «хост сессий у нас сделан»): «Работает сегодня» on «Где мы сейчас», and the status in the notes.
- **«Ссылки и контакты»:** the plaque about the post's chapters removed («какой-то артефакт?»).
- **Backup slides 55–57 into Ivan's part:** «Состав скилла у агента» and «Установка скилла — цепочка проверок» after «Скиллы как пакеты»; «Кафе как плейбук» closes the processes chapter. The backup keeps «Вход внешнего агента в рой».
- **Chapter 3 tags:** one tag, «03 · КООРДИНАЦИЯ».
- **Presentation server on the mini:** `npm run present` (`.scripts/present.sh`), smoke-tested on the mini; the laser pointer is built into Slidev and shows on the shared screen (`docs/shared-clicker.md`).
- **Timing:** 42.7 min.

## 5. Still open after v6

See `open-questions.md`: the licence wording of the board; oss-release's list of public repositories (overdue since 11.10); the paper's URL; Ivan's second talk for the QR; Alexey's pass over his part (13.10); demos 1 and 2 (Ivan); statistics from `.scripts/agent-hours.mjs` on all three machines; the module zones on «Пересечение проектов»; the status of the Curator project profile; the speakers' confirmation of «десятки тысяч» aloud.

## 6. v5.2 slide numbers and what happened to them

Numbers as in the release v0.5.1 PDF and main 8c40d65, which the call used.

| v5.2 | Slide | v6 |
| ---: | --- | --- |
| 1 | Титул | kept; «Relux Works» on top removed |
| 2 | Кто мы и зачем рассказываем | kept; three points on the right |
| 3–6 | Оркестрация как параллелизм · Закон Брукса · Параллелизм в рантайме · Те же задачи у агентов | removed; replaced by four «how projects grow» slides; Brooks as a card |
| 7–11 | Эпохи · эпохи 0–3 | kept, reworded |
| 12 | Эпоха 4 — один агент на всё | becomes «Эпоха 3 — один агент на всё», orange problem |
| 13 | Эпоха 5 — оркестраторы внутри вендора | becomes epoch 4, orange problem |
| 14 | Доска и автономия | renamed «Автономия через оркестрацию» |
| 15 | Проблема — один агент не удерживает проект | removed; thesis on «один агент на всё» |
| — | — | new «Память в заметках», «Доска задач и спека» |
| 16 | Доска задач — граф зависимостей | becomes «Управляемый параллелизм» |
| 17 | Продюсер и ревьюер | «Оркестратор, продюсер и ревьюер»; number as small text; orange problem |
| 18 | Приземление через ревью | replaced by 63 as «Изоляция и приземление» |
| 19 | Цель у каждого агента | kept; orange problem |
| 20 | Автономия на практике | «Автономная разработка», Gantt-like, no numbers |
| 21 | Демо 1 | moved to the end of chapter 2 |
| 22 | Устойчивость к падениям | moved to the achievements, lime |
| 23 | Без привязки к вендору | removed |
| 24 | Проблема — четыре привязки к вендору | «Отвязка от вендора», before/after |
| 25 | Оркестратор поверх любой среды | «Свои спавны в любой среде», after the producer slide |
| 26–28 | Ревью безопасности в трёх средах · одной командой · Демо 2 | removed; the example is on the router slide |
| 29 | Роутинг по политике запуска | merged into «Роутер моделей» |
| 30 | Реестр моделей и плагины сред | removed |
| 31 | Управление живыми сессиями | removed |
| 32 | Одна точка сборки запуска | idea moved into «Curator — профиль проекта» |
| 33 | Проблема — несколько оркестраторов на одной машине | «Проблема — человек-диспетчер», products B–D |
| 34–35 | Связь оркестраторов на одной машине · Итог первой части | removed |
| 36 | Менеджер агентского контекста | renamed «Координация оркестраторов» |
| — | — | new «Канал между оркестраторами», «Главный оркестратор», «Пересечение проектов», «Связь между машинами», «Одна точка входа», «Демо 2: оркестраторы в Matrix» |
| 37 | Проблема — контекст агента сегодня | «Проблема — контексты разных проектов» |
| 38 | Профиль — единица контекста | merged with backup 71 into «Curator — профиль проекта» |
| 39 | Скиллы как пакеты | kept |
| 40–44 | Процессы · проблема · Playbook.json · расширение · валидация | kept, notes shortened |
| 45 | Демо 3: кафе | removed |
| 46 | Главный оркестратор машины | removed; idea in chapter 3 |
| 47 | Подтверждение человеком | removed |
| 48 | Между машинами и рой | «Внешние агенты в открытом проекте» |
| 49 | Проблема — два оркестратора на разных машинах | removed |
| 50 | Подписанные сообщения поверх любого канала | «Доверие между оркестраторами» in chapter 3 |
| 51 | Большой проект в одной сети | removed |
| 52 | Проблема — предел одной команды | «Проблема — предел масштабируемости»; diagram reused for «две недоверяющие стороны» |
| — | — | new «Вклад временем агента» |
| 53 | Рабочее место внешнего агента | kept, relabelled |
| 54–56 | Доставка через брокер · Безопасность роя · Шардирование | removed; the one-way channel is in the workplace notes |
| 57 | Донорская квота для открытых проектов | «Время агента для открытых проектов» |
| 58 | Выводы доклада | removed |
| 59 | Состояние и следующие шаги | «Где мы сейчас» |
| 60–61 | Ссылки и контакты · Спасибо | kept; paper card added |
| 62–91 | backup | kept 72, 73, 76, 90; 63 and 69 moved to the main flow; 71 merged; the rest removed |
