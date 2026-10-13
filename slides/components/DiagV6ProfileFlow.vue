<script setup lang="ts">
// v6 (12.10), часть Ивана, «Curator — профиль проекта». Как контекст перетекает в агентский ран: профиль компании и манифест
// проекта → Curator проверяет и собирает профиль проекта → управляемый дом → запуск из любого каталога. Каталоги репозитория
// Curator не читает: скилл, подложенный туда в обход манифеста, в запуск не попадёт.
// Разговор спикеров 12.10 (Иван): проект объявляет скиллы и MCP; Curator «их проверяет… создает профиль специально для этого проекта,
// а потом смерджит этот профиль при необходимости» с профилем компании; «единая точка входа — это вот этот манифест»;
// запуск откуда угодно, «который вообще не смотрит ни на какие директории внутри репозитория»; «гибрид локального… и глобального».
// Источники: curator-spec v1.0.0-rc.13 protocol/environments.md §1, §1.3, §7.1, §9.4, §10.1 (профиль, lock, дома CLAUDE_CONFIG_DIR и
// CODEX_HOME, проверка дома перед запуском); curator README; бывшие DiagV4CProfile и DiagP34Profile.
// Сборка профиля проекта из манифеста и запуск без чтения каталогов репозитория — новый дизайн Ивана 12.10, статус в заметках слайда.
// 13.10, сверка с ivan-curator и curator-spec CIP-0002 (черновик): Skillfile объявляет только скиллы; результат — слой проекта поверх
// профиля в записи менеджера, а не новый «смердженный» профиль и не «hybrid» (это другое в Curator); файлы репозитория читаются
// только как кандидаты, в запуск идёт проверенная и одобренная копия, родное обнаружение агента выключено.
// reveal: входы (1), Curator (2), дом и запуск (3), каталоги репозитория не читаем (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const checks = ['lock: коммит и хэш', 'аудит и реестр', 'дифф и одобрение слоя']
</script>
<template>
  <svg width="908" height="288" viewBox="0 0 908 288" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <text x="0" y="14" class="t-head t-sec">ВХОД</text>
      <rect x="0" y="28" width="250" height="64" rx="10" class="n" />
      <text x="125" y="54" text-anchor="middle" class="t-big">Профиль компании</text>
      <text x="125" y="75" text-anchor="middle" class="t-sec">стандарты, общие скиллы</text>
      <rect x="0" y="108" width="250" height="64" rx="10" class="n" />
      <text x="125" y="134" text-anchor="middle" class="t-big">Контексты проекта</text>
      <text x="125" y="155" text-anchor="middle" class="t-sec">Skillfile, AGENTS.md, MCP</text>
    </Step>
    <Step :on="reveal">
      <path d="M250,60 C276,60 274,96 297,100" class="e" :marker-end="`url(#${id})`" />
      <path d="M250,140 C276,140 274,118 297,114" class="e" :marker-end="`url(#${id})`" />
      <rect x="300.75" y="0.75" width="290" height="216" rx="14" class="frame-hive" />
      <text x="316" y="24" class="t-head t-lilac">CURATOR</text>
      <g v-for="(c, i) in checks" :key="c">
        <rect x="316" :y="38 + i * 50" width="259" height="40" rx="8" class="n-lilac" />
        <text x="445.5" :y="63 + i * 50" text-anchor="middle" class="t-cap t-ink">{{ c }}</text>
      </g>
      <text x="316" y="200" class="t-cap t-sec">слой проекта поверх профиля</text>
    </Step>
    <Step :on="reveal">
      <line x1="591" y1="108" x2="625" y2="108" class="e" :marker-end="`url(#${id})`" />
      <rect x="628" y="28" width="280" height="76" rx="10" class="n" />
      <text x="768" y="56" text-anchor="middle" class="t-big">Управляемый дом</text>
      <text x="768" y="80" text-anchor="middle" class="t-sec">CLAUDE_CONFIG_DIR · CODEX_HOME</text>
      <line x1="768" y1="104" x2="768" y2="125" class="e" :marker-end="`url(#${id})`" />
      <rect x="628" y="128" width="280" height="76" rx="10" class="n-purple" />
      <text x="768" y="156" text-anchor="middle" class="t-big">Запуск из любого каталога</text>
      <text x="768" y="180" text-anchor="middle" class="t-on">curator run … --profile</text>
    </Step>
    <Step :on="reveal">
      <rect x="0" y="200" width="250" height="64" rx="10" class="n-wait" />
      <text x="125" y="226" text-anchor="middle" class="t-big">Каталоги репозитория</text>
      <text x="125" y="247" text-anchor="middle" class="t-sec">.claude, .agents, skills/</text>
      <rect x="0" y="270" width="590" height="18" class="knock" />
      <text x="0" y="282" class="t-cap t-orange">✕ в запуск напрямую не идут: только проверенная и одобренная копия</text>
    </Step>
  </svg>
</template>
