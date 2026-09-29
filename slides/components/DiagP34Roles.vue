<script setup lang="ts">
// Слайд 23, модели меняются каждую неделю: роль пишет потребности, оператор привязывает, реестр держит строку на модель.
// Новая схема. Источники: техническая записка гл. 04 (require/prefer, словарь потребностей, effort выбирает оператор,
// проект задаёт нижнюю планку; файлы оператора в ~/.curator/); wiki decisions.md 2026-09-27 (привязка @orchestrator)
// и «2026-09-28 call» (Opus 5.5 — оркестратор, Sonnet 5.5 — воркер, зарегистрирован как claude-sonnet-5-5 с алиасом
// sonnet; Luna не оркестратор); research/call-digest-2026-09-28.md §2 (Muse 1.4 ждём через одну-две недели);
// skill-agents-management SKILL.md (алиасы opus, sonnet, luna). Факты о моделях — на 29.09, обновить к дате доклада.
// reveal: потребности (1), привязка (2), реестр (3).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const cols = [
  { x: 0, h: 'Потребности роли', s: 'коммитятся в проект', rows: ['рассуждение', 'окно контекста', 'скорость: pp, tg, ttft', 'не того издателя, что автор'] },
  { x: 314, h: 'Привязка оператора', s: '~/.curator/models.toml', rows: ['@orchestrator → opus', 'воркер → sonnet', 'усилие выбирает оператор', 'проект: нижняя планка'] },
]
const models = [
  { id: 'claude-opus-5-5', s: 'алиас opus · оркестратор', cls: 'n-purple', sub: 't-on' },
  { id: 'claude-sonnet-5-5', s: 'алиас sonnet · с 28.09', cls: 'n-lime', sub: 't-ink-sec', ink: true },
  { id: 'gpt-6-luna', s: 'воркер, не оркестратор', cls: 'n', sub: 't-sec' },
  { id: 'Muse 1.4', s: 'ждём через 1–2 недели', cls: 'n-wait', sub: 't-sec' },
]
</script>
<template>
  <svg width="908" height="266" viewBox="0 0 908 266" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-for="(c, ci) in cols" :key="c.x" v-click="reveal ? ci + 1 : false">
      <rect :x="c.x + 0.75" y="0.75" width="278.5" height="262" rx="14" class="frame" />
      <text :x="c.x + 16" y="28" class="t-big">{{ c.h }}</text>
      <text :x="c.x + 16" y="48" class="t-sec">{{ c.s }}</text>
      <g v-for="(r, i) in c.rows" :key="r">
        <rect :x="c.x + 16" :y="62 + i * 48" width="248" height="42" rx="8" class="n" />
        <text :x="c.x + 30" :y="88 + i * 48" class="t-cap">{{ r }}</text>
      </g>
      <line v-if="ci > 0" :x1="c.x - 33" y1="134" :x2="c.x - 3" y2="134" class="e" :marker-end="`url(#${id})`" />
    </g>
    <g v-click="reveal ? 3 : false">
      <line x1="595" y1="134" x2="625" y2="134" class="e" :marker-end="`url(#${id})`" />
      <rect x="628.75" y="0.75" width="278.5" height="262" rx="14" class="frame-hive" />
      <text x="644" y="28" class="t-big">Реестр моделей</text>
      <text x="644" y="48" class="t-sec">одна строка на модель</text>
      <g v-for="(m, i) in models" :key="m.id">
        <rect x="644" :y="62 + i * 48" width="248" height="42" rx="8" :class="m.cls" />
        <text x="658" :y="79 + i * 48" :class="m.ink ? 't-ink' : ''">{{ m.id }}</text>
        <text x="658" :y="97 + i * 48" class="t-cap" :class="m.sub">{{ m.s }}</text>
      </g>
    </g>
  </svg>
</template>
