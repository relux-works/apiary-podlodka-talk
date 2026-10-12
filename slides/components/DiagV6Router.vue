<script setup lang="ts">
// v6 (12.10), глава 2: роутер моделей — бывшие «Роутинг по политике запуска» (DiagV4BPolicy) и запасной «Роутер моделей»
// (DiagP34Router) в одной простой схеме: что меняется каждую неделю → роутер → кому какая работа.
// Разговор спикеров 12.10: «чтобы эффективно спавнить, у нас есть роутер, который определяет модели»; «какие модели доступны
// со скидками или вне пиковых часов»; пример ревью безопасности — «на крутых моделях, а фиксы отдаем на более дешевые».
// Источники: plan/deck-v4-brief.md §3 «Routing» (бюджеты, подписки и лимиты, ночные окна, промо-недели); wiki book/ru/04-modeli-i-dengi.md
// (models.toml, окна расписания); curator-model-router spec/model-routing.md §0, R2; Иван 12.10: роутер сделан, режим теста.
// reveal: входы по одному (1–4), роутер (5), исходы (6).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const inputs = [
  { y: 0, h: 'Бюджет', s: 'сколько можно потратить' },
  { y: 60, h: 'Подписки и лимиты', s: 'что осталось на неделе' },
  { y: 120, h: 'Часы вне пика', s: 'ночью — локальная модель' },
  { y: 180, h: 'Скидки и промо', s: 'новая модель дешевле' },
]
</script>
<template>
  <svg width="908" height="232" viewBox="0 0 908 232" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step v-for="i in inputs" :key="i.y" :on="reveal">
      <rect x="0" :y="i.y" width="260" height="52" rx="10" class="n" />
      <text x="18" :y="i.y + 22" class="t-big">{{ i.h }}</text>
      <text x="18" :y="i.y + 41" class="t-sec">{{ i.s }}</text>
    </Step>
    <Step :on="reveal">
      <path d="M260,26 C300,26 296,96 327,102" class="e" :marker-end="`url(#${id})`" />
      <path d="M260,86 C292,86 296,108 327,112" class="e" :marker-end="`url(#${id})`" />
      <path d="M260,146 C292,146 296,124 327,120" class="e" :marker-end="`url(#${id})`" />
      <path d="M260,206 C300,206 296,136 327,130" class="e" :marker-end="`url(#${id})`" />
      <rect x="330" y="66" width="236" height="100" rx="12" class="n-purple" />
      <text x="448" y="102" text-anchor="middle" class="t-lab">Роутер моделей</text>
      <text x="448" y="126" text-anchor="middle" class="t-on">политика и оценка</text>
      <text x="448" y="146" text-anchor="middle" class="t-on">задачи, правится на ходу</text>
    </Step>
    <Step :on="reveal">
      <path d="M566,100 C600,100 598,60 625,60" class="e" :marker-end="`url(#${id})`" />
      <path d="M566,132 C600,132 598,172 625,172" class="e" :marker-end="`url(#${id})`" />
      <rect x="628" y="30" width="280" height="60" rx="10" class="n-lilac" />
      <text x="768" y="55" text-anchor="middle" class="t-big t-ink">Трудное — сильной модели</text>
      <text x="768" y="75" text-anchor="middle" class="t-ink-sec">архитектура, ревью</text>
      <rect x="628" y="142" width="280" height="60" rx="10" class="n" />
      <text x="768" y="167" text-anchor="middle" class="t-big">Мелочь — дешёвой</text>
      <text x="768" y="187" text-anchor="middle" class="t-sec">правки, шаблонные тесты</text>
    </Step>
  </svg>
</template>
