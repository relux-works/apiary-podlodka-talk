<script setup lang="ts">
// Слайд 37, рой над одной средой. Видение. Новая схема части 6.
// Источники: пост §6 «И ещё одно: рой над одной средой»; wiki naming.md (wild bees = external participants,
// работают над частью процесса по арендам и подписям); call-digest-2026-09-keeper-concept §3.1;
// apiary-docs v3.2.0 (статья §3 «Топология», руководство §2.2 «Инверсия: среда одна, агенты снаружи»):
// по сети идут только команды, вывод, хеши и подписи; учётные данные не покидают машину участника.
// Пример среды — сценарий руководства §1.5 (iOS-приложение с ядром на Rust, один Mac Studio с Xcode, ключами подписи и устройствами);
// что пчела не может — статья §1 и руководство §1.4 («не может расширить область задачи, изменить условия её приёмки или продвинуть основную ветку»).
// reveal: среда проекта сразу; по кликам — чужая ёмкость, любые среды, нижние строки.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const left = [['Подписка', 'остаток квоты ночью'], ['Ключ API', 'другой владелец'], ['Локальная модель', 'на своей машине']]
const right = [['Claude Code', 'чужая среда'], ['Codex', 'чужая среда'], ['Qwen', 'пришла и ушла']]
const ys = [44, 132, 220]
</script>
<template>
  <svg width="908" height="330" viewBox="0 0 908 330" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- одна среда -->
    <rect x="276.75" y="30.75" width="354.5" height="258" rx="14" class="frame-hive" />
    <text x="292" y="52" class="t-head t-lilac">СРЕДА ПРОЕКТА · ОДНА</text>
    <rect x="292" y="64" width="324" height="50" rx="10" class="n-purple" />
    <text x="454" y="85" text-anchor="middle" class="t-big">Доверенные оркестраторы</text>
    <text x="454" y="104" text-anchor="middle" class="t-on">аренды, задания, ревью</text>
    <rect x="292" y="128" width="154" height="50" rx="10" class="n-lime" />
    <text x="369" y="149" text-anchor="middle" class="t-big t-ink">Доска</text>
    <text x="369" y="168" text-anchor="middle" class="t-ink-sec">одна история</text>
    <rect x="462" y="128" width="154" height="50" rx="10" class="n" />
    <text x="539" y="149" text-anchor="middle" class="t-big">Основная ветка</text>
    <text x="539" y="168" text-anchor="middle" class="t-sec">одна голова</text>
    <rect x="292" y="192" width="324" height="50" rx="10" class="n" />
    <text x="454" y="213" text-anchor="middle" class="t-big">Сборка и проверки</text>
    <text x="454" y="232" text-anchor="middle" class="t-sec">Mac Studio: Xcode, ключи, устройства</text>
    <text x="292" y="270" class="t-cap t-sec">секреты проекта не покидают среду</text>
    <!-- дикие пчёлы: чужая ёмкость слева -->
    <Step :on="reveal">
      <text x="0" y="22" class="t-head t-sec">ЧУЖАЯ ЁМКОСТЬ</text>
      <g v-for="(b, i) in left" :key="b[0]">
        <rect x="0.75" :y="ys[i]" width="196" height="54" rx="10" class="n-wait" />
        <text x="99" :y="ys[i] + 22" text-anchor="middle" class="t-big">{{ b[0] }}</text>
        <text x="99" :y="ys[i] + 41" text-anchor="middle" class="t-sec">{{ b[1] }}</text>
        <line x1="198" :y1="ys[i] + 27" x2="273" :y2="ys[i] + 27" class="e-dash" :marker-end="`url(#${id})`" />
      </g>
    </Step>
    <!-- любые среды справа -->
    <Step :on="reveal">
      <text x="908" y="22" text-anchor="end" class="t-head t-sec">ЛЮБАЯ СРЕДА</text>
      <g v-for="(b, i) in right" :key="b[0]">
        <rect x="711.25" :y="ys[i]" width="196" height="54" rx="10" class="n-wait" />
        <text x="809" :y="ys[i] + 22" text-anchor="middle" class="t-big">{{ b[0] }}</text>
        <text x="809" :y="ys[i] + 41" text-anchor="middle" class="t-sec">{{ b[1] }}</text>
        <line x1="710" :y1="ys[i] + 27" x2="635" :y2="ys[i] + 27" class="e-dash" :marker-end="`url(#${id})`" />
      </g>
    </Step>
    <!-- граница пчелы и что идёт по сети -->
    <Step :on="reveal">
      <text x="0" y="306" class="t-cap t-sec">Внешний агент не расширяет задачу, не меняет условия приёмки и не двигает основную ветку.</text>
      <text x="0" y="326" class="t-cap t-sec">По сети идут только команды, их вывод, хеши и подписи.</text>
    </Step>
  </svg>
</template>
