<script setup lang="ts">
// Слайд 31, имена. Сценическая версия curator-keeper one-node-system.puml; содержание сверено с keeper.md DRAFT v0.5.1
// (§3, §5, §6.2, §10–§12, §15.1: приложение-компаньон — KP2, поэтому пунктиром) и process-configuration.md DRAFT v4.8 (§2.1, §2.3, §6.5).
// reveal: рамка точки сразу; человек и Кипер, хост сессий, улей календаря, улей кафе, передача между ульями,
// затем приложение-компаньон — по клику.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const hives = [
  { x: 16, name: 'УЛЕЙ · СЕМЕЙНЫЙ КАЛЕНДАРЬ', link: 'M570,142 C560,166 340,158 330,173' },
  { x: 464, name: 'УЛЕЙ · КАФЕ', link: 'M650,142 C654,158 700,160 704,173', label: 'хостит маток' },
]
</script>
<template>
  <svg width="908" height="362" viewBox="0 0 908 362" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- точка -->
    <rect x="0.75" y="58" width="906.5" height="302" rx="14" class="frame" />
    <text x="16" y="80" class="t-head t-sec">ТОЧКА · ОДНА МАШИНА</text>
    <!-- человек и Кипер -->
    <Step :on="reveal">
      <rect x="150" y="0" width="150" height="40" rx="10" class="n-lime" />
      <text x="225" y="26" text-anchor="middle" class="t-big t-ink">Человек</text>
      <line x1="225" y1="40" x2="225" y2="88" class="e" :marker-end="`url(#${id})`" />
      <text x="235" y="70" class="t-cap t-sec">терминал</text>
      <rect x="120" y="92" width="210" height="50" rx="10" class="n-lilac" />
      <text x="225" y="114" text-anchor="middle" class="t-big t-ink">Кипер</text>
      <text x="225" y="132" text-anchor="middle" class="t-ink-sec">главный цикл</text>
    </Step>
    <!-- хост сессий -->
    <Step :on="reveal">
      <rect x="500" y="92" width="220" height="50" rx="10" class="n" />
      <text x="610" y="122" text-anchor="middle" class="t-big">Хост сессий</text>
      <line x1="330" y1="117" x2="497" y2="117" class="e" :marker-end="`url(#${id})`" />
      <text x="340" y="109" class="t-cap t-sec">up, wake, park, stop</text>
    </Step>
    <!-- ульи -->
    <Step v-for="h in hives" :key="h.x" :on="reveal">
      <path :d="h.link" class="e" :marker-end="`url(#${id})`" />
      <text v-if="h.label" x="730" y="163" class="t-cap t-sec">{{ h.label }}</text>
      <rect :x="h.x" y="176" width="428" height="176" rx="14" class="frame-hive" />
      <text :x="h.x + 16" y="197" class="t-head t-lilac">{{ h.name }}</text>
      <rect :x="h.x + 84" y="210" width="260" height="48" rx="10" class="n-purple" />
      <text :x="h.x + 214" y="231" text-anchor="middle" class="t-big">Матка</text>
      <text :x="h.x + 214" y="249" text-anchor="middle" class="t-on">корневой оркестратор</text>
      <rect :x="h.x + 24" y="292" width="180" height="48" rx="10" class="n" />
      <text :x="h.x + 114" y="313" text-anchor="middle" class="t-big">Пчёлы</text>
      <text :x="h.x + 114" y="331" text-anchor="middle" class="t-sec">запуски</text>
      <rect :x="h.x + 224" y="292" width="180" height="48" rx="10" class="n-lime" />
      <text :x="h.x + 314" y="313" text-anchor="middle" class="t-big t-ink">Соты</text>
      <text :x="h.x + 314" y="331" text-anchor="middle" class="t-ink-sec">доска</text>
      <line :x1="h.x + 170" y1="258" :x2="h.x + 124" y2="289" class="e" :marker-end="`url(#${id})`" />
      <line :x1="h.x + 258" y1="258" :x2="h.x + 304" y2="289" class="e" :marker-end="`url(#${id})`" />
      <text :x="h.x + 136" y="280" text-anchor="end" class="t-cap t-sec">спавнит</text>
      <text :x="h.x + 292" y="280" class="t-cap t-sec">пишет</text>
    </Step>
    <!-- между ульями -->
    <Step :on="reveal">
      <line x1="346" y1="234" x2="545" y2="234" class="e-dash" :marker-end="`url(#${id})`" />
      <rect x="392" y="214" width="124" height="16" class="knock" />
      <text x="454" y="227" text-anchor="middle" class="t-cap t-sec">только передача</text>
    </Step>
    <!-- приложение-компаньон: KP2, пунктиром -->
    <Step :on="reveal">
      <rect x="660.75" y="0.75" width="246.5" height="38.5" rx="10" class="n-wait" />
      <text x="784" y="26" text-anchor="middle" class="t-big">Приложение-компаньон</text>
      <path d="M700,40 C660,74 420,62 332,96" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="420" y="36" class="t-cap t-sec">подтверждения, подписаны</text>
    </Step>
  </svg>
</template>
