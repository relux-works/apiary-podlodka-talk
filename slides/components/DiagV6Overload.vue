<script setup lang="ts">
// v6 (12.10): последний слайд части Алексея и первый слайд части Ивана. Человек сверху, под ним продукт A —
// репозиторий на оркестратор; по кликам появляются продукты B, C, D, и человек перегружен.
// Разговор спикеров 12.10: «Человек поднимается вверх, под ним появляется второй проект, третий, четвертый — и опаньки!»;
// «следующим кликом показываем перенасыщение: проектов становится три-четыре, человек опух».
// Источники: plan/deck-v4-brief.md «NEW: communication on one machine» (мобильный, фронтенд, бэкенд, CI; оркестратор на репозиторий);
// бывшая DiagV4BOneMachine (проблема). Среды на схеме — пример смеси, не описание установки.
// reveal: продукт A и человек-диспетчер (1), продукты B (2), C (3), D и перегрузка (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const orchs = [
  { x: 124, h: 'Мобильный', s: 'Claude' },
  { x: 320, h: 'Фронтенд', s: 'Codex' },
  { x: 516, h: 'Бэкенд', s: 'Muse' },
  { x: 712, h: 'CI', s: 'локальная' },
]
const more = [
  { y: 168, k: 'ПРОДУКТ B', t: 'три оркестратора' },
  { y: 214, k: 'ПРОДУКТ C', t: 'два оркестратора' },
  { y: 260, k: 'ПРОДУКТ D', t: 'пять оркестраторов' },
]
</script>
<template>
  <svg width="908" height="304" viewBox="0 0 908 304" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="314" y="0" width="280" height="58" rx="10" class="n-lime" />
      <text x="454" y="25" text-anchor="middle" class="t-big t-ink">Человек</text>
      <text x="454" y="45" text-anchor="middle" class="t-ink-sec">диспетчер оркестраторов</text>
      <text x="0" y="111" class="t-head t-sec">ПРОДУКТ A</text>
      <g v-for="o in orchs" :key="o.x">
        <path :d="`M454,58 C454,74 ${o.x + 92},70 ${o.x + 92},83`" class="e-dash" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <rect :x="o.x" y="86" width="184" height="58" rx="10" class="n-purple" />
        <text :x="o.x + 92" y="110" text-anchor="middle" class="t-big">{{ o.h }}</text>
        <text :x="o.x + 92" y="130" text-anchor="middle" class="t-on">оркестратор · {{ o.s }}</text>
      </g>
    </Step>
    <Step v-for="m in more" :key="m.y" :on="reveal">
      <path :d="`M314,29 H100 V${m.y + 18} H121`" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="0" :y="m.y + 24" class="t-head t-sec">{{ m.k }}</text>
      <rect x="124" :y="m.y" width="772" height="36" rx="8" class="n" />
      <text x="510" :y="m.y + 23" text-anchor="middle" class="t-cap">{{ m.t }} · свои репозитории, свои среды</text>
    </Step>
    <g v-click="reveal ? 4 : false">
      <rect x="314" y="0" width="280" height="58" rx="10" class="n-orange" />
      <text x="454" y="25" text-anchor="middle" class="t-big t-ink">Человек</text>
      <text x="454" y="45" text-anchor="middle" class="t-ink-sec">перегружен: мозг взрывается</text>
    </g>
  </svg>
</template>
