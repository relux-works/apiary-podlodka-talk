<script setup lang="ts">
// Слайд после «Снов», третий вход. Одна форма командных строк: keeper для человека, под ним curator (машина и хост сессий),
// в основании task-board (ядро). Источник: wiki decisions.md, 2026-09-27 «the command-line shape» (три входа; «beekeeping words
// stay in the apiary»; ядро без команд только для человека; keeper estop поверх curator session estop и board snapshot);
// curator-keeper spec/keeper.md DRAFT v0.5.1 — Names (решено 27.09), §7.2 (карта команд решена 27.09, детали предложены:
// up → curator run, park → curator session park, estop → curator session estop, hive list → реестр и curator session list),
// §7.3, §10.3 (estop снимает board snapshot с каждой доски), §10.5 (запуск паркуется директивой task-board spawn directive <RUN> park,
// без стрелки: её зовёт keeper, не хост); пост, раздел 4.2 «Три входа» (task-board вызывают агенты, хост сессий,
// таймер и keeper; ни одна команда ядра сессию не останавливает — раздел 4.3). Команды показаны без аргументов.
// Статус формы — «решено 27.09» в заголовке схемы; команды keeper — в спеке, предложено (пилюля в заголовке слайда).
// reveal: заголовок сразу; строка keeper, строка curator, строка task-board, полоса про пасечные слова — по клику.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const X0 = 160
const CW = 184
const PW = 172
const cx = (k: number) => X0 + k * CW + PW / 2
const rows = [
  { y: 26, name: 'keeper', sub: 'человек на пасеке', frame: 'frame-hive', pill: 'n-lilac', cmds: ['up', 'park', 'estop', 'hive list'] },
  { y: 104, name: 'curator', sub: 'машина и хост', frame: 'frame', pill: 'n', cmds: ['run', 'session park', 'session estop', 'session list'] },
]
const K = { y: 182 }
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <text x="0" y="13" class="t-head t-sec">КОМАНДНЫЕ СТРОКИ · ФОРМА РЕШЕНА 27.09 · ГЛАГОЛ ВЕЗДЕ ЗНАЧИТ ОДНО</text>
    <Step v-for="(r, ri) in rows" :key="r.name" :on="reveal">
      <template v-if="ri > 0">
        <line v-for="k in 4" :key="k" :x1="cx(k - 1)" y1="72" :x2="cx(k - 1)" y2="111" class="e" :marker-end="`url(#${id})`" />
      </template>
      <rect x="0.75" :y="r.y" width="906.5" height="56" rx="12" :class="r.frame" />
      <text x="16" :y="r.y + 25" class="t-cmd" :class="{ 't-lilac': ri === 0 }">{{ r.name }}</text>
      <text x="16" :y="r.y + 44" class="t-cap t-sec">{{ r.sub }}</text>
      <g v-for="(c, k) in r.cmds" :key="c">
        <rect :x="X0 + k * CW" :y="r.y + 10" :width="PW" height="36" rx="10" :class="r.pill" />
        <text :x="cx(k)" :y="r.y + 33" text-anchor="middle" :class="{ 't-ink': ri === 0 }">{{ c }}</text>
      </g>
    </Step>
    <!-- ядро -->
    <Step :on="reveal">
      <line :x1="cx(2)" y1="150" :x2="cx(2)" y2="189" class="e" :marker-end="`url(#${id})`" />
      <rect x="0.75" :y="K.y" width="906.5" height="56" rx="12" class="frame" />
      <text x="16" :y="K.y + 25" class="t-cmd">task-board</text>
      <text x="16" :y="K.y + 44" class="t-cap t-sec">ядро</text>
      <text :x="X0 + 4" :y="K.y + 25" class="t-cap">его вызывают агенты,</text>
      <text :x="X0 + 4" :y="K.y + 44" class="t-cap">хост, таймер и keeper</text>
      <rect :x="X0 + CW" :y="K.y + 10" :width="PW" height="36" rx="10" class="n" />
      <text :x="cx(1)" :y="K.y + 33" text-anchor="middle">spawn directive park</text>
      <rect :x="X0 + 2 * CW" :y="K.y + 10" :width="PW" height="36" rx="10" class="n" />
      <text :x="cx(2)" :y="K.y + 33" text-anchor="middle">board snapshot</text>
      <text :x="X0 + 3 * CW + 4" :y="K.y + 25" class="t-cap t-sec">ни одна команда ядра</text>
      <text :x="X0 + 3 * CW + 4" :y="K.y + 44" class="t-cap t-sec">сессию не останавливает</text>
    </Step>
    <!-- пасечные слова -->
    <Step :on="reveal">
      <rect x="0.75" y="252" width="906.5" height="47" rx="10" class="n-wait" />
      <text x="16" y="271" class="t-cap">Пасечные слова — только там, где их набирает человек: <tspan class="mono">keeper hive</tspan>, папка <tspan class="mono">~/apiary</tspan>, профиль <tspan class="mono">apiary</tspan></text>
      <text x="16" y="290" class="t-cap t-sec">Ядро, флаги, ключи и провайдеры говорят process, session, runtime: в <tspan class="mono">keeper.toml</tspan> ульи лежат в <tspan class="mono">[processes.*]</tspan></text>
    </Step>
  </svg>
</template>
<style scoped>
svg .t-cmd { font-size: 17px; font-weight: 500; }
</style>
