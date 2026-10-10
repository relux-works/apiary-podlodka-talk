<script setup lang="ts">
// Слайды 2–7, эпохи. Лента эпох над каждым слайдом части 1: пройденные — серые, текущая — сиренью, будущие — пунктиром.
// Источник: plan/slides-plan.ru.md, часть 1; text/from-buckets-to-apiary.ru.md §1–2; wiki posts/2026-09-24-agent-ecosystem.ru.md §1.
//   at — номер текущей эпохи, 0…5
const props = withDefaults(defineProps<{ at?: number }>(), { at: 0 })
const names = ['Stack Overflow', 'Чат', 'Скрипты', 'Агенты', 'Один агент', 'Оркестраторы']
const W = 908, GAP = 12, BW = (W - GAP * 5) / 6
const tone = (i: number) => i < props.at ? 'n' : i === props.at ? 'n-lilac' : 'n-wait'
</script>
<template>
  <svg :width="W" height="38" :viewBox="`0 0 ${W} 38`" aria-hidden="true" class="p12-epochs">
    <g v-for="(n, i) in names" :key="n">
      <rect :x="i * (BW + GAP)" y="1" :width="BW" height="36" rx="10" :class="tone(i)" />
      <text :x="i * (BW + GAP) + 12" y="24" class="t-dim" :class="{ 't-ink-sec': i === at }">{{ i }}</text>
      <text :x="i * (BW + GAP) + BW / 2 + 6" y="24" text-anchor="middle" class="t-cap" :class="{ 't-ink': i === at, 't-sec': i > at }">{{ n }}</text>
    </g>
  </svg>
</template>
<style>
.slidev-layout.rwb-content > svg.p12-epochs { margin-bottom: 18px; flex: none; }
</style>
