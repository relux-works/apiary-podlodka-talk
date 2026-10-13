<script setup lang="ts">
// Слайд после плана 20, Curator: скилл с командой — что из пакета куда попадает на машине. Новая схема.
// Источники: curator-spec v1.0.0-rc.13 protocol/core.md §3 (SKILL.md, name = объявленному; код пакета не исполняется),
// §3.1 (корни контекста; scripts/ — только без команд; tests, README и прочее отбрасываются; runtime_roots и build_roots
// вне контекста), §4 (agent-skill.json, схемы 1–8), §4.1 (script и system; нет system-команды — установка падает
// с подсказкой; имя команды = имя шима), §4.2 (build: закрытый драйвер go-v1), §4.3 (capabilities — поверхность аудита,
// не песочница, пока команда не выбрала script-worker-v1); profiles/manager.md §3 (контекст в .agents/skills/<name>/,
// шимы в .agents/bin/, runtime по имени и коммиту; build-команда идёт в кэш собранных артефактов);
// curator v0.15.0-rc.2 docs/authoring-cli-commands.md («Planned language drivers»: swift, rust, kotlin — резерв,
// «not admission»), docs/script-interpreters.md; живая проверка rc.2 в review 29.09 (.temp/review/F-curator-diagrams.md F.0).
// reveal: пакет (1), манифест (2), куда попадает (3), шим (4), capabilities (5).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const pkg = [
  { y: 34, a: 'SKILL.md · references/', b: 'инструкции и материалы', cls: 'n', sub: 't-sec' },
  { y: 90, a: 'scripts/', b: 'runtime_roots', cls: 'n', sub: 't-sec' },
  { y: 146, a: 'src/ · vendor/', b: 'build_roots, Go', cls: 'n', sub: 't-sec' },
  { y: 202, a: 'tests/ · README · Makefile', b: '✕ отброшено на любой глубине', cls: 'n-wait', sub: 't-cap t-orange' },
]
const kinds = [
  { y: 106, k: 'script', s: 'файл из scripts/' },
  { y: 148, k: 'system', s: 'git: нет на машине — отказ' },
  { y: 190, k: 'build', s: 'go-v1: без сети, без хуков' },
]
</script>
<template>
  <svg width="908" height="322" viewBox="0 0 908 322" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- пакет -->
    <g v-click="reveal ? 1 : false">
      <rect x="0.75" y="0.75" width="250" height="260" rx="14" class="frame" />
      <text x="16" y="22" class="t-head t-sec">ПАКЕТ · GIT, ТЕГ v1.2.0</text>
      <g v-for="p in pkg" :key="p.y">
        <rect x="16" :y="p.y" width="218" height="46" rx="8" :class="p.cls" />
        <text x="30" :y="p.y + 19">{{ p.a }}</text>
        <text x="30" :y="p.y + 37" :class="p.sub">{{ p.b }}</text>
      </g>
    </g>
    <!-- манифест -->
    <g v-click="reveal ? 2 : false">
      <path d="M250,113 C276,113 272,125 297,125" class="e" :marker-end="`url(#${id})`" />
      <path d="M250,169 C278,169 270,209 297,209" class="e" :marker-end="`url(#${id})`" />
      <rect x="300" y="70" width="270" height="30" rx="8" class="n-lilac" />
      <text x="314" y="90" class="t-ink">agent-skill.json<tspan class="t-ink-sec"> · что объявлено</tspan></text>
      <g v-for="k in kinds" :key="k.k">
        <rect x="300" :y="k.y" width="270" height="38" rx="8" class="n" />
        <text x="314" :y="k.y + 16" class="t-lilac">{{ k.k }}</text>
        <text x="314" :y="k.y + 32" class="t-sec">{{ k.s }}</text>
      </g>
      <rect x="300" y="234" width="270" height="26" rx="8" class="n-wait" />
      <text x="435" y="252" text-anchor="middle" class="t-sec">swift, rust, kotlin: резерв</text>
    </g>
    <!-- куда попадает -->
    <g v-click="reveal ? 3 : false">
      <rect x="620.75" y="0.75" width="286.5" height="260" rx="14" class="frame" />
      <text x="636" y="22" class="t-head t-sec">МАШИНА</text>
      <line x1="250" y1="57" x2="633" y2="57" class="e" :marker-end="`url(#${id})`" />
      <text x="435" y="50" text-anchor="middle" class="t-cap t-sec">только контекст</text>
      <rect x="636" y="35" width="256" height="44" rx="8" class="n-lime" />
      <text x="650" y="54" class="t-ink">.agents/skills/&lt;name&gt;/</text>
      <text x="650" y="71" class="t-ink-sec">это читает агент</text>
      <path d="M570,125 C602,125 601,172 633,172" class="e" :marker-end="`url(#${id})`" />
      <rect x="636" y="150" width="256" height="44" rx="8" class="n" />
      <text x="650" y="169">runtime/&lt;skill&gt;/&lt;commit&gt;</text>
      <text x="650" y="186" class="t-sec">в ~/.curator: runtime_roots</text>
      <path d="M570,209 C602,209 601,228 633,228" class="e" :marker-end="`url(#${id})`" />
      <rect x="636" y="206" width="256" height="44" rx="8" class="n" />
      <text x="650" y="225">cache/build/go-v1/&lt;hash&gt;</text>
      <text x="650" y="242" class="t-sec">бинарь, собранный Curator</text>
    </g>
    <!-- шим -->
    <g v-click="reveal ? 4 : false">
      <rect x="636" y="92" width="256" height="44" rx="8" class="n-purple" />
      <text x="650" y="111">.agents/bin/&lt;cmd&gt;</text>
      <text x="650" y="128" class="t-on">шим: агент зовёт команду</text>
      <path d="M892,114 H900 V228 H895" class="e-dash" :marker-end="`url(#${id})`" />
      <path d="M900,172 H895" class="e-dash" :marker-end="`url(#${id})`" />
    </g>
    <!-- capabilities -->
    <g v-click="reveal ? 5 : false">
      <rect x="0" y="274" width="908" height="46" rx="10" class="n-wait" />
      <text x="16" y="293">capabilities: network · filesystem · exec · secrets · env_read</text>
      <text x="16" y="312" class="t-cap t-sec">объявлены для аудита; запуск ограничивают, только если скилл выбрал script-worker-v1</text>
    </g>
  </svg>
</template>
