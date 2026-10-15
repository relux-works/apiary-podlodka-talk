<script setup lang="ts">
// Рой на трёх машинах — перед демо 2 (Иван, 13.10: «41 слайд должен показывать уже рой из трех машин и наших оркестраторов
// воркеров и тд, потому что потом идет демо про рой»). Машины названы как в демо 2 (slides/demo/swarm.json hosts): Mac mini и
// MacBook Ивана, MacBook Алексея (m1max). На каждой — свой мета-оркестратор, главный оркестратор, оркестраторы проектов и их
// субагенты; единого мета-оркестратора на три машины нет (Алексей, ревью 15.10; Иван 15.10 — «нарисовать как есть»). Все
// мета-оркестраторы и оркестраторы — в одном Matrix; человек говорит с мета-оркестратором своей машины, но может спросить любого
// исполнителя (бывший слайд «Одна точка входа», DiagV6Meta).
// Источники: relux-works/a2a-swarm docs/protocol.md (одна комната на проект, без боковых каналов; правило 24 от 29.09 описывало
// одного мета-оркестратора как единый ящик владельца — с тех пор у каждой машины свой); curator-keeper spec/keeper.md DRAFT v0.5.1
// §0, §3. «Кипер» на слайд не выносим (v5, 10.10).
// reveal: машины с главными оркестраторами, оркестраторами и субагентами (1), Matrix под всеми машинами (2), мета-оркестратор на
// каждой машине и люди (3), прямой вопрос (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const FW = 284, FG = 12, FX = 16, FY = 60, FH = 168
const hosts = [
  { name: 'MAC MINI', who: 'Иван' },
  { name: 'MACBOOK ИВАНА', who: 'Иван' },
  { name: 'MACBOOK АЛЕКСЕЯ', who: 'Алексей' },
].map((h, i) => ({ ...h, x: FX + i * (FW + FG) }))
const IN = 16, IW = FW - 2 * IN // the content column of a frame
const OW = 44, OG = 8 // orchestrator boxes in a frame
const orchX = (h: { x: number }, k: number) => h.x + IN + k * (OW + OG)
const SUB = 8, SG = 4 // subagent squares under each orchestrator
const META_Y = FY + 32, MAIN_Y = FY + 66, ORCH_Y = FY + 100, SUB_Y = FY + 126
const IN_X = (h: { x: number }) => h.x + 206 // where a person's arrow reaches the machine's meta-orchestrator
const ivan = (IN_X(hosts[0]) + IN_X(hosts[1])) / 2
const BUS_Y = FY + FH + 14
const ask = ORCH_Y + 10 // the direct question enters the first orchestrator of the first machine
</script>
<template>
  <svg width="908" height="270" viewBox="0 0 908 270" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- машины: главный оркестратор, оркестраторы проектов, их субагенты -->
    <Step :on="reveal">
      <g v-for="h in hosts" :key="h.name">
        <rect :x="h.x + 0.75" :y="FY + 0.75" :width="FW - 1.5" :height="FH - 1.5" rx="14" class="frame" />
        <text :x="h.x + IN" :y="FY + 21" class="t-head t-sec">{{ h.name }}</text>
        <rect :x="h.x + IN" :y="MAIN_Y" :width="IW" height="24" rx="7" class="n" />
        <text :x="h.x + FW / 2" :y="MAIN_Y + 17" text-anchor="middle" class="t-cap">главный оркестратор</text>
        <g v-for="k in 5" :key="k">
          <rect :x="orchX(h, k - 1)" :y="ORCH_Y" :width="OW" height="20" rx="6" class="n" />
          <rect v-for="s in 4" :key="s" :x="orchX(h, k - 1) + (s - 1) * (SUB + SG)" :y="SUB_Y" :width="SUB" :height="SUB" rx="2" class="n-lilac" />
        </g>
        <text :x="h.x + IN" :y="FY + 154" class="t-cap t-sec">оркестраторы и их субагенты</text>
      </g>
    </Step>
    <!-- Matrix: мета-оркестраторы и оркестраторы всех машин в одной сети -->
    <Step :on="reveal">
      <rect :x="FX + 0.75" :y="BUS_Y" :width="3 * FW + 2 * FG - 1.5" height="24" rx="12" class="n-lilac" />
      <text x="454" :y="BUS_Y + 17" text-anchor="middle" class="t-cap t-ink">Matrix · мета-оркестраторы и оркестраторы всех машин в одной сети</text>
      <line v-for="h in hosts" :key="h.name" :x1="h.x + FW / 2" :y1="BUS_Y" :x2="h.x + FW / 2" :y2="FY + FH" class="e" />
    </Step>
    <!-- мета-оркестратор на каждой машине, люди говорят с мета-оркестраторами своих машин -->
    <Step :on="reveal">
      <g v-for="h in hosts" :key="h.name">
        <rect :x="h.x + IN" :y="META_Y" :width="IW" height="26" rx="8" class="n-purple" />
        <text :x="h.x + FW / 2" :y="META_Y + 18" text-anchor="middle" class="t-cap">мета-оркестратор</text>
      </g>
      <rect :x="ivan - 90" y="0" width="180" height="40" rx="10" class="n-lime" />
      <text :x="ivan" y="25" text-anchor="middle" class="t-big t-ink">Иван</text>
      <rect :x="IN_X(hosts[2]) - 80" y="0" width="160" height="40" rx="10" class="n-lime" />
      <text :x="IN_X(hosts[2])" y="25" text-anchor="middle" class="t-big t-ink">Алексей</text>
      <line :x1="ivan - 24" y1="40" :x2="IN_X(hosts[0])" :y2="META_Y - 3" class="e" :marker-end="`url(#${id})`" />
      <line :x1="ivan + 24" y1="40" :x2="IN_X(hosts[1])" :y2="META_Y - 3" class="e" :marker-end="`url(#${id})`" />
      <line :x1="IN_X(hosts[2])" y1="40" :x2="IN_X(hosts[2])" :y2="META_Y - 3" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <!-- можно спросить любого исполнителя -->
    <Step :on="reveal">
      <path :d="`M${ivan - 90},20 H12 Q6,20 6,26 V${ask - 6} Q6,${ask} 12,${ask} H${orchX(hosts[0], 0) - 2}`" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="16" y="14" class="t-cap t-lilac">можно спросить любого</text>
    </Step>
  </svg>
</template>
