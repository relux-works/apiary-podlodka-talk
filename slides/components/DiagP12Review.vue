<script setup lang="ts">
// Слайд 9, цикл продюсер → ревьюер → доработка. Оркестратор спавнит обоих; ревьюер обычно другой семьи (пост §2:
// «обычно модель другого вендора»; not_same_publisher_as — решено, но не проверяется ядром, техзаписка гл. 04);
// вердикт принимает ревизию или возвращает её на доработку новой ревизией.
// Источник: skill-project-management SPEC.md Part 2 (статусы, возвраты из reviewing, Orchestrator Routing Invariant);
// references/change-request-lifecycle.md (accept_cr — только ревьюер, которому выдана ревизия);
// README «Isolated Story delivery, end to end» п. 3; text/from-buckets-to-apiary.ru.md §2.
//   reveal — продюсер, ревизия, ревьюер, принятие, возврат
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const click = computed(() => props.reveal ? '+1' : false)
const BW = 200, GAP = 36, Y = 78, BH = 60
const bx = (i: number) => i * (BW + GAP)
</script>
<template>
  <svg width="908" height="194" viewBox="0 0 908 194" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <!-- оркестратор -->
    <rect x="336" y="0" width="236" height="40" rx="10" class="n" />
    <text x="454" y="26" text-anchor="middle" class="t-big">Оркестратор</text>
    <g v-click="click">
      <path :d="`M380,40 C360,60 ${bx(0) + BW / 2},56 ${bx(0) + BW / 2},${Y - 3}`" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <text x="170" y="52" class="t-cap t-sec">спавнит</text>
      <rect :x="bx(0)" :y="Y" :width="BW" :height="BH" rx="10" class="n-purple" />
      <text :x="bx(0) + BW / 2" :y="Y + 26" text-anchor="middle" class="t-big">Продюсер</text>
      <text :x="bx(0) + BW / 2" :y="Y + 45" text-anchor="middle" class="t-on">модель семьи A</text>
    </g>
    <g v-click="click">
      <line :x1="bx(0) + BW" :x2="bx(1) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
      <rect :x="bx(1)" :y="Y" :width="BW" :height="BH" rx="10" class="n" />
      <text :x="bx(1) + BW / 2" :y="Y + 26" text-anchor="middle" class="t-big">Change Request</text>
      <text :x="bx(1) + BW / 2" :y="Y + 45" text-anchor="middle" class="t-sec">ревизия N · to-review</text>
    </g>
    <g v-click="click">
      <path :d="`M528,40 C548,60 ${bx(2) + BW / 2},56 ${bx(2) + BW / 2},${Y - 3}`" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <text x="626" y="52" class="t-cap t-sec">спавнит</text>
      <line :x1="bx(1) + BW" :x2="bx(2) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
      <rect :x="bx(2)" :y="Y" :width="BW" :height="BH" rx="10" class="n-lilac" />
      <text :x="bx(2) + BW / 2" :y="Y + 26" text-anchor="middle" class="t-big t-ink">Ревьюер</text>
      <text :x="bx(2) + BW / 2" :y="Y + 45" text-anchor="middle" class="t-ink-sec">обычно другая семья</text>
    </g>
    <g v-click="click">
      <line :x1="bx(2) + BW" :x2="bx(3) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <rect :x="bx(3)" :y="Y" :width="BW" :height="BH" rx="10" class="n-lime" />
      <text :x="bx(3) + BW / 2" :y="Y + 26" text-anchor="middle" class="t-big t-ink">Принято</text>
      <text :x="bx(3) + BW / 2" :y="Y + 45" text-anchor="middle" class="t-ink-sec">accept_cr · integrating</text>
    </g>
    <g v-click="click">
      <path :d="`M${bx(2) + BW / 2},${Y + BH} V${Y + BH + 36} H${bx(0) + BW / 2} V${Y + BH + 3}`" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <rect x="198" :y="Y + BH + 25" width="270" height="22" class="knock" />
      <text x="333" :y="Y + BH + 41" text-anchor="middle" class="t-cap">вернуть: to-dev, ревизия N+1</text>
    </g>
  </svg>
</template>
