<script setup lang="ts">
// v6 (12.10), вступление: как растут проекты у людей, до моделей. Четыре ступени в стиле слайдов эпох:
// 0 — один человек держит весь проект в голове; 1 — команда делит проект на модули или домены;
// 2 — продукт из нескольких проектов: независимые команды со своими циклами и проджект-менеджер, который их синхронизирует;
// 3 — распределённые команды: контракты частей системы и согласования заранее.
// Источник: разговор спикеров 12.10 (Алексей; meetings/2026-10-12-ivan-alexey-call.md, «Вступление»). Статус: история, не утверждение о системе.
//   stage — 0…3; reveal — части схемы по кликам
import { useId } from 'vue'
withDefaults(defineProps<{ stage?: number, reveal?: boolean }>(), { stage: 0, reveal: false })
const id = useId()
const chips = ['Интерфейс', 'Логика', 'Данные']
const modules = [
  { x: 16, t: 'Бэкенд' },
  { x: 312, t: 'Фронтенд' },
  { x: 608, t: 'Мобильный' },
]
const teams = [
  { x: 0, t: 'Команда бэкенда' },
  { x: 312, t: 'Команда фронтенда' },
  { x: 624, t: 'Мобильная команда' },
]
const regions = [
  { x: 0, t: 'СЕРВИСЫ' },
  { x: 312, t: 'КЛИЕНТЫ' },
  { x: 624, t: 'ПЛАТФОРМА' },
]
</script>
<template>
  <svg width="908" height="150" viewBox="0 0 908 150" aria-hidden="true">
    <defs>
      <marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
    </defs>
    <!-- 0 · один человек -->
    <template v-if="stage === 0">
      <Step :on="reveal">
        <rect x="0" y="34" width="210" height="66" rx="10" class="n-lime" />
        <text x="105" y="62" text-anchor="middle" class="t-big t-ink">Человек</text>
        <text x="105" y="83" text-anchor="middle" class="t-ink-sec">весь проект в голове</text>
        <line x1="210" y1="67" x2="245" y2="67" class="e" :marker-end="`url(#${id})`" />
        <rect x="248.75" y="0.75" width="420" height="134" rx="14" class="frame" />
        <text x="264" y="24" class="t-head t-sec">ПРОЕКТ</text>
        <g v-for="(c, i) in chips" :key="c">
          <rect :x="264 + i * 134" y="44" width="122" height="48" rx="10" class="n" />
          <text :x="325 + i * 134" y="73" text-anchor="middle" class="t-cap">{{ c }}</text>
        </g>
        <text x="264" y="120" class="t-cap t-sec">небольшой: виден целиком</text>
      </Step>
      <Step :on="reveal">
        <text x="704" y="52" class="t-cap">один цикл</text>
        <text x="704" y="76" class="t-cap">никаких согласований</text>
        <text x="704" y="100" class="t-cap t-lime">работает отлично</text>
      </Step>
    </template>
    <!-- 1 · команда и модули -->
    <template v-else-if="stage === 1">
      <Step :on="reveal">
        <rect x="0.75" y="0.75" width="906.5" height="146" rx="14" class="frame" />
        <text x="16" y="24" class="t-head t-sec">ПРОЕКТ · МОДУЛИ ИЛИ ДОМЕНЫ</text>
        <g v-for="m in modules" :key="m.t">
          <rect :x="m.x" y="80" width="284" height="54" rx="10" class="n" />
          <text :x="m.x + 142" y="103" text-anchor="middle" class="t-big">{{ m.t }}</text>
          <text :x="m.x + 142" y="122" text-anchor="middle" class="t-sec">свой модуль</text>
        </g>
      </Step>
      <Step :on="reveal">
        <g v-for="m in modules" :key="m.t + 'p'">
          <rect :x="m.x + 92" y="34" width="100" height="30" rx="8" class="n-lime" />
          <text :x="m.x + 142" y="54" text-anchor="middle" class="t-cap t-ink">Человек</text>
          <line :x1="m.x + 142" y1="64" :x2="m.x + 142" y2="77" class="e" :marker-end="`url(#${id})`" />
        </g>
      </Step>
    </template>
    <!-- 2 · продукт из нескольких проектов -->
    <template v-else-if="stage === 2">
      <Step :on="reveal">
        <g v-for="t in teams" :key="t.t">
          <rect :x="t.x" y="88" width="284" height="60" rx="10" class="n" />
          <text :x="t.x + 142" y="113" text-anchor="middle" class="t-big">{{ t.t }}</text>
          <text :x="t.x + 142" y="133" text-anchor="middle" class="t-sec">свой цикл и план</text>
        </g>
        <line x1="287" y1="118" x2="309" y2="118" class="e-dash" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <line x1="599" y1="118" x2="621" y2="118" class="e-dash" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
      </Step>
      <Step :on="reveal">
        <rect x="304" y="0" width="300" height="56" rx="10" class="n-purple" />
        <text x="454" y="24" text-anchor="middle" class="t-big">Проджект-менеджер</text>
        <text x="454" y="44" text-anchor="middle" class="t-on">оркестратор планов команд</text>
        <path d="M380,56 C380,74 142,66 142,85" class="e" :marker-end="`url(#${id})`" />
        <line x1="454" y1="56" x2="454" y2="85" class="e" :marker-end="`url(#${id})`" />
        <path d="M528,56 C528,74 766,66 766,85" class="e" :marker-end="`url(#${id})`" />
      </Step>
    </template>
    <!-- 3 · распределённые команды -->
    <template v-else>
      <Step :on="reveal">
        <g v-for="r in regions" :key="r.t">
          <rect :x="r.x + 0.75" y="0.75" width="282.5" height="92" rx="14" class="frame" />
          <text :x="r.x + 16" y="24" class="t-head t-sec">{{ r.t }}</text>
          <rect :x="r.x + 16" y="36" width="252" height="44" rx="10" class="n" />
          <text :x="r.x + 142" y="63" text-anchor="middle" class="t-cap">команда и её менеджер</text>
        </g>
      </Step>
      <Step :on="reveal">
        <line x1="268" y1="92" x2="268" y2="104" class="e" />
        <line x1="328" y1="92" x2="328" y2="104" class="e" />
        <rect x="212" y="104" width="172" height="30" rx="8" class="n-lilac" />
        <text x="298" y="124" text-anchor="middle" class="t-cap t-ink">контракт API</text>
        <line x1="580" y1="92" x2="580" y2="104" class="e" />
        <line x1="640" y1="92" x2="640" y2="104" class="e" />
        <rect x="524" y="104" width="172" height="30" rx="8" class="n-lilac" />
        <text x="610" y="124" text-anchor="middle" class="t-cap t-ink">контракт API</text>
        <text x="0" y="124" class="t-cap t-sec">сначала контракты,</text>
        <text x="0" y="144" class="t-cap t-sec">потом код</text>
        <text x="908" y="124" text-anchor="end" class="t-cap t-sec">согласования —</text>
        <text x="908" y="144" text-anchor="end" class="t-cap t-sec">отдельная стадия</text>
      </Step>
    </template>
  </svg>
</template>
