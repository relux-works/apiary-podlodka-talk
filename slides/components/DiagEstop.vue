<script setup lang="ts">
// Запасная к слайдам 14 и 21. Сценическая версия emergency-stop, предложено (session host spec §9, §11).
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'o', label: 'Оператор', tone: 'lime' },
  { id: 'e', label: 'estop', sub: 'task-board' },
  { id: 'kk', label: 'Ядро доски', sub: 'код, без модели' },
  { id: 'h', label: 'Хост сессий' },
  { id: 'q', label: 'Оркестраторы', tone: 'purple' },
  { id: 'b', label: 'Доски' },
]
const steps = [
  { from: 'o', to: 'e', text: 'estop [--process NAME]' },
  { from: 'e', to: 'o', text: 'кого остановит · «введите STOP»' },
  { note: 'из сессии или рана — отказ,\nтолько оператор', at: 'e' },
  { from: 'e', to: 'kk', text: 'снимок затронутых досок' },
  { from: 'kk', to: 'b', text: 'раны, CR на ревью, обязательства' },
  { from: 'e', to: 'h', text: 'прерывание: заметка за 10–30 с' },
  { from: 'h', to: 'q', text: 'заметка, затем стоп; цели целы' },
  { from: 'e', to: 'b', text: 'ревизия цели: handoff = снимок + заметка' },
  { from: 'e', to: 'o', text: 'отчёт: кто остановлен, кто нет', tone: 'lime' },
  { section: 'Позже' },
  { from: 'o', to: 'h', text: 'keeper up' },
  { from: 'h', to: 'q', text: 'возобновление по цели и заметке', tone: 'lime' },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" :row="25" /></template>
