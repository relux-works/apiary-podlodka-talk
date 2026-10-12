<script setup lang="ts">
// v6 (12.10), часть Ивана, «Координация оркестраторов». Одна геометрия на два слайда:
// stage 1 — канал: оркестраторы продукта пишут друг другу в комнату проекта, но ответственного нет, и человек читает всех;
// stage 2 — главный оркестратор над каналом: рутину решает сам, человеку несёт только критичное (архитектура, breaking changes).
// Разговор спикеров 12.10: «Первый слайд — канал связи. Второй слайд: здорово, а кто ответственный за управление?»;
// «дополнительный оркестратор, который координирует их деятельность в вопросах, которые можно принять в автономном режиме».
// Источники: relux-works/a2a-swarm docs/protocol.md (комнаты — проекты, треды — темы; решения с подтверждением адресатов;
// owner-needed — человеку); curator-keeper spec/keeper.md DRAFT v0.5.1 §0, §3 («coordination, not command»).
// В спеках главный оркестратор называется Кипер; на слайде — технический термин (v5, 10.10).
// reveal: stage 1 — оркестраторы и канал (1), человек (2); stage 2 — главный оркестратор (1), человек (2).
import { useId } from 'vue'
const props = withDefaults(defineProps<{ stage?: number, reveal?: boolean }>(), { stage: 1, reveal: false })
const id = useId()
const orchs = [
  { x: 16, h: 'Мобильный' },
  { x: 214, h: 'Фронтенд' },
  { x: 412, h: 'Бэкенд' },
]
</script>
<template>
  <svg width="908" height="290" viewBox="0 0 908 290" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal && props.stage === 1">
      <text x="0" y="14" class="t-head t-sec">ПРОДУКТ A · ОРКЕСТРАТОР НА РЕПОЗИТОРИЙ</text>
      <rect x="0.75" y="26.75" width="610" height="196" rx="14" class="frame" />
      <g v-for="o in orchs" :key="o.x">
        <rect :x="o.x" y="44" width="184" height="58" rx="10" class="n-purple" />
        <text :x="o.x + 92" y="70" text-anchor="middle" class="t-big">{{ o.h }}</text>
        <text :x="o.x + 92" y="90" text-anchor="middle" class="t-on">оркестратор</text>
        <line :x1="o.x + 92" y1="105" :x2="o.x + 92" y2="131" class="e" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
      </g>
      <rect x="16" y="134" width="580" height="72" rx="10" class="n-lilac" />
      <text x="306" y="162" text-anchor="middle" class="t-big t-ink">Канал: комната проекта</text>
      <text x="306" y="184" text-anchor="middle" class="t-ink-sec">сообщения по правилам · решения с подтверждением</text>
    </Step>
    <template v-if="props.stage === 1">
      <Step :on="reveal">
        <path d="M596,170 C640,170 640,160 677,160" class="e-dash" :marker-end="`url(#${id})`" />
        <rect x="680" y="124" width="228" height="72" rx="10" class="n-lime" />
        <text x="794" y="153" text-anchor="middle" class="t-big t-ink">Человек</text>
        <text x="794" y="175" text-anchor="middle" class="t-ink-sec">читает всех</text>
        <text x="680" y="226" class="t-cap t-orange">ответственного нет</text>
      </Step>
    </template>
    <template v-else>
      <Step :on="reveal">
        <path d="M596,150 C632,150 628,96 657,96" class="e" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <rect x="660" y="40" width="248" height="104" rx="12" class="n-purple" />
        <text x="784" y="72" text-anchor="middle" class="t-lab">Главный оркестратор</text>
        <text x="784" y="96" text-anchor="middle" class="t-on">ведёт остальных</text>
        <text x="784" y="118" text-anchor="middle" class="t-on">рутину решает сам</text>
      </Step>
      <Step :on="reveal">
        <line x1="784" y1="147" x2="784" y2="181" class="e" :marker-start="`url(#${id})`" :marker-end="`url(#${id})`" />
        <rect x="660" y="184" width="248" height="70" rx="10" class="n-lime" />
        <text x="784" y="212" text-anchor="middle" class="t-big t-ink">Человек</text>
        <text x="784" y="234" text-anchor="middle" class="t-ink-sec">только критичное</text>
        <text x="908" y="282" text-anchor="end" class="t-cap t-sec">архитектура, breaking changes</text>
      </Step>
    </template>
  </svg>
</template>
