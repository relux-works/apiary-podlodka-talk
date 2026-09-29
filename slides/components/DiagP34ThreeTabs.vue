<script setup lang="ts">
// Слайд 15, проблема кросс-харнесса: секьюрити-ревью в три вкладки. Новая схема, не из diagrams/.
// Источники: text/from-buckets-to-apiary.ru.md гл. 3 «Проблема»; notes/discussions.ru.md 27.09 «Главный пример».
// reveal: вкладки по одной (клики 1–3), затем человек со стрелками (клик 4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const tabs = [
  { x: 0, head: 'ВКЛАДКА 1 · CODEX', name: 'Топовая модель Codex', sub: 'своя среда и контекст', end: 'M340,236 C300,196 160,196 143,146' },
  { x: 311, head: 'ВКЛАДКА 2 · CLAUDE', name: 'Топовая модель Claude', sub: 'своя среда и контекст', end: 'M454,236 L454,146' },
  { x: 622, head: 'ВКЛАДКА 3 · ЛОКАЛЬНАЯ', name: 'Локальная или uncensored', sub: 'по-настоящему ломает', end: 'M568,236 C608,196 748,196 765,146' },
]
</script>
<template>
  <svg width="908" height="296" viewBox="0 0 908 296" aria-hidden="true">
    <defs>
      <marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
    </defs>
    <g v-for="(t, i) in tabs" :key="t.x" v-click="reveal ? i + 1 : false">
      <rect :x="t.x + 0.75" y="0.75" width="284.5" height="142" rx="14" class="frame" />
      <text :x="t.x + 16" y="24" class="t-head t-sec">{{ t.head }}</text>
      <rect :x="t.x + 16" y="38" width="254" height="56" rx="10" class="n" />
      <text :x="t.x + 143" y="61" text-anchor="middle" class="t-big">{{ t.name }}</text>
      <text :x="t.x + 143" y="81" text-anchor="middle" class="t-sec">{{ t.sub }}</text>
      <text :x="t.x + 16" y="126" class="t-cap t-sec">не видит двух других</text>
    </g>
    <g v-click="reveal ? 4 : false">
      <path v-for="t in tabs" :key="t.x" :d="t.end" class="e-dash" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
      <rect x="329" y="236" width="250" height="56" rx="10" class="n-lime" />
      <text x="454" y="259" text-anchor="middle" class="t-big t-ink">Человек</text>
      <text x="454" y="279" text-anchor="middle" class="t-ink-sec">носит дифф и находки</text>
    </g>
  </svg>
</template>
