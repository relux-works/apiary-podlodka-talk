<script setup lang="ts">
// Запасная к слайдам 14 и 21. Предложено. Сценическая версия one-host-per-node (session host spec §5, §6; сегодня — один демон на доску, §2.1, §2.8).
import { useId } from 'vue'
const id = useId()
</script>
<template>
  <svg width="908" height="364" viewBox="0 0 908 364" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <rect x="0" y="0" width="230" height="56" rx="10" class="n-lilac" />
    <text x="115" y="24" text-anchor="middle" class="t-big t-ink">Кипер</text>
    <text x="115" y="43" text-anchor="middle" class="t-ink-sec">в своём держателе</text>
    <rect x="330" y="0" width="248" height="56" rx="10" class="n-wait" />
    <text x="454" y="24" text-anchor="middle" class="t-big">Сокет управления</text>
    <text x="454" y="43" text-anchor="middle" class="t-sec">0600, peer credentials</text>
    <rect x="720" y="8" width="188" height="40" rx="10" class="n-lime" />
    <text x="814" y="34" text-anchor="middle" class="t-big t-ink">Оператор</text>
    <line x1="230" y1="28" x2="327" y2="28" class="e" :marker-end="`url(#${id})`" />
    <text x="240" y="20" class="t-cap t-sec">wake, park</text>
    <line x1="720" y1="28" x2="581" y2="28" class="e" :marker-end="`url(#${id})`" />
    <text x="590" y="20" class="t-cap t-sec">stop, estop</text>
    <line x1="454" y1="56" x2="454" y2="93" class="e" :marker-end="`url(#${id})`" />
    <rect x="200" y="96" width="508" height="58" rx="12" class="n-purple" />
    <text x="454" y="120" text-anchor="middle" class="t-big">Хост сессий · один на точку</text>
    <text x="454" y="140" text-anchor="middle" class="t-on">супервизор · реестр · звонки · доступ · события</text>
    <text x="722" y="112" class="t-cap t-sec">рестарт хоста</text>
    <text x="722" y="130" class="t-cap t-sec">не трогает держатели:</text>
    <text x="722" y="148" class="t-cap t-sec">новый их подхватывает</text>
    <!-- ульи -->
    <rect x="0.75" y="184" width="560" height="178" rx="14" class="frame-hive" />
    <text x="16" y="204" class="t-head t-lilac">УЛЕЙ A</text>
    <rect x="588.75" y="184" width="318" height="178" rx="14" class="frame-hive" />
    <text x="604" y="204" class="t-head t-lilac">УЛЕЙ Б</text>
    <g v-for="c in [{ x: 20, s: 'Матка A' }, { x: 290, s: 'Саборкестратор' }, { x: 608, s: 'Матка Б' }]" :key="c.x">
      <rect :x="c.x" y="214" width="250" height="40" rx="10" class="n" />
      <text :x="c.x + 125" y="239" text-anchor="middle" class="t-big">Держатель терминала</text>
      <rect :x="c.x" y="266" width="250" height="40" rx="10" class="n-purple" />
      <text :x="c.x + 125" y="291" text-anchor="middle" class="t-big">{{ c.s }}</text>
    </g>
    <rect x="20" y="318" width="520" height="34" rx="10" class="n-lime" />
    <text x="280" y="340" text-anchor="middle" class="t-big t-ink">Доска A · саборкестратор пишет своё поддерево</text>
    <rect x="608" y="318" width="280" height="34" rx="10" class="n-lime" />
    <text x="748" y="340" text-anchor="middle" class="t-big t-ink">Доска Б</text>
    <path d="M300,154 L150,212" class="e" :marker-end="`url(#${id})`" />
    <path d="M430,154 L415,212" class="e" :marker-end="`url(#${id})`" />
    <path d="M600,154 L720,212" class="e" :marker-end="`url(#${id})`" />
  </svg>
</template>
