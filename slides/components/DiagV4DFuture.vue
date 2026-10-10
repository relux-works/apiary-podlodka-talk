<script setup lang="ts">
// v4, глава 6, слайд 52 «Картинка будущего». Видение. Замена DiagP67Future для основного потока.
// Источники: пост §6, последний абзац (остаток подписок ночью открытым проектам, как добровольные вычисления; ядро ОС с нуля);
// apiary-docs v3.2.0, руководство §8.2 (простаивает только остаток окна квоты перед сбросом), §1.6 (Prove2Me: формализация
// Великой теоремы Ферма силами десятков агентов, сентябрь 2026; у формальной математики есть оракул, у кода — нет);
// статья §1, §4 (приёмка сконструирована записями: контракт задачи, независимое ревью, журнал). «Десятки тысяч агентов» —
// оценка спикеров (бриф v4, 29.09). Поиск лекарства — пример спикеров без источника, только в заметках. Квадраты — пиктограмма.
// reveal: люди сразу; по кликам — протокол с агентами, цели.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const cells = Array.from({ length: 24 * 6 }, (_, i) => ({ x: 262 + (i % 24) * 13.5, y: 44 + Math.floor(i / 24) * 13 }))
const rules = ['задача с условиями приёмки', 'независимое ревью', 'журнал решений']
</script>
<template>
  <svg width="908" height="290" viewBox="0 0 908 290" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- кто приносит ёмкость -->
    <rect x="0" y="40" width="200" height="62" rx="10" class="n" />
    <text x="100" y="64" text-anchor="middle" class="t-big">Люди ночью</text>
    <text x="100" y="85" text-anchor="middle" class="t-sec">остаток квоты</text>
    <rect x="0" y="126" width="200" height="62" rx="10" class="n" />
    <text x="100" y="150" text-anchor="middle" class="t-big">Сообщества</text>
    <text x="100" y="171" text-anchor="middle" class="t-sec">свои агенты и машины</text>
    <text x="0" y="222" class="t-cap t-sec">как когда-то отдавали процессор</text>
    <text x="0" y="241" class="t-cap t-sec">добровольным вычислениям</text>
    <!-- строгий протокол -->
    <Step :on="reveal">
      <path d="M200,71 C224,71 222,120 243,120" class="e" :marker-end="`url(#${id})`" />
      <path d="M200,157 C224,157 222,140 243,140" class="e" :marker-end="`url(#${id})`" />
      <rect x="246.75" y="0.75" width="360" height="288" rx="14" class="frame-hive" />
      <text x="262" y="24" class="t-head t-lilac">СТРОГИЙ ПРОТОКОЛ</text>
      <rect v-for="(c, i) in cells" :key="i" :x="c.x" :y="c.y" width="9" height="9" rx="2" class="n" />
      <text x="262" y="142" class="t-cap">тысячи агентов на одну цель</text>
      <g v-for="(r, i) in rules" :key="r">
        <rect x="262" :y="156 + i * 42" width="329" height="34" rx="8" class="n-lilac" />
        <text x="426" :y="178 + i * 42" text-anchor="middle" class="t-cap t-ink">{{ r }}</text>
      </g>
    </Step>
    <!-- цели -->
    <Step :on="reveal">
      <line x1="607" y1="145" x2="643" y2="145" class="e" :marker-end="`url(#${id})`" />
      <rect x="646" y="60" width="262" height="72" rx="10" class="n-lime" />
      <text x="777" y="90" text-anchor="middle" class="t-big t-ink">Ядро ОС с нуля</text>
      <text x="777" y="111" text-anchor="middle" class="t-ink-sec">общее дело сообщества</text>
      <rect x="646" y="152" width="262" height="72" rx="10" class="n-lime" />
      <text x="777" y="182" text-anchor="middle" class="t-big t-ink">Формальное доказательство</text>
      <text x="777" y="203" text-anchor="middle" class="t-ink-sec">как теорема Ферма в 2026</text>
    </Step>
  </svg>
</template>
