<script setup lang="ts">
// v4.2, глава 6, слайд «Рабочее место — пользователь на нашей машине». Решено 07.10, не построено.
// Источники: контракт trust-and-isolation v1.3 §1 п. 3 (ядро — песочница; пользователь ОС на агента, решено), §5 (файрвол по UID:
// только брокер и прокси сетевого профиля), §7 (рабочее место удалённого: SSH по закреплённому ключу, authorized_keys с restrict
// и принудительной командой исполнителя инструментов; соединение только к нашему хосту и только для инструментов; задачи —
// подписанными письмами через брокера и ящик; к донору ни соединений, ни команд); wiki session-host/architecture.ru.md §7.9;
// call-digest 2026-10-07 C3, C9, C19, Q2; сиквенс remote-workplace-attach.
// Защита машины донора (выключить родные инструменты его среды) — открыто, только в заметках.
// reveal: две машины и рабочее место сразу; по кликам — SSH к нам, файрвол к брокеру и прокси, запрет обратного направления.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- машина донора -->
    <rect x="0.75" y="0.75" width="220" height="250" rx="14" class="frame" />
    <text x="16" y="22" class="t-head t-sec">МАШИНА ДОНОРА</text>
    <rect x="16" y="68" width="189" height="62" rx="10" class="n" />
    <text x="110.5" y="92" text-anchor="middle" class="t-big">Хозяин машины</text>
    <text x="110.5" y="113" text-anchor="middle" class="t-sec">отдаёт квоту</text>
    <rect x="16" y="142" width="189" height="62" rx="10" class="n-wait" />
    <text x="110.5" y="166" text-anchor="middle" class="t-big">Среда агента</text>
    <text x="110.5" y="187" text-anchor="middle" class="t-sec">модель думает здесь</text>
    <text x="16" y="232" class="t-cap t-orange">недоверенная</text>
    <!-- наша машина и рабочее место -->
    <rect x="330.75" y="0.75" width="576.5" height="250" rx="14" class="frame-hive" />
    <text x="346" y="22" class="t-head t-lilac">НАША МАШИНА</text>
    <rect x="346.75" y="36.75" width="270" height="180" rx="12" class="frame" />
    <text x="362" y="58" class="t-head t-sec">РАБОЧЕЕ МЕСТО</text>
    <rect x="362" y="68" width="238" height="62" rx="10" class="n-purple" />
    <text x="481" y="92" text-anchor="middle" class="t-big">Пользователь ОС</text>
    <text x="481" y="113" text-anchor="middle" class="t-on">свой дом и свои права</text>
    <rect x="362" y="142" width="238" height="62" rx="10" class="n" />
    <text x="481" y="166" text-anchor="middle" class="t-big">Исполнитель</text>
    <text x="481" y="187" text-anchor="middle" class="t-sec">bash, git, файлы задачи</text>
    <!-- 1. SSH только к нам, только инструменты -->
    <Step :on="reveal">
      <line x1="205" y1="173" x2="343" y2="173" class="e" :marker-end="`url(#${id})`" />
      <text x="275" y="164" text-anchor="middle" class="t-cap">SSH</text>
      <text x="275" y="192" text-anchor="middle" class="t-cap t-sec">инструменты</text>
    </Step>
    <!-- 2. файрвол по пользователю: только брокер и прокси -->
    <Step :on="reveal">
      <line x1="617" y1="99" x2="647" y2="99" class="e" :marker-end="`url(#${id})`" />
      <line x1="617" y1="173" x2="647" y2="173" class="e" :marker-end="`url(#${id})`" />
      <rect x="650" y="68" width="242" height="62" rx="10" class="n-lilac" />
      <text x="771" y="92" text-anchor="middle" class="t-big t-ink">Брокер и ящик</text>
      <text x="771" y="113" text-anchor="middle" class="t-ink-sec">задачи — письмами</text>
      <rect x="650" y="142" width="242" height="62" rx="10" class="n" />
      <text x="771" y="166" text-anchor="middle" class="t-big">Прокси сети</text>
      <text x="771" y="187" text-anchor="middle" class="t-sec">только разрешённое</text>
      <text x="346" y="240" class="t-cap t-sec">файрвол по пользователю: наружу только брокер и прокси</text>
    </Step>
    <!-- 3. к донору — ничего -->
    <Step :on="reveal">
      <path d="M481,217 L481,280 L110,280 L110,254" class="e-dash" :marker-end="`url(#${id})`" />
      <rect x="512" y="265" width="380" height="26" rx="8" class="knock" />
      <text x="702" y="283" text-anchor="middle" class="t-cap t-orange">✕ к донору — ни соединений, ни команд</text>
    </Step>
  </svg>
</template>
