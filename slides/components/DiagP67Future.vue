<script setup lang="ts">
// Слайд 39, картинка будущего. Видение. Новая схема части 6.
// Источники: пост §6, последний абзац (остаток подписок ночью проектам с открытым кодом, как добровольные
// вычисления; десятки оркестраторов и со временем тысячи субагентов; ядро ОС с нуля как общее дело сообщества;
// «в том числе для обороны»); plan/slides-plan.ru.md слайд 39; call-digest-2026-09-keeper-concept §3.1.
// Квадраты — пиктограмма масштаба, а не подсчёт.
// reveal: люди и сообщества сразу; по кликам — проект на протоколе с оркестраторами и субагентами, результат.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const orch = Array.from({ length: 10 }, (_, i) => i)
const bees = Array.from({ length: 29 * 6 }, (_, i) => ({ x: 256 + (i % 29) * 14.5, y: 116 + Math.floor(i / 29) * 14 }))
</script>
<template>
  <svg width="908" height="304" viewBox="0 0 908 304" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- кто приносит ёмкость -->
    <rect x="0" y="44" width="190" height="54" rx="10" class="n" />
    <text x="95" y="66" text-anchor="middle" class="t-big">Люди ночью</text>
    <text x="95" y="85" text-anchor="middle" class="t-sec">остаток подписок</text>
    <rect x="0" y="130" width="190" height="54" rx="10" class="n" />
    <text x="95" y="152" text-anchor="middle" class="t-big">Сообщества</text>
    <text x="95" y="171" text-anchor="middle" class="t-sec">свои агенты и среды</text>
    <text x="0" y="222" class="t-cap t-sec">как когда-то отдавали</text>
    <text x="0" y="241" class="t-cap t-sec">процессорное время</text>
    <text x="0" y="260" class="t-cap t-sec">добровольным вычислениям</text>
    <!-- проект на нашем протоколе -->
    <Step :on="reveal">
      <path d="M190,71 C214,71 214,120 235,120" class="e" :marker-end="`url(#${id})`" />
      <path d="M190,157 C214,157 214,150 235,150" class="e" :marker-end="`url(#${id})`" />
      <rect x="238.75" y="0.75" width="456" height="302" rx="14" class="frame-hive" />
      <text x="256" y="24" class="t-head t-lilac">ОТКРЫТЫЙ ПРОЕКТ НА НАШЕМ ПРОТОКОЛЕ</text>
      <rect v-for="i in orch" :key="'o' + i" :x="256 + i * 42" y="40" width="30" height="30" rx="6" class="n-purple" />
      <text x="256" y="94" class="t-cap">десятки оркестраторов</text>
      <rect v-for="(b, i) in bees" :key="'b' + i" :x="b.x" :y="b.y" width="10" height="10" rx="2" class="n" />
      <text x="256" y="220" class="t-cap">тысячи субагентов</text>
      <rect x="256" y="236" width="422" height="50" rx="10" class="n-wait" />
      <text x="467" y="256" text-anchor="middle" class="t-cap">одна среда, одна доска,</text>
      <text x="467" y="275" text-anchor="middle" class="t-cap">независимые ревьюеры</text>
    </Step>
    <!-- цель -->
    <Step :on="reveal">
      <line x1="695" y1="150" x2="735" y2="150" class="e" :marker-end="`url(#${id})`" />
      <rect x="738" y="104" width="170" height="92" rx="10" class="n-lime" />
      <text x="823" y="130" text-anchor="middle" class="t-big t-ink">Ядро ОС с нуля</text>
      <text x="823" y="152" text-anchor="middle" class="t-ink-sec">общее дело</text>
      <text x="823" y="170" text-anchor="middle" class="t-ink-sec">сообщества</text>
    </Step>
  </svg>
</template>
