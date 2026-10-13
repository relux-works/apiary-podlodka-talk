<script setup lang="ts">
// Демо 3 «Внешние агенты в одной среде», после «Время агента для открытых проектов» (Иван, 13.10: «демо 3 после 55 слайда
// которое визуализировало бы допустим 10 внешних агентов, одну нашу централизованную среду, и начиная от хэндшейка и до
// завершения задачи и отключения агента — с особым акцентом на то что обе среды (наша + агентский цикл донора) защищены…
// как создаются пользователи под агентов и потом уничтожаются»).
// Это схема по принятому дизайну, а не повтор логов: ничего из этого ещё не построено. Строка — донор: сверху его агентский
// цикл (модель думает у донора, на его подписке), снизу наш пользователь ОС рабочего места — от user.create до удаления дома.
// Этапы — из плана реализации, веха A: присоединение → первое задание → разрыв и переподключение → выгрузка и доработка →
// финальная выгрузка и вывод. События и защиты — curator-spec CIP-0009 ревизия 7 (D4.1–D4.7 присоединение и допуск, D5 канал
// и письма, D5a выгрузка и ревью, D5b веб выключен, D5c список разрешённых команд, D7 вывод, D9 отдельный хост присоединения,
// D10 init только человеком), CIP-0008 R6, R9; user manager helper.md §4.3 (user.create, новое поколение аккаунта, ноль
// исходящих), §4.4 (вывод: процессов нет, выгрузка, дом удаляется без архива); dispatcher §5.2, §5.4; TRU §5, §7; книга
// Swarma, глава 11. Десять доноров — для наглядности (в книге пример на пятерых); расписание событий синтетическое.
// Управление и часы — как у демо 1 (slides/demo/clock.ts, docs/demos.md).
import { computed } from 'vue'
import { useDemoClock } from '../demo/clock'

// ---- the schedule: ten donors, staggered ----------------------------------------------------------------------------
const INTRO = 3500, PLAY = 52000, OUTRO = 9000
const DURATION = INTRO + PLAY + OUTRO
const N = 10
const WORK = [9000, 12000, 10500, 13000, 9500, 11000, 12500, 9000, 10000, 11500]
const REWORK = new Set([2, 5, 8]) // review asked for changes
const DOWN = new Set([3, 7]) // the link broke during the task
const REFUSED = new Set([1, 4, 6]) // a build or test call was refused
interface Donor {
  k: number, start: number, keys: number, check: number, admit: number, user: number, letter: number,
  down: null | [number, number], refused: null | number, export1: number, review1: number, rework: null | [number, number],
  land: number, retire: number, removed: number,
}
const donors: Donor[] = Array.from({ length: N }, (_, k) => {
  const start = INTRO + 600 + k * 2300
  const keys = start, check = start + 900, admit = start + 1700, user = start + 2300, letter = start + 3200
  const workEnd = letter + WORK[k]
  const down: null | [number, number] = DOWN.has(k) ? [letter + WORK[k] * 0.45, letter + WORK[k] * 0.45 + 2000] : null
  const refused = REFUSED.has(k) ? letter + WORK[k] * 0.3 : null
  const export1 = workEnd, review1 = workEnd + 2200
  const rework: null | [number, number] = REWORK.has(k) ? [review1, review1 + 4200] : null
  const land = (rework ? rework[1] + 1600 : review1) + 400
  const retire = land + 600, removed = retire + 900
  return { k, start, keys, check, admit, user, letter, down, refused, export1, review1, rework, land, retire, removed }
})
const END = Math.max(...donors.map((d) => d.removed))
const first = (f: (d: Donor) => number | null) => Math.min(...donors.map(f).filter((x): x is number => x !== null))

// ---- beats, at least 6 s apart -------------------------------------------------------------------------------------
const RAW_BEATS = [
  { at: 0, text: 'Десять внешних агентов и одна наша среда: защищены обе стороны' },
  { at: INTRO, text: 'Присоединение: init у донора, проверка среды, допуск — и у нас новый пользователь ОС' },
  { at: first((d) => d.letter), text: 'Задание приходит письмом: подпись проверяют и у нас, и у донора' },
  { at: first((d) => d.refused), text: 'Инструменты работают у нас, но сборка и тесты в рабочем месте запрещены' },
  { at: first((d) => d.down?.[0] ?? null), text: 'Связь оборвалась: донор сам переподключается, вызовы не повторяются' },
  { at: first((d) => d.rework?.[0] ?? null), text: 'Код уходит только выгрузкой: ревью у нас, по замечаниям — доработка' },
  { at: first((d) => d.removed), text: 'Вывод из работы: дом и пользователь удалены, сертификат отозван' },
  { at: INTRO + PLAY, text: 'Обе среды защищены: у нас ни одного исходящего соединения, у донора — свои ключи и подписка' },
].sort((a, b) => a.at - b.at)
const BEATS = RAW_BEATS.map((b) => ({ ...b }))
for (let i = 1; i < BEATS.length - 1; i++) BEATS[i].at = Math.min(Math.max(BEATS[i].at, BEATS[i - 1].at + 6000), INTRO + PLAY - 6000 * (BEATS.length - 1 - i))

const { t } = useDemoClock('remote', DURATION, BEATS.map((b) => b.at))

// ---- layout ---------------------------------------------------------------------------------------------------------
const W = 908, AX = 92, AW = 700, LANE_Y = 74, PITCH = 24, TH = 8
const xOf = (ms: number) => AX + ((Math.min(ms, END) - INTRO) / (END - INTRO)) * AW
const laneY = (k: number) => LANE_Y + k * PITCH
// a growing count keeps the text after it in place: tabular figures plus an invisible head as wide as the largest value's
const pad = (n: number, max: number) => { const s = String(n), m = String(Math.max(n, max)); return m.slice(0, m.length - s.length) }

const OURS = [
  { at: first((d) => d.user), text: 'ноль исходящих, даже loopback' },
  { at: first((d) => d.refused), text: 'только разрешённые команды' },
  { at: first((d) => d.admit), text: 'гранты: свой тред, свой ящик, срок' },
  { at: first((d) => d.removed), text: 'дом и пользователь удаляются' },
]
const THEIRS = [
  { at: first((d) => d.keys), text: 'init — только человек, ключи у донора' },
  { at: first((d) => d.letter), text: 'lockdown: своих инструментов нет, веба нет' },
  { at: first((d) => d.letter) + 1500, text: 'модель на своей подписке' },
  { at: first((d) => d.down?.[0] ?? null), text: 'к донору — ни одного соединения' },
]

const frame = computed(() => {
  const time = t.value
  const p = Math.min(time, END)
  const lanes = donors.map((d) => {
    const y = laneY(d.k)
    const seg = (a: number, b: number, cls: string, track: 0 | 1) => (a < p ? { x: xOf(a), w: Math.max(0.8, xOf(Math.min(b, p)) - xOf(a)), y: y + (track ? TH + 2 : 0), cls } : null)
    const workEnd = d.export1
    const segs = [
      seg(d.keys, d.letter, 'join', 0),
      ...(d.down ? [seg(d.letter, d.down[0], 'think', 0), seg(d.down[0], d.down[1], 'down', 0), seg(d.down[1], workEnd, 'think', 0)] : [seg(d.letter, workEnd, 'think', 0)]),
      seg(workEnd, d.review1, 'export', 0),
      ...(d.rework ? [seg(d.rework[0], d.rework[1], 'think', 0), seg(d.rework[1], d.land, 'export', 0)] : []),
      seg(d.user, d.retire, 'user', 1),
      seg(d.retire, d.removed, 'retiring', 1),
    ].filter(Boolean) as { x: number, w: number, y: number, cls: string }[]
    const marks = [
      ...(d.refused !== null && d.refused <= p ? [{ x: xOf(d.refused), y: y + TH + 2, cls: 'm-no' }] : []),
      ...(d.rework && d.rework[0] <= p ? [{ x: xOf(d.rework[0]), y: y + TH + 2, cls: 'm-no' }] : []),
      ...(d.land <= p ? [{ x: xOf(d.land), y: y + TH + 2, cls: 'm-ok' }] : []),
    ]
    const state = p < d.user ? (p >= d.keys ? 'присоединение' : '') : p < d.user + 400 ? 'creating' : p < d.retire ? 'active' : p < d.removed ? 'retiring' : 'removed'
    return { k: d.k, y, segs, marks, state, gone: p >= d.removed, link: p >= d.admit && p < d.retire && !(d.down && p >= d.down[0] && p < d.down[1]), broken: !!d.down && p >= d.down[0] && p < d.down[1] }
  })
  const live = donors.filter((d) => p >= d.user && p < d.removed).length
  const created = donors.filter((d) => p >= d.user).length
  const removed = donors.filter((d) => p >= d.removed).length
  const review = donors.filter((d) => (p >= d.export1 && p < d.review1) || (d.rework && p >= d.rework[1] && p < d.land)).length
  const landed = donors.filter((d) => p >= d.land).length
  return {
    beat: [...BEATS].reverse().find((b) => b.at <= time)!.text,
    lanes,
    live, created, removed, review, landed,
    ours: OURS.map((o) => ({ ...o, on: time >= o.at })),
    theirs: THEIRS.map((o) => ({ ...o, on: time >= o.at })),
    head: xOf(p),
    playing: time > INTRO && time < INTRO + PLAY,
  }
})
</script>

<template>
  <svg class="demo-remote demo-live" :data-demo-t="Math.round(t)" width="908" height="414" viewBox="0 0 908 414" aria-hidden="true">
    <text x="0" y="18" class="t-lab cap">{{ frame.beat }}</text>
    <text x="0" y="38" class="t-sec small status">рабочих мест сейчас <tspan class="pad">{{ pad(frame.live, N) }}</tspan><tspan class="v">{{ frame.live }}</tspan> · пользователей ОС создано <tspan class="pad">{{ pad(frame.created, N) }}</tspan><tspan class="v">{{ frame.created }}</tspan> · удалено <tspan class="pad">{{ pad(frame.removed, N) }}</tspan><tspan class="v">{{ frame.removed }}</tspan> · на ревью <tspan class="pad">{{ pad(frame.review, N) }}</tspan><tspan class="v">{{ frame.review }}</tspan> · приземлено <tspan class="pad">{{ pad(frame.landed, N) }}</tspan><tspan class="t-lime">{{ frame.landed }}</tspan></text>

    <text :x="AX" y="62" class="t-head t-sec">СВЕРХУ — АГЕНТСКИЙ ЦИКЛ У ДОНОРА · СНИЗУ — НАШ ПОЛЬЗОВАТЕЛЬ ОС</text>
    <g v-for="l in frame.lanes" :key="l.k">
      <text :x="AX - 12" :y="l.y + 13" text-anchor="end" class="small" :class="l.gone ? 't-dim' : 't-sec'">донор {{ l.k + 1 }}</text>
      <rect :x="AX" :y="l.y" :width="AW" :height="TH * 2 + 2" rx="3" class="lane-bg" />
      <line v-if="l.link" :x1="AX - 6" :y1="l.y + TH + 1" :x2="AX - 2" :y2="l.y + TH + 1" class="link" />
      <rect v-for="(g, i) in l.segs" :key="i" :x="g.x" :y="g.y" :width="g.w" :height="TH" rx="2" :class="g.cls" />
      <rect v-for="(m, i) in l.marks" :key="'m' + i" :x="m.x - 1.5" :y="m.y - 1" width="3" :height="TH + 2" :class="m.cls" />
      <text :x="W" :y="l.y + 13" text-anchor="end" class="state" :class="{ 't-dim': l.gone, 't-orange': l.broken }">{{ l.broken ? 'нет связи' : l.state }}</text>
    </g>
    <line v-if="frame.playing" :x1="frame.head" :y1="LANE_Y - 4" :x2="frame.head" :y2="LANE_Y + N * PITCH - 4" class="head" />

    <g class="legend">
      <rect :x="AX" y="322" width="10" height="8" rx="2" class="join" /><text :x="AX + 15" y="330" class="small t-sec">присоединение</text>
      <rect :x="AX + 128" y="322" width="10" height="8" rx="2" class="think" /><text :x="AX + 143" y="330" class="small t-sec">модель думает у донора</text>
      <rect :x="AX + 312" y="322" width="10" height="8" rx="2" class="export" /><text :x="AX + 327" y="330" class="small t-sec">выгрузка и ревью</text>
      <rect :x="AX + 452" y="322" width="10" height="8" rx="2" class="user" /><text :x="AX + 467" y="330" class="small t-sec">наш пользователь ОС</text>
      <rect :x="AX + 612" y="321" width="3" height="10" class="m-no" /><text :x="AX + 620" y="330" class="small t-sec">отказ</text>
    </g>

    <rect x="0.75" y="342.75" width="446.5" height="70.5" rx="10" class="panel ours" />
    <text x="14" y="361" class="t-head t-lilac">У НАС</text>
    <text v-for="(o, i) in frame.ours" :key="o.text" :x="14 + (i % 2) * 216" :y="381 + Math.floor(i / 2) * 20" class="small" :class="o.on ? 'on' : 't-dim'">{{ o.on ? '✓' : '·' }} {{ o.text }}</text>
    <rect x="460.75" y="342.75" width="446.5" height="70.5" rx="10" class="panel theirs" />
    <text x="474" y="361" class="t-head t-sec">У ДОНОРА</text>
    <text v-for="(o, i) in frame.theirs" :key="o.text" :x="474 + (i % 2) * 216" :y="381 + Math.floor(i / 2) * 20" class="small" :class="o.on ? 'on' : 't-dim'">{{ o.on ? '✓' : '·' }} {{ o.text }}</text>
  </svg>
</template>

<style scoped>
.demo-remote text { font-variant-numeric: tabular-nums; }
.demo-remote tspan.pad { fill: transparent; }
.demo-remote tspan.v { fill: var(--rwb-txt); }
.demo-remote text.cap { font-size: 18px; }
.demo-remote text.small { font-size: 12px; }
.demo-remote text.state { font-family: var(--rwb-mono); font-size: 11px; fill: var(--rwb-sec); }
.demo-remote text.on { fill: var(--rwb-txt); }
.demo-remote .lane-bg { fill: rgba(255, 255, 255, 0.035); }
.demo-remote .join { fill: var(--rwb-lilac); }
.demo-remote .think { fill: var(--rwb-sec-card); }
.demo-remote .down { fill: var(--rwb-orange); }
.demo-remote .export { fill: var(--rwb-purple); }
.demo-remote .user { fill: var(--rwb-purple); }
.demo-remote .retiring { fill: var(--rwb-dim); }
.demo-remote .m-no { fill: var(--rwb-orange); }
.demo-remote .m-ok { fill: var(--rwb-lime); }
.demo-remote .link { stroke: var(--rwb-lilac); stroke-width: 2; }
.demo-remote .head { stroke: var(--rwb-lilac); stroke-width: 1.5; }
.demo-remote .panel { fill: none; stroke: var(--rwb-rule); stroke-width: 1.5; }
.demo-remote .panel.ours { stroke: var(--rwb-purple); }
</style>
