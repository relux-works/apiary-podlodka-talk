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
