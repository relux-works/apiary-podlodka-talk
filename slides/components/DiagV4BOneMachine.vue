<script setup lang="ts">
// Plan v4 slide 32: communication on one machine, problem and solution in one geometry. New stage diagram (v4, 29.09).
// Sources: plan/deck-v4-brief.md «NEW: communication on one machine» (mobile, frontend, backend, CI; one orchestrator
// per repository makes the human coordinate orchestrators again; orchestrators talk, harness-neutral, first on one
// machine); text/from-buckets-to-apiary.ru.md ch. 3, last paragraph (sharding needs orchestrators that know each other);
// waggle spec/waggle.md DRAFT v5.2 §0 (first on one machine), §9.3 (local Maildir-style carrier: orchestrators on one
// Mac), §10 (delivery through the session host, no harness dependency), §17 CM1 (two orchestrators on one machine
// coordinate in a room); wiki decisions.md, waggle (decided 2026-09-24). Status: in the spec, not implemented.
// Harness labels are an example of a mix, not a claim about a running setup.
// solution=false: orchestrators (1), the human between them (2).
// solution=true: orchestrators (1), the message exchange (2), the human aside (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean, solution?: boolean }>(), { reveal: false, solution: false })
const id = useId()
const orchs = [
  { x: 16, h: 'Мобильный', s: 'оркестратор · Claude' },
  { x: 239, h: 'Фронтенд', s: 'оркестратор · Codex' },
  { x: 462, h: 'Бэкенд', s: 'оркестратор · Muse' },
  { x: 685, h: 'CI', s: 'оркестратор · локальная' },
]
const W = 207
</script>
<template>
  <svg width="908" :height="solution ? 286 : 300" :viewBox="`0 0 908 ${solution ? 286 : 300}`" aria-hidden="true">
    <defs>
      <marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
    </defs>
    <text x="0" y="14" class="t-head t-sec">ОДНА МАШИНА · РЕПОЗИТОРИЙ НА ОРКЕСТРАТОР</text>
    <rect x="0.75" y="26" width="906.5" :height="solution ? 172 : 190" rx="14" class="frame" />
    <Step :on="reveal">
      <g v-for="o in orchs" :key="o.x">
        <rect :x="o.x" y="44" :width="W" height="64" rx="10" class="n-purple" />
        <text :x="o.x + W / 2" y="71" text-anchor="middle" class="t-lab">{{ o.h }}</text>
        <text :x="o.x + W / 2" y="93" text-anchor="middle" class="t-on">{{ o.s }}</text>
      </g>
    </Step>
    <template v-if="!solution">
      <Step :on="reveal">
        <path v-for="o in orchs" :key="o.x" :d="`M${o.x + W / 2},108 C${o.x + W / 2},190 454,170 454,234`" class="e-dash" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <rect x="314" y="236" width="280" height="62" rx="10" class="n-lime" />
        <text x="454" y="262" text-anchor="middle" class="t-big t-ink">Человек</text>
        <text x="454" y="283" text-anchor="middle" class="t-ink-sec">снова диспетчер оркестраторов</text>
      </Step>
    </template>
    <template v-else>
      <Step :on="reveal">
        <line v-for="o in orchs" :key="o.x" :x1="o.x + W / 2" y1="111" :x2="o.x + W / 2" y2="135" class="e" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <rect x="16" y="138" width="876" height="50" rx="10" class="n-lilac" />
        <text x="454" y="160" text-anchor="middle" class="t-big t-ink">Сообщения между оркестраторами</text>
        <text x="454" y="179" text-anchor="middle" class="t-ink-sec">локальный почтовый ящик · не зависит от среды</text>
      </Step>
      <Step :on="reveal">
        <line x1="454" y1="198" x2="454" y2="223" class="e-dash" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <rect x="314" y="226" width="280" height="58" rx="10" class="n-lime" />
        <text x="454" y="250" text-anchor="middle" class="t-big t-ink">Человек</text>
        <text x="454" y="270" text-anchor="middle" class="t-ink-sec">только решения</text>
      </Step>
    </template>
  </svg>
</template>
