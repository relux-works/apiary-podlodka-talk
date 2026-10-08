<script setup lang="ts">
// v4.2, запас к главе 6: «Чужой агент входит в рой». Решено 07.10 (C8, C9), не построено.
// Источники: контракт trust-and-isolation v1.3 §2 (внешние личности: самоподписанный сертификат, закрепление ключа, запись допуска
// от корня), §7 (join: отпечаток по второму каналу; пакет учётных данных, зашифрованный ключом агента; рабочее место по желанию);
// wiki session-host/architecture.ru.md §7.9 «Первичное рукопожатие», «Защита от посредника»; call-digest 2026-10-07 C8, C9, Q6;
// сиквенсы external-agent-onboarding, remote-workplace-attach. Сокращено до 9 однострочных сообщений (сертификат самоподписанный; пакет зашифрован ключом агента); DNS (TXT, SSHFP) — только в заметках.
// reveal: по сообщению на клик.
const actors = [
  { id: 'x', label: 'Внешний агент', sub: 'своя пара ключей' },
  { id: 'op', label: 'Оператор', sub: 'человек', tone: 'lime' },
  { id: 't', label: 'Реестр', sub: 'ключи и гранты' },
  { id: 'k', label: 'Ключник', sub: 'корень', tone: 'purple' },
  { id: 'h', label: 'Наша машина', sub: 'рабочее место', tone: 'lilac' },
]
const steps = [
  { from: 'x', to: 'op', text: 'сертификат' },
  { from: 'op', to: 'x', text: 'отпечаток голосом', dashed: true },
  { from: 'op', to: 't', text: 'закрепить ключ' },
  { from: 'op', to: 'k', text: 'подписать допуск' },
  { from: 'op', to: 't', text: 'гранты: ящик, срок' },
  { from: 'op', to: 'x', text: 'шифрованный пакет', dashed: true, tone: 'lime' },
  { section: 'Рабочее место' },
  { from: 'op', to: 'h', text: 'пользователь ОС, его ключ в SSH' },
  { from: 'x', to: 'h', text: 'SSH к нам: только инструменты' },
  { from: 'x', to: 'op', text: 'подписанное «готов»' },
]
defineProps<{ reveal?: boolean }>()
</script>
<template><Seq :actors="actors" :steps="steps" :reveal="reveal" :row="25" /></template>
