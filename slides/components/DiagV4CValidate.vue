<script setup lang="ts">
// v4, слайд 42: валидатор проверяет граф процесса до запуска.
// Источник: curator-playbook spec/process-configuration.md DRAFT v4.8 §10 (curator playbook check; переносимые проверки:
// owners «owner tester is not a role», reachability «state escalated unreachable from open», unbounded cycles — предупреждение;
// «A version that fails a portable check never takes effect»), §7.1 (extends: iOS вставляет qa с tester).
// Граф — iOS-вариант dev-cycle с тремя нарочными дефектами, сообщения — по форме примеров §10.
// reveal: граф (1), затем по дефекту: подсветка на графе и строка вывода (2–4).
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const states = [
  { x: 0, t: 'development', s: 'developer' },
  { x: 236, t: 'qa', s: 'tester' },
  { x: 472, t: 'review', s: 'reviewer' },
]
const errs = [
  { y: 186, k: '✗', cls: 't-orange', m: 'workflow dev, state qa: owner tester is not a role', r: 'нет владельца' },
  { y: 228, k: '✗', cls: 't-orange', m: 'workflow dev: state escalated unreachable from open', r: 'не попасть' },
  { y: 270, k: '!', cls: 't-lilac', m: 'workflow dev: cycle review → development: no bounded limit', r: 'круг без лимита' },
]
</script>
<template>
  <svg width="908" height="284" viewBox="0 0 908 284" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <g v-for="s in states" :key="s.t">
        <rect :x="s.x" y="10" width="190" height="50" rx="10" class="n" />
        <text :x="s.x + 95" y="32" text-anchor="middle" class="t-big">{{ s.t }}</text>
        <text :x="s.x + 95" y="50" text-anchor="middle" class="t-sec">{{ s.s }}</text>
      </g>
      <line x1="190" y1="35" x2="233" y2="35" class="e" :marker-end="`url(#${id})`" />
      <line x1="426" y1="35" x2="469" y2="35" class="e" :marker-end="`url(#${id})`" />
      <line x1="662" y1="35" x2="705" y2="35" class="e" :marker-end="`url(#${id})`" />
      <rect x="708" y="10" width="200" height="50" rx="10" class="n-lime" />
      <text x="808" y="40" text-anchor="middle" class="t-big t-ink">done</text>
      <path d="M567,60 C557,98 105,98 95,63" class="e" :marker-end="`url(#${id})`" />
      <rect x="704" y="84" width="196" height="44" rx="10" class="n-wait" />
      <text x="802" y="111" text-anchor="middle" class="t-big">escalated</text>
      <text x="0" y="152" class="t-head t-sec">$ CURATOR PLAYBOOK CHECK</text>
    </Step>
    <Step :on="reveal">
      <rect x="234" y="8" width="194" height="54" rx="12" class="hl" />
      <text :y="errs[0].y" x="0" class="cli" :class="errs[0].cls">{{ errs[0].k }}</text>
      <text :y="errs[0].y" x="22" class="cli">{{ errs[0].m }}</text>
      <text :y="errs[0].y" x="908" text-anchor="end" class="t-cap t-orange">{{ errs[0].r }}</text>
    </Step>
    <Step :on="reveal">
      <rect x="702" y="82" width="200" height="48" rx="12" class="hl" />
      <text :y="errs[1].y" x="0" class="cli" :class="errs[1].cls">{{ errs[1].k }}</text>
      <text :y="errs[1].y" x="22" class="cli">{{ errs[1].m }}</text>
      <text :y="errs[1].y" x="908" text-anchor="end" class="t-cap t-orange">{{ errs[1].r }}</text>
    </Step>
    <Step :on="reveal">
      <path d="M567,60 C557,98 105,98 95,63" class="hl-e" />
      <text :y="errs[2].y" x="0" class="cli" :class="errs[2].cls">{{ errs[2].k }}</text>
      <text :y="errs[2].y" x="22" class="cli">{{ errs[2].m }}</text>
      <text :y="errs[2].y" x="908" text-anchor="end" class="t-cap t-lilac">{{ errs[2].r }}</text>
    </Step>
  </svg>
</template>
<style scoped>
.hl { fill: none; stroke: var(--rwb-orange); stroke-width: 2; }
.cli { font-size: 15px; }
.hl-e { fill: none; stroke: var(--rwb-lilac); stroke-width: 2; stroke-dasharray: 6 4; }
</style>
