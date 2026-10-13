<script setup lang="ts">
// Рой на трёх машинах — перед демо 2 (Иван, 13.10: «41 слайд должен показывать уже рой из трех машин и наших оркестраторов
// воркеров и тд, потому что потом идет демо про рой»). Машины названы как в демо 2 (slides/demo/swarm.json hosts): Mac mini и
// MacBook Ивана, MacBook Алексея (m1max). На каждой — главный оркестратор, оркестраторы проектов и их субагенты; оркестраторы
// пишут друг другу через Matrix, мета-оркестратор следит за системными событиями всех комнат; человек говорит с одной точкой,
// но может спросить любого исполнителя (бывший слайд «Одна точка входа», DiagV6Meta).
// Источники: relux-works/a2a-swarm docs/protocol.md (одна комната на проект, без боковых каналов; мета-оркестратор — единый
// ящик владельца по типам событий); curator-keeper spec/keeper.md DRAFT v0.5.1 §0, §3. «Кипер» на слайд не выносим (v5, 10.10).
// reveal: машины с оркестраторами и субагентами (1), Matrix между машинами (2), люди и мета-оркестратор (3), прямой вопрос (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const FW = 292, FG = 16, FY = 160, FH = 140
const hosts = [
  { name: 'MAC MINI', who: 'Иван' },
  { name: 'MACBOOK ИВАНА', who: 'Иван' },
  { name: 'MACBOOK АЛЕКСЕЯ', who: 'Алексей' },
].map((h, i) => ({ ...h, x: i * (FW + FG) }))
const OW = 44, OG = 9 // orchestrator boxes in a frame
const orchX = (h: { x: number }, k: number) => h.x + 16 + k * (OW + OG)
const SUB = 8, SG = 4 // subagent squares under each orchestrator
</script>
<template>
  <svg width="908" height="302" viewBox="0 0 908 302" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- машины: главный оркестратор, оркестраторы проектов, их субагенты -->
    <Step :on="reveal">
      <g v-for="h in hosts" :key="h.name">
        <rect :x="h.x + 0.75" :y="FY + 0.75" :width="FW - 1.5" :height="FH - 1.5" rx="14" class="frame" />
        <text :x="h.x + 16" :y="FY + 21" class="t-head t-sec">{{ h.name }}</text>
        <rect :x="h.x + 16" :y="FY + 32" :width="FW - 32" height="28" rx="8" class="n-purple" />
        <text :x="h.x + FW / 2" :y="FY + 51" text-anchor="middle" class="t-cap">главный оркестратор</text>
        <g v-for="k in 5" :key="k">
          <rect :x="orchX(h, k - 1)" :y="FY + 72" :width="OW" height="22" rx="6" class="n" />
          <rect v-for="s in 4" :key="s" :x="orchX(h, k - 1) + (s - 1) * (SUB + SG)" :y="FY + 100" :width="SUB" :height="SUB" rx="2" class="n-lilac" />
        </g>
        <text :x="h.x + 16" :y="FY + 128" class="t-cap t-sec">оркестраторы и их субагенты</text>
      </g>
    </Step>
    <!-- Matrix: оркестраторы всех машин пишут друг другу -->
    <Step :on="reveal">
      <rect x="0.75" y="118" width="906.5" height="24" rx="12" class="n-lilac" />
      <text x="454" y="135" text-anchor="middle" class="t-cap t-ink">Matrix · оркестраторы пишут друг другу через машины</text>
      <line v-for="h in hosts" :key="h.name" :x1="h.x + FW / 2 + 30" y1="142" :x2="h.x + FW / 2 + 30" :y2="FY + 30" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <!-- люди и мета-оркестратор -->
    <Step :on="reveal">
      <rect x="254" y="0" width="180" height="40" rx="10" class="n-lime" />
      <text x="344" y="25" text-anchor="middle" class="t-big t-ink">Иван</text>
      <rect x="474" y="0" width="180" height="40" rx="10" class="n-lime" />
      <text x="564" y="25" text-anchor="middle" class="t-big t-ink">Алексей</text>
      <line x1="344" y1="40" x2="400" y2="57" class="e" :marker-end="`url(#${id})`" />
      <line x1="564" y1="40" x2="508" y2="57" class="e" :marker-end="`url(#${id})`" />
      <rect x="304" y="60" width="300" height="44" rx="10" class="n-purple" />
      <text x="454" y="79" text-anchor="middle" class="t-big">Мета-оркестратор</text>
      <text x="454" y="97" text-anchor="middle" class="t-on">одна точка входа · видит все комнаты</text>
      <line x1="454" y1="104" x2="454" y2="115" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <!-- можно спросить любого исполнителя -->
    <Step :on="reveal">
      <path :d="`M654,20 C860,20 880,150 ${orchX(hosts[2], 4) + OW / 2},${FY + 70}`" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="676" y="14" class="t-cap t-lilac">можно спросить любого</text>
    </Step>
  </svg>
</template>
