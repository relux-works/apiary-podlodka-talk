<script setup lang="ts">
// Слайд 11, цели. У оркестратора — цель доски (слот parent/primary, одна на доску), у каждого спавна — своя
// (run/RUN-*); у каждой цели ревизии, сессия подтверждает точную ревизию; длинная цель режется на вехи.
// Дети в разных средах получают цель по-разному: Claude — /goal в терминале, Codex — цель треда через app-server.
// Источник: skill-project-management docs/claude-goal-runtime.md, docs/codex-goal-runtime.md («Goal mutation»,
// «Native goal payload shape»); wiki book/ru/02-yadro-segodnya.md; research/call-digest-2026-09-24.md п. 3;
// wiki decisions.md 2026-09-24 (вехи короче для слабых моделей); text/from-buckets-to-apiary.ru.md §2, §3.
//   reveal — оркестратор и вехи, дети, рекурсия
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const click = computed(() => props.reveal ? '+1' : false)
const KW = 290, KG = 19, KY = 130, KH = 60
const kx = (i: number) => i * (KW + KG)
</script>
<template>
  <svg width="908" height="284" viewBox="0 0 908 284" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <!-- оркестратор и вехи -->
    <g v-click="click">
      <rect x="0" y="10" width="140" height="40" rx="10" class="n-lime" />
      <text x="70" y="35" text-anchor="middle" class="t-big t-ink">Человек</text>
      <line x1="140" y1="30" x2="215" y2="30" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <text x="150" y="22" class="t-cap t-sec">задача</text>
      <rect x="218" y="0" width="330" height="60" rx="10" class="n-purple" />
      <text x="383" y="26" text-anchor="middle" class="t-big">Оркестратор · цель доски</text>
      <text x="383" y="45" text-anchor="middle" class="t-on">одна на доску · ревизия 3</text>
      <line x1="548" y1="30" x2="605" y2="30" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <rect x="608" y="12" width="92" height="36" rx="8" class="n-lime" />
      <text x="654" y="35" text-anchor="middle" class="t-cap t-ink">веха 1 ✓</text>
      <rect x="708" y="12" width="92" height="36" rx="8" class="n-lilac" />
      <text x="754" y="35" text-anchor="middle" class="t-cap t-ink">веха 2</text>
      <rect x="808" y="12" width="92" height="36" rx="8" class="n-wait" />
      <text x="854" y="35" text-anchor="middle" class="t-cap t-sec">веха 3</text>
      <text x="608" y="72" class="t-cap t-sec">чем слабее модель, тем ближе вехи</text>
    </g>
    <!-- дети -->
    <g v-click="click">
      <path :d="`M300,60 C300,96 ${kx(0) + KW / 2},92 ${kx(0) + KW / 2},${KY - 3}`" class="e" :marker-end="`url(#${id}-a)`" />
      <line :x1="kx(1) + KW / 2" y1="60" :x2="kx(1) + KW / 2" :y2="KY - 3" class="e" :marker-end="`url(#${id}-a)`" />
      <text x="148" y="101" text-anchor="end" class="t-cap t-sec">своя цель</text>
      <text x="444" y="101" text-anchor="end" class="t-cap t-sec">сдвинуть на ходу</text>
      <rect :x="kx(0)" :y="KY" :width="KW" :height="KH" rx="10" class="n" />
      <text :x="kx(0) + KW / 2" :y="KY + 26" text-anchor="middle" class="t-big">Продюсер · Claude</text>
      <text :x="kx(0) + KW / 2" :y="KY + 45" text-anchor="middle" class="t-sec">/goal в терминале, ack по экрану</text>
      <rect :x="kx(1)" :y="KY" :width="KW" :height="KH" rx="10" class="n" />
      <text :x="kx(1) + KW / 2" :y="KY + 26" text-anchor="middle" class="t-big">Ревьюер · Codex</text>
      <text :x="kx(1) + KW / 2" :y="KY + 45" text-anchor="middle" class="t-sec">цель треда через app-server</text>
      <text x="0" y="222" class="t-cap t-sec">У каждой цели ревизии: сессия подтверждает точную</text>
      <text x="0" y="242" class="t-cap t-sec">ревизию, и только после этого начинается работа.</text>
    </g>
    <!-- рекурсия -->
    <g v-click="click">
      <path :d="`M480,60 C480,100 ${kx(2) + KW / 2},92 ${kx(2) + KW / 2},${KY - 3}`" class="e" :marker-end="`url(#${id}-a)`" />
      <rect :x="kx(2)" :y="KY" :width="KW" :height="KH" rx="10" class="n-lilac" />
      <text :x="kx(2) + KW / 2" :y="KY + 26" text-anchor="middle" class="t-big t-ink">Под-оркестратор</text>
      <text :x="kx(2) + KW / 2" :y="KY + 45" text-anchor="middle" class="t-ink-sec">своя цель, свои дети</text>
      <path :d="`M${kx(2) + 90},${KY + KH} V${KY + KH + 27}`" class="e" :marker-end="`url(#${id}-a)`" />
      <path :d="`M${kx(2) + 220},${KY + KH} V${KY + KH + 27}`" class="e" :marker-end="`url(#${id}-a)`" />
      <rect :x="kx(2) + 30" :y="KY + KH + 30" width="120" height="34" rx="8" class="n-wait" />
      <text :x="kx(2) + 90" :y="KY + KH + 52" text-anchor="middle" class="t-cap t-sec">своя цель</text>
      <rect :x="kx(2) + 160" :y="KY + KH + 30" width="120" height="34" rx="8" class="n-wait" />
      <text :x="kx(2) + 220" :y="KY + KH + 52" text-anchor="middle" class="t-cap t-sec">своя цель</text>
      <text :x="kx(2) + 30" y="278" class="t-cap t-sec">и дальше — рекурсивно</text>
    </g>
  </svg>
</template>
