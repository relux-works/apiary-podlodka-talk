<script setup lang="ts">
// Демо 2, прототип 13.10 (Иван: «показать работу нашего роя… где больше 20 оркестраторов… в похожем стиле, но так,
// чтобы был понятен масштаб»). Две недели всех машин: каждая строка — оркестратор проекта на своей машине, цвет — среда
// (Claude Code, Codex, Muse); точка у бегунка — работает прямо сейчас. Снизу река: сколько оркестраторов и субагентов
// заняты в каждые десять минут. Тот же стиль и то же управление, что у демо 1 (docs/demos.md).
// Данные: slides/demo/swarm.json (.scripts/demo-swarm.mjs по закрытой базе сессий; строки анонимные, без имён проектов).
import { computed } from 'vue'
import data from '../demo/swarm.json'
import { useDemoClock } from '../demo/clock'

const INTRO = 3500, PLAY = 50000, OUTRO = 9000
const DURATION = INTRO + PLAY + OUTRO
const [W0, W1] = data.window as [number, number]
const SPAN = (W1 - W0) / 1000 // seconds
const c = data.counts

// ---- layout ---------------------------------------------------------------------------------------------------------
const W = 908, AX = 100, AW = 760, LH = 4, LG = 1
const RUNTIME_CLS = ['rt-claude', 'rt-codex', 'rt-muse']
const frames: { name: string, n: number, y: number, lanes: number[] }[] = []
{
  let y = 50, i = 0
  for (const h of data.hosts) {
    const lanes = Array.from({ length: h.lanes }, (_, k) => i + k)
    frames.push({ name: h.name.toUpperCase(), n: h.lanes, y, lanes })
    i += h.lanes
    y += 16 + h.lanes * (LH + LG) + 10
  }
}
const laneY = (i: number) => { const f = frames.find((x) => x.lanes.includes(i))!; return f.y + 16 + (i - f.lanes[0]) * (LH + LG) }
const RIVER_Y = frames[frames.length - 1].y + 16 + frames[frames.length - 1].n * (LH + LG) + 18, RIVER_H = Math.max(40, 392 - RIVER_Y)
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
const nHosts = data.hosts.length
const machines = nHosts === 2 ? 'Две машины' : nHosts === 3 ? 'Три машины' : `${nHosts} машин`
const peakAt = (slot: number) => INTRO + ((slot * data.slot) / 1000 / SPAN) * PLAY
const totalHours = c.orchHours + c.workHours
const BEATS = [
  { at: 0, text: `${machines}, ${c.orchestrators} ${plural(c.orchestrators, ['оркестратор', 'оркестратора', 'оркестраторов'])} за две недели` },
  { at: INTRO, text: 'Каждая строка — оркестратор проекта, цвет — среда' },
  { at: peakAt(c.peakOrch.slot), text: `Пик: ${c.peakOrch.n} ${plural(c.peakOrch.n, ['оркестратор', 'оркестратора', 'оркестраторов'])} заняты в одни десять минут` },
  { at: Math.max(peakAt(c.peakOrch.slot) + 6000, INTRO + PLAY * 0.8), text: `Субагентов до ${c.peakWork.n} одновременно, ${num(c.runs)} ${plural(c.runs, ['запуск', 'запуска', 'запусков'])} доски` },
  { at: INTRO + PLAY, text: `Два человека и ${c.orchestrators} ${plural(c.orchestrators, ['оркестратор', 'оркестратора', 'оркестраторов'])}: ${num(totalHours)} ${plural(totalHours, ['час', 'часа', 'часов'])} работы агентов за две недели` },
].sort((a, b) => a.at - b.at)

const { t } = useDemoClock('swarm', DURATION, BEATS.map((b) => b.at))

// ---- one frame ------------------------------------------------------------------------------------------------------
const frame = computed(() => {
  const time = t.value
  const now = Math.max(0, Math.min(1, (time - INTRO) / PLAY)) * SPAN // seconds into the window
  const slot = Math.min(data.orch.length - 1, Math.floor((now * 1000) / data.slot))
  const paths = ['', '', '']
  const live: number[] = []
  data.lanes.forEach((lane, i) => {
    const y = laneY(i)
    for (const [a, b, r] of lane.iv as [number, number, number][]) {
      if (a >= now) break
      const x0 = xOfSec(a), x1 = Math.max(x0 + 0.8, xOfSec(Math.min(b, now)))
      paths[r] += `M${x0.toFixed(1)},${y}h${(x1 - x0).toFixed(1)}v${LH}h${(x0 - x1).toFixed(1)}z`
      if (a <= now && now <= b) live.push(y)
    }
  })
  const area = (s: number[]) => {
    let d = `M${AX},${RIVER_Y + RIVER_H}`
    for (let k = 0; k <= slot; k++) d += `L${xOfSec((k * data.slot) / 1000).toFixed(1)},${(RIVER_Y + RIVER_H - (s[k] / peakMax) * RIVER_H).toFixed(1)}`
    return `${d}L${xOfSec((slot * data.slot) / 1000).toFixed(1)},${RIVER_Y + RIVER_H}Z`
  }
  const perFrame = frames.map((f) => live.filter((y) => y >= f.y && y < f.y + 16 + f.n * (LH + LG)).length)
  const runsN = data.runs.filter((s) => s <= now).length
  return {
    now,
    clock: `${new Date(W0 + now * 1000).toLocaleString('ru-RU', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} мск`,
    beat: [...BEATS].reverse().find((b) => b.at <= time)!.text,
    final: time >= INTRO + PLAY,
    shown: Math.min(1, time / INTRO),
    paths,
    live,
    perFrame,
    orchNow: data.orch[slot] ?? 0,
    workNow: data.work[slot] ?? 0,
    runsN,
    riverO: area(data.orch),
    riverW: area(data.work),
    head: xOfSec(now),
    playing: time > INTRO && time < INTRO + PLAY,
    peakO: now * 1000 >= c.peakOrch.slot * data.slot ? { x: xOfSec((c.peakOrch.slot * data.slot) / 1000), y: RIVER_Y + RIVER_H - (c.peakOrch.n / peakMax) * RIVER_H } : null,
  }
})
</script>

<template>
  <svg class="demo-swarm demo-live" :class="{ final: frame.final }" width="908" height="414" viewBox="0 0 908 414" aria-hidden="true">
    <text x="0" y="18" class="t-lab cap">{{ frame.beat }}</text>
    <text x="908" y="17" text-anchor="end" class="clock">{{ frame.clock }}</text>
    <text x="0" y="36" class="t-sec small">сейчас заняты: оркестраторов <tspan class="v">{{ frame.live.length }}</tspan> · субагентов <tspan class="v">{{ frame.workNow }}</tspan> · запусков доски <tspan class="v">{{ num(frame.runsN) }}</tspan></text>

    <g class="lanes" :style="{ opacity: frame.shown }">
      <line v-for="d in days" :key="d.label" :x1="d.x" :y1="frames[0].y" :x2="d.x" :y2="RIVER_Y + RIVER_H" class="day" />
      <g v-for="(f, k) in frames" :key="f.name">
        <text :x="AX" :y="f.y + 11" class="t-head t-sec">{{ f.name }} · {{ f.n }} {{ plural(f.n, ['ОРКЕСТРАТОР', 'ОРКЕСТРАТОРА', 'ОРКЕСТРАТОРОВ']) }}</text>
        <rect :x="AX" :y="f.y + 16" :width="AW" :height="f.n * (LH + LG) - LG" rx="2" class="lane-bg" />
        <text :x="W" :y="f.y + 16 + (f.n * (LH + LG)) / 2 + 4" text-anchor="end" class="lane-n">{{ frame.perFrame[k] }}</text>
      </g>
      <text x="0" :y="frames[0].y + 30" class="small t-dim">строка —</text>
      <text x="0" :y="frames[0].y + 44" class="small t-dim">оркестратор</text>
      <text x="0" :y="frames[0].y + 58" class="small t-dim">справа —</text>
      <text x="0" :y="frames[0].y + 72" class="small t-dim">заняты сейчас</text>
      <path v-for="(d, r) in frame.paths" :key="r" :d="d" :class="RUNTIME_CLS[r]" />
      <rect v-for="(y, i) in frame.live" :key="'l' + i" :x="frame.head - 1" :y="y - 0.5" width="4" :height="LH + 1" rx="1" class="live" />
    </g>

    <g class="river">
      <text :x="AX - 10" :y="RIVER_Y + 11" text-anchor="end" class="t-head t-sec">ЗАНЯТЫ</text>
      <text :x="AX - 10" :y="RIVER_Y + 26" text-anchor="end" class="small t-dim">за 10 минут</text>
      <rect :x="AX" :y="RIVER_Y" :width="AW" :height="RIVER_H" rx="3" class="lane-bg" />
      <path :d="frame.riverW" class="river-work" />
      <path :d="frame.riverO" class="river-orch" />
      <g v-if="frame.peakO">
        <circle :cx="frame.peakO.x" :cy="frame.peakO.y" r="3.5" class="peak" />
        <text :x="frame.peakO.x + 7" :y="frame.peakO.y + 4" class="small v">{{ c.peakOrch.n }}</text>
      </g>
      <line v-if="frame.playing" :x1="frame.head" :y1="frames[0].y" :x2="frame.head" :y2="RIVER_Y + RIVER_H" class="head" />
    </g>

    <g class="foot">
      <text v-for="d in days" :key="d.label + 't'" :x="d.x + 3" y="405" class="t-dim tiny">{{ d.label }}</text>
    </g>
    <g class="legend">
      <template v-for="(name, r) in data.runtimes" :key="name">
        <rect :x="W - 330 + r * 112" y="27" width="10" height="10" rx="2" :class="RUNTIME_CLS[r]" />
        <text :x="W - 314 + r * 112" y="36" class="t-sec small">{{ name }}</text>
      </template>
    </g>
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
.demo-swarm .rt-claude { fill: var(--rwb-txt); }
.demo-swarm .rt-codex { fill: var(--rwb-lilac); }
.demo-swarm .rt-muse { fill: var(--rwb-purple); }
.demo-swarm .live { fill: var(--rwb-lime); }
.demo-swarm .river-orch { fill: var(--rwb-purple); opacity: 0.9; }
.demo-swarm .river-work { fill: var(--rwb-lilac); opacity: 0.55; }
.demo-swarm .peak { fill: var(--rwb-lime); }
.demo-swarm .head { stroke: var(--rwb-lilac); stroke-width: 1.5; }
.demo-swarm .lanes, .demo-swarm .river { transition: opacity 0.6s ease; }
</style>
