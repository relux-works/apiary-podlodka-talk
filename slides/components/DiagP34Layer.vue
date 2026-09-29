<script setup lang="ts">
// Слайд 16, слой абстракции: оркестратор в любой среде спавнит сабагентов в любой другой. Новая схема.
// Источники: text/from-buckets-to-apiary.ru.md гл. 3 (таблица сред: канал управления) и гл. 4 (плоскости);
// agent-session-host spec/session-host.md DRAFT v0.3 §3.3 (операции контракта, адаптеры: Claude и Codex первыми,
// Muse, agy, Pi, Qwen следом); skill-agents-management SKILL.md (плагин на каждую среду).
// Лайм — работает сегодня в task-board (цели и дети в Claude и Codex); пунктир — адаптер в спеке хоста сессий.
// reveal: оркестратор (1), слой (2), среды (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const layer = [
  { x: 16, h: 'Роль и политика', s: 'выбирают модель' },
  { x: 313, h: 'Сборка запуска', s: 'agents-management' },
  { x: 610, h: 'Хост сессий', s: 'цель, звонок, события' },
]
const envs = [
  { x: 0, h: 'Claude Code', s: 'PTY', today: true },
  { x: 184.5, h: 'Codex', s: 'app-server', today: true },
  { x: 369, h: 'Muse', s: 'muse serve', today: false },
  { x: 553.5, h: 'agy', s: 'stream-json + хук', today: false },
  { x: 738, h: 'Pi, Qwen', s: 'расширение', today: false },
]
</script>
<template>
  <svg width="908" height="276" viewBox="0 0 908 276" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-click="reveal ? 1 : false">
      <rect x="244" y="0" width="420" height="56" rx="10" class="n-purple" />
      <text x="454" y="23" text-anchor="middle" class="t-big">Оркестратор в любой среде</text>
      <text x="454" y="43" text-anchor="middle" class="t-on">даже локальный Qwen рулит Claude и Codex</text>
    </g>
    <g v-click="reveal ? 2 : false">
      <line x1="454" y1="56" x2="454" y2="83" class="e" :marker-end="`url(#${id})`" />
      <rect x="0.75" y="86" width="906.5" height="94" rx="14" class="frame-hive" />
      <text x="16" y="106" class="t-head t-lilac">НАШ СЛОЙ · ОДНИ ИНСТРУКЦИИ РОЛИ ДЛЯ ВСЕХ СРЕД</text>
      <g v-for="l in layer" :key="l.x">
        <rect :x="l.x" y="116" width="282" height="50" rx="10" class="n" />
        <text :x="l.x + 141" y="137" text-anchor="middle" class="t-big">{{ l.h }}</text>
        <text :x="l.x + 141" y="156" text-anchor="middle" class="t-sec">{{ l.s }}</text>
      </g>
    </g>
    <g v-click="reveal ? 3 : false">
      <g v-for="e in envs" :key="e.x">
        <line :x1="e.x + 85" y1="180" :x2="e.x + 85" y2="211" class="e" :marker-end="`url(#${id})`" />
        <rect :x="e.x" y="214" width="170" height="58" rx="10" :class="e.today ? 'n-lime' : 'n-wait'" />
        <text :x="e.x + 85" y="238" text-anchor="middle" class="t-big" :class="e.today ? 't-ink' : ''">{{ e.h }}</text>
        <text :x="e.x + 85" y="258" text-anchor="middle" :class="e.today ? 't-ink-sec' : 't-sec'">{{ e.s }}</text>
      </g>
    </g>
  </svg>
</template>
