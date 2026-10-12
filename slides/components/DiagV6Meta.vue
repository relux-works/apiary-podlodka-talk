<script setup lang="ts">
// v6 (12.10), часть Ивана, рекап перед процессами: «Одна точка входа». Человек говорит с мета-оркестратором, тот — с главными
// оркестраторами, они — с оркестраторами проектов и воркерами; человек может напрямую спросить любого исполнителя.
// Разговор спикеров 12.10 (Алексей): «Мета-Keeper добавляем, который общается с шестью Keeper-ами, те в свою очередь с оркестраторами,
// а человек имеет только одну точку. Но имеет возможность подключиться… умеет пообщаться с конкретным исполнителем».
// Источники: relux-works/a2a-swarm docs/protocol.md (в чате — люди, киперы, оркестраторы; мета-оркестратор следит за #system);
// curator-keeper spec/keeper.md DRAFT v0.5.1 §0, §3. Слова «Кипер» и «мета-Кипер» на слайд не выносим (v5, 10.10).
// reveal: человек и мета-оркестратор (1), главные оркестраторы (2), оркестраторы и воркеры (3), прямой вопрос (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const mains = [0, 1, 2, 3, 4, 5]
const MW = 136, MG = 18
const mx = (i: number) => i * (MW + MG)
</script>
<template>
  <svg width="908" height="268" viewBox="0 0 908 268" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="314" y="0" width="280" height="50" rx="10" class="n-lime" />
      <text x="454" y="22" text-anchor="middle" class="t-big t-ink">Человек</text>
      <text x="454" y="40" text-anchor="middle" class="t-ink-sec">одна точка входа</text>
      <line x1="454" y1="50" x2="454" y2="73" class="e" :marker-end="`url(#${id})`" />
      <rect x="314" y="76" width="280" height="50" rx="10" class="n-purple" />
      <text x="454" y="98" text-anchor="middle" class="t-big">Мета-оркестратор</text>
      <text x="454" y="116" text-anchor="middle" class="t-on">видит все проекты</text>
    </Step>
    <Step :on="reveal">
      <g v-for="i in mains" :key="i">
        <path :d="`M454,126 C454,140 ${mx(i) + MW / 2},142 ${mx(i) + MW / 2},155`" class="e" :marker-end="`url(#${id})`" />
        <rect :x="mx(i)" y="158" width="136" height="52" rx="10" class="n-purple" />
        <text :x="mx(i) + MW / 2" y="180" text-anchor="middle" class="t-cap">главный</text>
        <text :x="mx(i) + MW / 2" y="199" text-anchor="middle" class="t-cap t-on">оркестратор</text>
      </g>
    </Step>
    <Step :on="reveal">
      <rect x="0.75" y="224.75" width="906.5" height="40" rx="10" class="n-wait" />
      <text x="454" y="250" text-anchor="middle" class="t-cap">оркестраторы проектов · воркеры · ревьюеры</text>
    </Step>
    <Step :on="reveal">
      <path d="M594,25 C850,25 842,110 838,152" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="640" y="18" class="t-cap t-lilac">можно спросить любого</text>
    </Step>
  </svg>
</template>
