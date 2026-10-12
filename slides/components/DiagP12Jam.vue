<script setup lang="ts">
// Эпоха 3, второй слайд «один агент на всё» (v6: эпохи 3 и 4 объединены). Разные роли — спека и архитектура, тесты и правки,
// ревью — идут в одного агента на одной модели; заплатки — Ralph loop и цель — держат его в работе, но он сам же оценивает свой код.
// Источник: text/from-buckets-to-apiary.ru.md §1 «Пробки»; wiki posts/2026-09-24-agent-ecosystem.ru.md §1, §3;
// разговор спикеров 12.10 («и архитектура, и проектирование, и ревью, и тестирование — все решает та же модель, которая спеку составляла»).
//   reveal — классы задач, агент в заплатках, самопроверка — по кликам
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const click = computed(() => props.reveal ? '+1' : false)
const classes = [
  { y: 22, name: 'Спека и архитектура', need: 'нужна сильная модель' },
  { y: 110, name: 'Тесты и правки', need: 'хватит дешёвой' },
  { y: 198, name: 'Ревью', need: 'нужен взгляд со стороны' },
]
</script>
<template>
  <svg width="908" height="268" viewBox="0 0 908 268" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- классы задач -->
    <g v-click="click">
      <text x="0" y="14" class="t-head t-sec">ОДИН ПРОЕКТ · РАЗНЫЕ РОЛИ</text>
      <g v-for="c in classes" :key="c.y">
        <rect x="0" :y="c.y" width="232" height="58" rx="10" class="n" />
        <text x="116" :y="c.y + 25" text-anchor="middle" class="t-big">{{ c.name }}</text>
        <text x="116" :y="c.y + 44" text-anchor="middle" class="t-sec">{{ c.need }}</text>
      </g>
      <path d="M232,51 C268,51 272,126 305,132" class="e" :marker-end="`url(#${id})`" />
      <line x1="232" y1="139" x2="305" y2="139" class="e" :marker-end="`url(#${id})`" />
      <path d="M232,227 C268,227 272,152 305,146" class="e" :marker-end="`url(#${id})`" />
    </g>
    <!-- агент в заплатках -->
    <g v-click="click">
      <rect x="308" y="22" width="336" height="244" rx="14" class="n-wait" />
      <text x="324" y="44" class="t-head t-sec">RALPH LOOP · ПЕРЕЗАПУСК</text>
      <rect x="326" y="58" width="300" height="194" rx="12" class="frame" />
      <text x="342" y="82" class="t-head t-sec">ЦЕЛЬ · ДЕРЖИТ НА ЗАДАЧЕ</text>
      <rect x="360" y="108" width="232" height="62" rx="10" class="n-purple" />
      <text x="476" y="134" text-anchor="middle" class="t-big">Один агент</text>
      <text x="476" y="154" text-anchor="middle" class="t-on">одна модель на всё</text>
      <path d="M430,170 V200 H522 V173" class="e" :marker-end="`url(#${id})`" />
      <text x="476" y="222" text-anchor="middle" class="t-cap t-sec">закапывается, теряет нить,</text>
      <text x="476" y="240" text-anchor="middle" class="t-cap t-sec">идёт в ту же стену</text>
    </g>
    <!-- самопроверка -->
    <g v-click="click">
      <line x1="592" y1="139" x2="705" y2="139" class="e" :marker-end="`url(#${id})`" />
      <text x="604" y="130" class="t-cap t-sec">«готово»</text>
      <rect x="708" y="96" width="200" height="86" rx="10" class="n-orange" />
      <text x="808" y="124" text-anchor="middle" class="t-big t-ink">Проверяет</text>
      <text x="808" y="143" text-anchor="middle" class="t-big t-ink">сам себя</text>
      <text x="808" y="165" text-anchor="middle" class="t-ink-sec">автор = ревьюер</text>
      <text x="708" y="214" class="t-cap t-sec">свои ошибки хуже всех</text>
      <text x="708" y="234" class="t-cap t-sec">видит та модель,</text>
      <text x="708" y="254" class="t-cap t-sec">которая их написала</text>
    </g>
  </svg>
</template>
