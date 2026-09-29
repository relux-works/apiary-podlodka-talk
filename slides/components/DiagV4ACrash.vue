<script setup lang="ts">
// v4, глава 2, слайд «Мы переживаем падения» (бывшие «Эксплуатация: что ломается» и «Рестарт хоста»).
// Слева — что падает: сессия, CLI, хост; в центре — доска как единственный источник правды (задачи, цели, раны);
// справа — оркестратор перезапускается, читает доску и продолжает с места.
// Сводку сессии, которая пока не переносится, на схеме не рисуем: бриф v4 §3 — говорить словами.
// Источник: wiki book/ru/01-zachem.md «Семь принципов» п. 2 (журнал — состояние, сессия — кэш; решено);
// skill-project-management docs/claude-goal-runtime.md и docs/codex-goal-runtime.md «Managed reconnect and restart»;
// эпизод с крашем машины 28.09 (подтверждён tb-keeper 29.09, open-questions.md «Решено»).
//   reveal — падения, доска, оркестратор
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const falls = ['Сессия перезапустилась', 'CLI упал', 'Хост перезагрузился']
const FW = 250, FH = 52, FG = 16
const fy = (i: number) => i * (FH + FG)
const BX = 318, BW = 272, BY = 48, BH = 148, T = 28
const OX = 658, OW = 250
</script>
<template>
  <svg width="908" height="220" viewBox="0 0 908 220" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <Step :on="reveal">
      <text x="0" y="14" class="t-head t-orange">ПАДАЕТ</text>
      <g v-for="(f, i) in falls" :key="f">
        <rect x="0" :y="T + fy(i)" :width="FW" :height="FH" rx="10" class="n-orange" />
        <text :x="FW / 2" :y="T + fy(i) + 32" text-anchor="middle" class="t-lab t-ink">{{ f }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <text :x="BX" y="14" class="t-head t-lime">ОСТАЁТСЯ</text>
      <rect :x="BX" :y="BY" :width="BW" :height="BH" rx="12" class="n-lime" />
      <text :x="BX + BW / 2" :y="BY + 46" text-anchor="middle" class="t-lab t-ink">Доска</text>
      <text :x="BX + BW / 2" :y="BY + 72" text-anchor="middle" class="t-cap t-ink">единственный источник правды</text>
      <text :x="BX + BW / 2" :y="BY + 110" text-anchor="middle" class="t-cap t-ink-sec">задачи · цели · раны</text>
      <text :x="BX + BW / 2" :y="BY + 130" text-anchor="middle" class="t-cap t-ink-sec">переживают любую сессию</text>
    </Step>
    <Step :on="reveal">
      <line :x1="BX + BW" :x2="OX - 3" :y1="BY + BH / 2" :y2="BY + BH / 2" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <text :x="BX + BW + 10" :y="BY + BH / 2 - 10" class="t-cap t-lime">читает</text>
      <rect :x="OX" :y="BY" :width="OW" :height="BH" rx="12" class="n-purple" />
      <text :x="OX + OW / 2" :y="BY + 46" text-anchor="middle" class="t-lab">Оркестратор</text>
      <text :x="OX + OW / 2" :y="BY + 72" text-anchor="middle" class="t-cap t-on">перезапускается</text>
      <text :x="OX + OW / 2" :y="BY + 92" text-anchor="middle" class="t-cap t-on">и продолжает с места</text>
    </Step>
  </svg>
</template>
