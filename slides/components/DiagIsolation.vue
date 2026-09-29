<script setup lang="ts">
// Слайд 33, доверие. Сценическая версия process-isolation-on-one-node.puml (process configuration draft v3.3 §2.1–§8.1; waggle §12).
import { useId } from 'vue'
const id = useId()
const hives = [{ x: 0, n: 'A' }, { x: 478, n: 'Б' }]
</script>
<template>
  <svg width="908" height="364" viewBox="0 0 908 364" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <rect x="20" y="0" width="190" height="46" rx="10" class="n-wait" />
    <text x="115" y="28" text-anchor="middle" class="t-big">Реестр ульев</text>
    <rect x="300" y="0" width="200" height="46" rx="10" class="n-lilac" />
    <text x="400" y="28" text-anchor="middle" class="t-big t-ink">Кипер</text>
    <rect x="600" y="0" width="200" height="46" rx="10" class="n" />
    <text x="700" y="28" text-anchor="middle" class="t-big">Хост сессий</text>
    <line x1="300" y1="23" x2="213" y2="23" class="e" :marker-end="`url(#${id})`" />
    <line x1="500" y1="23" x2="597" y2="23" class="e" :marker-end="`url(#${id})`" />
    <text x="512" y="16" class="t-cap t-sec">разбуди</text>
    <path d="M640,46 C630,70 380,62 370,81" class="e" :marker-end="`url(#${id})`" />
    <path d="M740,46 C746,66 860,62 866,81" class="e" :marker-end="`url(#${id})`" />
    <g v-for="h in hives" :key="h.n">
      <rect :x="h.x + 0.75" y="84" width="428" height="222" rx="14" class="frame-hive" />
      <text :x="h.x + 16" y="104" class="t-head t-lilac">УЛЕЙ {{ h.n }} · СВОЙ GIT-РЕПОЗИТОРИЙ</text>
      <rect :x="h.x + 24" y="116" width="200" height="48" rx="10" class="n-purple" />
      <text :x="h.x + 124" y="137" text-anchor="middle" class="t-big">Матка</text>
      <text :x="h.x + 124" y="155" text-anchor="middle" class="t-on">ровно одна на улей</text>
      <rect :x="h.x + 24" y="200" width="200" height="48" rx="10" class="n" />
      <text :x="h.x + 124" y="221" text-anchor="middle" class="t-big">Саборкестраторы</text>
      <text :x="h.x + 124" y="239" text-anchor="middle" class="t-sec">и раны</text>
      <rect :x="h.x + 264" y="200" width="148" height="48" rx="10" class="n-lime" />
      <text :x="h.x + 338" y="229" text-anchor="middle" class="t-big t-ink">Доска {{ h.n }}</text>
      <line :x1="h.x + 124" y1="164" :x2="h.x + 124" y2="197" class="e" :marker-end="`url(#${id})`" />
      <path :d="`M${h.x + 224},150 C${h.x + 300},156 ${h.x + 330},170 ${h.x + 334},197`" class="e" :marker-end="`url(#${id})`" />
      <line :x1="h.x + 224" y1="224" :x2="h.x + 261" y2="224" class="e" :marker-end="`url(#${id})`" />
      <text :x="h.x + 344" y="182" class="t-cap t-sec">пишет</text>
      <text :x="h.x + 24" y="284" class="t-sec">Playbook.json · Skillfile.json · task-board.config</text>
    </g>
    <line x1="226" y1="128" x2="499" y2="128" class="e-dash" :marker-end="`url(#${id})`" />
    <rect x="296" y="110" width="136" height="14" class="knock" />
    <text x="364" y="122" text-anchor="middle" class="t-cap t-sec">только передача</text>
    <rect x="0" y="320" width="908" height="44" rx="10" class="n-wait" />
    <text x="20" y="347" class="t-cap"><tspan class="mono">~/.curator/</tspan> — файлы оператора: модели, рантаймы, движки, сеть. Общие для точки, не в git.</text>
  </svg>
</template>
