<script setup lang="ts">
// Слайд 34, сны. Всё на схеме — предложено 2026-09-25.
// Источник: curator-playbook spec/process-configuration.md DRAFT v4.8 §6.13 (режим сна: контракт --dream, песочница, агент знает,
// доказательства сна не засчитываются, вход по праву dreams и policy.dreams); curator-keeper spec/keeper.md DRAFT v0.5.1 §9.2 (репетиция
// перед подтверждением), §13.4 (лестница памяти), §13.6 (ночной цикл: повтор, репетиция, закрепление, озарения); wiki research/memory-resolution-ladder.md.
// reveal: рамка репетиции сразу; песочница, отчёт и касание, рамка ночного цикла с первым шагом, остальные шаги по одному,
// затем полоса права dreams — по клику.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const night = [
  { h: '1 · Повтор', s: 'прошлые сессии через дистиллятор логов' },
  { h: '2 · Репетиция', s: 'ульи с правками и сбоями дня, --dream' },
  { h: '3 · Закрепление', s: 'лестница памяти: сессии → дни → недели' },
  { h: '4 · Озарения', s: 'память снов на карантине → предложения человеку' },
]
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- репетиция -->
    <rect x="0.75" y="0.75" width="428" height="244" rx="14" class="frame-hive" />
    <text x="16" y="24" class="t-head t-lilac">РЕПЕТИЦИЯ · ПЕСОЧНИЦА</text>
    <Step :on="reveal">
    <rect x="16" y="38" width="190" height="48" rx="10" class="n" />
    <text x="111" y="59" text-anchor="middle" class="t-big">Копия доски</text>
    <text x="111" y="77" text-anchor="middle" class="t-sec">ветка или worktree</text>
    <rect x="222" y="38" width="190" height="48" rx="10" class="n" />
    <text x="317" y="59" text-anchor="middle" class="t-big">Инструменты</text>
    <text x="317" y="77" text-anchor="middle" class="t-sec">с флагом --dream</text>
    <text x="16" y="112" class="t-cap">Всё выглядит настоящим, агент знает, что спит</text>
    <text x="16" y="132" class="t-cap t-sec">Наружу ничего не уходит, приземление — в песочницу</text>
    <text x="16" y="152" class="t-cap t-sec">Результаты сна не засчитываются ни одной проверкой</text>
    </Step>
    <Step :on="reveal">
    <rect x="16" y="176" width="190" height="52" rx="10" class="n-lilac" />
    <text x="111" y="198" text-anchor="middle" class="t-big t-ink">Отчёт сна</text>
    <text x="111" y="217" text-anchor="middle" class="t-ink-sec">что дошло, где встало</text>
    <rect x="222" y="176" width="190" height="52" rx="10" class="n-lime" />
    <text x="317" y="198" text-anchor="middle" class="t-big t-ink">Касание человека</text>
    <text x="317" y="217" text-anchor="middle" class="t-ink-sec">подтверждение версии</text>
    <line x1="206" y1="202" x2="219" y2="202" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <!-- ночной цикл -->
    <Step :on="reveal">
    <rect x="456.75" y="0.75" width="450.5" height="244" rx="14" class="frame" />
    <text x="472" y="24" class="t-head t-sec">НОЧНОЙ ЦИКЛ ТОЧКИ</text>
    <rect x="472" y="36" width="420" height="44" rx="10" class="n" />
    <text x="486" y="54" class="t-big">{{ night[0].h }}</text>
    <text x="486" y="72" class="t-sec">{{ night[0].s }}</text>
    </Step>
    <Step v-for="(n, i) in night.slice(1)" :key="n.h" :on="reveal">
      <rect x="472" :y="87 + i * 51" width="420" height="44" rx="10" class="n" />
      <text x="486" :y="105 + i * 51" class="t-big">{{ n.h }}</text>
      <text x="486" :y="123 + i * 51" class="t-sec">{{ n.s }}</text>
    </Step>
    <!-- вход в сон -->
    <Step :on="reveal">
    <rect x="0.75" y="258" width="906.5" height="41" rx="10" class="n-wait" />
    <text x="16" y="283" class="t-cap">Засыпают только по праву <tspan class="mono">dreams</tspan>, один раз на улей: окно, бюджет токенов и минут, простой, квота, питание от сети</text>
    </Step>
  </svg>
</template>
