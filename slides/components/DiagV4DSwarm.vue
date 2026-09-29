<script setup lang="ts">
// v4, глава 6, слайд 50 «Рой над одной средой». Видение. Замена DiagP67WildBees для основного потока.
// Источники: пост §6 (проблема: ядро ОС с нуля требует многих людей, машин и общей среды; мост инструментов);
// apiary-docs v3.2.0, статья §1 (рабочая нода не может расширить задачу, изменить условия приёмки или продвинуть основную ветку),
// §3 (по сети только команды, вывод, хеши и подписи), §5 (санбокс задачи, агент не получает shell хоста), §12 (ёмкость любого
// происхождения); руководство §2.2 (инверсия: среда одна, агенты снаружи). «Десятки тысяч субагентов» — оценка спикеров (бриф v4).
// Каталога задачи (санбокса) пока нет — только в статье; говорится в заметках.
// reveal: цель и команда сразу; по кликам — среда, внешние агенты, удалённый тулчейн, нижняя строка.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const agents = [['чужая подписка', 50], ['чужой ключ API', 120], ['чужая локальная модель', 190]] as const
</script>
<template>
  <svg width="908" height="318" viewBox="0 0 908 318" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- цель больше команды -->
    <text x="0" y="22" class="t-head t-sec">ЦЕЛЬ</text>
    <rect x="0" y="36" width="210" height="62" rx="10" class="n-lime" />
    <text x="105" y="60" text-anchor="middle" class="t-big t-ink">Ядро ОС с нуля</text>
    <text x="105" y="81" text-anchor="middle" class="t-ink-sec">десятки тысяч субагентов</text>
    <rect x="0" y="116" width="210" height="62" rx="10" class="n" />
    <text x="105" y="140" text-anchor="middle" class="t-big">Одна команда</text>
    <text x="105" y="161" text-anchor="middle" class="t-sec">несколько подписок</text>
    <text x="0" y="206" class="t-cap t-orange">ёмкости одной команды мало</text>
    <!-- одна среда -->
    <Step :on="reveal">
      <rect x="246.75" y="0.75" width="340" height="262" rx="14" class="frame-hive" />
      <text x="262" y="22" class="t-head t-lilac">СРЕДА ПРОЕКТА · ОДНА</text>
      <rect x="262" y="36" width="309" height="54" rx="10" class="n-purple" />
      <text x="416" y="58" text-anchor="middle" class="t-big">Доверенный оркестратор</text>
      <text x="416" y="77" text-anchor="middle" class="t-on">режет цель на задачи</text>
      <rect x="262" y="106" width="309" height="54" rx="10" class="n" />
      <text x="416" y="128" text-anchor="middle" class="t-big">Доска и основная ветка</text>
      <text x="416" y="147" text-anchor="middle" class="t-sec">секреты проекта здесь</text>
      <rect x="262" y="176" width="309" height="62" rx="10" class="n-lilac" />
      <text x="416" y="200" text-anchor="middle" class="t-big t-ink">Каталог задачи</text>
      <text x="416" y="221" text-anchor="middle" class="t-ink-sec">сборка и тесты внутри</text>
    </Step>
    <!-- недоверенные внешние агенты -->
    <Step :on="reveal">
      <text x="908" y="22" text-anchor="end" class="t-head t-sec">ВНЕШНИЕ АГЕНТЫ</text>
      <rect x="690.75" y="36.75" width="216.5" height="226" rx="14" class="frame" />
      <g v-for="a in agents" :key="a[0]">
        <rect x="702" :y="a[1]" width="194" height="54" rx="10" class="n-wait" />
        <text x="799" :y="a[1] + 22" text-anchor="middle" class="t-big">Недоверенный агент</text>
        <text x="799" :y="a[1] + 41" text-anchor="middle" class="t-sec">{{ a[0] }}</text>
      </g>
      <line x1="571" y1="63" x2="687" y2="63" class="e" :marker-end="`url(#${id})`" />
      <text x="629" y="54" text-anchor="middle" class="t-cap t-sec">задачи</text>
    </Step>
    <!-- удалённый тулчейн -->
    <Step :on="reveal">
      <line x1="690" y1="207" x2="574" y2="207" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="629" y="198" text-anchor="middle" class="t-cap t-sec">команды</text>
      <text x="629" y="228" text-anchor="middle" class="t-cap t-sec">вывод →</text>
      <text x="908" y="286" text-anchor="end" class="t-cap t-sec">удалённый тулчейн: агент работает в нашей среде, не забирая код</text>
    </Step>
    <!-- граница -->
    <Step :on="reveal">
      <text x="0" y="310" class="t-cap">Внешний агент предлагает изменения, но не расширит задачу и не продвинет основную ветку.</text>
    </Step>
  </svg>
</template>
