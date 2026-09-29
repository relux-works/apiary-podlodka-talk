<script setup lang="ts">
// v4, слайд 36: профиль — новая единица контекста. Простая картинка вместо DiagP34Profile (та — в запасе).
// Профиль: корневые инструкции, скиллы, MCP-серверы и инструменты (команды скиллов), закреплённые в lock;
// оркестратор стартует с профилем своей роли в Claude Code или Codex, субагенты — с профилем своей роли.
// Источники: curator-spec v1.0.0-rc.13 protocol/environments.md §1, §1.3, §7.1, §9.4; curator README (v0.15.0-rc.2);
// curator-playbook spec DRAFT v4.8 §8.1 (каждый запуск — с профилем своей роли, решено 25.09);
// wiki decisions.md 2026-09-28 (привязка роль → профиль в ~/.curator/models.toml, spawn --profile).
// reveal: профиль (1), оркестратор стартует с профилем (2), субагенты со своими профилями (3).
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const items = ['Инструкции', 'Скиллы', 'MCP-серверы', 'Инструменты']
const workers = [
  { y: 20, t: 'Разработчик', h: 'Codex', p: 'профиль developer' },
  { y: 176, t: 'Ревьюер', h: 'Claude Code', p: 'профиль reviewer' },
]
</script>
<template>
  <svg width="908" height="290" viewBox="0 0 908 290" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step :on="reveal">
      <rect x="0.75" y="0.75" width="298.5" height="288.5" rx="14" class="frame-hive" />
      <text x="16" y="24" class="t-head t-lilac">ПРОФИЛЬ</text>
      <g v-for="(it, i) in items" :key="it">
        <rect x="16" :y="38 + i * 54" width="268" height="44" rx="10" class="n" />
        <text x="150" :y="66 + i * 54" text-anchor="middle" class="t-lab">{{ it }}</text>
      </g>
      <text x="16" y="276" class="t-sec">lock: коммит и хэш</text>
    </Step>
    <Step :on="reveal">
      <line x1="300" y1="145" x2="357" y2="145" class="e" :marker-end="`url(#${id})`" />
      <rect x="360" y="96" width="238" height="98" rx="12" class="n-purple" />
      <text x="479" y="128" text-anchor="middle" class="t-lab">Оркестратор</text>
      <text x="479" y="152" text-anchor="middle" class="t-on">Claude Code или Codex</text>
      <text x="479" y="174" text-anchor="middle" class="t-on">профиль orchestrator</text>
      <text x="479" y="224" text-anchor="middle" class="t-cap t-sec">среда стартует с профилем</text>
    </Step>
    <Step :on="reveal">
      <path d="M598,125 C630,125 628,62 657,62" class="e" :marker-end="`url(#${id})`" />
      <path d="M598,165 C630,165 628,218 657,218" class="e" :marker-end="`url(#${id})`" />
      <g v-for="w in workers" :key="w.t">
        <rect x="660" :y="w.y" width="248" height="84" rx="10" class="n" />
        <text x="784" :y="w.y + 28" text-anchor="middle" class="t-lab">{{ w.t }}</text>
        <text x="784" :y="w.y + 50" text-anchor="middle" class="t-sec">{{ w.h }}</text>
        <text x="784" :y="w.y + 70" text-anchor="middle" class="t-lilac">{{ w.p }}</text>
      </g>
      <text x="784" y="140" text-anchor="middle" class="t-cap t-sec">субагент — с профилем</text>
      <text x="784" y="158" text-anchor="middle" class="t-cap t-sec">своей роли</text>
    </Step>
  </svg>
</template>
