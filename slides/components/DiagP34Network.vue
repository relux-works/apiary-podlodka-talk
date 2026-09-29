<script setup lang="ts">
// Слайд 19, несколько подписок на одной машине: сетевые профили. Новая схема по картинке цели спеки.
// Источник: curator-network-profiles spec/network-profiles.md (DRAFT, decided design, pre-implementation):
// §0 (codex A и pi C через :18081, claude B через :18082, оркестратор и остальное — обычной сетью; кооперативная
// маршрутизация, не песочница), N1 (пять независимых настроек; учётные данные выбирает Curator, другой маршрут —
// не новый домен квоты), N3 (пример network.toml: egress-a, egress-b), N4 (без выбора — unmanaged, как сегодня).
// reveal: запуск A (1), запуск B (2), запуск C на том же выходе A (3), оркестратор и пять настроек (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const rows = [
  { h: 'Codex · запуск A', s: 'логин подписки A' },
  { h: 'Pi · запуск C', s: 'делит выход A' },
  { h: 'Claude · запуск B', s: 'логин подписки B' },
]
</script>
<template>
  <svg width="908" height="318" viewBox="0 0 908 318" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <text x="0" y="14" class="t-head t-sec">ЗАПУСК · ДОМ CURATOR</text>
    <text x="330" y="14" class="t-head t-sec">СЕТЕВОЙ ПРОФИЛЬ</text>
    <text x="640" y="14" class="t-head t-sec">ВЫХОД В СЕТЬ</text>
    <g v-click="reveal ? 1 : false">
      <rect x="0" y="30" width="250" height="52" rx="10" class="n" />
      <text x="125" y="52" text-anchor="middle" class="t-big">{{ rows[0].h }}</text>
      <text x="125" y="71" text-anchor="middle" class="t-sec">{{ rows[0].s }}</text>
      <line x1="250" y1="56" x2="327" y2="56" class="e" :marker-end="`url(#${id})`" />
      <rect x="330" y="30" width="230" height="118" rx="10" class="n-lilac" />
      <text x="445" y="85" text-anchor="middle" class="t-big t-ink">egress-a</text>
      <text x="445" y="104" text-anchor="middle" class="t-ink-sec">прокси :18081</text>
      <line x1="560" y1="89" x2="637" y2="89" class="e" :marker-end="`url(#${id})`" />
      <rect x="640" y="30" width="268" height="118" rx="10" class="n" />
      <text x="774" y="85" text-anchor="middle" class="t-big">VPN или выход A</text>
      <text x="774" y="104" text-anchor="middle" class="t-sec">свой маршрут</text>
    </g>
    <g v-click="reveal ? 2 : false">
      <rect x="0" y="162" width="250" height="52" rx="10" class="n" />
      <text x="125" y="184" text-anchor="middle" class="t-big">{{ rows[2].h }}</text>
      <text x="125" y="203" text-anchor="middle" class="t-sec">{{ rows[2].s }}</text>
      <line x1="250" y1="188" x2="327" y2="188" class="e" :marker-end="`url(#${id})`" />
      <rect x="330" y="162" width="230" height="52" rx="10" class="n-lilac" />
      <text x="445" y="184" text-anchor="middle" class="t-big t-ink">egress-b</text>
      <text x="445" y="203" text-anchor="middle" class="t-ink-sec">прокси :18082</text>
      <line x1="560" y1="188" x2="637" y2="188" class="e" :marker-end="`url(#${id})`" />
      <rect x="640" y="162" width="268" height="52" rx="10" class="n" />
      <text x="774" y="184" text-anchor="middle" class="t-big">VPN или выход B</text>
      <text x="774" y="203" text-anchor="middle" class="t-sec">свой маршрут</text>
    </g>
    <g v-click="reveal ? 3 : false">
      <rect x="0" y="96" width="250" height="52" rx="10" class="n" />
      <text x="125" y="118" text-anchor="middle" class="t-big">{{ rows[1].h }}</text>
      <text x="125" y="137" text-anchor="middle" class="t-sec">{{ rows[1].s }}</text>
      <line x1="250" y1="122" x2="327" y2="122" class="e" :marker-end="`url(#${id})`" />
    </g>
    <g v-click="reveal ? 4 : false">
      <rect x="0" y="232" width="250" height="52" rx="10" class="n-purple" />
      <text x="125" y="254" text-anchor="middle" class="t-big">Оркестратор и остальное</text>
      <text x="125" y="273" text-anchor="middle" class="t-on">без профиля: unmanaged</text>
      <line x1="250" y1="258" x2="637" y2="258" class="e" :marker-end="`url(#${id})`" />
      <text x="330" y="250" class="t-cap t-sec">как сегодня</text>
      <rect x="640" y="232" width="268" height="52" rx="10" class="n" />
      <text x="774" y="263" text-anchor="middle" class="t-big">Обычная сеть машины</text>
      <text x="0" y="312" class="t-cap t-sec">Пять независимых настроек запуска: профиль Curator · учётные данные · привязка среды · сеть · исполнение</text>
    </g>
  </svg>
</template>
