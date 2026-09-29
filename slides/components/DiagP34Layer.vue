<script setup lang="ts">
// Plan v4 slide 24: one orchestrator, any harness — one more layer of abstraction. Simplified for v4 (29.09):
// the orchestrator in any harness, our layer (sessions, choice, launch), the harnesses below.
// Sources: text/from-buckets-to-apiary.ru.md ch. 3 (harness table: control channel) and ch. 4 (planes);
// agent-session-host spec/session-host.md DRAFT v0.3 §3.3 (one contract; Claude and Codex adapters first, Muse, agy,
// Pi, Qwen next); skill-agents-management SKILL.md (a plugin per agentic system); wiki research/call-digest-2026-09-28.md
// §2 (Muse 1.4 «should make a good orchestrator»); roadmap §1 («Pi and Qwen primary sessions are planned»).
// Solid — works today in task-board (goals and children in Claude and Codex); dashed — an adapter in the host spec.
// reveal: orchestrator (1), our layer (2), harnesses (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const layer = [
  { x: 16, h: 'Сессии', s: 'один протокол для всех сред' },
  { x: 313, h: 'Выбор', s: 'среда и модель по роли' },
  { x: 610, h: 'Запуск', s: 'воркеры и ревьюеры' },
]
const envs = [
  { x: 0, h: 'Claude Code', s: 'терминал', today: true },
  { x: 184.5, h: 'Codex', s: 'app-server', today: true },
  { x: 369, h: 'Muse', s: 'muse serve', today: false },
  { x: 553.5, h: 'agy', s: 'stream-json', today: false },
  { x: 738, h: 'Pi, Qwen', s: 'расширение', today: false },
]
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="214" y="0" width="480" height="60" rx="10" class="n-purple" />
      <text x="454" y="26" text-anchor="middle" class="t-lab">Оркестратор в любой среде</text>
      <text x="454" y="47" text-anchor="middle" class="t-on">Claude · Codex · Muse · локальная модель</text>
    </Step>
    <Step :on="reveal">
      <line x1="454" y1="60" x2="454" y2="85" class="e" :marker-end="`url(#${id})`" />
      <rect x="0.75" y="88" width="906.5" height="96" rx="14" class="frame-hive" />
      <text x="16" y="109" class="t-head t-lilac">ЕЩЁ ОДИН СЛОЙ АБСТРАКЦИИ</text>
      <g v-for="l in layer" :key="l.x">
        <rect :x="l.x" y="118" width="282" height="54" rx="10" class="n-lilac" />
        <text :x="l.x + 141" y="141" text-anchor="middle" class="t-lab t-ink">{{ l.h }}</text>
        <text :x="l.x + 141" y="161" text-anchor="middle" class="t-ink-sec">{{ l.s }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <g v-for="e in envs" :key="e.x">
        <line :x1="e.x + 85" y1="184" :x2="e.x + 85" y2="209" class="e" :marker-end="`url(#${id})`" />
        <rect :x="e.x" y="212" width="170" height="58" rx="10" :class="e.today ? 'n' : 'n-wait'" />
        <text :x="e.x + 85" y="237" text-anchor="middle" class="t-big">{{ e.h }}</text>
        <text :x="e.x + 85" y="257" text-anchor="middle" class="t-sec">{{ e.s }}</text>
      </g>
      <text x="908" y="294" text-anchor="end" class="t-cap t-sec">пунктир — в спеке</text>
    </Step>
  </svg>
</template>
