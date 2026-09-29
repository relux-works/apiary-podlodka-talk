<script setup lang="ts">
// v4, глава 2, слайд «Человек уходит в начало и в конец». Внимание человека до и после оркестратора:
// было — рваная лента «агент, одобрить, агент, подождать, агент, переключиться»; стало — человек в начале
// (видение, спека, декомпозиция), длинная полоса работы агентов, человек в конце (решения, приёмка).
// Источник: plan/deck-v4-brief.md §3 «Автономия на практике» (reframing операторов, прогон 29.09);
// text/from-buckets-to-apiary.ru.md, вступление («человек весь день переносит контекст») и §2
// («сотни часов … почти без вмешательства человека»).
//   reveal — строка «было», затем строка «стало»
defineProps<{ reveal?: boolean }>()
const X0 = 108, H = 50
// было: [ширина, кто, подпись]
const before: [number, 'a' | 'h', string][] = [
  [84, 'a', 'агент'], [122, 'h', 'одобрить'], [84, 'a', 'агент'], [130, 'h', 'подождать'],
  [84, 'a', 'агент'], [156, 'h', 'переключиться'], [84, 'a', 'агент'],
]
const G = 8
const bxs = before.reduce<number[]>((acc, _s, i) => { acc.push(i === 0 ? X0 : acc[i - 1] + before[i - 1][0] + G); return acc }, [])
</script>
<template>
  <svg width="908" height="150" viewBox="0 0 908 150" aria-hidden="true">
    <Step :on="reveal">
      <text x="0" y="31" class="t-head t-sec">БЫЛО</text>
      <g v-for="(s, i) in before" :key="i">
        <rect :x="bxs[i]" y="0" :width="s[0]" :height="H" rx="10" :class="s[1] === 'h' ? 'n-lime' : 'n-purple'" />
        <text :x="bxs[i] + s[0] / 2" y="31" text-anchor="middle" :class="s[1] === 'h' ? 't-cap t-ink' : 't-cap t-on'">{{ s[2] }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <text x="0" y="111" class="t-head t-lilac">СТАЛО</text>
      <rect :x="X0" y="80" width="262" :height="H" rx="10" class="n-lime" />
      <text :x="X0 + 131" y="111" text-anchor="middle" class="t-cap t-ink">видение · спека · декомпозиция</text>
      <rect :x="X0 + 270" y="80" width="352" :height="H" rx="10" class="n-purple" />
      <text :x="X0 + 446" y="111" text-anchor="middle" class="t-lab">агенты работают неделями</text>
      <rect :x="X0 + 630" y="80" width="170" :height="H" rx="10" class="n-lime" />
      <text :x="X0 + 715" y="111" text-anchor="middle" class="t-cap t-ink">решения · приёмка</text>
    </Step>
  </svg>
</template>
