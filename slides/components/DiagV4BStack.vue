<script setup lang="ts">
// Plan v4 slide 33, the summary of the first half: we do not need our own agent harness. A simplified replacement of
// DiagP34Layers (v4, 29.09): three bands, big words, built bottom-up.
// Sources: text/from-buckets-to-apiary.ru.md ch. 3 (harness table), ch. 4 (planes: context, launch, sessions, choice),
// 4.6 (no own agent loop, decided 2026-09-28; change the harness without losing processes, boards and memory);
// waggle spec DRAFT v5.2 §0 (orchestrators talking, first on one machine). Status per block is in the slide notes.
// reveal: harnesses (1), our layer (2), orchestration on top (3).
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const envs = ['Claude Code', 'Codex', 'Muse', 'Локальные модели']
const layer = ['Контекст', 'Запуск', 'Сессии', 'Выбор модели', 'Связь']
const EW = 207, LW = 163
</script>
<template>
  <svg width="908" height="286" viewBox="0 0 908 286" aria-hidden="true">
    <Step :on="reveal">
      <rect x="0.75" y="194" width="906.5" height="90" rx="14" class="frame" />
      <text x="16" y="216" class="t-head t-sec">ГОТОВЫЕ СРЕДЫ · ПОДПИСКИ УЖЕ ОПЛАЧЕНЫ</text>
      <g v-for="(e, i) in envs" :key="e">
        <rect :x="16 + i * (EW + 16)" y="228" :width="EW" height="44" rx="8" class="n" />
        <text :x="16 + i * (EW + 16) + EW / 2" y="256" text-anchor="middle" class="t-lab">{{ e }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <rect x="0.75" y="96" width="906.5" height="88" rx="14" class="frame-hive" />
      <text x="16" y="118" class="t-head t-lilac">НАШ СЛОЙ · ВСЁ ВЕНДОРСКОЕ СПРЯТАНО ЗДЕСЬ</text>
      <g v-for="(l, i) in layer" :key="l">
        <rect :x="16 + i * (LW + 15.25)" y="128" :width="LW" height="44" rx="8" class="n-lilac" />
        <text :x="16 + i * (LW + 15.25) + LW / 2" y="156" text-anchor="middle" class="t-lab t-ink">{{ l }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <rect x="0" y="0" width="908" height="86" rx="14" class="n-purple" />
      <text x="16" y="24" class="t-head t-on">ПОВЕРХ</text>
      <text x="454" y="60" text-anchor="middle" class="v4b-xl">Оркестратор · доска задач · роли · цели</text>
    </Step>
  </svg>
</template>
<style scoped>
.slidev-layout svg text.v4b-xl { font-family: var(--rwb-sans); font-size: 22px; font-weight: 500; }
</style>
