<script setup lang="ts">
// Демо 2, прототип 13.10 (Иван: «показать работу нашего роя… где больше 20 оркестраторов… в похожем стиле, но так,
// чтобы был понятен масштаб»; затем: контрастные цвета вендоров, без почти пустых оркестраторов, видно, где работает
// оркестратор, а где его субагенты). Две недели всех машин:
// - строка — оркестратор проекта на своей машине, не меньше 10 часов работы: сверху полоса — он сам, снизу — его
//   субагенты; цвет — вендор (Claude Code янтарный, Codex голубой, Muse пурпурный); у бегунка — кто занят сейчас;
// - Matrix: сообщения агентов Ивана и агентов Алексея за каждые полчаса по видам (рабочие серые, решения лаймовые,
//   вопросы оранжевые) и между ними — что одна сторона писала другой;
// - река: сколько оркестраторов и субагентов заняты в каждые десять минут, пик отмечен.
// Данные: slides/demo/swarm.json (.scripts/demo-swarm.mjs по закрытой базе сессий и выгрузке метаданных a2a; строки
// анонимные, без имён проектов и текстов). Управление и часы — как у демо 1 (slides/demo/clock.ts, docs/demos.md).
import { computed } from 'vue'
import data from '../demo/swarm.json'
import { useDemoClock } from '../demo/clock'

const INTRO = 3500, PLAY = 50000, OUTRO = 9000
const DURATION = INTRO + PLAY + OUTRO
const [W0, W1] = data.window as [number, number]
const SPAN = (W1 - W0) / 1000 // seconds
const c = data.counts
const mx = data.matrix as null | { bin: number, sides: number[][][], cross: number[], total: number, crossTotal: number, agents: number[] }

// ---- layout ---------------------------------------------------------------------------------------------------------
const W = 908, AX = 100, AW = 760, TOP = 48
const VENDOR = ['v-claude', 'v-codex', 'v-muse']
const RIVER_H = 32, RIVER_Y = 392 - RIVER_H
const MX_ROW = 13, MX_GAP = 3, MX_Y = mx ? RIVER_Y - 10 - (14 + 3 * MX_ROW + 2 * MX_GAP) : RIVER_Y
const HEAD = 16, FRAME_GAP = 8
const laneCount = data.lanes.length
const pitch = Math.min(11, (MX_Y - 8 - TOP - data.hosts.length * (HEAD + FRAME_GAP)) / laneCount)
const OH = pitch * 0.46, SH = pitch * 0.38 // orchestrator and subagent tracks
const frames: { name: string, n: number, of: number, y: number, first: number }[] = []
{
  let y = TOP, first = 0
  for (const h of data.hosts) {
    frames.push({ name: h.name.toUpperCase(), n: h.lanes, of: h.of, y, first })
    first += h.lanes
    y += HEAD + h.lanes * pitch + FRAME_GAP
  }
}
const laneY = (i: number) => { const f = [...frames].reverse().find((x) => i >= x.first)!; return f.y + HEAD + (i - f.first) * pitch }
const xOfSec = (s: number) => AX + (s / SPAN) * AW
const peakMax = Math.max(c.peakOrch.n, c.peakWork.n)

// day marks at Moscow midnights (the window starts at one)
const TZ = 'Europe/Moscow'
const days = Array.from({ length: Math.round(SPAN / 86400) }, (_, d) => ({
  x: xOfSec(d * 86400),
  label: new Date(W0 + d * 86400e3).toLocaleDateString('ru-RU', { timeZone: TZ, weekday: 'short', day: 'numeric' }),
}))

// ---- words ----------------------------------------------------------------------------------------------------------
const plural = (n: number, f: [string, string, string]) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
const num = (n: number) => n.toLocaleString('ru-RU')
const ORCH: [string, string, string] = ['оркестратор', 'оркестратора', 'оркестраторов']
const machines = { 1: 'одной машине', 2: 'двух машинах', 3: 'трёх машинах' }[data.hosts.length as 1 | 2 | 3] ?? `${data.hosts.length} машинах`
const agents = mx ? mx.agents[0] + mx.agents[1] : 0
const totalHours = c.orchHours + c.workHours
const peakAt = (slot: number) => INTRO + ((slot * data.slot) / 1000 / SPAN) * PLAY
const BEATS = [
  { at: 0, text: `Две недели нашего роя: ${c.orchestrators} ${plural(c.orchestrators, ORCH)} на ${machines}${mx ? `, ${agents} ${plural(agents, ['агент', 'агента', 'агентов'])} в Matrix` : ''}` },
  { at: INTRO, text: 'Строка — оркестратор: сверху он сам, снизу его субагенты; цвет — вендор' },
  { at: peakAt(c.peakOrch.slot), text: `Пик: ${c.peakOrch.n} ${plural(c.peakOrch.n, ORCH)} заняты в одни десять минут` },
  ...(mx ? [{ at: Math.max(peakAt(c.peakOrch.slot) + 6000, INTRO + PLAY * 0.74), text: `Агенты Ивана и Алексея пишут друг другу напрямую: больше ${num(Math.floor(mx.crossTotal / 100) * 100)} сообщений` }] : []),
  { at: INTRO + PLAY, text: `Два человека и ${c.orchestrators} ${plural(c.orchestrators, ORCH)}: ${num(totalHours)} ${plural(totalHours, ['час', 'часа', 'часов'])} работы агентов за две недели` },
].sort((a, b) => a.at - b.at)

const { t } = useDemoClock('swarm', DURATION, BEATS.map((b) => b.at))

// ---- Matrix: bars per 30 minutes ----------------------------------------------------------------------------------
const MX_ROWS = mx
  ? [
      { key: 'ivan', label: `Ивана · ${mx.agents[0]}`, y: MX_Y + 14 },
      { key: 'cross', label: 'между', y: MX_Y + 14 + MX_ROW + MX_GAP },
      { key: 'alexey', label: `Алексея · ${mx.agents[1]}`, y: MX_Y + 14 + 2 * (MX_ROW + MX_GAP) },
    ]
  : []
const mxMax = mx ? Math.max(1, ...mx.sides.flatMap((s) => s[0].map((_, k) => s[0][k] + s[1][k] + s[2][k]))) : 1
const crossMax = mx ? Math.max(1, ...mx.cross) : 1

// ---- one frame ------------------------------------------------------------------------------------------------------
const rect = (x0: number, x1: number, y: number, h: number) => `M${x0.toFixed(1)},${y.toFixed(1)}h${(x1 - x0).toFixed(1)}v${h.toFixed(1)}h${(x0 - x1).toFixed(1)}z`
const frame = computed(() => {
  const time = t.value
  const now = Math.max(0, Math.min(1, (time - INTRO) / PLAY)) * SPAN // seconds into the window
  const slot = Math.min(data.orch.length - 1, Math.floor((now * 1000) / data.slot))
  const orch = ['', '', ''], sub = ['', '', '']
  const liveO: number[] = [], liveS: number[] = []
  data.lanes.forEach((lane, i) => {
    const y = laneY(i)
    for (const [a, b, r] of lane.o as [number, number, number][]) {
      if (a >= now) break
      orch[r] += rect(xOfSec(a), Math.max(xOfSec(a) + 0.8, xOfSec(Math.min(b, now))), y, OH)
      if (now <= b) liveO.push(y)
    }
    for (const [a, b, r] of lane.s as [number, number, number][]) {
      if (a >= now) break
      sub[r] += rect(xOfSec(a), Math.max(xOfSec(a) + 0.8, xOfSec(Math.min(b, now))), y + OH + 0.6, SH)
      if (now <= b) liveS.push(y + OH + 0.6)
    }
  })
  const area = (s: number[]) => {
    let d = `M${AX},${RIVER_Y + RIVER_H}`
    for (let k = 0; k <= slot; k++) d += `L${xOfSec((k * data.slot) / 1000).toFixed(1)},${(RIVER_Y + RIVER_H - (s[k] / peakMax) * RIVER_H).toFixed(1)}`
    return `${d}L${xOfSec((slot * data.slot) / 1000).toFixed(1)},${RIVER_Y + RIVER_H}Z`
  }
  // Matrix bars up to the playhead: work, decisions and questions stacked per side; cross-side traffic in the middle row
  const bars = { work: '', decision: '', question: '', cross: '' }
  let msgs = 0, crossN = 0
  if (mx) {
    const bw = Math.max(0.9, (mx.bin / 1000 / SPAN) * AW - 0.3)
    const lastBin = Math.floor((now * 1000) / mx.bin)
    for (let k = 0; k <= Math.min(lastBin, mx.cross.length - 1); k++) {
      if (now <= 0) break
      const x = xOfSec((k * mx.bin) / 1000)
      for (const [si, row] of [[0, MX_ROWS[0]], [1, MX_ROWS[2]]] as const) {
        let base = row.y + MX_ROW
        for (const [g, key] of [[0, 'work'], [1, 'decision'], [2, 'question']] as const) {
          const n = mx.sides[si][g][k]
          if (!n) continue
          msgs += n
          const all = mx.sides[si][0][k] + mx.sides[si][1][k] + mx.sides[si][2][k]
          const h = Math.sqrt(all / mxMax) * MX_ROW * (n / all) // the bar's height on a square-root scale, split by kind
          base -= h
          bars[key] += rect(x, x + bw, base, h)
        }
      }
      if (mx.cross[k]) {
        crossN += mx.cross[k]
        const h = Math.max(1.5, Math.sqrt(mx.cross[k] / crossMax) * MX_ROW)
        bars.cross += rect(x, x + bw, MX_ROWS[1].y + (MX_ROW - h) / 2, h)
      }
    }
  }
  const perFrame = frames.map((f) => liveO.filter((y) => y >= f.y && y < f.y + HEAD + f.n * pitch).length)
  return {
    now,
    clock: `${new Date(W0 + now * 1000).toLocaleString('ru-RU', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} мск`,
    beat: [...BEATS].reverse().find((b) => b.at <= time)!.text,
    shown: Math.min(1, time / INTRO),
    orch,
    sub,
    liveO,
    liveS,
    perFrame,
    workNow: data.work[slot] ?? 0,
    runsN: data.runs.filter((s) => s <= now).length,
    msgs,
    crossN,
    bars,
    riverO: area(data.orch),
    riverW: area(data.work),
    head: xOfSec(now),
    playing: time > INTRO && time < INTRO + PLAY,
    peakO: now * 1000 >= c.peakOrch.slot * data.slot ? { x: xOfSec((c.peakOrch.slot * data.slot) / 1000), y: RIVER_Y + RIVER_H - (c.peakOrch.n / peakMax) * RIVER_H } : null,
  }
})
</script>

<template>
  <svg class="demo-swarm demo-live" width="908" height="414" viewBox="0 0 908 414" aria-hidden="true">
    <text x="0" y="18" class="t-lab cap">{{ frame.beat }}</text>
    <text x="908" y="17" text-anchor="end" class="clock">{{ frame.clock }}</text>
    <text x="0" y="36" class="t-sec small">сейчас заняты: оркестраторов <tspan class="v">{{ frame.liveO.length }}</tspan> · субагентов <tspan class="v">{{ frame.workNow }}</tspan> · запусков доски <tspan class="v">{{ num(frame.runsN) }}</tspan><tspan v-if="mx"> · сообщений <tspan class="v">{{ num(frame.msgs) }}</tspan></tspan></text>

    <g class="lanes" :style="{ opacity: frame.shown }">
      <line v-for="d in days" :key="d.label" :x1="d.x" :y1="TOP" :x2="d.x" :y2="RIVER_Y + RIVER_H" class="day" />
      <g v-for="(f, k) in frames" :key="f.name">
        <text :x="AX" :y="f.y + 11" class="t-head t-sec">{{ f.name }} · {{ f.n }} ИЗ {{ f.of }} {{ plural(f.of, ['ОРКЕСТРАТОРА', 'ОРКЕСТРАТОРОВ', 'ОРКЕСТРАТОРОВ']) }}</text>
        <rect :x="AX" :y="f.y + HEAD" :width="AW" :height="f.n * pitch - (pitch - OH - SH - 0.6)" rx="2" class="lane-bg" />
        <text :x="W" :y="f.y + HEAD + (f.n * pitch) / 2 + 4" text-anchor="end" class="lane-n">{{ frame.perFrame[k] }}</text>
      </g>
      <text x="0" :y="frames[0].y + HEAD + 10" class="small t-dim">сверху —</text>
      <text x="0" :y="frames[0].y + HEAD + 24" class="small t-dim">оркестратор,</text>
      <text x="0" :y="frames[0].y + HEAD + 38" class="small t-dim">снизу — его</text>
      <text x="0" :y="frames[0].y + HEAD + 52" class="small t-dim">субагенты</text>
      <template v-for="(name, r) in data.runtimes" :key="name">
        <rect x="0" :y="frames[0].y + HEAD + 70 + r * 16" width="10" height="10" rx="2" :class="VENDOR[r]" />
        <text x="16" :y="frames[0].y + HEAD + 79 + r * 16" class="t-sec small">{{ name }}</text>
      </template>
      <path v-for="(d, r) in frame.orch" :key="'o' + r" :d="d" :class="VENDOR[r]" />
      <path v-for="(d, r) in frame.sub" :key="'s' + r" :d="d" :class="[VENDOR[r], 'sub']" />
      <rect v-for="(y, i) in frame.liveO" :key="'lo' + i" :x="frame.head - 1" :y="y - 0.5" width="4" :height="OH + 1" rx="1" class="live" />
      <rect v-for="(y, i) in frame.liveS" :key="'ls' + i" :x="frame.head - 1" :y="y" width="3" :height="SH" rx="1" class="live-sub" />
    </g>

    <g v-if="mx" class="matrix">
      <text :x="AX" :y="MX_Y + 10" class="t-head t-sec">СООБЩЕНИЯ В MATRIX · АГЕНТЫ</text>
      <text :x="W" :y="MX_Y + 10" text-anchor="end" class="small t-dim">рабочие · <tspan class="t-lime">решения</tspan> · <tspan class="t-orange">вопросы</tspan></text>
      <g v-for="row in MX_ROWS" :key="row.key">
        <text :x="AX - 10" :y="row.y + MX_ROW - 2" text-anchor="end" class="small t-sec">{{ row.label }}</text>
        <rect :x="AX" :y="row.y" :width="AW" :height="MX_ROW" rx="2" class="lane-bg" />
      </g>
      <path :d="frame.bars.work" class="mx-work" />
      <path :d="frame.bars.decision" class="mx-decision" />
      <path :d="frame.bars.question" class="mx-question" />
      <path :d="frame.bars.cross" class="mx-cross" />
      <text :x="W" :y="MX_ROWS[1].y + MX_ROW - 2" text-anchor="end" class="lane-n">{{ num(frame.crossN) }}</text>
    </g>

    <g class="river">
      <text :x="AX - 10" :y="RIVER_Y + 12" text-anchor="end" class="t-head t-sec">ЗАНЯТЫ</text>
      <text :x="AX - 10" :y="RIVER_Y + 26" text-anchor="end" class="small t-dim">за 10 минут</text>
      <rect :x="AX" :y="RIVER_Y" :width="AW" :height="RIVER_H" rx="3" class="lane-bg" />
      <path :d="frame.riverW" class="river-work" />
      <path :d="frame.riverO" class="river-orch" />
      <g v-if="frame.peakO">
        <circle :cx="frame.peakO.x" :cy="frame.peakO.y" r="3.5" class="peak" />
        <text :x="frame.peakO.x + 7" :y="frame.peakO.y + 4" class="small v">{{ c.peakOrch.n }}</text>
      </g>
      <line v-if="frame.playing" :x1="frame.head" :y1="TOP" :x2="frame.head" :y2="RIVER_Y + RIVER_H" class="head" />
    </g>

    <text v-for="d in days" :key="d.label + 't'" :x="d.x + 3" y="405" class="t-dim tiny">{{ d.label }}</text>
  </svg>
</template>

<style scoped>
.demo-swarm text.cap { font-size: 18px; }
.demo-swarm text.clock { font-size: 15px; fill: var(--rwb-lilac); }
.demo-swarm text.small { font-size: 12px; }
.demo-swarm text.tiny { font-size: 10px; }
.demo-swarm .v, .demo-swarm tspan.v { fill: var(--rwb-txt); }
.demo-swarm text.lane-n { font-size: 13px; fill: var(--rwb-txt); }
.demo-swarm .lane-bg { fill: rgba(255, 255, 255, 0.035); }
.demo-swarm .day { stroke: var(--rwb-rule); stroke-width: 1; stroke-dasharray: 3 4; }
.demo-swarm .v-claude { fill: var(--demo-claude); }
.demo-swarm .v-codex { fill: var(--demo-codex); }
.demo-swarm .v-muse { fill: var(--demo-muse); }
.demo-swarm .sub { opacity: 0.85; }
.demo-swarm .live { fill: var(--rwb-lime); }
.demo-swarm .live-sub { fill: var(--rwb-txt); }
.demo-swarm .mx-work { fill: var(--rwb-sec); }
.demo-swarm .mx-decision { fill: var(--rwb-lime); }
.demo-swarm .mx-question { fill: var(--rwb-orange); }
.demo-swarm .mx-cross { fill: var(--rwb-txt); }
.demo-swarm .river-orch { fill: var(--rwb-purple); opacity: 0.9; }
.demo-swarm .river-work { fill: var(--rwb-lilac); opacity: 0.55; }
.demo-swarm .peak { fill: var(--rwb-lime); }
.demo-swarm .head { stroke: var(--rwb-lilac); stroke-width: 1.5; }
.demo-swarm .lanes { transition: opacity 0.6s ease; }
</style>
