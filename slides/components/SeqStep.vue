<script setup lang="ts">
// One step of <Seq>: a message, a self-loop, a section divider or a note. Rendered by Seq only.
const props = defineProps<{ l: { s: any, top: number, h: number, n: number, self: boolean }, xs: Record<string, number>, w: number, uid: string }>()
const LINE = 16
const lines = (t?: string) => (t || '').split('\n')
const edge = (t?: string) => t === 'lime' ? 'e-lime' : 'e'
const mk = (t?: string) => `url(#${props.uid}-${t === 'lime' ? 'l' : 'a'})`
</script>
<template>
  <g v-if="l.s.section">
    <line x1="0" :x2="w" :y1="l.top + 17" :y2="l.top + 17" class="divider" />
    <rect :x="w / 2 - (l.s.section.length * 5 + 18)" :y="l.top + 5" :width="l.s.section.length * 10 + 36" height="24" rx="12" class="n-purple" />
    <text :x="w / 2" :y="l.top + 22" text-anchor="middle" class="t-head">{{ l.s.section.toUpperCase() }}</text>
  </g>
  <g v-else-if="l.s.note">
    <rect :x="xs[l.s.at] + 10" :y="l.top + 2" :width="Math.max(...lines(l.s.note).map(t => t.length)) * 7.4 + 26" :height="l.h - 6" rx="8" class="n-wait note-bg" />
    <text v-for="(t, k) in lines(l.s.note)" :key="k" :x="xs[l.s.at] + 23" :y="l.top + 20 + k * LINE" class="t-cap t-sec">{{ t }}</text>
  </g>
  <g v-else-if="l.self">
    <!-- near the right edge the loop and its label turn to the left -->
    <path :d="xs[l.s.from] > w * 0.7 ? `M${xs[l.s.from]},${l.top + 6} h-34 v14 h32` : `M${xs[l.s.from]},${l.top + 6} h34 v14 h-32`" :class="edge(l.s.tone)" :marker-end="mk(l.s.tone)" />
    <text v-for="(t, k) in lines(l.s.text)" :key="k" :x="xs[l.s.from] > w * 0.7 ? xs[l.s.from] - 44 : xs[l.s.from] + 44" :text-anchor="xs[l.s.from] > w * 0.7 ? 'end' : 'start'" :y="l.top + 18 + k * LINE" class="t-cap">{{ t }}</text>
  </g>
  <g v-else>
    <line :x1="xs[l.s.from]" :x2="xs[l.s.to] + (xs[l.s.to] > xs[l.s.from] ? -2 : 2)" :y1="l.top + l.h - 6" :y2="l.top + l.h - 6"
      :class="[edge(l.s.tone), { dashed: l.s.dashed }]" :marker-end="mk(l.s.tone)" />
    <text v-for="(t, k) in lines(l.s.text)" :key="k" :x="Math.min(xs[l.s.from], xs[l.s.to]) + 8" :y="l.top + l.h - 12 - (l.n - 1 - k) * LINE" class="t-cap">{{ t }}</text>
  </g>
</template>
