<script setup lang="ts">
// v4, глава 6, слайд 48 «Подпись важнее канала». Упрощённая версия DiagP67Envelope: без мультиподписи и FIDO.
// v4.2: права — подпись и грант (контракт trust-and-isolation v1.3 §3, §6); ключ у ключника, не у модели (§1 п. 1, §2);
// первыми — носители решения 07.10 (Matrix, XMPP), подпись едет в метаданных события (§6, решено).
// Источники: waggle spec/waggle.md DRAFT v5.2 §2 (провайдеры: local, NATS JetStream, IRC, XMPP, Matrix, Slack, Telegram, email),
// §3 (ключ сессии создаёт хост, заверяет ключ оператора), §4 (конверт: точные байты + подписи SSHSIG, реестр allowed_signers,
// проверка офлайн через ssh-keygen), §5 (coord просит или сообщает, решает получатель), §9 (провайдеры — недоверенные трубы).
// Реализации нет. reveal: автор и сообщение сразу; по кликам — транспорты, приёмная сторона.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const pipes = ['Matrix', 'XMPP', 'Slack', 'Telegram', 'IRC']
</script>
<template>
  <svg width="908" height="262" viewBox="0 0 908 262" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- автор -->
    <rect x="0" y="94" width="184" height="54" rx="10" class="n-purple" />
    <text x="92" y="116" text-anchor="middle" class="t-big">Оркестратор Ивана</text>
    <text x="92" y="135" text-anchor="middle" class="t-on">автор</text>
    <line x1="184" y1="121" x2="217" y2="121" class="e" :marker-end="`url(#${id})`" />
    <!-- сообщение -->
    <rect x="220.75" y="20.75" width="226" height="200" rx="14" class="frame-hive" />
    <text x="236" y="42" class="t-head t-lilac">СООБЩЕНИЕ</text>
    <rect x="236" y="56" width="196" height="62" rx="10" class="n" />
    <text x="334" y="80" text-anchor="middle" class="t-big">точные байты</text>
    <text x="334" y="101" text-anchor="middle" class="t-sec">«отдай модуль мне»</text>
    <rect x="236" y="134" width="196" height="62" rx="10" class="n-lilac" />
    <text x="334" y="158" text-anchor="middle" class="t-big t-ink">подпись автора</text>
    <text x="334" y="179" text-anchor="middle" class="t-ink-sec">ключ не у модели</text>
    <!-- любой транспорт -->
    <Step :on="reveal">
      <line x1="447" y1="121" x2="487" y2="121" class="e" :marker-end="`url(#${id})`" />
      <text x="490" y="15" class="t-head t-sec">ЛЮБОЙ ТРАНСПОРТ</text>
      <rect v-for="(p, i) in pipes" :key="p" x="490.75" :y="24.75 + i * 40" width="150" height="32" rx="8" class="n-wait" />
      <text v-for="(p, i) in pipes" :key="p + 't'" x="566" :y="46 + i * 40" text-anchor="middle" class="t-cap">{{ p }}</text>
      <text x="490" y="248" class="t-cap t-sec">возит байты, прав не даёт</text>
    </Step>
    <!-- приёмная сторона -->
    <Step :on="reveal">
      <line x1="641" y1="121" x2="677" y2="121" class="e" :marker-end="`url(#${id})`" />
      <rect x="680.75" y="20.75" width="226.5" height="200" rx="14" class="frame" />
      <text x="696" y="42" class="t-head t-sec">МАШИНА АЛЕКСЕЯ</text>
      <rect x="696" y="56" width="196" height="62" rx="10" class="n-lilac" />
      <text x="794" y="80" text-anchor="middle" class="t-big t-ink">проверка подписи</text>
      <text x="794" y="101" text-anchor="middle" class="t-ink-sec">ключ и грант</text>
      <line x1="794" y1="118" x2="794" y2="131" class="e" :marker-end="`url(#${id})`" />
      <rect x="696" y="134" width="196" height="62" rx="10" class="n-purple" />
      <text x="794" y="158" text-anchor="middle" class="t-big">Оркестратор Алексея</text>
      <text x="794" y="179" text-anchor="middle" class="t-on">решает сам</text>
    </Step>
  </svg>
</template>
