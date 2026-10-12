<script setup lang="ts">
// v6 (12.10), часть Ивана, «Пересечение проектов». Два человека, у каждого свой главный оркестратор; личные проекты
// не пересекаются (оранжевые), общие — пересекаются (лаймовые). Модули в общей зоне — настоящие модули Relux Works.
// Разговор спикеров 12.10: «два человека… два личных там (условно говоря, работа твоя, работа моя), плюс наш общий проект»;
// «красные не пересекаются, зеленые пересекаются проекты»; «в идеале какие-то модули, которые у нас уже есть… всякие роутеры».
// Бывшая «Две машины одного владельца» (запас) показана через проекты и модули (решение 12.10).
// [Для себя] Какие модули чьи и какие общие — раскладка оркестратора дека, спикеры уточняют.
// reveal: Иван и его проекты (1), Алексей и его проекты (2), общая зона (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const shared = ['Доска задач', 'Роутер моделей', 'Curator', 'Связь агентов']
</script>
<template>
  <svg width="908" height="276" viewBox="0 0 908 276" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="0" y="0" width="236" height="62" rx="10" class="n-lime" />
      <text x="118" y="25" text-anchor="middle" class="t-big t-ink">Иван</text>
      <text x="118" y="46" text-anchor="middle" class="t-ink-sec">свой главный оркестратор</text>
      <line x1="118" y1="62" x2="118" y2="101" class="e" :marker-end="`url(#${id})`" />
      <rect x="0" y="104" width="236" height="58" rx="10" class="n-orange" />
      <text x="118" y="129" text-anchor="middle" class="t-big t-ink">Работа в RWB</text>
      <text x="118" y="149" text-anchor="middle" class="t-ink-sec">свой контекст</text>
      <rect x="0" y="176" width="236" height="58" rx="10" class="n-orange" />
      <text x="118" y="201" text-anchor="middle" class="t-big t-ink">Свои проекты</text>
      <text x="118" y="221" text-anchor="middle" class="t-ink-sec">не пересекаются</text>
    </Step>
    <Step :on="reveal">
      <rect x="672" y="0" width="236" height="62" rx="10" class="n-lime" />
      <text x="790" y="25" text-anchor="middle" class="t-big t-ink">Алексей</text>
      <text x="790" y="46" text-anchor="middle" class="t-ink-sec">свой главный оркестратор</text>
      <line x1="790" y1="62" x2="790" y2="101" class="e" :marker-end="`url(#${id})`" />
      <rect x="672" y="104" width="236" height="58" rx="10" class="n-orange" />
      <text x="790" y="129" text-anchor="middle" class="t-big t-ink">Работа в МТС</text>
      <text x="790" y="149" text-anchor="middle" class="t-ink-sec">свой контекст</text>
      <rect x="672" y="176" width="236" height="58" rx="10" class="n-orange" />
      <text x="790" y="201" text-anchor="middle" class="t-big t-ink">Свои проекты</text>
      <text x="790" y="221" text-anchor="middle" class="t-ink-sec">не пересекаются</text>
    </Step>
    <Step :on="reveal">
      <path d="M236,31 C262,31 258,96 279,104" class="e" :marker-end="`url(#${id})`" />
      <path d="M672,31 C646,31 650,96 629,104" class="e" :marker-end="`url(#${id})`" />
      <rect x="282.75" y="80.75" width="342.5" height="194" rx="14" class="frame-hive" />
      <text x="298" y="104" class="t-head t-lilac">ОБЩИЙ ПРОЕКТ · RELUX WORKS</text>
      <g v-for="(m, i) in shared" :key="m">
        <rect :x="298 + (i % 2) * 160" :y="118 + Math.floor(i / 2) * 74" width="152" height="62" rx="10" class="n-lime" />
        <text :x="374 + (i % 2) * 160" :y="154 + Math.floor(i / 2) * 74" text-anchor="middle" class="t-big t-ink">{{ m }}</text>
      </g>
    </Step>
  </svg>
</template>
