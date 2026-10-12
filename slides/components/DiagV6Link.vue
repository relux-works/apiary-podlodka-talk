<script setup lang="ts">
// v6 (12.10), часть Ивана, «Связь между машинами». Главные оркестраторы двух людей на разных машинах переписываются
// в комнате общего проекта на своём сервере Matrix: комнаты — проекты, треды — темы, у сообщений есть тип.
// Разговор спикеров 12.10: «выстраиваешь… ремоутное общение Matrix-ом между тобой, мной, твоими, моими по тем проектам,
// которые у нас пересекаются»; демо 2 — по сессиям этого общения за две-три недели.
// Источники: relux-works/a2a-swarm docs/protocol.md и docs/cli.md (сервер Matrix a2a.local на Mac mini, федерация выключена;
// комнаты — проекты, треды — темы; виды сообщений: вопрос, ответ, решение, приземление, owner-needed; решения подтверждают адресаты).
// reveal: машина Ивана (1), комната (2), машина Алексея (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const kinds = ['вопрос и ответ', 'решение и подтверждения', 'приземление в main', 'нужен человек']
</script>
<template>
  <svg width="908" height="250" viewBox="0 0 908 250" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="0.75" y="0.75" width="252" height="226" rx="14" class="frame" />
      <text x="16" y="24" class="t-head t-sec">МАШИНА ИВАНА</text>
      <rect x="16" y="40" width="221" height="62" rx="10" class="n-purple" />
      <text x="126.5" y="66" text-anchor="middle" class="t-big">Главный оркестратор</text>
      <text x="126.5" y="86" text-anchor="middle" class="t-on">говорит за свои проекты</text>
      <rect x="16" y="120" width="104" height="44" rx="10" class="n" />
      <text x="68" y="147" text-anchor="middle" class="t-cap">оркестратор</text>
      <rect x="133" y="120" width="104" height="44" rx="10" class="n" />
      <text x="185" y="147" text-anchor="middle" class="t-cap">оркестратор</text>
    </Step>
    <Step :on="reveal">
      <line x1="256" y1="71" x2="301" y2="71" class="e" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
      <rect x="304.75" y="0.75" width="298.5" height="226" rx="14" class="frame-hive" />
      <text x="320" y="24" class="t-head t-lilac">MATRIX · КОМНАТА ПРОЕКТА</text>
      <g v-for="(k, i) in kinds" :key="k">
        <rect x="320" :y="40 + i * 44" width="268" height="34" rx="8" class="n-lilac" />
        <text x="454" :y="62 + i * 44" text-anchor="middle" class="t-cap t-ink">{{ k }}</text>
      </g>
      <text x="320" y="244" class="t-cap t-sec">треды — темы, у сообщения есть тип</text>
    </Step>
    <Step :on="reveal">
      <line x1="607" y1="71" x2="652" y2="71" class="e" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
      <rect x="655.25" y="0.75" width="252" height="226" rx="14" class="frame" />
      <text x="671" y="24" class="t-head t-sec">МАШИНА АЛЕКСЕЯ</text>
      <rect x="671" y="40" width="221" height="62" rx="10" class="n-purple" />
      <text x="781.5" y="66" text-anchor="middle" class="t-big">Главный оркестратор</text>
      <text x="781.5" y="86" text-anchor="middle" class="t-on">говорит за свои проекты</text>
      <rect x="671" y="120" width="104" height="44" rx="10" class="n" />
      <text x="723" y="147" text-anchor="middle" class="t-cap">оркестратор</text>
      <rect x="788" y="120" width="104" height="44" rx="10" class="n" />
      <text x="840" y="147" text-anchor="middle" class="t-cap">оркестратор</text>
    </Step>
  </svg>
</template>
