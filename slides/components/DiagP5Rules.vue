<script setup lang="ts">
// Слайд 29, проверка на реальных пайплайнах. Левая колонка — восемь правил процесса, которые несут длинные промпты
// (research/video-pipelines-synthesis.md §1: ~245 уникальных промптов из трёх каталогов, 4–8 правил в длинных, медиана ноль до 1000 символов).
// Правая колонка — где это правило живёт в плейбуке: curator-playbook spec/process-configuration.md DRAFT v4.8.
// Решено: §6.4 (approvals), §6.2 (risk: spending), §6.2/§7.3 (limit), §6.11 (состояние-инструмент).
// Предложено 2026-09-29: §6.11.2 (tiers), §5.5 (inputs.fresh, licence.cleared), §6.16 (writes), §6.15 (версии по платформам).
defineProps<{ reveal?: boolean }>()
const rows = [
  { r: 'сначала план или раскадровка', m: 'состояние, из которого выводит одобрение человека', ok: true },
  { r: 'смета, потом ждать', m: 'переход risk: spending ждёт одобрения трат', ok: true },
  { r: 'проба перед полным прогоном', m: 'уровни preview и final у инструмента', ok: false },
  { r: 'доводка до планки', m: 'петля ревью и доработки с limit', ok: true },
  { r: 'замер синхронизации', m: 'состояние, которым владеет инструмент-проверка', ok: true },
  { r: 'неизменяемое не трогать', m: 'закреплённые входы и области записи', ok: false },
  { r: 'спеки платформ', m: 'версии по платформам, пределы — параметры', ok: false },
  { r: 'лицензии', m: 'guard licence.cleared перед публикацией', ok: false },
]
const Y0 = 40
const RH = 32
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <text x="0" y="14" class="t-head t-sec">ДЛИННЫЙ ПРОМПТ · ПРАВИЛО ПРОЦЕССА</text>
    <text x="336" y="14" class="t-head t-lilac">ПЛЕЙБУК · ЯВНО, В ВЕРСИЯХ, ПРОВЕРЯЕМО</text>
    <template v-for="(w, i) in rows" :key="w.r">
      <g v-if="reveal" v-click>
        <rect x="0" :y="Y0 + i * RH - 12" width="292" height="26" rx="8" class="n" />
        <text x="12" :y="Y0 + i * RH + 6" class="t-cap">{{ w.r }}</text>
        <line x1="296" :y1="Y0 + i * RH + 1" x2="329" :y2="Y0 + i * RH + 1" class="e" />
        <path :d="`M325,${Y0 + i * RH - 3} L333,${Y0 + i * RH + 1} L325,${Y0 + i * RH + 5} z`" class="m" />
        <rect x="336" :y="Y0 + i * RH - 12" width="570" height="26" rx="8" class="n-lilac" />
        <text x="348" :y="Y0 + i * RH + 6" class="t-cap t-ink">{{ w.m }}</text>
      </g>
      <g v-else>
        <rect x="0" :y="Y0 + i * RH - 12" width="292" height="26" rx="8" class="n" />
        <text x="12" :y="Y0 + i * RH + 6" class="t-cap">{{ w.r }}</text>
        <line x1="296" :y1="Y0 + i * RH + 1" x2="329" :y2="Y0 + i * RH + 1" class="e" />
        <path :d="`M325,${Y0 + i * RH - 3} L333,${Y0 + i * RH + 1} L325,${Y0 + i * RH + 5} z`" class="m" />
        <rect x="336" :y="Y0 + i * RH - 12" width="570" height="26" rx="8" class="n-lilac" />
        <text x="348" :y="Y0 + i * RH + 6" class="t-cap t-ink">{{ w.m }}</text>
      </g>
    </template>
  </svg>
</template>
