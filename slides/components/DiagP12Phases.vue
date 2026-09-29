<script setup lang="ts">
// Слайд 8, task-board. Слева — иерархия Epic → Story → Task/Bug в .task-board/ репозитория и эскалация
// зависимости через родителей; справа — тот же граф, разложенный планировщиком по фазам (--layout phases).
// Источник: skill-project-management SPEC.md, Part 1 R1 (иерархия, эскалация), R2 (фазы, критерий параллельности,
// «один сабагент = одна story»), R4 (--layout phases), R5 (критический путь); wiki book/ru/02-yadro-segodnya.md.
//   reveal — иерархия, затем фазы
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const click = computed(() => props.reveal ? '+1' : false)
// фазы: колонки справа
const COL = [356, 540, 724], CW = 140
const stories = [
  { k: 'A', c: 0, y: 64 }, { k: 'C', c: 0, y: 128 }, { k: 'F', c: 0, y: 192 },
  { k: 'B', c: 1, y: 64 }, { k: 'D', c: 1, y: 128 },
  { k: 'E', c: 2, y: 96 },
]
const pos = (k: string) => stories.find(s => s.k === k)!
const edges = [['A', 'B', true], ['C', 'D', false], ['B', 'E', true], ['D', 'E', false]] as const
</script>
<template>
  <svg width="908" height="276" viewBox="0 0 908 276" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <!-- иерархия -->
    <g v-click="click">
      <rect x="0.75" y="0.75" width="318" height="274" rx="14" class="frame" />
      <text x="16" y="24" class="t-head t-sec">.task-board/ В РЕПОЗИТОРИИ</text>
      <rect x="16" y="40" width="286" height="40" rx="10" class="n-lilac" />
      <text x="159" y="65" text-anchor="middle" class="t-big t-ink">Epic</text>
      <line x1="80" y1="80" x2="80" y2="103" class="e" :marker-end="`url(#${id}-a)`" />
      <line x1="238" y1="80" x2="238" y2="103" class="e" :marker-end="`url(#${id}-a)`" />
      <rect x="16" y="106" width="128" height="40" rx="10" class="n" />
      <text x="80" y="131" text-anchor="middle" class="t-big">Story A</text>
      <rect x="174" y="106" width="128" height="40" rx="10" class="n" />
      <text x="238" y="131" text-anchor="middle" class="t-big">Story B</text>
      <rect x="16" y="166" width="128" height="34" rx="8" class="n" />
      <text x="80" y="188" text-anchor="middle" class="t-cap">Task a1</text>
      <rect x="16" y="208" width="128" height="34" rx="8" class="n" />
      <text x="80" y="230" text-anchor="middle" class="t-cap">Bug a2</text>
      <rect x="174" y="166" width="128" height="34" rx="8" class="n" />
      <text x="238" y="188" text-anchor="middle" class="t-cap">Task b1</text>
      <line x1="80" y1="146" x2="80" y2="163" class="e" />
      <line x1="238" y1="146" x2="238" y2="163" class="e" />
      <line x1="144" y1="183" x2="171" y2="183" class="e" :marker-end="`url(#${id}-a)`" />
      <path d="M124,106 C136,90 170,90 186,103" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <text x="16" y="262" class="t-cap t-sec">связь задач поднимается до story и epic</text>
    </g>
    <!-- фазы -->
    <g v-click="click">
      <rect x="336.75" y="0.75" width="570.5" height="274" rx="14" class="frame-hive" />
      <text x="356" y="24" class="t-head t-lilac">task-board plan --layout phases</text>
      <text v-for="(cx, i) in COL" :key="cx" :x="cx" y="50" class="t-head t-sec">ФАЗА {{ i + 1 }}</text>
      <g v-for="s in stories" :key="s.k">
        <rect :x="COL[s.c]" :y="s.y" :width="CW" height="44" rx="10" :class="s.k === 'A' || s.k === 'B' || s.k === 'E' ? 'n-purple' : 'n'" />
        <text :x="COL[s.c] + CW / 2" :y="s.y + 27" text-anchor="middle" class="t-big">Story {{ s.k }}</text>
      </g>
      <path v-for="[a, b, crit] in edges" :key="a + b"
        :d="`M${COL[pos(a).c] + CW},${pos(a).y + 22} C${COL[pos(a).c] + CW + 8},${pos(a).y + 22} ${COL[pos(b).c] - 8},${pos(b).y + 22} ${COL[pos(b).c] - 3},${pos(b).y + 22}`"
        :class="crit ? 'e-lime' : 'e'" :marker-end="`url(#${id}-${crit ? 'l' : 'a'})`" />
      <text x="724" y="166" class="t-cap t-lime">критический путь</text>
      <text x="724" y="186" class="t-cap t-lime">A → B → E</text>
      <text x="356" y="262" class="t-cap t-sec">в одной фазе — параллельно: одна story — один сабагент</text>
    </g>
  </svg>
</template>
