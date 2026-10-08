<script setup lang="ts">
// v4.2, глава 6, слайд «Рою нужны чужие агенты» — проблема (в v4 — «Рой над одной средой»). Видение.
// Источники: пост §6 (ядро ОС с нуля требует многих людей, машин и общей среды; честными будут не все участники);
// apiary-docs v3.2.0, руководство §2.2 (инверсия: среда одна, агенты снаружи), статья §15 (агент злонамерен, взломан или
// отравлен инъекцией); контракт trust-and-isolation v1.3 §7 (удалённые агенты недоверенные; к донору ни соединений, ни команд);
// call-digest 2026-10-07 Q2. «Десятки тысяч субагентов» — оценка спикеров (бриф v4).
// v4.2: «Каталог задачи» (санбокс статьи) и стрелки «задачи» / «команды» убраны: ответ показывают два следующих слайда —
// рабочее место (DiagV4DWorkplace) и письмо в ящик (Boxes на слайде).
// reveal: цель и команда сразу; по кликам — среда проекта, чужие агенты с вопросом, два запрета.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const agents = [['чужая подписка', 50], ['чужой ключ API', 120], ['чужая локальная модель', 190]] as const
const risks = ['✕ пустить к себе — агент может быть взломан', '✕ командовать чужой машиной — риск для хозяина']
</script>
<template>
  <svg width="908" height="270" viewBox="0 0 908 270" aria-hidden="true">
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
      <rect x="246.75" y="0.75" width="340" height="176" rx="14" class="frame-hive" />
      <text x="262" y="22" class="t-head t-lilac">СРЕДА ПРОЕКТА · ОДНА</text>
      <rect x="262" y="36" width="309" height="54" rx="10" class="n-purple" />
      <text x="416" y="58" text-anchor="middle" class="t-big">Доверенный оркестратор</text>
      <text x="416" y="77" text-anchor="middle" class="t-on">режет цель на задачи</text>
      <rect x="262" y="106" width="309" height="54" rx="10" class="n" />
      <text x="416" y="128" text-anchor="middle" class="t-big">Код, доска, основная ветка</text>
      <text x="416" y="147" text-anchor="middle" class="t-sec">секреты проекта здесь</text>
    </Step>
    <!-- недоверенные внешние агенты и вопрос -->
    <Step :on="reveal">
      <text x="908" y="22" text-anchor="end" class="t-head t-sec">ВНЕШНИЕ АГЕНТЫ</text>
      <rect x="690.75" y="36.75" width="216.5" height="226" rx="14" class="frame" />
      <g v-for="a in agents" :key="a[0]">
        <rect x="702" :y="a[1]" width="194" height="54" rx="10" class="n-wait" />
        <text x="799" :y="a[1] + 22" text-anchor="middle" class="t-big">Недоверенный агент</text>
        <text x="799" :y="a[1] + 41" text-anchor="middle" class="t-sec">{{ a[0] }}</text>
      </g>
      <line x1="590" y1="63" x2="687" y2="63" class="e-dash" :marker-end="`url(#${id})`" />
      <text x="638" y="54" text-anchor="middle" class="t-cap t-orange">как?</text>
    </Step>
    <!-- два запрета -->
    <Step :on="reveal">
      <g v-for="(r, i) in risks" :key="r">
        <rect x="246.75" :y="196.75 + i * 38" width="428" height="28" rx="8" class="knock" />
        <text x="262" :y="216 + i * 38" class="t-cap t-orange">{{ r }}</text>
      </g>
    </Step>
  </svg>
</template>
