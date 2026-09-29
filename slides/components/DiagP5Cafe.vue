<script setup lang="ts">
// Слайд 27, не только код. Заказ поставщику в кафе: четыре вида владельцев на одной машинке.
// Источник: curator-playbook examples/cafe/cafe.playbook.json (воркфлоу purchase: draft → approval → sending → awaiting-confirmation
// → confirmed → receiving → invoiced → paid; таймер PT15M → escalated; handoff в accounting) и spec/process-configuration.md DRAFT v4.8
// §4.2 (виды владельцев), §6.5 (передача между процессами), §6.9 (таймеры, подписанные события), §11 (векторы общности).
// ВНЖ в Грузии — следующий пример, которого в examples/ ещё нет (пост, раздел 5.1; wiki call-digest-2026-09-keeper-concept §3.8).
import { useId } from 'vue'
const id = useId()
const top = [
  { x: 0, t: 'Черновик', s: 'закупщик · агент', cls: 'n' },
  { x: 236, t: 'Одобрение', s: 'менеджер · человек', cls: 'n-lime' },
  { x: 472, t: 'Отправка', s: 'портал · инструмент', cls: 'n-wait' },
  { x: 708, t: 'Ждём ответа', s: 'оркестратор', cls: 'n' },
]
const bottom = [
  { x: 708, t: 'Подтверждён', s: 'оркестратор', cls: 'n' },
  { x: 472, t: 'Приёмка', s: 'менеджер · человек', cls: 'n-lime' },
  { x: 236, t: 'Счёт', s: 'бухгалтерия · процесс', cls: 'n-purple' },
  { x: 0, t: 'Оплачен', s: '', cls: 'n' },
]
const legend = [
  { x: 0, cls: 'n', t: 'агент' },
  { x: 150, cls: 'n-lime', t: 'человек' },
  { x: 316, cls: 'n-wait', t: 'инструмент' },
  { x: 506, cls: 'n-purple', t: 'другой процесс' },
]
const ink = (c: string) => c === 'n-lime'
</script>
<template>
  <svg width="908" height="304" viewBox="0 0 908 304" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <text x="0" y="13" class="t-head t-sec">КАФЕ · ЗАКАЗ ПОСТАВЩИКУ · ВОРКФЛОУ PURCHASE</text>
    <g v-for="b in top" :key="b.t">
      <rect :x="b.x" y="26" width="200" height="50" rx="10" :class="b.cls" />
      <text :x="b.x + 100" y="47" text-anchor="middle" class="t-big" :class="{ 't-ink': ink(b.cls) }">{{ b.t }}</text>
      <text :x="b.x + 100" y="66" text-anchor="middle" :class="ink(b.cls) ? 't-ink-sec' : 't-sec'">{{ b.s }}</text>
    </g>
    <line x1="200" y1="51" x2="233" y2="51" class="e" :marker-end="`url(#${id})`" />
    <line x1="436" y1="51" x2="469" y2="51" class="e" :marker-end="`url(#${id})`" />
    <line x1="672" y1="51" x2="705" y2="51" class="e" :marker-end="`url(#${id})`" />
    <line x1="808" y1="76" x2="808" y2="121" class="e" :marker-end="`url(#${id})`" />
    <text x="796" y="96" text-anchor="end" class="t-cap t-sec">подписанное событие поставщика</text>
    <text x="796" y="115" text-anchor="end" class="t-cap t-sec">иначе через 15 минут — эскалация менеджеру</text>
    <g v-for="b in bottom" :key="b.t">
      <rect :x="b.x" y="124" width="200" height="50" rx="10" :class="b.cls" />
      <text :x="b.x + 100" :y="b.s ? 145 : 154" text-anchor="middle" class="t-big" :class="{ 't-ink': ink(b.cls) }">{{ b.t }}</text>
      <text v-if="b.s" :x="b.x + 100" y="164" text-anchor="middle" :class="ink(b.cls) ? 't-ink-sec' : (b.cls === 'n-purple' ? 't-on' : 't-sec')">{{ b.s }}</text>
    </g>
    <line x1="708" y1="149" x2="675" y2="149" class="e" :marker-end="`url(#${id})`" />
    <line x1="472" y1="149" x2="439" y2="149" class="e" :marker-end="`url(#${id})`" />
    <line x1="236" y1="149" x2="203" y2="149" class="e" :marker-end="`url(#${id})`" />
    <!-- легенда: вид владельца состояния -->
    <text x="0" y="206" class="t-head t-sec">ВЛАДЕЛЕЦ СОСТОЯНИЯ</text>
    <g v-for="l in legend" :key="l.t">
      <rect :x="l.x" y="216" width="22" height="18" rx="5" :class="l.cls" />
      <text :x="l.x + 32" y="230" class="t-cap">{{ l.t }}</text>
    </g>
    <!-- следующий пример -->
    <rect x="0.75" y="250" width="906.5" height="53" rx="10" class="n-wait" />
    <text x="16" y="272" class="t-head t-lilac">ВИДЕНИЕ · ВНЖ В ГРУЗИИ</text>
    <text x="16" y="292" class="t-cap">Следующий пример не из разработки: документы, службы, записи на приём в Дом юстиции</text>
  </svg>
</template>
