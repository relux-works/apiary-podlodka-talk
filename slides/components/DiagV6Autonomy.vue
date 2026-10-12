<script setup lang="ts">
// v6 (12.10), глава 2, итог «Автономная разработка». Было — человек на каждом такте работы агента; стало — человек в начале
// (видение, спека, декомпозиция) и в конце (приёмка), между ними агенты неделями; пока идёт один проект, человек
// запускает следующие — «колбаски» со смещением, как диаграмма Ганта.
// Разговор спикеров 12.10: «агент — человек попить кофе, агент — человек покурить»; «две колбаски нарисовать, как диаграмму
// Ганта… пару-тройку проектов вести параллельно». Цифр на схеме нет: их пересчитываем (.scripts/agent-hours.mjs).
// Источники: plan/deck-v4-brief.md §3 «Автономия на практике»; text/from-buckets-to-apiary.ru.md §2 («сотни часов … почти без
// вмешательства человека»); бывшая DiagV4AAutonomy (строка «было»).
// reveal: «было» (1), проект A (2), проекты B и C (3).
defineProps<{ reveal?: boolean }>()
const X0 = 108, H = 42, G = 8
const before: [number, 'a' | 'h', string][] = [
  [84, 'a', 'агент'], [122, 'h', 'одобрить'], [84, 'a', 'агент'], [130, 'h', 'подождать'],
  [84, 'a', 'агент'], [156, 'h', 'переключиться'], [84, 'a', 'агент'],
]
const bxs = before.reduce<number[]>((acc, _s, i) => { acc.push(i === 0 ? X0 : acc[i - 1] + before[i - 1][0] + G); return acc }, [])
</script>
<template>
  <svg width="908" height="214" viewBox="0 0 908 214" aria-hidden="true">
    <Step :on="reveal">
      <text x="0" y="27" class="t-head t-sec">БЫЛО</text>
      <g v-for="(s, i) in before" :key="i">
        <rect :x="bxs[i]" y="0" :width="s[0]" :height="H" rx="10" :class="s[1] === 'h' ? 'n-lime' : 'n-purple'" />
        <text :x="bxs[i] + s[0] / 2" y="27" text-anchor="middle" :class="s[1] === 'h' ? 't-cap t-ink' : 't-cap t-on'">{{ s[2] }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <text x="0" y="89" class="t-head t-lilac">ПРОЕКТ A</text>
      <rect :x="X0" y="62" width="256" :height="H" rx="10" class="n-lime" />
      <text :x="X0 + 128" y="89" text-anchor="middle" class="t-cap t-ink">видение · спека · декомпозиция</text>
      <rect :x="X0 + 264" y="62" width="420" :height="H" rx="10" class="n-purple" />
      <text :x="X0 + 474" y="89" text-anchor="middle" class="t-lab">агенты работают неделями</text>
      <rect :x="X0 + 692" y="62" width="108" :height="H" rx="10" class="n-lime" />
      <text :x="X0 + 746" y="89" text-anchor="middle" class="t-cap t-ink">приёмка</text>
    </Step>
    <Step :on="reveal">
      <text x="0" y="141" class="t-head t-lilac">ПРОЕКТ B</text>
      <rect :x="X0 + 264" y="114" width="200" :height="H" rx="10" class="n-lime" />
      <text :x="X0 + 364" y="141" text-anchor="middle" class="t-cap t-ink">спека проекта B</text>
      <rect :x="X0 + 472" y="114" width="328" :height="H" rx="10" class="n-purple" />
      <text :x="X0 + 636" y="141" text-anchor="middle" class="t-lab">агенты неделями</text>
      <text x="0" y="193" class="t-head t-lilac">ПРОЕКТ C</text>
      <rect :x="X0 + 472" y="166" width="180" :height="H" rx="10" class="n-lime" />
      <text :x="X0 + 562" y="193" text-anchor="middle" class="t-cap t-ink">спека проекта C</text>
      <rect :x="X0 + 660" y="166" width="140" :height="H" rx="10" class="n-purple" />
      <text :x="X0 + 730" y="193" text-anchor="middle" class="t-lab">агенты</text>
    </Step>
  </svg>
</template>
