<script setup lang="ts">
// Слайд 21, звонок в дверь. Сценическая версия doorbell-delivery (claude-goal-runtime.md; waggle §10; session host spec §2.5, §7).
// reveal: цепочка сразу, затем «сегодня» и три режима цели по клику. Статус: «сегодня» — работает (§2.5), три режима — §7, предложено.
// Подробности доставки сегодня (Claude — вставкой, Codex — turn/start или turn/steer) — в заметках слайда.
defineProps<{ reveal?: boolean }>()
const cards = [
  { h: 'Сегодня', cls: '', html: 'Одно уведомление на запуск и только при подключённом клиенте. Без клиента ждёт.' },
  { h: 'next_turn · по умолчанию', cls: 'lilac', html: 'Свободна — новый ход сразу.<br>Занята — на границе хода.' },
  { h: 'steer', cls: '', html: 'Codex — прямо в текущий ход.<br>Claude — вставка в безопасной точке, иначе next_turn.' },
  { h: 'interrupt', cls: 'orange', html: 'Только стоп, парковка и аварийный стоп: остановить ход, затем доставить.' },
]
</script>
<template>
  <div class="dg-bell">
    <Boxes :items="['Отправитель', 'Входящие сессии', 'Хост сессий: роутер', 'Адаптер среды', 'Сессия']" :colors="['neutral', 'neutral', 'purple', 'neutral', 'neutral']" />
    <div class="cards cols-4">
      <template v-if="reveal"><div v-for="c in cards" :key="c.h" v-click class="card" :class="c.cls"><h2>{{ c.h }}</h2><p v-html="c.html" /></div></template>
      <template v-else><div v-for="c in cards" :key="c.h" class="card" :class="c.cls"><h2>{{ c.h }}</h2><p v-html="c.html" /></div></template>
    </div>
  </div>
</template>
<style scoped>
.dg-bell .card { font-size: 15px; }
.dg-bell :deep(.rwb-boxes .box) { font-size: 15px; min-height: 56px; padding: 12px 14px; }
</style>
