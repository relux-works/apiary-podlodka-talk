<script setup lang="ts">
// v6 (12.10), глава 2, итог «Передача работы между средами». Оркестратор в одной среде упёрся в лимиты или потерял сеть;
// работа переезжает в другую среду: цель, состояние задач и заметка о передаче живут на доске, новая сессия продолжает с той же цели.
// Разговор спикеров 12.10: «цели не меняются, состояние не меняется — делаем ретейки с Claude на Codex, на что угодно»;
// «мы поддерживаем handoff и takeover»; «и субагентов тоже».
// Источники: wiki book/ru/01-zachem.md «Семь принципов» п. 2 (журнал — состояние, сессия — кэш); skill-project-management
// docs/claude-goal-runtime.md и docs/codex-goal-runtime.md (цели с ревизиями, managed reconnect); wiki session-host/architecture.ru.md
// §5.4 (пакет передачи swarm-handoff/2, причины park · crash · takeover — предложено).
// reveal: среда 1 и обрыв (1), доска и запись передачи (2), среда 2 и продолжение (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
</script>
<template>
  <svg width="908" height="190" viewBox="0 0 908 190" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <Step :on="reveal">
      <rect x="0.75" y="0.75" width="250" height="186" rx="14" class="frame" />
      <text x="16" y="24" class="t-head t-sec">СРЕДА 1 · CLAUDE</text>
      <rect x="16" y="40" width="219" height="62" rx="10" class="n-purple" />
      <text x="125.5" y="65" text-anchor="middle" class="t-big">Оркестратор</text>
      <text x="125.5" y="85" text-anchor="middle" class="t-on">и его субагенты</text>
      <rect x="16" y="116" width="219" height="54" rx="10" class="n-orange" />
      <text x="125.5" y="139" text-anchor="middle" class="t-cap t-ink">кончились лимиты</text>
      <text x="125.5" y="158" text-anchor="middle" class="t-cap t-ink">или упал VPN</text>
    </Step>
    <Step :on="reveal">
      <line x1="252" y1="94" x2="317" y2="94" class="e" :marker-end="`url(#${id}-a)`" />
      <text x="285" y="84" text-anchor="middle" class="t-cap t-sec">запись</text>
      <rect x="320" y="20" width="268" height="148" rx="12" class="n-lime" />
      <text x="454" y="54" text-anchor="middle" class="t-lab t-ink">Доска</text>
      <text x="454" y="84" text-anchor="middle" class="t-cap t-ink">цель и её ревизия</text>
      <text x="454" y="106" text-anchor="middle" class="t-cap t-ink">состояние задач</text>
      <text x="454" y="128" text-anchor="middle" class="t-cap t-ink">заметка о передаче</text>
    </Step>
    <Step :on="reveal">
      <line x1="588" y1="94" x2="653" y2="94" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <text x="621" y="84" text-anchor="middle" class="t-cap t-lime">чтение</text>
      <rect x="656.75" y="0.75" width="250.5" height="186" rx="14" class="frame-hive" />
      <text x="672" y="24" class="t-head t-lilac">СРЕДА 2 · CODEX</text>
      <rect x="672" y="40" width="219" height="62" rx="10" class="n-purple" />
      <text x="781.5" y="65" text-anchor="middle" class="t-big">Оркестратор</text>
      <text x="781.5" y="85" text-anchor="middle" class="t-on">продолжает с той же цели</text>
      <rect x="672" y="116" width="219" height="54" rx="10" class="n" />
      <text x="781.5" y="139" text-anchor="middle" class="t-cap">субагенты — так же,</text>
      <text x="781.5" y="158" text-anchor="middle" class="t-cap">со своими целями</text>
    </Step>
  </svg>
</template>
