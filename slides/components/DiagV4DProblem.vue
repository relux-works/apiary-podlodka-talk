<script setup lang="ts">
// v4, глава 6, слайд 47 «Проблема»: два оркестратора на разных машинах ведут пересекающиеся модули.
// Источники: waggle spec/waggle.md DRAFT v5.2 §1 (между оркестраторами не ходит ни одного сообщения, ничего не подписано);
// пост §5.3 (блокируют друг друга, переделывают чужую работу, наперегонки приземляются в одну основную ветку);
// wiki decisions.md 2026-09-28 «Two operators on one module». Модули на схеме условные.
// reveal: две машины сразу; по кликам — общий проект, отсутствие связи, последствия.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const modules = [['модуль авторизации', 40], ['модуль синхронизации', 96]] as const
const harms = ['блокируют друг друга', 'переделывают чужую работу', 'наперегонки в основную ветку']
</script>
<template>
  <svg width="908" height="330" viewBox="0 0 908 330" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- две машины -->
    <g v-for="(m, i) in [['МАШИНА ИВАНА', 'Оркестратор Ивана', 'Иван'], ['МАШИНА АЛЕКСЕЯ', 'Оркестратор Алексея', 'Алексей']]" :key="m[0]">
      <rect :x="i ? 657.25 : 0.75" y="0.75" width="250" height="226" rx="14" class="frame" />
      <text :x="i ? 673 : 16" y="22" class="t-head t-sec">{{ m[0] }}</text>
      <rect :x="i ? 673 : 16" y="40" width="218" height="54" rx="10" class="n-purple" />
      <text :x="i ? 782 : 125" y="62" text-anchor="middle" class="t-big">{{ m[1] }}</text>
      <text :x="i ? 782 : 125" y="81" text-anchor="middle" class="t-on">свои агенты</text>
      <rect v-for="k in 5" :key="k" :x="(i ? 673 : 16) + (k - 1) * 46" y="110" width="34" height="26" rx="6" class="n" />
      <text :x="i ? 673 : 16" y="158" class="t-cap t-sec">воркеры</text>
      <rect :x="i ? 673 : 16" y="176" width="218" height="34" rx="10" class="n-lime" />
      <text :x="i ? 782 : 125" y="198" text-anchor="middle" class="t-big t-ink">{{ m[2] }} · оператор</text>
    </g>
    <!-- общий проект: оба пишут в одни модули -->
    <Step :on="reveal">
      <rect x="300.75" y="0.75" width="306.5" height="226" rx="14" class="frame-hive" />
      <text x="316" y="22" class="t-head t-lilac">ОДИН ПРОЕКТ</text>
      <g v-for="m in modules" :key="m[0]">
        <rect x="316" :y="m[1]" width="276" height="44" rx="10" class="n" />
        <text x="454" :y="m[1] + 27" text-anchor="middle" class="t-big">{{ m[0] }}</text>
        <path :d="`M234,67 C270,67 280,${m[1] + 22} 313,${m[1] + 22}`" class="e" :marker-end="`url(#${id})`" />
        <path :d="`M673,67 C637,67 628,${m[1] + 22} 595,${m[1] + 22}`" class="e" :marker-end="`url(#${id})`" />
      </g>
      <rect x="316" y="152" width="276" height="44" rx="10" class="n-lilac" />
      <text x="454" y="179" text-anchor="middle" class="t-big t-ink">основная ветка</text>
      <path d="M234,84 C280,84 282,174 313,174" class="e" :marker-end="`url(#${id})`" />
      <path d="M673,84 C627,84 626,174 595,174" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <!-- связи между машинами нет -->
    <Step :on="reveal">
      <path d="M125,227 L125,248 L782,248 L782,227" class="e-dash" />
      <rect x="258" y="236" width="392" height="26" rx="8" class="knock" />
      <text x="454" y="254" text-anchor="middle" class="t-cap t-orange">✕ между машинами ни одного сообщения</text>
    </Step>
    <!-- последствия -->
    <Step :on="reveal">
      <g v-for="(h, i) in harms" :key="h">
        <rect :x="0.75 + i * 309" y="284.75" width="288" height="44" rx="10" class="n-wait" />
        <text :x="144.75 + i * 309" y="312" text-anchor="middle" class="t-cap t-orange">{{ h }}</text>
      </g>
    </Step>
  </svg>
</template>
