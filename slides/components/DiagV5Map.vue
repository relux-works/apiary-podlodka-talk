<script setup lang="ts">
// v5, вступление, слайд «Те же задачи у агентов»: параллель между параллелизмом в рантайме и оркестрацией агентов,
// по строке на главу доклада. Это же карта доклада (chapters — показать колонку глав и спикеров).
// Источник: план v5 (plan/slides-plan.ru.md, plan/deck-v5-brief.md); содержание строк — тезисы глав 1–6.
// reveal: по строке на клик.
defineProps<{ reveal?: boolean, chapters?: boolean }>()
const rows = [
  ['Последовательное исполнение', 'один агент, контекст переносит человек', '01 Эпохи · Алексей'],
  ['Потоки, граф зависимостей, гонки', 'субагенты и роли, доска как граф, рабочая копия на задачу', '02 Доска и автономия · демо 1 · Алексей'],
  ['Планировщик — ядро и приоритет под задачу', 'роутинг — модель и бюджет под задачу, любая среда', '03 Без привязки к вендору · демо 2 · Алексей'],
  ['Окружение процесса и пакеты', 'профиль агента, скиллы как пакеты, процесс как конфигурация', '04–05 Контекст, процессы · демо 3 · Иван'],
  ['Изоляция процессов — адресное пространство и права', 'пользователь ОС на агента, ключи вне агента', '06 Рой · рабочее место · Иван'],
  ['Акторы и базы через границы машин', 'оркестраторы между машинами, удалённый агент, рой', '06 Между машинами и рой · Иван'],
]
</script>
<template>
  <div class="dg-map" :class="{ ch: chapters }">
    <div class="head"><span></span><span>В рантайме</span><span>У агентов</span><span v-if="chapters">Глава</span></div>
    <Step v-for="(r, i) in rows" :key="r[0]" :on="reveal" as="div">
      <div class="row"><span class="idx">{{ String(i + 1).padStart(2, '0') }}</span><span class="rt">{{ r[0] }}</span><span class="ag">{{ r[1] }}</span><span v-if="chapters" class="chap">{{ r[2] }}</span></div>
    </Step>
  </div>
</template>
<style scoped>
.dg-map { display: grid; margin-bottom: 16px; }
.head, .row { display: grid; grid-template-columns: 40px 1fr 1fr; column-gap: 18px; align-items: baseline; }
.ch .head, .ch .row { grid-template-columns: 40px 1fr 1fr 250px; }
.head { padding: 0 0 6px 0; font-family: var(--rwb-mono); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--rwb-sec); }
.row { padding: 6px 0; border-top: 1px solid var(--rwb-rule); }
.idx { font-family: var(--rwb-mono); font-size: 14px; color: var(--rwb-dim); }
.rt { font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--rwb-txt); }
.ag { font-size: 15px; line-height: 1.3; color: var(--rwb-lilac); }
.chap { font-size: 13px; line-height: 1.3; color: var(--rwb-sec); }
</style>
