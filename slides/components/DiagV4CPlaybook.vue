<script setup lang="ts">
// v4, слайд 40: процесс разработки из первой половины — в Playbook.json; роли — это скиллы.
// Упрощённая версия DiagP5Anatomy (та — в запасе).
// Источник: curator-playbook spec/process-configuration.md DRAFT v4.8 — §0 (четыре части файла; «Playbooks are data only»;
// «Roles are skills»), §2.1 (Playbook.json рядом со Skillfile.json), §4.1–§4.2 (псевдонимы ролей, один владелец в состоянии),
// §6.2 (переходы, limit), §8.1 (опубликованный плейбук — набор скиллов; скилл роли — только в запуски роли через её профиль);
// examples/dev-cycle.playbook.json (воркфлоу dev, упрощён до трёх состояний).
// reveal: воркфлоу (1), роли (2), типы и политика (3), роли — это скиллы (4).
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
</script>
<template>
  <svg width="908" height="290" viewBox="0 0 908 290" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <rect x="0.75" y="0.75" width="560" height="288.5" rx="14" class="frame" />
    <text x="16" y="24" class="t-head t-sec">PLAYBOOK.JSON · В GIT ПРОЕКТА</text>
    <Step :on="reveal">
      <text x="16" y="72" class="t-head t-lilac">ВОРКФЛОУ</text>
      <rect x="124" y="44" width="150" height="48" rx="10" class="n" />
      <text x="199" y="65" text-anchor="middle" class="t-big">development</text>
      <text x="199" y="83" text-anchor="middle" class="t-sec">developer</text>
      <rect x="310" y="44" width="120" height="48" rx="10" class="n" />
      <text x="370" y="65" text-anchor="middle" class="t-big">review</text>
      <text x="370" y="83" text-anchor="middle" class="t-sec">reviewer</text>
      <rect x="466" y="44" width="80" height="48" rx="10" class="n-lime" />
      <text x="506" y="73" text-anchor="middle" class="t-big t-ink">done</text>
      <line x1="274" y1="68" x2="307" y2="68" class="e" :marker-end="`url(#${id})`" />
      <line x1="430" y1="68" x2="463" y2="68" class="e" :marker-end="`url(#${id})`" />
      <path d="M350,92 C340,116 222,116 212,95" class="e" :marker-end="`url(#${id})`" />
      <text x="282" y="128" text-anchor="middle" class="t-cap t-sec">доработка</text>
    </Step>
    <Step :on="reveal">
      <text x="16" y="178" class="t-head t-lilac">РОЛИ</text>
      <rect x="124" y="150" width="130" height="48" rx="10" class="n-lime" />
      <text x="189" y="171" text-anchor="middle" class="t-big t-ink">operator</text>
      <text x="189" y="189" text-anchor="middle" class="t-ink-sec">человек</text>
      <rect x="266" y="150" width="136" height="48" rx="10" class="n" />
      <text x="334" y="179" text-anchor="middle" class="t-big">developer</text>
      <rect x="414" y="150" width="132" height="48" rx="10" class="n" />
      <text x="480" y="179" text-anchor="middle" class="t-big">reviewer</text>
    </Step>
    <Step :on="reveal">
      <text x="16" y="256" class="t-head t-lilac">ТИПЫ</text>
      <text x="16" y="274" class="t-head t-lilac">ПОЛИТИКА</text>
      <rect x="124" y="234" width="200" height="40" rx="10" class="n-wait" />
      <text x="224" y="259" text-anchor="middle">epic › story › task</text>
      <rect x="336" y="234" width="210" height="40" rx="10" class="n-wait" />
      <text x="441" y="259" text-anchor="middle">лимиты · делегирование</text>
    </Step>
    <Step :on="reveal">
      <line x1="546" y1="174" x2="597" y2="174" class="e" :marker-end="`url(#${id})`" />
      <rect x="600.75" y="0.75" width="306.5" height="288.5" rx="14" class="frame-hive" />
      <text x="616" y="24" class="t-head t-lilac">РОЛИ — ЭТО СКИЛЛЫ</text>
      <rect x="616" y="40" width="276" height="58" rx="10" class="n-purple" />
      <text x="754" y="64" text-anchor="middle" class="t-big">скилл оркестратора</text>
      <text x="754" y="84" text-anchor="middle" class="t-on">несёт шаблон процесса</text>
      <rect x="616" y="110" width="276" height="44" rx="10" class="n" />
      <text x="754" y="137" text-anchor="middle" class="t-big">скилл developer</text>
      <rect x="616" y="164" width="276" height="44" rx="10" class="n" />
      <text x="754" y="191" text-anchor="middle" class="t-big">скилл reviewer</text>
      <text x="616" y="246" class="t-cap">Ставит Curator; запуск роли</text>
      <text x="616" y="266" class="t-cap">стартует с её профилем</text>
    </Step>
  </svg>
</template>
