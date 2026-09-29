<script setup lang="ts">
// Слайд 21 (запас), парковка через цель. Сценическая версия park-and-resume (session host spec DRAFT v0.3 §8: curator session park,
// keeper park поверх — решено 27.09, task-board session park отозван; board goal v2; аварийный стоп — §9).
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'p', label: 'Человек или Кипер', tone: 'lime' },
  { id: 'h', label: 'Хост сессий', sub: 'curator session' },
  { id: 'o', label: 'Оркестратор', sub: 'сессия', tone: 'purple' },
  { id: 'b', label: 'Доска', sub: 'цели и заметки' },
]
const steps = [
  { section: 'Парковка' },
  { from: 'p', to: 'h', text: 'park SES --reason' },
  { from: 'h', to: 'o', text: 'звонок (interrupt): запиши заметку' },
  { from: 'o', to: 'b', text: 'раны, CR на ревью, решения, дальше' },
  { from: 'h', to: 'b', text: 'новая ревизия цели, handoff = заметка' },
  { from: 'h', to: 'o', text: 'стоп с возобновлением, цель не очищена' },
  { section: 'Возобновление' },
  { from: 'p', to: 'h', text: 'start, wake или keeper up' },
  { from: 'h', to: 'b', text: 'читает голову цели' },
  { from: 'h', to: 'o', text: '/goal … rev N+1, handoff' },
  { from: 'o', to: 'b', text: 'сначала читает заметку' },
  { from: 'o', to: 'o', text: 'продолжает работу', tone: 'lime' },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" :row="25" /></template>
