<script setup lang="ts">
// Мини-демо «Curator в терминале», сразу после «Curator — профиль проекта» (Иван, 13.10: «мини демо тоже кодом как до этого —
// которое показало бы будто сам терминал внутри слайда, установку куратор через brew, клонирование проекта из гита, а далее
// запуск этого проекта в агентской среде не переходя в директорию проекта но со всеми его скиллами и агентскими контекстами, но
// уже проверенными на уязвимости + с конкретным глобальным профилем (например relux), а далее скачиваем и запускаем другой проект
// (эфемерный — Wildfruits глобальный профиль и из его эфемерного внутреннего контура гитлаба сам проект — fruitmarket-iosapp)
// и его запускаем с другим профилем»).
// Команды сверены с ivan-curator 13.10 (curator v0.15.0-rc.5, launcher v0.3.0, curator-spec a0154285):
// - сегодня: brew install relux-works/tap/curator; curator profile install <git-url> --tag … --as <имя> (docs/second-operator.md
//   §2, §4; environments §9.1; строка «installed profile …» — cmd/curator/profile.go); у каждого профиля свои дома
//   ~/.curator/environments/<профиль>/<среда> (environments §7.4);
// - дизайн CIP-0002 (решение оператора 10.10, в коде нет, имена команд предложены): регистрация проекта, preview и approve его
//   контекстов — кандидаты из репозитория, в запуск идут только одобренные копии, родное обнаружение выключено; запуск с --project
//   из любого каталога. Место агента (codex, claude) в дизайне не задано — оставлено как в сегодняшнем curator run.
// «Эфемерного» понятия в Curator нет: временный GitLab заказчика — просто адрес клона. Вывод сокращён; адреса, версии и имена —
// пример, Wildfruits — вымышленный заказчик. Управление и часы — как у демо 1 (slides/demo/clock.ts, docs/demos.md).
import { computed } from 'vue'
import { useDemoClock } from '../demo/clock'

// ---- the script -----------------------------------------------------------------------------------------------------
type Seg = { t: string, c: string }
const s = (t: string, c = 'o'): Seg => ({ t, c })
interface Step { pane: 0 | 1, beat?: string, cmd: string, out: Seg[][] }
const STEPS: Step[] = [
  { pane: 0, beat: 'Ставим Curator из Homebrew', cmd: 'brew install relux-works/tap/curator', out: [
    [s('==> Fetching relux-works/tap/curator')],
    [s('==> Installing curator')],
    [s('✓ ', 'ok'), s('curator installed')],
  ] },
  { pane: 0, beat: 'Профиль компании relux — git-репозиторий, ставится как пакет', cmd: 'curator profile install git@github.com:relux-works/agent-profile.git --tag v1.4.0 --as relux', out: [
    [s('resolve   agent-profile v1.4.0 · 3 context modules · 4 skills · 2 MCP')],
    [s('audit     strict · signer relux-works ✓ · '), s('7/7 ok', 'ok')],
    [s('mcp-declaration github-mcp 1.2.0 stdio command=github-mcp')],
    [s('✓ ', 'ok'), s('installed profile relux (lock sha256:9f2c…e41)')],
  ] },
  { pane: 0, beat: 'Клонируем проект: в репозитории зашиты контексты агента', cmd: 'git clone git@github.com:relux-works/demo-app.git', out: [
    [s("Cloning into 'demo-app'... done.")],
  ] },
  { pane: 0, beat: 'Контексты проекта — только кандидаты: Curator проверяет и показывает их', cmd: 'curator project register demo-app && curator context preview demo-app', out: [
    [s('✓ ', 'ok'), s('registered demo-app (checkout c-7f3a2e)')],
    [s('  AGENTS.md               instructions      new')],
    [s('  Skillfile.json          6 skills          '), s('audit strict 6/6 ok', 'ok')],
    [s('  .mcp.json               jira-mcp · stdio  new')],
    [s('  .claude/skills/deploy   not in Skillfile  '), s('✕ unapproved', 'no')],
    [s('  permissions             no expansion')],
    [s('  review digest sha256:41d0…7ac')],
  ] },
  { pane: 0, cmd: 'curator context approve demo-app', out: [
    [s('✓ ', 'ok'), s('approved generation 1 · 4 items · sha256:41d0…7ac')],
  ] },
  { pane: 0, beat: 'Запуск из любого каталога: профиль relux и слой проекта', cmd: 'curator run codex --profile relux --project demo-app', out: [
    [s('curator-run: profile relux + project demo-app, generation 1')],
    [s('curator-run: home ~/.curator/environments/relux/codex_cli')],
    [s('curator-run: native discovery off · project context from approved copies')],
    [s('› ', 'p'), s('codex ready in ~/demo-app', 'c')],
  ] },
  { pane: 1, beat: 'Второй проект — заказчика Wildfruits, из его временного GitLab', cmd: 'curator profile install \\\n    git@gitlab.wildfruits.example:ai/profile.git \\\n    --tag v2.0.0 --as wildfruits', out: [
    [s('audit     strict · signer wildfruits ✓ · '), s('9/9 ok', 'ok')],
    [s('✓ ', 'ok'), s('installed profile wildfruits')],
  ] },
  { pane: 1, cmd: 'git clone \\\n    git@gitlab.wildfruits.example:mobile/fruitmarket-iosapp.git', out: [
    [s("Cloning into 'fruitmarket-iosapp'... done.")],
  ] },
  { pane: 1, cmd: 'curator project register fruitmarket-iosapp && \\\n    curator context approve fruitmarket-iosapp', out: [
    [s('✓ ', 'ok'), s('approved generation 1 · 7 items')],
  ] },
  { pane: 1, beat: 'Свой профиль и свой дом: контексты двух заказчиков не смешиваются', cmd: 'curator run claude --profile wildfruits \\\n    --project fruitmarket-iosapp', out: [
    [s('curator-run: wildfruits + fruitmarket-iosapp, generation 1')],
    [s('curator-run: home ~/.curator/environments/wildfruits/claude_code')],
    [s('› ', 'p'), s('claude ready in ~/fruitmarket-iosapp', 'c')],
  ] },
]

// ---- the timeline: typing, output lines, pauses ----------------------------------------------------------------------
const INTRO = 2500, CHAR = 24, LINE = 260, AFTER = 1100, BEAT = 1200, OUTRO = 7000
interface Row { at: number, pane: 0 | 1, segs: Seg[], cmd?: { text: string, start: number } }
const rows: Row[] = []
const BEATS: { at: number, text: string }[] = [{ at: 0, text: 'Curator в терминале: от установки до двух проектов с разными профилями' }]
let clock = INTRO
for (const st of STEPS) {
  if (st.beat) { BEATS.push({ at: clock, text: st.beat }); clock += BEAT }
  rows.push({ at: clock, pane: st.pane, segs: [], cmd: { text: st.cmd, start: clock } })
  clock += st.cmd.length * CHAR + 350
  for (const out of st.out) { rows.push({ at: clock, pane: st.pane, segs: out }); clock += LINE }
  clock += AFTER
}
const SPLIT = rows.find((r) => r.pane === 1)!.at - BEAT // the screen splits when the second project's beat begins
// after the split the first session is a short summary of itself, its lines short enough for the narrow pane
const SUMMARY: Seg[][] = [
  [s('~ $ ', 'p'), s('curator run codex --profile relux \\', 'c')],
  [s('    --project demo-app', 'c')],
  [s('profile relux + demo-app, generation 1')],
  [s('home …/environments/relux/codex_cli')],
  [s('native discovery off')],
  [s('context from approved copies only')],
  [s('› ', 'p'), s('codex ready in ~/demo-app', 'c')],
]
const DURATION = clock + OUTRO
BEATS.push({ at: clock, text: 'Два заказчика, два профиля, два дома: всё, что получил агент, прошло аудит' })

const { t } = useDemoClock('terminal', DURATION, BEATS.map((b) => b.at))

// ---- layout ---------------------------------------------------------------------------------------------------------
const W = 908, TOP = 44, H = 366, LH = 17
const FONT = 12.5, CW = FONT * 0.6 // JetBrains Mono advance: 0.6 em
const PANES = [{ x: 16, w: W - 32 }, { x: 16, w: 336 }, { x: 368, w: 524 }] // full width; then 40 % for the first session, 60 % for the second
const ROWS = Math.floor((H - 52) / LH)
// a long line wraps at the pane's width, as a terminal does
function wrap(segs: Seg[], cols: number): Seg[][] {
  const out: Seg[][] = [[]]
  let n = 0
  for (const g of segs) {
    let rest = g.t
    while (rest.length) {
      const take = rest.slice(0, cols - n)
      out[out.length - 1].push({ t: take, c: g.c })
      n += take.length
      rest = rest.slice(take.length)
      if (n >= cols && rest.length) { out.push([]); n = 0 }
    }
  }
  return out
}

const frame = computed(() => {
  const time = t.value
  const split = time >= SPLIT
  const panes = (split ? [1, 2] : [0]).map((p) => ({ ...PANES[p], lines: [] as Seg[][], cursor: null as null | { line: number, col: number } }))
  for (const [k, pane] of panes.entries()) {
    const which = split ? k : 0
    const cols = Math.floor((pane.w - 24) / CW)
    let lines: Seg[][] = []
    let cursor: null | { line: number, col: number } = null
    for (const r of rows) {
      if (r.at > time || r.pane !== which || (split && which === 0)) continue
      if (r.cmd) {
        const typed = r.cmd.text.slice(0, Math.max(0, Math.floor((time - r.cmd.start) / CHAR)))
        typed.split('\n').forEach((part, i) => lines.push(...wrap([s(i ? '' : '~ $ ', 'p'), s(part, 'c')], cols)))
        const last = lines[lines.length - 1].reduce((a, g) => a + g.t.length, 0)
        cursor = typed.length < r.cmd.text.length ? { line: lines.length - 1, col: last } : null
      } else {
        lines.push(...wrap(r.segs, cols))
        cursor = null
      }
    }
    if (split && which === 0) lines = SUMMARY.slice()
    // a prompt waits only between commands: not while a command still prints, not under a running agent
    const pending = rows.find((r) => r.pane === which && r.at > time)
    const printing = pending && !pending.cmd && lines.length > 0
    const agent = lines.length > 0 && lines[lines.length - 1][0]?.t === '› '
    if (!cursor && !printing && !agent) { lines.push([s('~ $ ', 'p')]); cursor = { line: lines.length - 1, col: 4 } }
    const rowsFit = ROWS - (split ? 1 : 0)
    const skip = Math.max(0, lines.length - rowsFit)
    pane.lines = lines.slice(skip)
    pane.cursor = cursor ? { line: cursor.line - skip, col: cursor.col } : null
  }
  return {
    split,
    panes,
    beat: [...BEATS].reverse().find((b) => b.at <= time)!.text,
  }
})
const HEADS = ['demo-app · профиль relux', 'fruitmarket-iosapp · профиль wildfruits']
</script>

<template>
  <svg class="demo-term demo-live" :data-demo-t="Math.round(t)" width="908" height="414" viewBox="0 0 908 414" aria-hidden="true">
    <text x="0" y="18" class="t-lab cap">{{ frame.beat }}</text>
    <rect x="0.75" :y="TOP + 0.75" :width="W - 1.5" :height="H - 1.5" rx="12" class="win" />
    <circle v-for="k in 3" :key="k" :cx="18 + (k - 1) * 16" :cy="TOP + 16" r="5" class="dot" />
    <text :x="W / 2" :y="TOP + 20" text-anchor="middle" class="title">zsh — ~</text>
    <line x1="0.75" :y1="TOP + 32" :x2="W - 0.75" :y2="TOP + 32" class="rule" />
    <g v-for="(p, k) in frame.panes" :key="k">
      <template v-if="frame.split">
        <rect :x="p.x - 6" :y="TOP + 42" :width="p.w + 12" :height="H - 52" rx="8" class="pane" />
        <text :x="p.x + 6" :y="TOP + 58" class="head">{{ HEADS[k] }}</text>
      </template>
      <text v-for="(line, i) in p.lines" :key="i" :x="p.x + 6" :y="TOP + 58 + (i + (frame.split ? 1 : 0)) * LH" class="mono"><tspan v-for="(g, j) in line" :key="j" :class="g.c">{{ g.t }}</tspan></text>
      <rect v-if="p.cursor" :x="p.x + 6 + p.cursor.col * CW" :y="TOP + 58 + (p.cursor.line + (frame.split ? 1 : 0)) * LH - 11" :width="CW" height="13" class="cursor" />
    </g>
  </svg>
</template>

<style scoped>
.demo-term text.cap { font-size: 18px; }
.demo-term .win { fill: #0E0E0E; stroke: var(--rwb-rule); stroke-width: 1.5; }
.demo-term .pane { fill: none; stroke: var(--rwb-rule); stroke-width: 1; }
.demo-term .dot { fill: var(--rwb-rule); }
.demo-term .rule { stroke: var(--rwb-rule); stroke-width: 1; }
.demo-term text.title { font-family: var(--rwb-mono); font-size: 12px; fill: var(--rwb-dim); }
.demo-term text.head { font-family: var(--rwb-mono); font-size: 12px; fill: var(--rwb-lilac); }
.demo-term text.mono { font-family: var(--rwb-mono); font-size: 12.5px; white-space: pre; }
.demo-term tspan.p { fill: var(--rwb-lilac); }
.demo-term tspan.c { fill: var(--rwb-txt); }
.demo-term tspan.o { fill: var(--rwb-sec); }
.demo-term tspan.ok { fill: var(--rwb-lime); }
.demo-term tspan.no { fill: var(--rwb-orange); }
.demo-term .cursor { fill: var(--rwb-txt); }
</style>
