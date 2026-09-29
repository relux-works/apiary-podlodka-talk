<script setup lang="ts">
// v4, глава 2 «Доска и автономия», слайд «Каждая история приземляется через ревью».
// Путь работы в main: своя рабочая копия (worktree) на story → Change Request (неизменяемая ревизия, проверки
// на точном дереве кандидата) → ревью (принять или вернуть ревизией N+1) → CI на pull request → приземление
// fast-forward подписанных коммитов. Упрощение DiagP12Landing по брифу v4 §3: без очереди тяжёлых прогонов
// и без строки про обязательный набор проверок (она уехала в запас вместе с DiagP12Landing).
// Источник: skill-project-management references/tracked-background-spawn.md («Story Worktree Isolation»,
// «Change Requests, review, rework», «Landing a Story», «Validation binds to the tree that lands»);
// README «Isolated Story delivery», «Cross-repository landing flow»; text/from-buckets-to-apiary.ru.md §2.
//   reveal — рабочая копия и Change Request, ревью с возвратом, CI и приземление
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const BW = 160, GAP = 27, Y = 44, BH = 76
const bx = (i: number) => i * (BW + GAP)
</script>
<template>
  <svg width="908" height="178" viewBox="0 0 908 178" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <Step :on="reveal">
      <rect :x="bx(0)" :y="Y" :width="BW" :height="BH" rx="10" class="n-purple" />
      <text :x="bx(0) + BW / 2" :y="Y + 32" text-anchor="middle" class="t-lab">Worktree</text>
      <text :x="bx(0) + BW / 2" :y="Y + 54" text-anchor="middle" class="t-cap t-on">копия на историю</text>
      <line :x1="bx(1) - GAP" :x2="bx(1) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
      <rect :x="bx(1)" :y="Y" :width="BW" :height="BH" rx="10" class="n" />
      <text :x="bx(1) + BW / 2" :y="Y + 32" text-anchor="middle" class="t-lab">Change Request</text>
      <text :x="bx(1) + BW / 2" :y="Y + 54" text-anchor="middle" class="t-cap t-sec">ревизия и проверки</text>
    </Step>
    <Step :on="reveal">
      <line :x1="bx(2) - GAP" :x2="bx(2) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
      <rect :x="bx(2)" :y="Y" :width="BW" :height="BH" rx="10" class="n-lilac" />
      <text :x="bx(2) + BW / 2" :y="Y + 32" text-anchor="middle" class="t-lab t-ink">Ревью</text>
      <text :x="bx(2) + BW / 2" :y="Y + 54" text-anchor="middle" class="t-cap t-ink-sec">принять или вернуть</text>
      <path :d="`M${bx(2) + BW / 2},${Y} V${Y - 26} H${bx(0) + BW / 2} V${Y - 3}`" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <rect :x="bx(1) + BW / 2 - 104" :y="Y - 37" width="208" height="22" class="knock" />
      <text :x="bx(1) + BW / 2" :y="Y - 21" text-anchor="middle" class="t-cap">доработка: ревизия N+1</text>
    </Step>
    <Step :on="reveal">
      <line :x1="bx(3) - GAP" :x2="bx(3) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <rect :x="bx(3)" :y="Y" :width="BW" :height="BH" rx="10" class="n" />
      <text :x="bx(3) + BW / 2" :y="Y + 32" text-anchor="middle" class="t-lab">CI</text>
      <text :x="bx(3) + BW / 2" :y="Y + 54" text-anchor="middle" class="t-cap t-sec">pull request</text>
      <line :x1="bx(4) - GAP" :x2="bx(4) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <rect :x="bx(4)" :y="Y" :width="BW" :height="BH" rx="10" class="n-lime" />
      <text :x="bx(4) + BW / 2" :y="Y + 32" text-anchor="middle" class="t-lab t-ink">Приземление</text>
      <text :x="bx(4) + BW / 2" :y="Y + 54" text-anchor="middle" class="t-cap t-ink-sec">fast-forward в main</text>
      <text :x="bx(3)" :y="Y + BH + 30" class="t-cap t-sec">в main — только целая принятая история,</text>
      <text :x="bx(3)" :y="Y + BH + 50" class="t-cap t-sec">подписанными коммитами</text>
    </Step>
  </svg>
</template>
