<script setup lang="ts">
// Слайд 14, эксплуатация. Сценическая версия reboot-restore (main loop DRAFT v0.1 §1.1, §7.3, §10.5, §10.6).
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'la', label: 'Агент входа', sub: 'launchd' },
  { id: 'ku', label: 'keeper up' },
  { id: 'h', label: 'Хост сессий' },
  { id: 'k', label: 'Кипер', tone: 'lilac' },
  { id: 'q', label: 'Матки', sub: 'ульев', tone: 'purple' },
  { id: 'b', label: 'Доски', sub: 'цели, заметки' },
  { id: 'p', label: 'Человек', tone: 'lime' },
]
const steps = [
  { from: 'la', to: 'ku', text: 'при входе' },
  { from: 'ku', to: 'h', text: 'старт' },
  { from: 'h', to: 'h', text: 'читает реестр сессий' },
  { from: 'ku', to: 'h', text: 'верни Кипера' },
  { from: 'h', to: 'k', text: 'resume или новая сессия с целью' },
  { from: 'ku', to: 'h', text: 'верни матки, кроме остановленных' },
  { from: 'h', to: 'b', text: 'цель и заметка каждого улья' },
  { from: 'h', to: 'q', text: 'resume или новая сессия с целью' },
  { note: 'каждая матка сама решает,\nкого из своих перезапустить', at: 'q' },
  { from: 'h', to: 'q', text: 'накопленные звонки' },
  { from: 'k', to: 'p', text: 'отчёт: что вернулось, что нет и почему', tone: 'lime' },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" :row="26" /></template>
