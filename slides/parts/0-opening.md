---
layout: two-cols
tag: 'ВСТУПЛЕНИЕ'
---

::title::
# Кто мы и *зачем рассказываем*

::default::
<h2>На работе, в бигтехе</h2>

<ul class="v4a-big">
<li v-click>Параллельные команды</li>
<li v-click>Висящие merge request</li>
<li v-click>Старые процессы</li>
</ul>

::right::
<h2>В своих проектах</h2>

<ul class="v4a-big">
<li v-click>Делаем их сами</li>
<li v-click>Времени на них мало</li>
</ul>

::bottom::
<p v-click class="lead">И там и там упираемся в одно: координацию держит человек.</p>

<style>
.v4a-big li { font-size: 30px; font-weight: 500; line-height: 1.25; margin-bottom: 22px !important; }
</style>

<!--
[Алексей] Коротко о нас. Мы оба работаем в бигтехе: я в МТС, Иван в RWB. И каждый день видим одну и ту же боль координации: параллельные команды, merge request, которые висят, процессы, которые давно пора менять.

[Иван] А ещё мы вдвоём делаем свои проекты в Relux Works, и времени на них мало. Поэтому работу там делают агенты, а мы строим то, что ими управляет. И там и там упираемся в одно: координацию держит человек. Про это и доклад.

Источники: plan/deck-v4-brief.md §1 п. 4 («We work in big tech and see enterprise coordination pain… We also build our own projects with little time»); роли спикеров — титул (slides/slides.md). Статус: контекст спикеров, не утверждение о системе.
-->

---
layout: default
tag: 'ВСТУПЛЕНИЕ'
---

# Что вы *унесёте*

<div class="cards cols-3 grow v4a-xl">
<div v-click class="card big num" data-num="01"><h2>Проблема</h2><p>Много агентов, вендоров и людей на одном проекте.</p></div>
<div v-click class="card big num" data-num="02"><h2>Что покажем</h2><p>Как это устроено у нас. Три демо.</p></div>
<div v-click class="card big purple num" data-num="03"><h2>Что останется</h2><p>Как строить оркестрацию поверх любой агентской среды.</p></div>
</div>

<p v-click class="lead">Ссылки на всё, что откроем, — в конце доклада.</p>

<style>
.v4a-xl .card p { font-size: 28px; line-height: 1.25; }
</style>

<!--
[Иван] Что вы унесёте. Проблема: над одним проектом работают много агентов, несколько вендоров и несколько людей, а почти все инструменты построены вокруг одного человека с одним агентом одного вендора. Мы покажем, как решаем это мы, с тремя демо. А унесёте главное: как строить оркестрацию поверх любой агентской среды, не завязываясь на вендора. Ссылки — в конце.

Источники: plan/deck-v4-brief.md §1 п. 4 («the problem, what we will show, and what they leave with… plus the links we will open»); text/from-buckets-to-apiary.ru.md, вступление («Почти все инструменты построены вокруг одного человека с одним агентом от одного вендора»). Что открываем — открыто (open-questions.md, п. 11). Статус: обещание доклада.
-->

---
layout: two-cols
tag: 'ВСТУПЛЕНИЕ'
---

::title::
# Шесть глав, *вопросы в конце*

::default::
<h2>Алексей</h2>

<ul class="v4a-plan">
<li v-click><span>01</span>Эпохи</li>
<li v-click><span>02</span>Доска и автономия&nbsp;·&nbsp;демо</li>
<li v-click><span>03</span>Без привязки к вендору&nbsp;·&nbsp;демо</li>
</ul>

::right::
<h2>Иван</h2>

<ul class="v4a-plan">
<li v-click><span>04</span>Менеджер агентского контекста</li>
<li v-click><span>05</span>Процессы как конфигурация&nbsp;·&nbsp;демо</li>
<li v-click><span>06</span>Между машинами и рой</li>
</ul>

::bottom::
<p v-click class="lead">В конце — итог и ссылки, вдвоём. Вопросы — после доклада.</p>

<style>
.v4a-plan li { font-size: 20px; font-weight: 500; line-height: 1.3; margin-bottom: 24px !important; display: flex; gap: 14px; white-space: nowrap; }
.v4a-plan li span { font-family: var(--rwb-mono); font-weight: 400; opacity: 0.6; flex: none; }
</style>

<!--
[Алексей] План. Первую половину веду я: как мы сюда пришли, по эпохам; доска и автономия; и как уйти от привязки к вендору. Вторую половину ведёт Иван: контекст агентов, процессы как конфигурация и оркестраторы на разных машинах, вплоть до роя. В конце — итог и ссылки, вопросы — после. Начнём с истории.

Источники: plan/slides-plan.ru.md, хронометраж и главы 1–7; plan/deck-v4-brief.md §1 п. 1 (вопросы только в конце), п. 6 (разделение спикеров). Статус: план; место главы «Менеджер агентского контекста» подтверждают спикеры (бриф v4 §4 п. 2).
-->
