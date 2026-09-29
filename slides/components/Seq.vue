<script setup lang="ts">
// Stage sequence diagram in rwb-tech tokens. Data in, layout computed:
//   actors: [{ id, label, sub?, tone? }]          tone: neutral | lilac | lime | orange | purple
//   steps:  { from, to, text, dashed?, tone? }     a message; from === to draws a self-loop
//           { section: 'Парковка' }                a full-width divider
//           { note: 'текст', at: 'id' }            a note box beside a lifeline
//   reveal: every step appears on its own click
// Text lines split on '\n'. Keep a message label shorter than the gap it spans.
import { computed, useId } from 'vue'

type Actor = { id: string, label: string, sub?: string, tone?: string }
type Step = { from?: string, to?: string, text?: string, dashed?: boolean, tone?: string, section?: string, note?: string, at?: string }
const props = withDefaults(defineProps<{ actors: Actor[], steps: Step[], reveal?: boolean, width?: number, row?: number, head?: number }>(),
  { reveal: false, width: 908, row: 27, head: 46 })

const uid = useId()
const LINE = 16
const W = computed(() => props.width)
const boxW = computed(() => Math.min(156, W.value / props.actors.length - 10))
const xs = computed(() => {
  const n = props.actors.length
  const pad = boxW.value / 2
  const map: Record<string, number> = {}
  props.actors.forEach((a, i) => { map[a.id] = n === 1 ? W.value / 2 : pad + i * (W.value - 2 * pad) / (n - 1) })
  return map
})
const lines = (t?: string) => (t || '').split('\n')

const layout = computed(() => {
  let y = props.head + 22
  return props.steps.map((s) => {
    const n = lines(s.section ?? s.note ?? s.text).length
    const self = !s.section && !s.note && s.from === s.to
    const h = s.section ? 34 : s.note ? 12 + n * LINE : Math.max(props.row, n * LINE + 12) + (self ? 8 : 0)
    const top = y
    y += h
    return { s, top, h, n, self }
  })
})
const height = computed(() => {
  const l = layout.value[layout.value.length - 1]
  return (l ? l.top + l.h : props.head) + 10
})
const tone = (t?: string) => 'n' + (t && t !== 'neutral' ? '-' + t : '')
const ink = (t?: string) => (t === 'lilac' || t === 'lime' || t === 'orange') ? 't-ink' : ''
</script>

<template>
  <svg :width="W" :height="height" :viewBox="`0 0 ${W} ${height}`" class="rwb-seq" aria-hidden="true">
    <defs>
      <marker :id="`${uid}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${uid}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <g v-for="a in actors" :key="a.id">
      <line :x1="xs[a.id]" :x2="xs[a.id]" :y1="head" :y2="height - 4" class="lifeline" />
      <rect :x="xs[a.id] - boxW / 2" y="0" :width="boxW" :height="head" rx="10" :class="tone(a.tone)" />
      <text :x="xs[a.id]" :y="a.sub ? 20 : 28" text-anchor="middle" class="t-big" :class="ink(a.tone)">{{ a.label }}</text>
      <text v-if="a.sub" :x="xs[a.id]" y="37" text-anchor="middle" :class="ink(a.tone) ? 't-ink-sec' : 't-sec'">{{ a.sub }}</text>
    </g>
    <template v-if="reveal">
      <SeqStep v-for="(l, i) in layout" :key="i" v-click :l="l" :xs="xs" :w="W" :uid="uid" />
    </template>
    <template v-else>
      <SeqStep v-for="(l, i) in layout" :key="i" :l="l" :xs="xs" :w="W" :uid="uid" />
    </template>
  </svg>
</template>

<style>
.rwb-seq .lifeline { stroke: var(--rwb-dim); stroke-width: 1; stroke-dasharray: 3 5; }
.rwb-seq .divider { stroke: var(--rwb-purple); stroke-width: 1; opacity: 0.7; }
.rwb-seq .dashed { stroke-dasharray: 5 4; }
</style>
