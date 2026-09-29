<script setup lang="ts">
// Слайды 35–36, распределённая пасека. Видение: архитектура заложена, не реализовано. Сценическая версия several-nodes (main loop DRAFT v0.1 §4, §10.4; waggle §9.3, §12).
import { useId } from 'vue'
const id = useId()
</script>
<template>
  <svg width="908" height="366" viewBox="0 0 908 366" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- люди -->
    <rect x="100" y="0" width="160" height="38" rx="10" class="n-lime" />
    <text x="180" y="25" text-anchor="middle" class="t-big t-ink">Владелец</text>
    <rect x="648" y="0" width="160" height="38" rx="10" class="n-lime" />
    <text x="728" y="25" text-anchor="middle" class="t-big t-ink">Второй оператор</text>
    <!-- левая точка -->
    <rect x="0.75" y="54" width="358" height="310" rx="14" class="frame" />
    <text x="16" y="76" class="t-head t-sec">ТОЧКА ВЛАДЕЛЬЦА</text>
    <line x1="180" y1="38" x2="180" y2="85" class="e" :marker-end="`url(#${id})`" />
    <rect x="90" y="88" width="180" height="46" rx="10" class="n-lilac" />
    <text x="180" y="109" text-anchor="middle" class="t-big t-ink">Головной Кипер</text>
    <text x="180" y="126" text-anchor="middle" class="t-ink-sec">маршрутизирует</text>
    <rect x="16" y="160" width="170" height="190" rx="12" class="frame-hive" />
    <text x="28" y="180" class="t-head t-lilac">ХОББИ · СВОЙ</text>
    <rect x="30" y="192" width="142" height="44" rx="10" class="n-purple" />
    <text x="101" y="219" text-anchor="middle" class="t-big">Матка</text>
    <rect x="30" y="286" width="142" height="48" rx="10" class="n-lime" />
    <text x="101" y="307" text-anchor="middle" class="t-big t-ink">Доска</text>
    <text x="101" y="325" text-anchor="middle" class="t-ink-sec">одна на улей</text>
    <line x1="101" y1="236" x2="101" y2="283" class="e" :marker-end="`url(#${id})`" />
    <rect x="200" y="160" width="144" height="92" rx="12" class="frame-hive" />
    <text x="212" y="180" class="t-head t-lilac">КАЛЕНДАРЬ</text>
    <rect x="214" y="194" width="116" height="44" rx="10" class="n-purple" />
    <text x="272" y="221" text-anchor="middle" class="t-big">Матка</text>
    <path d="M150,134 L130,157" class="e" :marker-end="`url(#${id})`" />
    <path d="M210,134 L250,157" class="e" :marker-end="`url(#${id})`" />
    <!-- правая точка -->
    <rect x="548.75" y="54" width="358" height="310" rx="14" class="frame" />
    <text x="564" y="76" class="t-head t-sec">ДОМАШНИЙ СЕРВЕР</text>
    <line x1="728" y1="38" x2="728" y2="85" class="e" :marker-end="`url(#${id})`" />
    <rect x="638" y="88" width="180" height="46" rx="10" class="n-lilac" />
    <text x="728" y="117" text-anchor="middle" class="t-big t-ink">Кипер</text>
    <rect x="564" y="160" width="144" height="92" rx="12" class="frame-hive" />
    <text x="576" y="180" class="t-head t-lilac">УМНЫЙ ДОМ</text>
    <rect x="578" y="194" width="116" height="44" rx="10" class="n-purple" />
    <text x="636" y="221" text-anchor="middle" class="t-big">Матка</text>
    <rect x="722" y="160" width="170" height="190" rx="12" class="frame-hive" />
    <text x="734" y="180" class="t-head t-lilac">ХОББИ · ГОСТЬ</text>
    <rect x="736" y="192" width="142" height="62" rx="10" class="n" />
    <text x="807" y="215" text-anchor="middle" class="t-big">Саборкестр.</text>
    <text x="807" y="235" text-anchor="middle" class="t-sec">под арендой</text>
    <text x="736" y="290" class="t-cap t-sec">ведёт арендованное</text>
    <text x="736" y="310" class="t-cap t-sec">поддерево чужой</text>
    <text x="736" y="330" class="t-cap t-sec">доски</text>
    <path d="M700,134 L660,157" class="e" :marker-end="`url(#${id})`" />
    <path d="M760,134 L800,157" class="e" :marker-end="`url(#${id})`" />
    <!-- транспорт -->
    <rect x="376" y="84" width="156" height="58" rx="10" class="n-wait" />
    <text x="454" y="107" text-anchor="middle" class="t-big">Чужой агент</text>
    <text x="454" y="126" text-anchor="middle" class="t-sec">аренда, подписи</text>
    <rect x="376" y="200" width="156" height="76" rx="10" class="n-purple" />
    <text x="454" y="226" text-anchor="middle" class="t-big">waggle</text>
    <text x="454" y="245" text-anchor="middle" class="t-on">NATS · tailnet</text>
    <text x="454" y="263" text-anchor="middle" class="t-on">ящики, аренды</text>
    <line x1="454" y1="142" x2="454" y2="197" class="e-dash" :marker-end="`url(#${id})`" />
    <path d="M270,120 C330,130 360,180 373,214" class="e" :marker-end="`url(#${id})`" />
    <path d="M638,120 C580,130 548,180 535,214" class="e" :marker-end="`url(#${id})`" />
    <path d="M736,246 C640,300 560,300 535,262" class="e-dash" :marker-end="`url(#${id})`" />
    <text x="376" y="306" class="t-cap t-sec">координация,</text>
    <text x="376" y="326" class="t-cap t-sec">не команда</text>
  </svg>
</template>
