<script setup lang="ts">
// Слайд 21, одна точка сборки запуска. Новая схема.
// Источники: curator-spec decision 0019 (fragment consumers and one construction site; в файле — proposed,
// оператор решил 23.09, wiki decisions.md); skill-agents-management SKILL.md («It builds plans; it does not execute»:
// Plan{Binary, Argv, Env, Stdin}, плагин на каждую среду); wiki README «How the planes fit» (три владельца процесса);
// text/from-buckets-to-apiary.ru.md гл. 4.2 (пример с --strict-mcp-config).
// 0019 §2: хост сессий получает готовый план и фрагмент не читает — поэтому стрелки от хоста в модуль нет.
// Статус (0019 «proposed — not adopted»; shipped-state: «the current LaunchRequest has no typed Curator context»):
// модуль и план — сегодня; каналы MCP и промпта в модуле — решено 23.09, в работе (roadmap M2).
// reveal: владельцы процессов (1), фрагмент и модуль (2), план (3).
// v4 (29.09): the «ПОЧЕМУ ТАК» box moved to the slide lead and the notes.
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const owners = [
  { y: 32, h: 'curator run', s: 'человек входит в сессию' },
  { y: 96, h: 'task-board spawn', s: 'отслеживаемые дети' },
  { y: 160, h: 'Хост сессий', s: 'получает готовый план' },
]
</script>
<template>
  <svg width="908" height="216" viewBox="0 0 908 216" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-click="reveal ? 1 : false">
      <g v-for="o in owners" :key="o.y">
        <rect x="0" :y="o.y" width="236" height="52" rx="10" class="n" />
        <text x="118" :y="o.y + 22" text-anchor="middle" class="t-big">{{ o.h }}</text>
        <text x="118" :y="o.y + 41" text-anchor="middle" class="t-sec">{{ o.s }}</text>
      </g>
    </g>
    <g v-click="reveal ? 2 : false">
      <rect x="320" y="0" width="268" height="44" rx="10" class="n-lilac" />
      <text x="454" y="27" text-anchor="middle" class="t-big t-ink">Фрагмент профиля Curator</text>
      <line x1="454" y1="44" x2="454" y2="61" class="e" :marker-end="`url(#${id})`" />
      <path d="M236,58 C282,58 280,108 317,110" class="e" :marker-end="`url(#${id})`" />
      <path d="M236,122 C282,122 280,132 317,134" class="e" :marker-end="`url(#${id})`" />
      <rect x="320" y="64" width="268" height="116" rx="10" class="n-purple" />
      <text x="454" y="90" text-anchor="middle" class="t-big">agents-management</text>
      <text x="454" y="112" text-anchor="middle" class="t-on">одна точка сборки</text>
      <text x="454" y="132" text-anchor="middle" class="t-on">реестр моделей</text>
      <text x="454" y="150" text-anchor="middle" class="t-on">плагин на каждую среду</text>
      <text x="454" y="168" text-anchor="middle" class="t-on">лимиты провайдеров</text>
    </g>
    <g v-click="reveal ? 3 : false">
      <line x1="588" y1="122" x2="665" y2="122" class="e" :marker-end="`url(#${id})`" />
      <rect x="668" y="64" width="240" height="116" rx="10" class="n" />
      <text x="788" y="90" text-anchor="middle" class="t-big">План запуска</text>
      <text x="788" y="112" text-anchor="middle" class="t-sec">binary · argv</text>
      <text x="788" y="130" text-anchor="middle" class="t-sec">env · stdin</text>
      <text x="788" y="154" text-anchor="middle" class="t-cap">значение, не процесс:</text>
      <text x="788" y="172" text-anchor="middle" class="t-cap">исполняет владелец</text>
    </g>
  </svg>
</template>
