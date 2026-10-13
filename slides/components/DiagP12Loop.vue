<script setup lang="ts">
// Слайды 2–5, эпохи 0–3. Один и тот же цикл разработки — «контекст → ответ → правка → сборка → ошибки» —
// и кто крутит каждый его шаг: человек (лайм), скрипт (серый), модель (сирень), агент (фиолетовый).
// Источник: text/from-buckets-to-apiary.ru.md §1 («Таскаем вёдра», «Скрипты», «Агенты»);
// wiki posts/2026-09-24-agent-ecosystem.ru.md §1; эпоха 0 — plan/slides-plan.ru.md, слайд 2.
//   epoch — 0…3; reveal — цепочка одним кликом, возврат следующим (13.10: шаг за шагом было слишком мелко)
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ epoch?: number, reveal?: boolean }>(), { epoch: 1, reveal: false })
const id = useId()
type Who = 'человек' | 'скрипт' | 'модель' | 'агент' | 'форум'
const EPOCHS: { steps: [string, Who][], back: string, human: boolean }[] = [
  { steps: [['Вопрос', 'человек'], ['Чужой ответ', 'форум'], ['Адаптация', 'человек'], ['Сборка', 'человек'], ['Ошибки', 'человек']],
    back: 'новый вопрос — снова руками', human: true },
  { steps: [['Код в чат', 'человек'], ['Ответ', 'модель'], ['Ответ в редактор', 'человек'], ['Сборка', 'человек'], ['Ошибку в чат', 'человек']],
    back: 'следующий круг снова несёт человек', human: true },
  { steps: [['Сбор контекста', 'скрипт'], ['Ответ', 'модель'], ['Применить ответ', 'скрипт'], ['Сборка и тесты', 'человек'], ['Разбор ошибок', 'человек']],
    back: 'следующий круг запускает человек', human: true },
  { steps: [['Открыть файлы', 'агент'], ['Ответ', 'модель'], ['Правка', 'агент'], ['Сборка и тесты', 'агент'], ['Чтение падений', 'агент']],
    back: 'следующий круг агент запускает сам', human: false },
]
const e = computed(() => EPOCHS[Math.max(0, Math.min(3, props.epoch))])
const W = 908, GAP = 22, BW = (W - GAP * 4) / 5, TOP = 6, BH = 62
const x = (i: number) => i * (BW + GAP)
const fill: Record<Who, string> = { человек: 'n-lime', скрипт: 'n', модель: 'n-lilac', агент: 'n-purple', форум: 'n-wait' }
const ink = (w: Who) => w === 'человек' || w === 'модель'
const click = computed(() => props.reveal ? '+1' : false)
</script>
<template>
  <svg :width="W" height="132" :viewBox="`0 0 ${W} 132`" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <g v-click="click">
      <g v-for="(s, i) in e.steps" :key="i">
        <line v-if="i > 0" :x1="x(i) - GAP + 2" :x2="x(i) - 3" :y1="TOP + BH / 2" :y2="TOP + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
        <rect :x="x(i)" :y="TOP" :width="BW" :height="BH" rx="10" :class="fill[s[1]]" />
        <text :x="x(i) + BW / 2" :y="TOP + 27" text-anchor="middle" class="t-big" :class="{ 't-ink': ink(s[1]) }">{{ s[0] }}</text>
        <text :x="x(i) + BW / 2" :y="TOP + 47" text-anchor="middle" :class="ink(s[1]) ? 't-ink-sec' : s[1] === 'агент' ? 't-on' : 't-sec'">{{ s[1] }}</text>
      </g>
    </g>
    <g v-click="click">
      <path :d="`M${x(4) + BW / 2},${TOP + BH} V${TOP + BH + 36} H${BW / 2} V${TOP + BH + 3}`" :class="e.human ? 'e-lime' : 'e'" :marker-end="`url(#${id}-${e.human ? 'l' : 'a'})`" />
      <rect :x="W / 2 - e.back.length * 4.1 - 14" :y="TOP + BH + 26" :width="e.back.length * 8.2 + 28" height="20" class="knock" />
      <text :x="W / 2" :y="TOP + BH + 41" text-anchor="middle" class="t-cap" :class="e.human ? 't-lime' : 't-lilac'">{{ e.back }}</text>
    </g>
  </svg>
</template>
