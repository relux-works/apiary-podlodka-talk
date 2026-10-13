<script setup lang="ts">
// Демо 1 «Разработка по логам» (v6, Иван 13.10: «один раз старт и далее в автономном режиме»): настоящий прогон эпика
// доски задач, воспроизведённый по журналам. Сверху доска фаз: задачи переходят между колонками, как менялся их статус;
// белая с фиолетовым ободком — над ней сейчас работает субагент, оранжевая вспышка — ревью вернуло на доработку,
// лаймовая — готово. Снизу дорожки: человек (его сообщения оркестратору), оркестратор (сам просыпается по событиям),
// роли субагентов; полоска — запуск, цвет — модель. Тихие часы без событий проматываются быстро.
// Данные: slides/demo/run.json (.scripts/demo-run.mjs; анонимные id, без имён и текстов). Часы и управление:
// slides/demo/clock.ts. Стиль демо: docs/demos.md.
import { computed } from 'vue'
import data from '../demo/run.json'
import { useDemoClock } from '../demo/clock'

const INTRO = 3500, PLAY = 56000, OUTRO = 9000, QUIET = 450
const DURATION = INTRO + PLAY + OUTRO
const [T0, T1] = data.window as [number, number]

// the replay clock: busy time at one speed, each quiet stretch squeezed to QUIET ms
const quiet = data.quiet as [number, number][]
const busy = T1 - T0 - quiet.reduce((s, [a, b]) => s + b - a, 0)
const rate = (PLAY - quiet.length * QUIET) / busy
const knots: [number, number][] = [[T0, 0]] // [real ms, play ms]
for (const [a, b] of quiet) {
  const [r, d] = knots[knots.length - 1]
  knots.push([a, d + (a - r) * rate], [b, d + (a - r) * rate + QUIET])
}
knots.push([T1, knots[knots.length - 1][1] + (T1 - knots[knots.length - 1][0]) * rate])
const toPlay = (real: number) => {
  let i = 1
  while (i < knots.length - 1 && knots[i][0] < real) i++
  const [r0, d0] = knots[i - 1], [r1, d1] = knots[i]
  return r1 === r0 ? d0 : d0 + ((Math.min(Math.max(real, r0), r1) - r0) / (r1 - r0)) * (d1 - d0)
}
const toReal = (play: number) => {
  let i = 1
  while (i < knots.length - 1 && knots[i][1] < play) i++
  const [r0, d0] = knots[i - 1], [r1, d1] = knots[i]
  return d1 === d0 ? r0 : r0 + ((Math.min(Math.max(play, d0), d1) - d0) / (d1 - d0)) * (r1 - r0)
}

// ---- layout -----------------------------------------------------------------------------------------------
const W = 908, AX = 100, AW = 760 // the time axis; lane counters sit right of it
const COLS = [
  { key: 'queue', label: 'ОЧЕРЕДЬ', of: ['backlog'] },
  { key: 'analysis', label: 'АНАЛИЗ', of: ['analysis'] },
  { key: 'dev', label: 'РАЗРАБОТКА', of: ['to-dev', 'development', 'blocked'] },
  { key: 'review', label: 'РЕВЬЮ', of: ['to-review', 'reviewing'] },
  { key: 'integrating', label: 'ИНТЕГРАЦИЯ', of: ['integrating'] },
  { key: 'done', label: 'ГОТОВО', of: ['done'] },
]
const colOf = (s: string) => Math.max(0, COLS.findIndex((c) => c.of.includes(s)))
const CW = 148, CG = 4, TOK = 16, TG = 6, PER_ROW = 6, BOARD_Y = 44
const LANES = [
  { key: 'human', label: 'Человек', y: 226, h: 18 },
  { key: 'orch', label: 'Оркестратор', y: 250, h: 18 },
  { key: 'analyst', label: 'Аналитик', y: 276, h: 30 },
  { key: 'implementer', label: 'Исполнитель', y: 312, h: 28 },
  { key: 'reviewer', label: 'Ревьюер', y: 346, h: 28 },
]
const laneOf = Object.fromEntries(LANES.map((l) => [l.key, l]))
// vendor colours shared with demo 2 (slides/style.css): OpenAI cyan, Meta magenta, Anthropic amber
const MODELS: Record<string, { cls: string, name: string }> = {
  'gpt-6.1-sol': { cls: 'v-codex', name: 'GPT-6.1 Sol' },
  'gpt-6-astra': { cls: 'v-codex-2', name: 'GPT-6 Astra' },
  'muse-spark-1.3-contributor': { cls: 'v-muse', name: 'Muse Spark' },
  'claude-sonnet-5-5': { cls: 'v-claude', name: 'Claude Sonnet' },
}
const xOf = (play: number) => AX + (Math.min(Math.max(play, 0), PLAY) / PLAY) * AW

// ---- the data on the play clock ---------------------------------------------------------------------------
const tasks = data.tasks.map((t, i) => ({ id: t.id, i, start: t.start, changes: t.changes.map(([r, s, back]) => ({ d: toPlay(r as number), s: s as string, back: !!back })) }))
// runs in role lanes; parallel runs of one role get their own row
const runs = data.runs.map((r) => ({ ...r, ds: toPlay(r.start), de: toPlay(r.end) })).sort((a, b) => a.ds - b.ds)
const rowEnd: Record<string, number[]> = {}
const placed = runs.map((r) => {
  const ends = (rowEnd[r.role] ||= [])
  let row = ends.findIndex((e) => e <= r.ds)
  if (row < 0) row = ends.length
  ends[row] = r.de
  return { ...r, row }
})
const rows = Object.fromEntries(Object.entries(rowEnd).map(([k, v]) => [k, Math.max(1, v.length)]))
const human = data.human.map(toPlay)
const wakes = data.wakes.map(toPlay)
let peak = 0
{
  const ev = runs.flatMap((r) => [[r.ds, 1], [r.de, -1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  let cur = 0
  for (const [, k] of ev) peak = Math.max(peak, (cur += k))
}
const returnsAt = tasks.flatMap((t) => t.changes.filter((c) => c.back).map((c) => c.d)).sort((a, b) => a - b)

// Moscow time, the audience's, on every laptop and in CI alike; day marks at each Moscow midnight
const TZ = 'Europe/Moscow', MSK = 3 * 3600e3, DAY = 86400e3
const dayLabel = (ms: number) => new Date(ms).toLocaleDateString('ru-RU', { timeZone: TZ, weekday: 'short', day: 'numeric' })
const firstDay = dayLabel(T0)
const days: { x: number, label: string }[] = []
for (let m = Math.floor((T0 + MSK) / DAY) * DAY - MSK + DAY; m < T1; m += DAY) days.push({ x: xOf(toPlay(m)), label: dayLabel(m) })

// ---- words ----------------------------------------------------------------------------------------------------
const plural = (n: number, f: [string, string, string]) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
const c = data.counts
const hours = Math.round((T1 - T0) / 3600e3)
const range = `${new Date(T0).toLocaleDateString('ru-RU', { timeZone: TZ, day: 'numeric' })}–${new Date(T1).toLocaleDateString('ru-RU', { timeZone: TZ, day: 'numeric', month: 'long' })}`
const BEATS = [
  { at: 0, text: `Эпик доски задач: ${c.tasks} ${plural(c.tasks, ['задача', 'задачи', 'задач'])}, ${range}` },
  { at: INTRO, text: 'Оркестратор раздаёт задачи аналитикам, исполнителям и ревьюерам' },
  { at: INTRO + (returnsAt[2] ?? PLAY * 0.3), text: 'Ревью возвращает задачи на доработку' },
  { at: INTRO + PLAY * 0.62, text: `Запуски идут параллельно, до ${peak} одновременно, днём и ночью` },
  { at: INTRO + PLAY, text: `Человек написал ${c.human} ${plural(c.human, ['раз', 'раза', 'раз'])} за ${hours} ${plural(hours, ['час', 'часа', 'часов'])}, оркестратор просыпался сам ${c.wakes} ${plural(c.wakes, ['раз', 'раза', 'раз'])}` },
].sort((a, b) => a.at - b.at)

const { t } = useDemoClock('run', DURATION, BEATS.map((b) => b.at))

// ---- one frame --------------------------------------------------------------------------------------------------
const frame = computed(() => {
  const time = t.value
  const p = time - INTRO // play time
  const real = p <= 0 ? T0 : toReal(p)
  const appear = Math.min(1, time / INTRO)
  const cols = COLS.map(() => [] as number[])
  const tokens = tasks.map((tk) => {
    let s = tk.start, back = -Infinity
    for (const ch of tk.changes) { if (ch.d > p) break; s = ch.s; if (ch.back) back = ch.d }
    const col = colOf(s)
    cols[col].push(tk.i)
    const working = runs.some((r) => r.task === tk.id && r.ds <= p && p < r.de)
    return { id: tk.id, col, s, working, flash: p - back < 1200, shown: tk.i / tasks.length < appear, x: 0, y: 0 }
  })
  for (const tk of tokens) {
    const k = cols[tk.col].indexOf(tasks.find((x) => x.id === tk.id)!.i)
    Object.assign(tk, { x: tk.col * (CW + CG) + 11 + (k % PER_ROW) * (TOK + TG), y: BOARD_Y + 30 + Math.floor(k / PER_ROW) * (TOK + TG) })
  }
  const bars = placed.filter((r) => r.ds <= p).map((r) => {
    const lane = laneOf[r.role]
    const n = rows[r.role], rh = (lane.h - (n - 1) * 2) / n
    const x0 = xOf(r.ds), x1 = Math.max(x0 + 2, xOf(Math.min(r.de, p)))
    return { x: x0, w: x1 - x0, y: lane.y + r.row * (rh + 2), h: rh, cls: MODELS[r.model]?.cls ?? 'v-codex-2', cut: r.outcome === 'cancelled' && r.de <= p }
  })
  const quietNow = quiet.find(([a, b]) => real > a && real < b && p > 0 && p < PLAY)
  return {
    p,
    clock: `${new Date(real).toLocaleString('ru-RU', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} мск`,
    skip: quietNow ? `пропуск ${Math.round((quietNow[1] - quietNow[0]) / 3600e3)} ч без событий` : '',
    beat: [...BEATS].reverse().find((b) => b.at <= time)!.text,
    final: time >= INTRO + PLAY,
    counts: COLS.map((_, i) => cols[i].length),
    tokens,
    bars,
    human: human.filter((d) => d <= p).map(xOf),
    wakes: wakes.filter((d) => d <= p).map((d) => `M${xOf(d).toFixed(1)},${laneOf.orch.y + 3}v${laneOf.orch.h - 6}`).join(''),
    runsStarted: runs.filter((r) => r.ds <= p).length,
    returns: returnsAt.filter((d) => d <= p).length,
    lane: {
      human: human.filter((d) => d <= p).length,
      orch: wakes.filter((d) => d <= p).length,
      ...Object.fromEntries(['analyst', 'implementer', 'reviewer'].map((k) => [k, runs.filter((r) => r.role === k && r.ds <= p).length])),
    } as Record<string, number>,
    head: xOf(Math.max(0, p)),
  }
})
const legend = Object.entries(MODELS).filter(([m]) => runs.some((r) => r.model === m)).map(([, v]) => v)
</script>

<template>
  <svg class="demo-run demo-live" :class="{ final: frame.final }" width="908" height="414" viewBox="0 0 908 414" aria-hidden="true">
    <text x="0" y="18" class="t-lab cap">{{ frame.beat }}</text>
    <text x="908" y="17" text-anchor="end" class="clock">{{ frame.clock }}</text>
    <text x="0" y="36" class="t-sec small">запусков <tspan class="v">{{ frame.runsStarted }}</tspan> из {{ runs.length }} · возвратов с ревью <tspan class="v">{{ frame.returns }}</tspan></text>
    <text x="908" y="36" text-anchor="end" class="t-dim small">{{ frame.skip }}</text>

    <g class="board">
      <g v-for="(col, i) in COLS" :key="col.key">
        <rect :x="i * (CW + CG)" :y="BOARD_Y" :width="CW" height="174" rx="10" class="col" :class="{ 'col-done': col.key === 'done' }" />
        <text :x="i * (CW + CG) + 11" :y="BOARD_Y + 19" class="t-head t-sec">{{ col.label }}</text>
        <text :x="i * (CW + CG) + CW - 11" :y="BOARD_Y + 19" text-anchor="end" class="t-head" :class="frame.counts[i] ? 'count' : 't-dim'">{{ frame.counts[i] }}</text>
      </g>
      <rect v-for="tk in frame.tokens" :key="tk.id" x="0" y="0" :width="TOK" :height="TOK" rx="4" class="tok"
        :class="{ working: tk.working, done: tk.s === 'done', flash: tk.flash, blocked: tk.s === 'blocked', hidden: !tk.shown }"
        :style="{ transform: `translate(${tk.x}px, ${tk.y}px)` }" />
    </g>

    <g class="lanes">
      <line v-for="d in days" :key="d.label" :x1="d.x" y1="220" :x2="d.x" y2="378" class="day" />
      <text :x="AX + 5" y="391" class="t-dim small">{{ firstDay }}</text>
      <text v-for="d in days" :key="d.label + 'l'" :x="d.x + 5" y="391" class="t-dim small">{{ d.label }}</text>
      <g v-for="lane in LANES" :key="lane.key" :class="['lane', lane.key]">
        <text :x="AX - 10" :y="lane.y + lane.h / 2 + 4" text-anchor="end" class="t-sec">{{ lane.label }}</text>
        <rect :x="AX" :y="lane.y" :width="AW" :height="lane.h" rx="4" class="lane-bg" />
        <text :x="W" :y="lane.y + lane.h / 2 + 4" text-anchor="end" class="lane-n">{{ frame.lane[lane.key] }}</text>
      </g>
      <path :d="frame.wakes" class="wake" />
      <rect v-for="(b, i) in frame.bars" :key="i" :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="2" :class="['bar', b.cls]" />
      <rect v-for="(b, i) in frame.bars.filter(b => b.cut)" :key="'c' + i" :x="b.x + b.w - 2" :y="b.y" width="2" :height="b.h" class="cut" />
      <circle v-for="(x, i) in frame.human" :key="'h' + i" :cx="x" :cy="laneOf.human.y + laneOf.human.h / 2" r="4" class="human" />
      <line v-if="frame.p > 0 && frame.p < PLAY" :x1="frame.head" y1="220" :x2="frame.head" y2="378" class="head" />
    </g>

    <g class="foot">
      <text :x="AX - 10" y="410" text-anchor="end" class="t-dim small">модель</text>
      <template v-for="(m, i) in legend" :key="m.name">
        <rect :x="AX + i * 124" y="401" width="10" height="10" rx="2" :class="m.cls" />
        <text :x="AX + i * 124 + 16" y="410" class="t-sec small">{{ m.name }}</text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.demo-run text.cap { font-size: 18px; }
.demo-run text.clock { font-size: 15px; fill: var(--rwb-lilac); }
.demo-run text.small { font-size: 12px; }
.demo-run text.count { fill: var(--rwb-txt); }
.demo-run tspan.v { fill: var(--rwb-txt); }
.demo-run text.lane-n { font-size: 13px; fill: var(--rwb-txt); }
.demo-run .col { fill: rgba(255, 255, 255, 0.045); }
.demo-run .col-done { fill: rgba(148, 227, 48, 0.08); }
.demo-run .tok { fill: var(--rwb-card); transition: transform 0.45s ease, fill 0.3s ease, opacity 0.3s ease; }
.demo-run .tok.hidden { opacity: 0; }
.demo-run .tok.working { fill: var(--rwb-txt); stroke: var(--rwb-purple); stroke-width: 3; animation: pulse 1.2s ease-in-out infinite; }
.demo-run .tok.blocked { stroke: var(--rwb-orange); stroke-width: 2; }
.demo-run .tok.done { fill: var(--rwb-lime); }
.demo-run .tok.flash { fill: var(--rwb-orange); }
@keyframes pulse { 50% { stroke-width: 1; } }
.demo-run .lane-bg { fill: rgba(255, 255, 255, 0.035); }
.demo-run .day { stroke: var(--rwb-rule); stroke-width: 1; stroke-dasharray: 3 4; }
.demo-run .wake { stroke: var(--rwb-purple); stroke-width: 1; opacity: 0.85; }
.demo-run .bar { opacity: 0.95; }
.demo-run .v-codex { fill: var(--demo-codex); }
.demo-run .v-codex-2 { fill: var(--demo-codex-2); }
.demo-run .v-muse { fill: var(--demo-muse); }
.demo-run .v-claude { fill: var(--demo-claude); }
.demo-run .cut { fill: var(--rwb-orange); }
.demo-run .human { fill: var(--rwb-lime); }
.demo-run .head { stroke: var(--rwb-lilac); stroke-width: 1.5; }
.demo-run .board, .demo-run .lane { transition: opacity 0.6s ease; }
.demo-run.final .board, .demo-run.final .lane.analyst, .demo-run.final .lane.implementer, .demo-run.final .lane.reviewer { opacity: 0.35; }
.demo-run.final .bar { opacity: 0.35; }
</style>
