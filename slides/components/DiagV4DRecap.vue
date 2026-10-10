<script setup lang="ts">
// v4, глава 7, слайд 53 «Итог»: выводы доклада крупными строками, по главам 2–6 плана v4 (plan/slides-plan.ru.md).
// Каждая строка повторяет тезис своей главы; новых утверждений здесь нет.
// reveal: по строке на клик.
defineProps<{ reveal?: boolean }>()
const lines = [
  ['01', 'Доска задач держит проект', 'граф зависимостей, продюсер и ревьюер, недели автономии'],
  ['02', 'Слой над любой агентской средой', 'Claude, Codex и локальные модели; роутинг по политике'],
  ['03', 'Контекст агента — профиль', 'скиллы как пакеты: зависимости, аудит, lockfile'],
  ['04', 'Процесс — конфигурация', 'один оркестратор ведёт и разработку, и кафе'],
  ['05', 'Доверие между машинами', 'подписи и гранты; внешний агент — в рабочем месте, отдельном пользователе ОС'],
]
</script>
<template>
  <div class="dg-recap">
    <Step v-for="l in lines" :key="l[0]" :on="reveal" as="div">
      <div class="line"><span class="n">{{ l[0] }}</span><span class="h">{{ l[1] }}</span><span class="d">{{ l[2] }}</span></div>
    </Step>
  </div>
</template>
<style scoped>
.dg-recap { display: grid; margin-bottom: 16px; }
.line { display: grid; grid-template-columns: 44px 410px 1fr; align-items: baseline; column-gap: 16px; padding: 13px 0; border-top: 1px solid var(--rwb-rule); }
.dg-recap > div:first-child .line { border-top: 0; padding-top: 0; }
.n { font-family: var(--rwb-mono); font-size: 15px; color: var(--rwb-dim); }
.h { font-size: 22px; font-weight: 500; line-height: 1.2; color: var(--rwb-txt); }
.d { font-size: 16px; line-height: 1.35; color: var(--rwb-sec); }
</style>
