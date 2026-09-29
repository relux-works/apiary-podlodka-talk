<script setup lang="ts">
// v4, слайд 39: проблема главы 5 — процесс зашит в код ядра task-board.
// Источник: curator-playbook spec/process-configuration.md DRAFT v4.8, вступление («A team's process is code today.
// task-board's element types, statuses, gates and roles are compiled into its kernel, so a team that works differently —
// or a cafe ordering supplies … — cannot describe its process without changing the board»), §14 (сегодняшняя доска).
// reveal: ядро с зашитым процессом (1), другая команда (2), процесс не про разработку (3).
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const chips = [
  { x: 16, w: 150, t: 'типы задач' },
  { x: 178, w: 130, t: 'статусы' },
  { x: 320, w: 110, t: 'роли' },
  { x: 442, w: 250, t: 'продюсер → ревьюер' },
  { x: 704, w: 188, t: 'проверки' },
]
</script>
<template>
  <svg width="908" height="316" viewBox="0 0 908 316" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="0.75" y="0.75" width="906.5" height="136" rx="14" class="frame" />
      <text x="16" y="24" class="t-head t-sec">КОД ЯДРА TASK-BOARD · GO</text>
      <g v-for="c in chips" :key="c.t">
        <rect :x="c.x" y="40" :width="c.w" height="56" rx="10" class="n" />
        <text :x="c.x + c.w / 2" y="74" text-anchor="middle" class="t-lab">{{ c.t }}</text>
      </g>
      <text x="16" y="122" class="t-cap t-sec">процесс из первой половины доклада — скомпилирован в ядро</text>
    </Step>
    <Step :on="reveal">
      <line x1="220" y1="137" x2="220" y2="183" class="e" :marker-end="`url(#${id})`" />
      <rect x="0.75" y="186" width="438.5" height="128" rx="12" class="n-wait" />
      <text x="24" y="236" class="t-lab t-orange">Команда с другим процессом</text>
      <text x="24" y="270" class="t-cap">QA, скрам, свои этапы — форк доски</text>
    </Step>
    <Step :on="reveal">
      <line x1="688" y1="137" x2="688" y2="183" class="e" :marker-end="`url(#${id})`" />
      <rect x="468.75" y="186" width="438.5" height="128" rx="12" class="n-wait" />
      <text x="492" y="236" class="t-lab t-orange">Процесс не про разработку</text>
      <text x="492" y="270" class="t-cap">кафе, семейный календарь — машинка недоступна</text>
    </Step>
  </svg>
</template>
