<script setup lang="ts">
// Слайд 27, не только код. Заказ поставщику в кафе: четыре вида владельцев на одной машинке.
// Источник: curator-playbook examples/cafe/cafe.playbook.json (воркфлоу purchase: draft → approval → sending → awaiting-confirmation
// → confirmed → receiving → invoiced → paid; таймер PT15M → escalated; handoff в accounting) и spec/process-configuration.md DRAFT v4.8
// §4.2 (виды владельцев), §6.5 (передача между процессами), §6.9 (таймеры, подписанные события), §11 (векторы общности).
// reveal: заголовок сразу; состояния по порядку — черновик, одобрение, отправка, ожидание и подтверждение, приёмка со счётом и оплатой;
// затем легенда владельцев и рамка видения — по клику.
// ВНЖ в Грузии — следующий пример, которого в examples/ ещё нет (пост, раздел 5.1; wiki call-digest-2026-09-keeper-concept §3.8).
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
// in — стрелка в состояние из предыдущего: [x1, y1, x2, y2]
const states = [
  { x: 0, y: 26, t: 'Черновик', s: 'закупщик · агент', cls: 'n' },
  { x: 236, y: 26, t: 'Одобрение', s: 'менеджер · человек', cls: 'n-lime', in: [200, 51, 233, 51] },
  { x: 472, y: 26, t: 'Отправка', s: 'портал · инструмент', cls: 'n-wait', in: [436, 51, 469, 51] },
  { x: 708, y: 26, t: 'Ждём ответа', s: 'оркестратор', cls: 'n', in: [672, 51, 705, 51] },
  { x: 708, y: 124, t: 'Подтверждён', s: 'оркестратор', cls: 'n', in: [808, 76, 808, 121] },
  { x: 472, y: 124, t: 'Приёмка', s: 'менеджер · человек', cls: 'n-lime', in: [708, 149, 675, 149] },
  { x: 236, y: 124, t: 'Счёт', s: 'бухгалтерия · процесс', cls: 'n-purple', in: [472, 149, 439, 149] },
  { x: 0, y: 124, t: 'Оплачен', s: '', cls: 'n', in: [236, 149, 203, 149] },
]
// клики по речи: черновик · одобрение · отправка · ответ поставщика · приёмка, счёт и оплата
const groups = [[0], [1], [2], [3, 4], [5, 6, 7]]
const legend = [
  { x: 0, cls: 'n', t: 'агент' },
  { x: 150, cls: 'n-lime', t: 'человек' },
  { x: 316, cls: 'n-wait', t: 'инструмент' },
  { x: 506, cls: 'n-purple', t: 'другой процесс' },
]
const ink = (c: string) => c === 'n-lime'
const sub = (c: string) => ink(c) ? 't-ink-sec' : (c === 'n-purple' ? 't-on' : 't-sec')
</script>
<template>
  <svg width="908" height="304" viewBox="0 0 908 304" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <text x="0" y="13" class="t-head t-sec">КАФЕ · ЗАКАЗ ПОСТАВЩИКУ · ВОРКФЛОУ PURCHASE</text>
    <Step v-for="(g, gi) in groups" :key="gi" :on="reveal">
      <g v-for="i in g" :key="states[i].t">
        <line v-if="states[i].in" :x1="states[i].in[0]" :y1="states[i].in[1]" :x2="states[i].in[2]" :y2="states[i].in[3]" class="e" :marker-end="`url(#${id})`" />
        <rect :x="states[i].x" :y="states[i].y" width="200" height="50" rx="10" :class="states[i].cls" />
        <text :x="states[i].x + 100" :y="states[i].y + (states[i].s ? 21 : 30)" text-anchor="middle" class="t-big" :class="{ 't-ink': ink(states[i].cls) }">{{ states[i].t }}</text>
        <text v-if="states[i].s" :x="states[i].x + 100" :y="states[i].y + 40" text-anchor="middle" :class="sub(states[i].cls)">{{ states[i].s }}</text>
      </g>
      <template v-if="gi === 3">
        <text x="796" y="96" text-anchor="end" class="t-cap t-sec">подписанное событие поставщика</text>
        <text x="796" y="115" text-anchor="end" class="t-cap t-sec">иначе через 15 минут — эскалация менеджеру</text>
      </template>
    </Step>
    <!-- легенда: вид владельца состояния -->
    <Step :on="reveal">
      <text x="0" y="206" class="t-head t-sec">ВЛАДЕЛЕЦ СОСТОЯНИЯ</text>
      <g v-for="l in legend" :key="l.t">
        <rect :x="l.x" y="216" width="22" height="18" rx="5" :class="l.cls" />
        <text :x="l.x + 32" y="230" class="t-cap">{{ l.t }}</text>
      </g>
    </Step>
    <!-- следующий пример -->
    <Step :on="reveal">
      <rect x="0.75" y="250" width="906.5" height="53" rx="10" class="n-wait" />
      <text x="16" y="272" class="t-head t-lilac">ВИДЕНИЕ · ВНЖ В ГРУЗИИ</text>
      <text x="16" y="292" class="t-cap">Следующий пример не из разработки: документы, службы, записи на приём в Дом юстиции</text>
    </Step>
  </svg>
</template>
