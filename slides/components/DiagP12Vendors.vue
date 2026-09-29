<script setup lang="ts">
// Слайд 7, эпоха 5: оркестраторы внутри одного вендора. Codex спавнит Codex, Claude спавнит Claude,
// некоторые среды не спавнят вообще; между средами ничего нет.
// Источник: text/from-buckets-to-apiary.ru.md §2 (второй абзац), §3 «Проблема»; wiki posts/2026-09-24-agent-ecosystem.ru.md §1 «Спавны»;
// plan/slides-plan.ru.md, слайд 7.
//   reveal — среды по одной, затем полоса «между средами»
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const click = computed(() => props.reveal ? '+1' : false)
const FW = 286, GAP = 25
const vendors = [
  { x: 0, head: 'CODEX СПАВНИТ CODEX', orch: 'Оркестратор · Codex', kid: 'Codex' },
  { x: FW + GAP, head: 'CLAUDE СПАВНИТ CLAUDE', orch: 'Оркестратор · Claude', kid: 'Claude' },
]
const kids = [0, 1, 2]
const KW = 76
const kx = (fx: number, k: number) => fx + 16 + k * (KW + 13)
</script>
<template>
  <svg width="908" height="252" viewBox="0 0 908 252" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-for="v in vendors" :key="v.x" v-click="click">
      <rect :x="v.x + 0.75" y="0.75" :width="FW - 1.5" height="176" rx="14" class="frame" />
      <text :x="v.x + 16" y="24" class="t-head t-sec">{{ v.head }}</text>
      <rect :x="v.x + 33" y="40" :width="FW - 66" height="44" rx="10" class="n-purple" />
      <text :x="v.x + FW / 2" y="67" text-anchor="middle" class="t-big">{{ v.orch }}</text>
      <g v-for="k in kids" :key="k">
        <path :d="`M${v.x + FW / 2},84 C${v.x + FW / 2},100 ${kx(v.x, k) + KW / 2},104 ${kx(v.x, k) + KW / 2},121`" class="e" :marker-end="`url(#${id})`" />
        <rect :x="kx(v.x, k)" y="124" :width="KW" height="38" rx="10" class="n" />
        <text :x="kx(v.x, k) + KW / 2" y="148" text-anchor="middle" class="t-cap">{{ v.kid }}</text>
      </g>
    </g>
    <g v-click="click">
      <rect :x="2 * (FW + GAP) + 0.75" y="0.75" :width="FW - 1.5" height="176" rx="14" class="frame" />
      <text :x="2 * (FW + GAP) + 16" y="24" class="t-head t-sec">ДРУГАЯ СРЕДА</text>
      <rect :x="2 * (FW + GAP) + 33" y="40" :width="FW - 66" height="44" rx="10" class="n" />
      <text :x="2 * (FW + GAP) + FW / 2" y="67" text-anchor="middle" class="t-big">Один агент</text>
      <rect :x="2 * (FW + GAP) + 16" y="112" :width="FW - 32" height="50" rx="10" class="n-wait" />
      <text :x="2 * (FW + GAP) + FW / 2" y="133" text-anchor="middle" class="t-cap t-sec">спавнить не умеет:</text>
      <text :x="2 * (FW + GAP) + FW / 2" y="152" text-anchor="middle" class="t-cap t-sec">всё идёт одним потоком</text>
    </g>
    <g v-click="click">
      <rect x="0" y="196" width="908" height="56" rx="10" class="n-wait" />
      <text x="20" y="220" class="t-cap">Между средами ничего нет: оркестратор Codex не запустит Claude, и наоборот.</text>
      <text x="20" y="240" class="t-cap t-sec">Ревью другой семьёй моделей — это вторая вкладка и человек, который носит дифф.</text>
    </g>
  </svg>
</template>
