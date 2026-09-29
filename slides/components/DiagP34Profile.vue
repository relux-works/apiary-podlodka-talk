<script setup lang="ts">
// Слайд 20, Curator: профиль превращается в управляемый дом, у каждого агента свой контекст. Новая схема.
// Строка «Скиллы» без «и их команды»: environments §9.4 — в ревизии 1 команды скиллов профиля внутри управляемого дома
// недоступны (сессия curator run наследует шимы текущего профиля машины); Decision 0016 — proposed, not adopted.
// Дома материализуют profile install/use/sync; env resolve только проверяет дом и выдаёт фрагмент (§9.1, §9.4, §10.1).
// Источники: curator-spec protocol/environments.md (rc; §1 профиль = корневой пакет + lock + оверлеи,
// §1.3 lock с коммитом или sha256 на каждого члена, §7.1 адаптеры CLAUDE_CONFIG_DIR и CODEX_HOME,
// §10.1 env resolve и фрагмент запуска); техническая записка гл. 06; text/from-buckets-to-apiary.ru.md гл. 4 «Проблема», 4.1.
// reveal: как было (1), профиль (2), дома (3), сессии (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const items = ['Корневые инструкции', 'Скиллы', 'MCP-серверы']
const homes = [
  { y: 110, h: 'Дом Claude Code', v: 'CLAUDE_CONFIG_DIR', f: 'CLAUDE.md · skills/' },
  { y: 208, h: 'Дом Codex', v: 'CODEX_HOME', f: 'AGENTS.md · skills/' },
]
</script>
<template>
  <svg width="908" height="294" viewBox="0 0 908 294" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-click="reveal ? 1 : false">
      <text x="0" y="14" class="t-head t-orange">КАК БЫЛО</text>
      <rect x="0" y="26" width="440" height="56" rx="10" class="n-wait" />
      <text x="16" y="49" class="t-big">Глобально: ~/.claude, ~/.codex</text>
      <text x="16" y="69" class="t-sec">видят все агенты машины</text>
      <rect x="468" y="26" width="440" height="56" rx="10" class="n-wait" />
      <text x="484" y="49" class="t-big">В проекте: .claude/skills</text>
      <text x="484" y="69" class="t-sec">скиллы ревьюера подхватит оркестратор</text>
    </g>
    <g v-click="reveal ? 2 : false">
      <rect x="0.75" y="100" width="298.5" height="190" rx="14" class="frame-hive" />
      <text x="16" y="122" class="t-head t-lilac">ПРОФИЛЬ «REVIEWER»</text>
      <g v-for="(it, i) in items" :key="it">
        <rect x="16" :y="134 + i * 44" width="268" height="36" rx="8" class="n" />
        <text x="150" :y="157 + i * 44" text-anchor="middle" class="t-big">{{ it }}</text>
      </g>
      <text x="16" y="276" class="t-sec">lock: коммит и sha256</text>
    </g>
    <g v-click="reveal ? 3 : false">
      <path d="M300,182 C356,182 360,149 417,149" class="e" :marker-end="`url(#${id})`" />
      <path d="M300,208 C356,208 360,247 417,247" class="e" :marker-end="`url(#${id})`" />
      <text x="312" y="200" class="t-sec">собирает дома</text>
      <g v-for="h in homes" :key="h.y">
        <rect x="420" :y="h.y" width="240" height="78" rx="10" class="n" />
        <text x="540" :y="h.y + 24" text-anchor="middle" class="t-big">{{ h.h }}</text>
        <text x="540" :y="h.y + 44" text-anchor="middle" class="t-sec">{{ h.v }}</text>
        <text x="540" :y="h.y + 63" text-anchor="middle" class="t-sec">{{ h.f }}</text>
      </g>
    </g>
    <g v-click="reveal ? 4 : false">
      <g v-for="h in homes" :key="h.y">
        <line x1="660" :y1="h.y + 39" x2="697" :y2="h.y + 39" class="e" :marker-end="`url(#${id})`" />
        <rect x="700" :y="h.y + 10" width="208" height="58" rx="10" class="n-purple" />
        <text x="804" :y="h.y + 34" text-anchor="middle" class="t-big">Сессия ревьюера</text>
        <text x="804" :y="h.y + 54" text-anchor="middle" class="t-on">видит только профиль</text>
      </g>
    </g>
  </svg>
</template>
