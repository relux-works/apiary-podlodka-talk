<script setup lang="ts">
// Слайд 36, «Аренда и один писатель». Одна последовательность вместо двух слайдов v1 («Аренда решает» + «Один писатель»).
// Источники: waggle DRAFT v5.2 §12 (аренда: держатель, монотонный term, токен, срок, compare-and-set; пример Auth/Billing:
// отказ scope_owned_by, передача по coord.handoff-offer, аренда переходит с большим term; сессия, вернувшаяся с другим term,
// получает отказ по старому); wiki decisions.md 2026-09-28 «Two operators on one module» (один принимающий писатель на доску,
// отсечение по эпохам; эпоха проверяется при запуске, последней записи и интеграции; потерявший полномочия приостанавливает
// новые записи; трек waggle CM2); техническая записка, глава 11 (аренды ⟦решено⟧); пост §5.4. Решено, не реализовано.
// Эпоха здесь — номер поколения аренды (term). «Пауза» — потерявший полномочия приостанавливает новые записи.
// Высота подобрана так, чтобы схема не сжималась под заголовком и одной строкой плашки. N — условный номер, не число из источника.
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'a', label: 'Оркестратор А', sub: 'держит эпик Auth', tone: 'purple' },
  { id: 'w', label: 'Писатель доски', sub: 'принимающий, один', tone: 'lilac' },
  { id: 'l', label: 'Аренды', sub: 'compare-and-set' },
  { id: 'b', label: 'Оркестратор Б', sub: 'держит эпик Billing', tone: 'purple' },
]
const steps = [
  { from: 'a', to: 'w', text: 'спавн в Billing' },
  { from: 'w', to: 'a', text: 'отказ: scope_owned_by Б', dashed: true },
  { from: 'a', to: 'b', text: 'coord: предлагаю передать Billing' },
  { from: 'b', to: 'l', text: 'согласен' },
  { from: 'l', to: 'a', text: 'Billing у А · эпоха N+1', dashed: true, tone: 'lime' },
  { section: 'А молчит, аренда истекла' },
  { from: 'b', to: 'l', text: 'захват · эпоха N+2' },
  { section: 'А проснулся' },
  { from: 'a', to: 'w', text: 'запись · эпоха N+1' },
  { from: 'w', to: 'a', text: 'отказ: эпоха устарела, пауза', dashed: true },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" :row="25" /></template>
