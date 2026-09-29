<script setup lang="ts">
// Запасная к слайду 21. Сценическая версия session-start-today (claude-goal-runtime.md; sessionmanager host.go, claude_host.go).
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'p', label: 'Человек', tone: 'lime' },
  { id: 'w', label: 'task-board claude', sub: 'обёртка' },
  { id: 'd', label: 'tb-sessiond', sub: 'один на доску' },
  { id: 'ph', label: 'Хост Claude', sub: 'держит PTY' },
  { id: 'c', label: 'Claude Code', tone: 'purple' },
  { id: 'b', label: 'Доска', sub: 'board-goal-v2' },
]
const steps = [
  { from: 'p', to: 'w', text: 'task-board claude' },
  { from: 'w', to: 'd', text: 'ConnectOrStart' },
  { from: 'd', to: 'd', text: 'основной слот свободен?' },
  { from: 'd', to: 'ph', text: 'Launch' },
  { from: 'ph', to: 'c', text: 'старт в PTY' },
  { from: 'd', to: 'b', text: 'читает голову цели' },
  { from: 'ph', to: 'c', text: '/goal … <условие>' },
  { from: 'c', to: 'ph', text: 'подтверждение ревизии', dashed: true },
  { from: 'w', to: 'c', text: 'терминал через демон' },
  { note: 'работает без клиента:\nцель ведёт продолжение', at: 'c' },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" /></template>
