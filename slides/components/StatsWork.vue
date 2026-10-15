<script setup lang="ts">
// Статистика после демо 1 (Иван, 13.10: «1 слайд после первого демо… наглядно покажут статистику»): две недели работы
// агентов на наших машинах. Карточки: запуски доски, сессии субагентов, часы агентов, часы людей (ревью Алексея 15.10:
// вместо «2 человека» — часы; Иван 15.10: 10-минутки, в которых человек писал оркестратору, .scripts/people-hours.mjs);
// ниже — запуски по ролям
// (журналы mini) и часы по вендорам у оркестраторов и у субагентов: оркестраторы в основном на Claude, исполнители —
// на Codex и Muse. Цифры читаются из slides/demo/stats.json (.scripts/swarm-stats.mjs), определения — docs/swarm-stats.md.
import stats from '../demo/stats.json'

const v = stats.twoWeeks
const num = (n: number) => n.toLocaleString('ru-RU')
const plural = (n: number, f: [string, string, string]) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
const hours = v.orchestrators.sumH + v.subagents.sumH
const people = Math.round(v.people.hours[0]) // the low end of the range: some prompts are known only to their half hour
const times = Math.round(hours / v.people.hours[0])
const roles = [
  { k: 'implementer', label: 'Исполнитель' },
  { k: 'reviewer', label: 'Ревьюер' },
  { k: 'analyst', label: 'Аналитик' },
].map((r) => ({ ...r, n: (v.runs.rolesMini as Record<string, number>)[r.k] || 0 }))
const roleMax = Math.max(...roles.map((r) => r.n))
const VENDORS = [{ k: 'claude', label: 'Claude Code', cls: 'v-claude' }, { k: 'codex', label: 'Codex', cls: 'v-codex' }, { k: 'muse', label: 'Muse', cls: 'v-muse' }]
const cohorts = [
  { label: 'Оркестраторы', total: v.orchestrators.sumH, by: v.orchestrators.byRuntime as Record<string, { sumH: number }> },
  { label: 'Субагенты', total: v.subagents.sumH, by: v.subagents.byRuntime as Record<string, { sumH: number }> },
]
const hMax = Math.max(...cohorts.map((c) => c.total))
const BAR = 230 // the longest bar, px; its label must stay inside the svg
const stack = (c: typeof cohorts[number]) => {
  let x = 0
  return VENDORS.map((vd) => { const w = ((c.by[vd.k]?.sumH || 0) / hMax) * BAR; const seg = { x, w, cls: vd.cls, h: c.by[vd.k]?.sumH || 0 }; x += w; return seg }).filter((s) => s.w > 0)
}
</script>

<template>
  <div class="cards cols-4">
    <BigNum :value="num(v.runs.total)" :caption="`${plural(v.runs.total, ['запуск', 'запуска', 'запусков'])} доски: анализ, код, ревью`" />
    <BigNum :value="num(v.subagents.sessions)" :caption="`${plural(v.subagents.sessions, ['сессия', 'сессии', 'сессий'])} субагентов, до ${v.subagents.peak.n} одновременно`" />
    <BigNum :value="`${num(hours)} ч`" :caption="`работы агентов: ${num(v.orchestrators.sumH)} у оркестраторов, ${num(v.subagents.sumH)} у субагентов`" tone="neutral" />
    <BigNum :value="`${num(people)} ч`" :caption="`люди: в ${times} ${plural(times, ['раз', 'раза', 'раз'])} меньше, чем у агентов`" tone="neutral" />
  </div>
  <svg v-click class="stats-work" width="908" height="128" viewBox="0 0 908 128" aria-hidden="true">
    <text x="0" y="14" class="t-head t-sec">ЗАПУСКИ ДОСКИ ПО РОЛЯМ · MINI</text>
    <g v-for="(r, i) in roles" :key="r.k">
      <text x="0" :y="44 + i * 30" class="t-sec">{{ r.label }}</text>
      <rect x="112" :y="31 + i * 30" :width="(r.n / roleMax) * 250" height="18" rx="3" class="n-lilac" />
      <text :x="120 + (r.n / roleMax) * 250" :y="44 + i * 30" class="v">{{ num(r.n) }}</text>
    </g>
    <text x="468" y="14" class="t-head t-sec">ЧАСЫ ПО ВЕНДОРАМ</text>
    <g v-for="(c, i) in cohorts" :key="c.label">
      <text x="468" :y="44 + i * 34" class="t-sec">{{ c.label }}</text>
      <rect v-for="s in stack(c)" :key="s.cls" :x="582 + s.x" :y="31 + i * 34" :width="s.w" height="18" :class="s.cls" />
      <text :x="590 + (c.total / hMax) * BAR" :y="44 + i * 34" class="v">{{ num(c.total) }} ч</text>
    </g>
    <template v-for="(vd, i) in VENDORS" :key="vd.k">
      <rect :x="582 + i * 112" y="108" width="10" height="10" rx="2" :class="vd.cls" />
      <text :x="598 + i * 112" y="117" class="t-sec small">{{ vd.label }}</text>
    </template>
  </svg>
  <p v-click class="lead lime">{{ num(hours) }} {{ plural(hours, ['час', 'часа', 'часов']) }} агентов против {{ num(people) }} {{ plural(people, ['часа', 'часов', 'часов']) }} людей.</p>
</template>

<style scoped>
.stats-work { display: block; margin: 18px 0 0 0; }
.stats-work text.v { fill: var(--rwb-txt); }
.stats-work text.small { font-size: 12px; }
.stats-work .v-claude { fill: var(--demo-claude); }
.stats-work .v-codex { fill: var(--demo-codex); }
.stats-work .v-muse { fill: var(--demo-muse); }
</style>
