<script setup lang="ts">
// Мини-демо «Сборка запуска из профиля и проекта», после «Установка скилла — цепочка проверок» (Иван, 13.10: «визуализацию как
// мы создаем профиль из агентских контекстов проекта (скиллы, agents.md, mcp, и тд — все что прошито в репозитории проекта) мы
// все это берем, также берем профиль глобальный установленный (профиль тоже может распространятся через гит — профиль это тоже
// самое что корневая папка агента вроде ~/.codex но в своей именованной директории. далее мерж двух таких экстрагированных
// профилей, и обертка в кураторе которая позволяет запустить проект с таким гибридным профилем — где все агентские контексты
// прошли аудиты»).
// По принятому дизайну, сверено с ivan-curator 13.10:
// - профиль — git-репозиторий с agent-context.json; curator profile install: разрешение, lock («the lock is the identity»),
//   строгий аудит; дома профиля ~/.curator/environments/<профиль>/<среда> (environments §1.3, §4, §7.4, §9.1) — работает;
// - контексты проекта по CIP-0002 (решение оператора 10.10, черновик): файлы репозитория — недоверенные кандидаты; нормализация,
//   снимок в защищённое хранилище, поэлементный дифф с дайджестом, одобрение; исполняемое — через обычный аудит; слой проекта
//   ложится поверх lock профиля: одинаковые пины сливаются, конфликт — отказ, права только сужаются; итог — запись менеджера,
//   а не новый профиль; запуск с выключенным родным обнаружением.
// Слово «гибрид» не используем: в Curator так называются hybrid-скиллы (ivan-curator, 13.10). Имена файлов и чисел — пример.
// Управление и часы — как у демо 1 (slides/demo/clock.ts, docs/demos.md).
import { computed } from 'vue'
import { useDemoClock } from '../demo/clock'

// ---- beats ----------------------------------------------------------------------------------------------------------
const INTRO = 3500, B_PROFILE = INTRO, B_CAND = 10500, B_CHECK = 17500, B_COMPOSE = 26500, B_RUN = 34500, OUTRO = 8000
const DURATION = B_RUN + 7000 + OUTRO
const BEATS = [
  { at: 0, text: 'Из чего Curator собирает запуск агента' },
  { at: B_PROFILE, text: 'Профиль компании — git: свой корень агента, как ~/.codex, только с именем' },
  { at: B_CAND, text: 'Контексты из репозитория проекта — только кандидаты' },
  { at: B_CHECK, text: 'Проверка: аудит скиллов, дифф и одобрение, подложенное — мимо' },
  { at: B_COMPOSE, text: 'Слой проекта ложится поверх профиля: один пин на скилл, права не шире' },
  { at: B_RUN, text: 'curator run запускает агента только с одобренным составом' },
]
const { t } = useDemoClock('profile', DURATION, BEATS.map((b) => b.at))

// ---- layout ---------------------------------------------------------------------------------------------------------
const AX = 0, BX = 300, CX = 632, CHIP_W = 250, CHIP_H = 26, ROW = 34, Y0 = 100, CY0 = 198, CROW = 29
const files = [
  { k: 'agents', name: 'AGENTS.md', sub: 'инструкции', check: 'дифф ✓', ok: true },
  { k: 'skills', name: 'Skillfile.json', sub: '6 скиллов', check: 'аудит 6/6 ✓', ok: true },
  { k: 'mcp', name: '.mcp.json', sub: 'jira-mcp', check: 'дифф ✓', ok: true },
  { k: 'perm', name: '.claude/settings.json', sub: 'права', check: 'не шире ✓', ok: true },
  { k: 'rogue', name: '.claude/skills/ops', sub: 'вне манифеста', check: '✕ не одобрен', ok: false },
  { k: 'src', name: 'src/', sub: 'код проекта', check: '', ok: false },
]
const approved = files.filter((f) => f.ok)
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : (1 - Math.cos(Math.PI * x)) / 2)
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const RUN_CMD = 'curator run codex --profile relux --project demo-app'

const frame = computed(() => {
  const time = t.value
  const chips = files.map((f, i) => {
    const toB = f.k === 'src' ? 0 : ease((time - B_CAND - i * 450) / 900)
    const j = approved.indexOf(f)
    const toC = j < 0 ? 0 : ease((time - B_COMPOSE - 1200 - j * 500) / 900)
    const yA = Y0 + i * ROW, yC = CY0 + j * CROW
    return {
      ...f,
      x: toC > 0 ? lerp(BX, CX + 4, toC) : lerp(AX + 10, BX, toB),
      y: toC > 0 ? lerp(yA, yC, toC) : yA,
      checked: f.k !== 'src' && time >= B_CHECK + i * 700,
      inC: toC >= 1,
    }
  })
  const typed = RUN_CMD.slice(0, Math.max(0, Math.floor((time - B_RUN - 600) / 28)))
  return {
    beat: [...BEATS].reverse().find((b) => b.at <= time)!.text,
    profile: time >= B_PROFILE,
    profileLock: time >= B_PROFILE + 2200,
    profileLayer: ease((time - B_PROFILE - 3800) / 900),
    chips,
    merge: time >= B_COMPOSE + 4600,
    typed,
    agent: time >= B_RUN + 600 + RUN_CMD.length * 28 + 900,
  }
})
</script>

<template>
  <svg class="demo-profile demo-live" :data-demo-t="Math.round(t)" width="908" height="414" viewBox="0 0 908 414" aria-hidden="true">
    <text x="0" y="18" class="t-lab cap">{{ frame.beat }}</text>

    <!-- проект: файлы репозитория -->
    <rect x="0.75" y="44.75" width="268.5" height="268.5" rx="14" class="frame" />
    <text x="12" y="66" class="t-head t-sec">РЕПОЗИТОРИЙ DEMO-APP</text>
    <!-- Curator: допуск контекстов проекта -->
    <rect x="290.75" y="44.75" width="290.5" height="268.5" rx="14" class="frame-hive" />
    <text x="302" y="66" class="t-head t-lilac">CURATOR · ДОПУСК ПРОЕКТА</text>
    <!-- запуск: профиль и состав -->
    <rect x="620.75" y="44.75" width="286.5" height="268.5" rx="14" class="frame" />
    <text x="632" y="66" class="t-head t-sec">СОСТАВ ЗАПУСКА</text>

    <g v-if="frame.profile">
      <rect :x="CX" y="74" width="262" height="48" rx="8" class="n-lilac" />
      <text :x="CX + 10" y="93" class="mono t-ink">git …/agent-profile v1.4.0</text>
      <text :x="CX + 10" y="112" class="mono t-ink">~/.curator/environments/relux/</text>
      <text v-if="frame.profileLock" :x="CX" y="139" class="small t-lime">lock sha256:9f2c… · аудит strict · подпись ✓</text>
      <rect v-if="frame.profileLayer > 0" :x="CX" :y="lerp(74, 148, frame.profileLayer)" width="262" height="28" rx="7" class="n-purple" />
      <text v-if="frame.profileLayer >= 1" :x="CX + 10" y="166" class="small">слой профиля relux · 4 скилла · github-mcp</text>
    </g>

    <g v-for="c in frame.chips" :key="c.k">
      <rect :x="c.x" :y="c.y - 18" :width="CHIP_W" :height="CHIP_H" rx="7" :class="c.k === 'src' ? 'n-wait' : c.k === 'rogue' && c.checked ? 'chip-no' : 'n'" />
      <text :x="c.x + 10" :y="c.y" class="mono">{{ c.name }}</text>
      <text v-if="!c.checked || c.inC || c.k === 'src'" :x="c.x + CHIP_W - 10" :y="c.y" text-anchor="end" class="small t-sec">{{ c.sub }}</text>
      <text v-if="c.checked && !c.inC" :x="c.x + CHIP_W - 10" :y="c.y" text-anchor="end" class="small" :class="c.ok ? 't-lime' : 't-orange'">{{ c.check }}</text>
    </g>
    <text x="12" y="300" class="small t-sec">код — данные работы, не настройка</text>
    <text v-if="frame.chips[0].x > BX - 1" x="302" y="300" class="small t-sec">читаем как данные: ничего не исполняем</text>
    <text v-if="frame.merge" :x="CX" y="304" class="small t-lime">общий скилл — один пин · конфликт — отказ</text>

    <!-- запуск -->
    <rect x="0.75" y="326.75" width="580.5" height="40" rx="10" class="win" />
    <text x="14" y="352" class="mono"><tspan class="p">~ $ </tspan><tspan>{{ frame.typed }}</tspan></text>
    <line v-if="frame.agent" x1="581" y1="347" x2="617" y2="347" class="e" />
    <rect v-if="frame.agent" x="620.75" y="326.75" width="286.5" height="40" rx="10" class="n-lime" />
    <text v-if="frame.agent" x="634" y="345" class="t-cap t-ink">codex: только одобренный состав</text>
    <text v-if="frame.agent" x="634" y="360" class="small t-ink-sec">родное обнаружение выключено</text>
  </svg>
</template>

<style scoped>
.demo-profile text.cap { font-size: 18px; }
.demo-profile text.small { font-size: 12px; }
.demo-profile text.mono { font-family: var(--rwb-mono); font-size: 12px; fill: var(--rwb-txt); white-space: pre; }
.demo-profile text.mono.t-ink { fill: var(--rwb-ink); }
.demo-profile tspan.p { fill: var(--rwb-lilac); }
.demo-profile .win { fill: #0E0E0E; stroke: var(--rwb-rule); stroke-width: 1.5; }
.demo-profile .chip-no { fill: none; stroke: var(--rwb-orange); stroke-width: 1.5; }
</style>
