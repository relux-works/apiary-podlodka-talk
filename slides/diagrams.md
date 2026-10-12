---
routerMode: hash
theme: ../themes/rwb-tech
title: 'От чат-ботов к пасеке · схемы'
info: 'Сценические версии схем из технической записки, по одной на слайд'
preloadImages: false
layout: cover
event: 'СХЕМЫ ДЛЯ СЛАЙДОВ'
who: 'Relux Works'
---

# Схемы для слайдов

<!--
Галерея сценических версий: каждая схема из diagrams/ перерисована компонентом в slides/components/Diag*.vue — по-русски, в токенах rwb-tech, под тезис своего слайда. В дек схема ставится одной строкой, например <DiagRouting reveal />. Номер слайда — по plan/slides-plan.ru.md.
-->
---
layout: default
tag: 'СЛАЙД 14 · ЭКСПЛУАТАЦИЯ'
---

# Раны *переживают рестарт хоста*

<DiagRestart />

<!--
DiagRestart — сценическая версия diagrams/restart-survival.png. Раскрытие по кликам: <DiagRestart reveal />.
-->

---
layout: default
tag: 'СЛАЙД 14 · ЭКСПЛУАТАЦИЯ'
---

# Перезагрузка: *keeper up поднимает точку*

<DiagReboot />

<!--
DiagReboot — сценическая версия diagrams/reboot-restore.png. Раскрытие по кликам: <DiagReboot reveal />.
-->

---
layout: default
tag: 'СЛАЙД 21 · ХОСТ СЕССИЙ'
---

# Звонок в дверь *в живую сессию*

<DiagDoorbell />

<!--
DiagDoorbell — сценическая версия diagrams/doorbell-delivery.png. Раскрытие по кликам: <DiagDoorbell reveal />.
-->

---
layout: default
tag: 'ЗАПАС · ХОСТ СЕССИЙ'
---

# Парковка и возобновление *через цель*

<DiagPark />

<!--
DiagPark — сценическая версия diagrams/park-and-resume.png. Раскрытие по кликам: <DiagPark reveal />.
-->

---
layout: default
tag: 'СЛАЙД 31 · ИМЕНА'
---

# Имена: *пасека, точка, улей*

<DiagOneNode />

<!--
DiagOneNode — сценическая версия diagrams/one-node-system.png. Раскрытие по кликам: <DiagOneNode reveal />.
-->

---
layout: default
tag: 'СЛАЙД 32 · КИПЕР'
---

# Кипер разводит *запрос по ульям*

<DiagRouting />

<!--
DiagRouting — сценическая версия diagrams/request-routing.png. Раскрытие по кликам: <DiagRouting reveal />.
-->

---
layout: default
tag: 'ЗАПАС · КИПЕР'
---

# Установка и *первый запуск*

<DiagInstall />

<!--
DiagInstall — сценическая версия diagrams/installation-and-first-run.png. Раскрытие по кликам: <DiagInstall reveal />.
-->

---
layout: default
tag: 'ЗАПАС · ДОВЕРИЕ'
---

# Делегирование *действий человека*

<DiagDelegation />

<!--
DiagDelegation — сценическая версия diagrams/delegation-of-human-acts.png. Раскрытие по кликам: <DiagDelegation reveal />.
-->

---
layout: default
tag: 'СЛАЙД 33 · ДОВЕРИЕ'
---

# Ульи на одной точке *изолированы*

<DiagIsolation />

<!--
DiagIsolation — сценическая версия diagrams/process-isolation-on-one-node.png. Раскрытие по кликам: <DiagIsolation reveal />.
-->

---
layout: default
tag: 'ЗАПАС · WAGGLE'
---

# Четыре уровня *связи*

<DiagCommLayers />

<!--
DiagCommLayers — сценическая версия diagrams/communication-layers.png. Раскрытие по кликам: <DiagCommLayers reveal />.
-->

---
layout: default
tag: 'СЛАЙДЫ 35–36 · ВИДЕНИЕ'
---

# Несколько точек, *одна пасека*

<DiagSeveralNodes />

<!--
DiagSeveralNodes — сценическая версия diagrams/several-nodes.png. Раскрытие по кликам: <DiagSeveralNodes reveal />.
-->

---
layout: default
tag: 'ЗАПАС · ХОСТ СЕССИЙ'
---

# Старт сессии *сегодня*

<DiagSessionStart />

<!--
DiagSessionStart — сценическая версия diagrams/session-start-today.png. Раскрытие по кликам: <DiagSessionStart reveal />.
-->

---
layout: default
tag: 'ЗАПАС · ПРЕДЛОЖЕНО'
---

# Один хост на точку, *держатель на сессию*

<DiagOneHost />

<!--
DiagOneHost — сценическая версия diagrams/one-host-per-node.png. Раскрытие по кликам: <DiagOneHost reveal />.
-->

---
layout: default
tag: 'ЗАПАС · ПРЕДЛОЖЕНО'
---

# Аварийный *стоп*

<DiagEstop />

<!--
DiagEstop — сценическая версия diagrams/emergency-stop.png. Раскрытие по кликам: <DiagEstop reveal />.
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Epochs'
class: dense
---

# DiagP12Epochs

<DiagP12Epochs />

<!--
Слайды 2–7, эпохи. Лента эпох над каждым слайдом части 1: пройденные — серые, текущая — сиренью, будущие — пунктиром.
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Goals'
class: dense
---

# DiagP12Goals

<DiagP12Goals />

<!--
Слайд 11, цели. У оркестратора — цель доски (слот parent/primary, одна на доску), у каждого спавна — своя
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Jam'
class: dense
---

# DiagP12Jam

<DiagP12Jam />

<!--
Слайд 6, эпоха 4 «пробки». Разные классы задач идут в одного агента на одной модели; заплатки — Ralph loop
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Landing'
class: dense
---

# DiagP12Landing

<DiagP12Landing />

<!--
Слайд 10, Change Request и приземление. Worktree на story → Change Request (неизменяемая ревизия) → проверки
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Loop'
class: dense
---

# DiagP12Loop

<DiagP12Loop />

<!--
Слайды 2–5, эпохи 0–3. Один и тот же цикл разработки — «контекст → ответ → правка → сборка → ошибки» —
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Phases'
class: dense
---

# DiagP12Phases

<DiagP12Phases />

<!--
Слайд 8, task-board. Слева — иерархия Epic → Story → Task/Bug в .task-board/ репозитория и эскалация
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Review'
class: dense
---

# DiagP12Review

<DiagP12Review />

<!--
Слайд 9, цикл продюсер → ревьюер → доработка. Оркестратор спавнит обоих; ревьюер — модель другой семьи;
-->

---
layout: default
tag: 'ЧАСТИ 1–2 · DiagP12Vendors'
class: dense
---

# DiagP12Vendors

<DiagP12Vendors />

<!--
Слайд 7, эпоха 5: оркестраторы внутри одного вендора. Codex спавнит Codex, Claude спавнит Claude,
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34Layer'
class: dense
---

# DiagP34Layer

<DiagP34Layer />

<!--
Слайд 16, слой абстракции: оркестратор в любой среде спавнит сабагентов в любой другой. Новая схема.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34Network'
class: dense
---

# DiagP34Network

<DiagP34Network />

<!--
Слайд 19, несколько подписок на одной машине: сетевые профили. Новая схема по картинке цели спеки.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34OneSite'
class: dense
---

# DiagP34OneSite

<DiagP34OneSite />

<!--
Слайд 21, одна точка сборки запуска. Новая схема.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34Profile'
class: dense
---

# DiagP34Profile

<DiagP34Profile />

<!--
Слайд 20, Curator: профиль превращается в управляемый дом, у каждого агента свой контекст. Новая схема.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34Roles'
class: dense
---

# DiagP34Roles

<DiagP34Roles />

<!--
Слайд 23, модели меняются каждую неделю: роль пишет потребности, оператор привязывает, реестр держит строку на модель.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34Router'
class: dense
---

# DiagP34Router

<DiagP34Router />

<!--
Слайд 18, экономика токенов: роутер и его четыре вопроса. Новая схема.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34ThreeTabs'
class: dense
---

# DiagP34ThreeTabs

<DiagP34ThreeTabs />

<!--
Слайд 15, проблема кросс-харнесса: секьюрити-ревью в три вкладки. Новая схема, не из diagrams/.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5Anatomy'
class: dense
---

# DiagP5Anatomy

<DiagP5Anatomy />

<!--
Слайд 25, процессы как конфигурация. Анатомия Playbook.json и опубликованного плейбука как набора скиллов.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5Cafe'
class: dense
---

# DiagP5Cafe

<DiagP5Cafe />

<!--
Слайд 27, не только код. Заказ поставщику в кафе: четыре вида владельцев на одной машинке.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5Dreams'
class: dense
---

# DiagP5Dreams

<DiagP5Dreams />

<!--
Слайд 34, сны. Всё на схеме — предложено 2026-09-25.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5Extends'
class: dense
---

# DiagP5Extends

<DiagP5Extends />

<!--
Слайд 26, только отличия. extends и uses поверх dev-cycle.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5MusicVideo'
class: dense
---

# DiagP5MusicVideo

<DiagP5MusicVideo />

<!--
Слайд 28, клип за 19 часов как плейбук. Схема процесса, без кадров и звука: кто владеет каким шагом.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5Rules'
class: dense
---

# DiagP5Rules

<DiagP5Rules />

<!--
Слайд 29, проверка на реальных пайплайнах. Левая колонка — восемь правил процесса, которые несут длинные промпты
-->

---
layout: default
tag: 'ЧАСТИ 6–7 · DiagP67Envelope'
class: dense
---

# DiagP67Envelope

<DiagP67Envelope />

<!--
Слайд 35, waggle: подпись важнее канала. Новая схема части 6.
-->

---
layout: default
tag: 'ЧАСТИ 6–7 · DiagP67Fencing'
class: dense
---

# DiagP67Fencing

<DiagP67Fencing />

<!--
Слайд 36, два оператора на одной доске. Новая схема части 6.
-->

---
layout: default
tag: 'ЧАСТИ 6–7 · DiagP67Future'
class: dense
---

# DiagP67Future

<DiagP67Future />

<!--
Слайд 39, картинка будущего. Видение. Новая схема части 6.
-->

---
layout: default
tag: 'ЧАСТИ 6–7 · DiagP67SwarmSecurity'
class: dense
---

# DiagP67SwarmSecurity

<DiagP67SwarmSecurity />

<!--
Слайд 38, безопасность роя. Видение. Новая схема части 6.
-->

---
layout: default
tag: 'ЧАСТИ 6–7 · DiagP67WildBees'
class: dense
---

# DiagP67WildBees

<DiagP67WildBees />

<!--
Слайд 37, рой над одной средой. Видение. Новая схема части 6.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34SkillAnatomy'
class: dense
---

# DiagP34SkillAnatomy

<DiagP34SkillAnatomy />

<!--
Слайд после плана 20, Curator: скилл с командой — что из пакета куда попадает на машине. Новая схема.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34InstallGates'
class: dense
---

# DiagP34InstallGates

<DiagP34InstallGates />

<!--
Слайд после плана 20, Curator: установка скилла как цепочка проверок. Новая схема в стиле DiagP12Landing.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34TrustChain'
class: dense
---

# DiagP34TrustChain

<DiagP34TrustChain />

<!--
Слайд после плана 20, Curator: кому мы доверяем, когда ставим скилл. Новая схема.
-->

---
layout: default
tag: 'ЧАСТИ 3–4 · DiagP34Layers'
class: dense
---

# DiagP34Layers

<DiagP34Layers />

<!--
Слайд плана 24, главный тезис: карта в три слоя — что строим поверх, наши контракты, среды вендоров. Новая схема.
-->

---
layout: default
tag: 'ЧАСТЬ 5 · DiagP5Keeper'
class: dense
---

# DiagP5Keeper

<DiagP5Keeper />

<!--
Слайд после «Снов», третий вход. Одна форма командных строк: keeper для человека, под ним curator (машина и хост сессий),
-->

---
layout: default
tag: 'V4 · ВСТУПЛЕНИЕ, ГЛАВЫ 1–2 · DiagV4AAutonomy'
class: dense
---

# DiagV4AAutonomy

<DiagV4AAutonomy />

<!--
v4, глава 2, слайд «Человек уходит в начало и в конец». Внимание человека до и после оркестратора:
-->

---
layout: default
tag: 'V4 · ВСТУПЛЕНИЕ, ГЛАВЫ 1–2 · DiagV4ACrash'
class: dense
---

# DiagV4ACrash

<DiagV4ACrash />

<!--
v4, глава 2, слайд «Мы переживаем падения» (бывшие «Эксплуатация: что ломается» и «Рестарт хоста»).
-->

---
layout: default
tag: 'V4 · ВСТУПЛЕНИЕ, ГЛАВЫ 1–2 · DiagV4ALanding'
class: dense
---

# DiagV4ALanding

<DiagV4ALanding />

<!--
v4, глава 2 «Доска и автономия», слайд «Каждая история приземляется через ревью».
-->

---
layout: default
tag: 'V4 · ГЛАВА 3 · DiagV4BOneMachine'
class: dense
---

# DiagV4BOneMachine

<DiagV4BOneMachine />

<!--
Plan v4 slide 32: communication on one machine, problem and solution in one geometry. New stage diagram (v4, 29.09).
-->

---
layout: default
tag: 'V4 · ГЛАВА 3 · DiagV4BPolicy'
class: dense
---

# DiagV4BPolicy

<DiagV4BPolicy />

<!--
Plan v4 slide 28: the launch policy is configured at runtime. New stage diagram (v4, 29.09).
-->

---
layout: default
tag: 'V4 · ГЛАВА 3 · DiagV4BSecReview'
class: dense
---

# DiagV4BSecReview

<DiagV4BSecReview />

<!--
Plan v4 slide 26: security review as dependent tasks on one board. New stage diagram (v4, 29.09).
-->

---
layout: default
tag: 'V4 · ГЛАВА 3 · DiagV4BStack'
class: dense
---

# DiagV4BStack

<DiagV4BStack />

<!--
Plan v4 slide 33, the summary of the first half: we do not need our own agent harness. A simplified replacement of
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 4–5 · DiagV4CHardcoded'
class: dense
---

# DiagV4CHardcoded

<DiagV4CHardcoded />

<!--
v4, слайд 39: проблема главы 5 — процесс зашит в код ядра task-board.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 4–5 · DiagV4CMachine'
class: dense
---

# DiagV4CMachine

<DiagV4CMachine />

<!--
v4, слайд 44: главный оркестратор машины над оркестраторами процессов. Технические термины вместо пасечных
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 4–5 · DiagV4CPackages'
class: dense
---

# DiagV4CPackages

<DiagV4CPackages />

<!--
v4, слайд 37: семантика пакетного менеджера. Сжатие слайдов «Скилл с командой», «Установка — это цепочка проверок»
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 4–5 · DiagV4CPlaybook'
class: dense
---

# DiagV4CPlaybook

<DiagV4CPlaybook />

<!--
v4, слайд 40: процесс разработки из первой половины — в Playbook.json; роли — это скиллы.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 4–5 · DiagV4CProfile'
class: dense
---

# DiagV4CProfile

<DiagV4CProfile />

<!--
v4, слайд 36: профиль — новая единица контекста. Простая картинка вместо DiagP34Profile (та — в запасе).
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 4–5 · DiagV4CValidate'
class: dense
---

# DiagV4CValidate

<DiagV4CValidate />

<!--
v4, слайд 42: валидатор проверяет граф процесса до запуска.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 6–7 · DiagV4DFuture'
class: dense
---

# DiagV4DFuture

<DiagV4DFuture />

<!--
v4, глава 6, слайд 52 «Картинка будущего». Видение. Замена DiagP67Future для основного потока.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 6–7 · DiagV4DProblem'
class: dense
---

# DiagV4DProblem

<DiagV4DProblem />

<!--
v4, глава 6, слайд 47 «Проблема»: два оркестратора на разных машинах ведут пересекающиеся модули.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 6–7 · DiagV4DRecap'
class: dense
---

# DiagV4DRecap

<DiagV4DRecap />

<!--
v4, глава 7, слайд 53 «Итог»: выводы доклада крупными строками, по главам 2–6 плана v4 (plan/slides-plan.ru.md).
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 6–7 · DiagV4DSecurity'
class: dense
---

# DiagV4DSecurity

<DiagV4DSecurity />

<!--
v4, глава 6, слайд 51 «Безопасность роя». Видение. Замена DiagP67SwarmSecurity для основного потока: угроза → защита.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 6–7 · DiagV4DSigned'
class: dense
---

# DiagV4DSigned

<DiagV4DSigned />

<!--
v4, глава 6, слайд 48 «Подпись важнее канала». Упрощённая версия DiagP67Envelope: без мультиподписи и FIDO.
-->

---
layout: default
tag: 'V4 · ГЛАВЫ 6–7 · DiagV4DSwarm'
class: dense
---

# DiagV4DSwarm

<DiagV4DSwarm />

<!--
v4.2, глава 6, «Рою нужны чужие агенты» (проблема; в v4 — «Рой над одной средой»). Видение. Замена DiagP67WildBees для основного потока.
-->

---
layout: default
tag: 'V4 · ГЛАВА 6 · DiagV4DWorkplace'
class: dense
---

# DiagV4DWorkplace

<DiagV4DWorkplace />

<!--
v4.2, глава 6, «Рабочее место — пользователь на нашей машине». Решено 07.10, не построено. Контракт trust-and-isolation v1.3 §5, §7.
-->

---
layout: default
tag: 'V4 · ЗАПАС К ГЛАВЕ 6 · DiagV4DOnboard'
class: dense
---

# DiagV4DOnboard

<DiagV4DOnboard />

<!--
v4.2, запас к главе 6, «Чужой агент входит в рой». Сиквенсы external-agent-onboarding и remote-workplace-attach, сокращено.
-->

---
layout: default
tag: 'V5 · ВСТУПЛЕНИЕ · DiagV5Parallel'
---

# DiagV5Parallel

<DiagV5Parallel />

<!--
DiagV5Parallel — v5, вступление «Параллелизм в рантайме»: три ступени параллелизма и цена. Раскрытие по кликам: <DiagV5Parallel reveal />.
-->

---
layout: default
tag: 'V5 · ВСТУПЛЕНИЕ · DiagV5Map'
---

# DiagV5Map

<DiagV5Map chapters />

<!--
DiagV5Map — v5, вступление «Те же задачи у агентов»: таблица рантайм ↔ агенты, по строке на главу; chapters — колонка глав и спикеров. Раскрытие по кликам: <DiagV5Map reveal chapters />.
-->

---
layout: default
tag: 'V6 · ВСТУПЛЕНИЕ · DiagV6Growth'
---

# DiagV6Growth

<DiagV6Growth :stage="2" />

<!--
v6, вступление: как растут проекты у людей — stage 0 один человек, 1 команда и модули, 2 продукт из проектов с проджект-менеджером, 3 распределённые команды. Раскрытие по кликам: <DiagV6Growth :stage="N" reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 2 · DiagV6Router'
---

# DiagV6Router

<DiagV6Router />

<!--
v6, глава 2 «Роутер моделей»: бюджет, лимиты, часы вне пика, скидки → роутер → трудное сильной модели, мелочь дешёвой. Раскрытие: <DiagV6Router reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 2 · DiagV6Autonomy'
---

# DiagV6Autonomy

<DiagV6Autonomy />

<!--
v6, глава 2 «Автономная разработка»: было — человек на каждом такте; стало — проекты A, B, C со смещением, как диаграмма Ганта. Раскрытие: <DiagV6Autonomy reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 2 · DiagV6Handoff'
---

# DiagV6Handoff

<DiagV6Handoff />

<!--
v6, глава 2 «Передача работы между средами»: Claude → доска (цель, состояние, заметка) → Codex. Раскрытие: <DiagV6Handoff reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 2 · DiagV6Overload'
---

# DiagV6Overload

<DiagV6Overload />

<!--
v6, конец части Алексея: человек над продуктом A, по кликам продукты B, C, D и перегрузка. Раскрытие: <DiagV6Overload reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 3 · DiagV6Coord'
---

# DiagV6Coord

<DiagV6Coord :stage="2" />

<!--
v6, глава 3: stage 1 — канал между оркестраторами, человек читает всех; stage 2 — главный оркестратор, человеку только критичное. Раскрытие: <DiagV6Coord :stage="1" reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 3 · DiagV6Shared'
---

# DiagV6Shared

<DiagV6Shared />

<!--
v6, глава 3 «Пересечение проектов»: два человека со своими главными оркестраторами, личные проекты оранжевые, общий проект — лаймовые модули. Раскрытие: <DiagV6Shared reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 3 · DiagV6Link'
---

# DiagV6Link

<DiagV6Link />

<!--
v6, глава 3 «Связь между машинами»: главные оркестраторы двух машин и комната проекта в Matrix с видами сообщений. Раскрытие: <DiagV6Link reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 3 · DiagV6ProfileFlow'
---

# DiagV6ProfileFlow

<DiagV6ProfileFlow />

<!--
v6, глава 3 «Curator — профиль проекта»: профиль компании и манифест проекта → проверки Curator → управляемый дом → запуск из любого каталога; каталоги репозитория не читаем. Раскрытие: <DiagV6ProfileFlow reveal />.
-->

---
layout: default
tag: 'V6 · ГЛАВА 3 · DiagV6Meta'
---

# DiagV6Meta

<DiagV6Meta />

<!--
v6, глава 3 «Одна точка входа»: человек → мета-оркестратор → главные оркестраторы → оркестраторы и воркеры; можно спросить любого. Раскрытие: <DiagV6Meta reveal />.
-->
