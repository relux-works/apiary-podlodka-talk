<script setup lang="ts">
// Slide «Модели меняются каждую неделю» (plan v4, 29): the role writes needs, the operator binds, the registry keeps one
// line per model; plugins per harness and per vendor. Simplified for v4 (29.09): three rows per column, a plugin strip.
// Sources: tech note ch. 04 (require/prefer, needs vocabulary, operator files in ~/.curator/, never committed);
// wiki decisions.md 2026-09-27 (@orchestrator binding) and «2026-09-28 call» (Opus 5.5 orchestrator, Sonnet 5.5 worker,
// claude-sonnet-5-5 with alias sonnet; Luna not an orchestrator); research/call-digest-2026-09-28.md §2 (Muse 1.4 in
// one or two weeks); skill-agents-management SKILL.md (agentic-system plugins claude-code, codex, qwen-code,
// gemini-cli, antigravity, muse; vendor plugins anthropic, openai, alibaba, google, conditional local-models).
// Model facts as of 29.09; update before the talk. Muse 1.4 is not registered — dashed.
// reveal: needs (1), binding (2), registry (3), plugins (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const cols = [
  { x: 0, h: 'Роль пишет потребности', s: 'коммитится в проект', rows: ['рассуждение', 'окно контекста', 'ревьюер другого издателя'] },
  { x: 314, h: 'Оператор привязывает', s: 'личный файл, не в git', rows: ['оркестратор → opus', 'воркер → sonnet', 'усилие выбирает оператор'] },
]
const models = [
  { id: 'claude-opus-5-5', s: 'оркестратор', cls: 'n-purple', sub: 't-on' },
  { id: 'claude-sonnet-5-5', s: 'воркер · с 28.09', cls: 'n-lime', sub: 't-ink-sec', ink: true },
  { id: 'gpt-6-luna', s: 'воркер, не оркестратор', cls: 'n', sub: 't-sec' },
  { id: 'Muse 1.4', s: 'ждём через 1–2 недели', cls: 'n-wait', sub: 't-sec' },
]
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step v-for="(c, ci) in cols" :key="c.x" :on="reveal">
      <rect :x="c.x + 0.75" y="0.75" width="278.5" height="240" rx="14" class="frame" />
      <text :x="c.x + 16" y="28" class="t-big">{{ c.h }}</text>
      <text :x="c.x + 16" y="48" class="t-sec">{{ c.s }}</text>
      <g v-for="(r, i) in c.rows" :key="r">
        <rect :x="c.x + 16" :y="62 + i * 56" width="248" height="46" rx="8" class="n" />
        <text :x="c.x + 30" :y="90 + i * 56" class="t-cap">{{ r }}</text>
      </g>
      <line v-if="ci > 0" :x1="c.x - 33" y1="120" :x2="c.x - 3" y2="120" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <Step :on="reveal">
      <line x1="595" y1="120" x2="625" y2="120" class="e" :marker-end="`url(#${id})`" />
      <rect x="628.75" y="0.75" width="278.5" height="240" rx="14" class="frame-hive" />
      <text x="644" y="28" class="t-big">Реестр моделей</text>
      <text x="644" y="48" class="t-sec">одна строка на модель</text>
      <g v-for="(m, i) in models" :key="m.id">
        <rect x="644" :y="60 + i * 44" width="248" height="40" rx="8" :class="m.cls" />
        <text x="658" :y="76 + i * 44" :class="m.ink ? 't-ink' : ''">{{ m.id }}</text>
        <text x="658" :y="93 + i * 44" class="t-cap" :class="m.sub">{{ m.s }}</text>
      </g>
    </Step>
    <Step :on="reveal">
      <rect x="0" y="254" width="908" height="44" rx="10" class="n-wait" />
      <text x="16" y="281" class="t-cap"><tspan class="t-lilac">Плагины</tspan> · на среду: claude-code, codex, muse, antigravity · на вендора: anthropic, openai, google, local-models</text>
    </Step>
  </svg>
</template>
