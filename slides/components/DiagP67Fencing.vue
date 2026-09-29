<script setup lang="ts">
// Слайд 36, два оператора на одной доске. Новая схема части 6.
// Источник: wiki decisions.md 2026-09-28 «Two operators on one module» (один принимающий писатель на доску,
// отсечение по эпохам; эпоха проверяется при запуске, последней записи и интеграции; потерявший полномочия
// приостанавливает новые записи; трек waggle CM2); waggle DRAFT v5.2 §12 (аренда: держатель, монотонный term,
// токен, срок, compare-and-set); пост §5.4. Решено, не реализовано. Как выбирается писатель — открыто (wiki open-questions).
// N — условный номер эпохи, не число из источника.
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'a', label: 'Оркестратор А', sub: 'точка оператора А', tone: 'purple' },
  { id: 'w', label: 'Писатель доски', sub: 'принимающий, один', tone: 'lilac' },
  { id: 'l', label: 'Аренды', sub: 'compare-and-set' },
  { id: 'b', label: 'Оркестратор Б', sub: 'точка оператора Б', tone: 'purple' },
]
const steps = [
  { from: 'a', to: 'w', text: 'операция · эпоха N' },
  { from: 'w', to: 'a', text: 'принято', dashed: true, tone: 'lime' },
  { section: 'А молчит, аренда истекла' },
  { from: 'b', to: 'l', text: 'захват аренды' },
  { from: 'l', to: 'b', text: 'эпоха N+1', dashed: true, tone: 'lime' },
  { from: 'b', to: 'w', text: 'операция · эпоха N+1' },
  { section: 'А проснулся' },
  { from: 'a', to: 'w', text: 'операция · эпоха N' },
  { from: 'w', to: 'a', text: 'отказ: эпоха устарела', dashed: true },
  { note: 'новые записи на паузе', at: 'a' },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" /></template>
