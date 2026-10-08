<script setup lang="ts">
// v4, глава 7, слайд 53 «Итог»: выводы доклада крупными строками, по главам 2–6 плана v4 (plan/slides-plan.ru.md).
// Каждая строка повторяет тезис своей главы; новых утверждений здесь нет.
// reveal: по строке на клик.
defineProps<{ reveal?: boolean }>()
const lines = [
  ['01', 'Доска держит проект', 'роли, продюсер и ревьюер, недели автономии'],
  ['02', 'Своя агентская среда не нужна', 'поверх Claude, Codex и локальных моделей'],
  ['03', 'Контекст агента — это профиль', 'скиллы как пакеты: зависимости, аудит, lockfile'],
  ['04', 'Процесс — это конфигурация', 'та же машинка ведёт и разработку, и кафе'],
  ['05', 'Оркестраторы договариваются сами', 'подписи и гранты между машинами; чужой агент — в своём рабочем месте'],
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
