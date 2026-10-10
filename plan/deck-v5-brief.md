# Deck v5 brief: orchestration as parallelism (2026-10-10)

For the deck orchestrator on the Mac mini (`macmini_apiary-podlodka-talk_orch`), from Ivan's dictation of 2026-10-10 and his decisions on the orchestrator's proposal the same day. The dictation itself is in [`../meetings/2026-10-10-ivan-dictation.md`](../meetings/2026-10-10-ivan-dictation.md). v5 builds on v4.1 (`plan/deck-v4-brief.md`, 29.09) and on the chapter 6 proposal of 08.10 (PR #20); everything in the v4 brief that is not changed below still holds.

## 1. Decisions (Ivan, 10.10)

1. **Orchestration as parallelism is the through-line.** The opening defines orchestration as parallelism of agent loops, draws the parallel with parallelism in runtimes, and the recap returns to it. Verbatim: «оркестрация как параллелизм -- глобально название не меняем тк оно согласовано с организаторами -- где внутри слайдов как заголовок можно».
2. **Brooks's law goes on a slide**, with the comment that orchestration behaves the same and that the talk looks for the optimum: «берем прям в слайды закон брукса. и с коментом что в оркестрации также и что далее будем разбираться как найти оптимум».
3. **The chain problem → solution → new problem** is explicit and visible: «что бы мы в презентации 'открывали' решение проблемы и открывали новую проблему. что бы это как-то тематически тоже было разделено». Implemented as: two cards on every epoch slide (lime «Решение», orange «Новая проблема»); every chapter's problem slide titled «Проблема — …»; the last lead of a chapter names the next problem where natural.
4. **Milestone of parallelism: multicore and the event loop, not OOP** («ок - тогда с ацентом на многоядерность и event loop»).
5. **Swift distributed actors stay** as the low-level primitive of parallelism across a process boundary; a remote agent is the same unit («distributed actor именно низкоуровневый примитив параллелизма рантайм скозь границы процесса. удаленный агенты будто ровно такая же единица»).
6. **The ICQ image** for first trust (exchanging keys, adding to a contact list) — yes.
7. **Replace, don't add**: the parallelism block is paid for by the epochs (4.5 → 3 min) and chapter 3 (8 → 7 min). Timing stays at 40–45 min.
8. **No status marks for the audience**: every «решено / есть / принято / в спеке» pill or label leaves the slides and the diagrams; the speakers say the status themselves («это для нас полезно - для публики нет - скажем сами на презе»). The vision mark on the chapter 6 opener goes too.
9. **No «one more thing»** about the blockchain social network in this talk.
10. **Strict technical titles.** «они должны быть нормальными строгими техническими заголовками - не слоп паттерны как маркетинговые предложения. и вообще презентация техническая, убираем весь слоп и маркетинг если где то есть». Mostly noun phrases; no slogans, no metaphors in titles («таскает вёдра», «встают в пробки», «картинка будущего»).
11. **Beekeeping names and «Кипер» leave slides and diagrams for now**, replaced by technical terms («там где что то про пчел и кипера - пока тоже заменям на строгие технические термины»). The two backup slides that were about the names and the keeper command line («Пасечные имена для людей», «Три входа — одна форма команд») are removed; restore them when the naming is final.
12. **Trunk-based**: land on main, fix or revert on top («у нас все через транк - делаем приземление в мейн - если будет надо - откатим или просто поправим поверх»). Alexey's review is not a precondition for landing.
13. **The title is fixed**: «От чат-ботов к пасеке: оркестраторы поверх любых агентских сред» is agreed with the organisers and does not change.
14. **Facts from experience** («мы как люди и специалисты имеем право ссылаться на свой опыт») are allowed when the notes say so: «по нашему опыту», «по нашей оценке». Outside facts still need a source: the summer 2026 OpenAI / Hugging Face incident is cited from METR's investigation of 26.08.2026 (link from Ivan, 10.10; details in `open-questions.md`, «Решено»); it is said aloud from the notes, not printed on a slide.

## 2. What changed in the deck

| Where | Change |
| --- | --- |
| Opening | «Что вы унесёте» and «Шесть глав» replaced by four slides: «Оркестрация как параллелизм», «Закон Брукса», «Параллелизм в рантайме» (`DiagV5Parallel`), «Те же задачи у агентов» (`DiagV5Map`, the runtime ↔ agents table that doubles as the agenda with speakers and demos) |
| Epochs | titles «Эпоха N — …»; two cards per epoch (solution / new problem); epoch 5 ends with the control problem (one level, vendor models, no own process) from the dictation; ≈3 min |
| Chapters 2–5 | strict titles; problem slides titled «Проблема — …»; one sentence per opener ties the chapter to its row of the table; chapter 3 loses the slide «Роутинг нужен и корпорациям, и людям» (its facts moved to the routing notes, the QR to «Ссылки и контакты») |
| Chapter 6 | on top of PR #20: ICQ image and «policies, not prompts» in the notes; the remote workplace explained as a distributed actor; «оркестрация оркестраций» and hundreds of people in «Большой проект»; new slide «Шардирование среды исполнения» (hardware as the next limit → several environments, leases and epochs, independent verification, independence from hardware); «Картинка будущего» becomes «Донорская квота для открытых проектов» with the open-source angle |
| Recap | «Выводы доклада» returns to the parallelism table in its lead; «Что работает и что дальше» → «Состояние и следующие шаги» |
| Backup | all `<Status>` pills removed; bee names and «Кипер» replaced in `DiagRouting`, `DiagInstall`, `DiagP5Dreams` and the notes; status labels removed from `DiagRestart`, `DiagP34Router`, `DiagP34Layer`, `DiagP5Rules`, `DiagP5Cafe`; two slides removed (item 11 above) |
| Theme | `Boxes` in reveal mode: equal box widths (the arrow no longer takes width from the first cell) |

## 3. Still open after v5

See `open-questions.md`: demos 1–3; oss-release's list of public repositories and the licence wording; the MTS logo; Alexey's pass over the opening and chapters 1–3. The whole opening is Alexey's (Ivan, 10.10: «у нас примерно пополам поделено, и вначале я ничего не говорю»).

## 4. v5.2 (10.10): the platform-side review

ivan-network-profiles reviewed v5.1 against the design book «Swarma» (wiki `book/swarma/ru`), the trust contract (swarm-platform-architecture PR #5) and Curator's CIP-0008/0009/0010; Ivan asked for one more iteration with that context loaded (relayed 10.10: «пускай сделает еще одну итерацию. но добавь ему ссылку на репо где у нас книга по дизайну»). Done:

- backup «Вход внешнего агента в рой» and `DiagV4DOnboard` follow CIP-0009 revisions 2–3: invitation with pins and a one-use code, three role-separated keys on the donor's bridge, a server challenge, DNSSEC checked inside the client (the voice check was removed by the owners on 10.10), a package without carrier identity or tokens, the SSH key outside the workplace user's home;
- «Рабочее место внешнего агента» notes: the donor's protection is designed (lockdown posture; deployment variants A/B/C of 10.10), not open;
- `DiagV5Map` gains the row «изоляция процессов ↔ пользователь ОС на агента, ключи вне агента»; the lead strip goes, the chapter column carries the speakers;
- the METR incident is told technically (isolation rested on an agreement; the shared cache became the channel);
- «Шардирование»: independent reviewers confirm, the quorum certifies the record (judgment never enters consensus);
- «Большой проект в одной сети»: the three benefit cards are replaced by the mechanism (lease, epoch, refusal of a stale writer); the expectation stays in the notes;
- «тысячи» on the diagrams (the post's number), «по нашей оценке десятки тысяч» aloud;
- «Управление живыми сессиями» notes: waiting is not the model's job, the host wakes and restarts a wedged session;
- «Сообщение с двумя подписями» notes: the slide shows the waggle draft; questions are answered by the contract (key keeper, registry, grants);
- «Состояние» notes: Curator v0.15.0-rc.5, the remote-worker CIPs; versions to re-check before the talk.
