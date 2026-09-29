<script setup lang="ts">
// Слайд 33, доверие. Сценическая версия delegation-of-human-acts (process configuration draft v3.3 §2.3–§6.8; waggle A1 §19).
defineProps<{ reveal?: boolean }>()
const cards = [
  { n: 1, h: 'Проект разрешает', cls: '', html: '<code>Playbook.json</code>, <code>policy.delegation</code>: <b>allow</b> — какие действия, каким ролям, с какими потолками; <b>never</b> — нельзя никогда. Нет политики — делегировать нечего.' },
  { n: 2, h: 'Человек выдаёт', cls: '', html: 'Действия, условия, срок, бюджет. Подтверждает ОС: Touch ID, Windows Hello, FIDO2. Например, заказы до 500 € каждый и до 2 000 € в неделю, 90 дней.' },
  { n: 3, h: 'Оркестратор действует от имени', cls: 'purple', html: '<span class="ok">180 €</span> — внутри лимита: засчитано как действие человека.<br><span class="no">800 €</span> — вне лимита: ждёт человека.<br>Самоодобрение не считается.' },
  { n: 4, h: 'Отзыв и срок', cls: '', html: 'Отзыв действует сразу. Уже совершённое остаётся в силе.' },
]
</script>
<template>
  <div class="cards cols-4 dg-deleg">
    <template v-if="reveal"><div v-for="c in cards" :key="c.n" v-click class="card num" :class="c.cls" :data-num="c.n"><h2>{{ c.h }}</h2><p v-html="c.html" /></div></template>
    <template v-else><div v-for="c in cards" :key="c.n" class="card num" :class="c.cls" :data-num="c.n"><h2>{{ c.h }}</h2><p v-html="c.html" /></div></template>
  </div>
</template>
<style scoped>
.dg-deleg .card { font-size: 15px; }
.dg-deleg :deep(.ok) { background: var(--rwb-lime); color: var(--rwb-ink); border-radius: 6px; padding: 0 6px; font-weight: 600; }
.dg-deleg :deep(.no) { background: var(--rwb-orange); color: var(--rwb-ink); border-radius: 6px; padding: 0 6px; font-weight: 600; }
</style>
