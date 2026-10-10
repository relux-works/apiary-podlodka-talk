<script setup lang="ts">
// v5, вступление, слайд «Параллелизм в рантайме». Три ступени параллелизма, которые зал знает по рантаймам,
// и четвёртая карточка — цена. Источник: план v5 (plan/deck-v5-brief.md, диктовка Ивана 10.10);
// distributed actors — Swift Evolution SE-0336 (Swift 5.7), WWDC22 «Meet distributed actors in Swift»;
// закон Брукса — The Mythical Man-Month, 1975. Чисел на схеме нет.
// reveal: по карточке на клик.
defineProps<{ reveal?: boolean }>()
const steps = [
  { n: '01', h: 'Последовательное исполнение', t: 'Один поток команд и цикл событий на одном ядре: интерфейс, сервер, браузер. Далеко уезжает, пока хватает ядра.' },
  { n: '02', h: 'Потоки и ядра', t: 'Независимые задачи идут параллельно. Появляются общее состояние, гонки, дедлоки и граф зависимостей: что можно параллелить, а что ждёт.' },
  { n: '03', h: 'Распределённый параллелизм', t: 'Задача уходит в другой процесс или на другую машину: распределённые акторы, базы данных с лидером, арендой и эпохами.' },
  { n: '04', h: 'Цена', t: 'Проектирование, компетенции, отладка. Дорого всегда; зато правильно сделанный параллелизм даёт скорость и масштаб.', cls: 'orange' },
]
</script>
<template>
  <div class="cards cols-4 grow dg-par">
    <Step v-for="s in steps" :key="s.n" :on="reveal" as="div">
      <div class="card num" :class="s.cls" :data-num="s.n"><h2>{{ s.h }}</h2><p>{{ s.t }}</p></div>
    </Step>
  </div>
</template>
<style scoped>
.dg-par > div { display: grid; }
.dg-par .card { font-size: 16px; line-height: 1.35; padding-bottom: 34px; }
.dg-par .card h2 { font-size: 19px; margin-bottom: 8px; }
</style>
