<script setup lang="ts">
// Лента над слайдами-ступенями: пройденные — серые, текущая — сиренью, будущие — пунктиром.
// v6 (12.10): эпохи 3 и 4 объединены — пять эпох, 0…4 (разговор спикеров 12.10, meetings/2026-10-12-ivan-alexey-call.md).
// Та же лента рисует ступени роста проекта во вступлении: names — свои подписи, start — номер первой ступени.
// Источник: plan/slides-plan.ru.md, вступление и глава 1; text/from-buckets-to-apiary.ru.md §1–2; wiki posts/2026-09-24-agent-ecosystem.ru.md §1.
//   at — номер текущей ступени (с учётом start); names — подписи; start — номер первой ступени (0 по умолчанию)
import { computed } from 'vue'
const props = withDefaults(defineProps<{ at?: number, names?: string[], start?: number }>(), {
  at: 0,
  names: () => ['Stack Overflow', 'Чат', 'Скрипты', 'Агенты', 'Оркестраторы'],
  start: 0,
})
const W = 908, GAP = 12
const BW = computed(() => (W - GAP * (props.names.length - 1)) / props.names.length)
const tone = (i: number) => i + props.start < props.at ? 'n' : i + props.start === props.at ? 'n-lilac' : 'n-wait'
</script>
<template>
  <svg :width="W" height="38" :viewBox="`0 0 ${W} 38`" aria-hidden="true" class="p12-epochs">
    <g v-for="(n, i) in names" :key="n">
      <rect :x="i * (BW + GAP)" y="1" :width="BW" height="36" rx="10" :class="tone(i)" />
      <text :x="i * (BW + GAP) + 12" y="24" class="t-dim" :class="{ 't-ink-sec': i + start === at }">{{ i + start }}</text>
      <text :x="i * (BW + GAP) + BW / 2 + 6" y="24" text-anchor="middle" class="t-cap" :class="{ 't-ink': i + start === at, 't-sec': i + start > at }">{{ n }}</text>
    </g>
  </svg>
</template>
<style>
.slidev-layout.rwb-content > svg.p12-epochs { margin-bottom: 18px; flex: none; }
</style>
