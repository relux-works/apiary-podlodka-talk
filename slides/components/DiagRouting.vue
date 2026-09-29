<script setup lang="ts">
// Слайд 32, Кипер. Сценическая версия curator-keeper request-routing.puml; содержание сверено с keeper.md DRAFT v0.5.1
// (§8.2–§8.4 порядок маршрутизации и пример кафе 0,82 / дом 0,61, §10.4) и waggle DRAFT v5.2 §10 (звонок и забор).
// Последний ответ человеку нейтральный: текста результата в спеке нет.
defineProps<{ reveal?: boolean }>()
const actors = [
  { id: 'p', label: 'Человек', sub: 'терминал', tone: 'lime' },
  { id: 'k', label: 'Кипер', sub: 'главный цикл', tone: 'lilac' },
  { id: 'r', label: 'Классификатор', sub: 'keeper route' },
  { id: 'h', label: 'Хост сессий' },
  { id: 'w', label: 'waggle', sub: 'почтовые ящики' },
  { id: 'q', label: 'Матка кафе', sub: 'корневой оркестр.', tone: 'purple' },
]
const steps = [
  { from: 'p', to: 'k', text: '«закажи овсяное молоко»' },
  { from: 'k', to: 'r', text: 'текст, канал, отправитель' },
  { from: 'r', to: 'k', text: 'кафе 0,82 · дом 0,61 → спросить', dashed: true },
  { from: 'k', to: 'p', text: '«Для дома или для кафе?»' },
  { from: 'p', to: 'k', text: '«для кафе» → подсказка в keeper.toml' },
  { from: 'k', to: 'h', text: 'разбуди кафе' },
  { from: 'k', to: 'w', text: 'запрос матке кафе' },
  { from: 'h', to: 'q', text: 'звонок в дверь' },
  { from: 'q', to: 'q', text: 'работает на своей доске' },
  { from: 'q', to: 'w', text: 'результат', tone: 'lime' },
  { from: 'w', to: 'k', text: 'звонок, результат', tone: 'lime' },
  { from: 'k', to: 'p', text: 'результат', tone: 'lime' },
]
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" /></template>
