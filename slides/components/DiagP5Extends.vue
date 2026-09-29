<script setup lang="ts">
// Слайд 26, только отличия. extends и uses поверх dev-cycle.
// Источник: curator-playbook spec/process-configuration.md DRAFT v4.8 — §7.1 (extends: iOS-проект меняет скилл разработчика и ставит QA перед review),
// §7.2 (uses и слоты: scrum поверх dev-cycle, bind scrum.work-item → story), §7.3 (параметры: rework_limit по умолчанию none);
// examples/dev-cycle.playbook.json (воркфлоу dev), examples/scrum/project.Playbook.json ("dev-cycle.rework_limit": 30).
import { useId } from 'vue'
const id = useId()
const base = [
  { x: 16, w: 120, t: 'open' },
  { x: 176, w: 150, t: 'development', s: 'developer' },
  { x: 366, w: 130, t: 'review', s: 'reviewer' },
  { x: 536, w: 150, t: 'accepted', s: 'orchestrator' },
  { x: 726, w: 166, t: 'done', cls: 'n-lime' },
]
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- шаблон -->
    <rect x="0.75" y="0.75" width="906.5" height="118" rx="14" class="frame" />
    <text x="16" y="24" class="t-head t-sec">DEV-CYCLE · ОПУБЛИКОВАННЫЙ ШАБЛОН, ВОРКФЛОУ DEV</text>
    <g v-for="b in base" :key="b.t">
      <rect :x="b.x" y="38" :width="b.w" height="44" rx="10" :class="b.cls || 'n'" />
      <text :x="b.x + b.w / 2" :y="b.s ? 57 : 65" text-anchor="middle" class="t-big" :class="{ 't-ink': b.cls }">{{ b.t }}</text>
      <text v-if="b.s" :x="b.x + b.w / 2" y="74" text-anchor="middle" class="t-sec">{{ b.s }}</text>
    </g>
    <line x1="136" y1="60" x2="173" y2="60" class="e" :marker-end="`url(#${id})`" />
    <line x1="326" y1="60" x2="363" y2="60" class="e" :marker-end="`url(#${id})`" />
    <line x1="496" y1="60" x2="533" y2="60" class="e" :marker-end="`url(#${id})`" />
    <line x1="686" y1="60" x2="723" y2="60" class="e" :marker-end="`url(#${id})`" />
    <path d="M410,82 C400,104 262,104 252,85" class="e" :marker-end="`url(#${id})`" />
    <text x="430" y="106" class="t-cap t-sec">доработка · $rework_limit = none</text>
    <!-- стрелки к проектам -->
    <line x1="220" y1="119" x2="220" y2="147" class="e" :marker-end="`url(#${id})`" />
    <text x="232" y="138" class="t-cap t-sec">extends</text>
    <line x1="688" y1="119" x2="688" y2="147" class="e" :marker-end="`url(#${id})`" />
    <text x="700" y="138" class="t-cap t-sec">uses</text>
    <!-- iOS-проект -->
    <rect x="0.75" y="150" width="440" height="149" rx="14" class="frame-hive" />
    <text x="16" y="172" class="t-head t-lilac">IOS-ПРОЕКТ · ОДИН ФАЙЛ ОТЛИЧИЙ</text>
    <rect x="16" y="186" width="136" height="44" rx="10" class="n" />
    <text x="84" y="205" text-anchor="middle" class="t-big">development</text>
    <text x="84" y="222" text-anchor="middle" class="t-sec">ios-developer</text>
    <rect x="188" y="186" width="96" height="44" rx="10" class="n-lilac" />
    <text x="236" y="205" text-anchor="middle" class="t-big t-ink">qa</text>
    <text x="236" y="222" text-anchor="middle" class="t-ink-sec">ios-tester</text>
    <rect x="320" y="186" width="104" height="44" rx="10" class="n" />
    <text x="372" y="213" text-anchor="middle" class="t-big">review</text>
    <line x1="152" y1="208" x2="185" y2="208" class="e" :marker-end="`url(#${id})`" />
    <line x1="284" y1="208" x2="317" y2="208" class="e" :marker-end="`url(#${id})`" />
    <text x="16" y="258" class="t-cap">Сменили скилл разработчика, вставили QA</text>
    <text x="16" y="278" class="t-cap t-sec">Остальное обновляется вместе с шаблоном</text>
    <!-- скрам -->
    <rect x="466.75" y="150" width="440.5" height="149" rx="14" class="frame-hive" />
    <text x="482" y="172" class="t-head t-lilac">СКРАМ-ПРОЕКТ · КОМПОЗИЦИЯ</text>
    <rect x="482" y="186" width="190" height="96" rx="10" class="n-wait" />
    <text x="496" y="206" class="t-sec">sprint · scrum</text>
    <rect x="496" y="218" width="76" height="26" rx="8" class="n" />
    <text x="534" y="236" text-anchor="middle">story</text>
    <rect x="582" y="218" width="76" height="26" rx="8" class="n" />
    <text x="620" y="236" text-anchor="middle">story</text>
    <rect x="496" y="250" width="76" height="26" rx="8" class="n" />
    <text x="534" y="268" text-anchor="middle">story</text>
    <text x="688" y="206" class="t-sec">uses:</text>
    <text x="688" y="224">dev-cycle, scrum</text>
    <text x="688" y="248" class="t-sec">bind: work-item</text>
    <text x="688" y="266">→ story</text>
    <text x="688" y="290" class="t-lilac">rework_limit: 30</text>
  </svg>
</template>
