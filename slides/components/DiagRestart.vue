<script setup lang="ts">
// Слайд 14, рестарт хоста: сегодня и в спеке. Сценическая версия restart-survival (claude-goal-runtime.md «The daemon owns
// the PTY master»: хост Claude не переживает рестарт менеджера, только Codex; codex-goal-runtime.md; agent-session-host
// spec/session-host.md DRAFT v0.3 §2.7, §5 «One host per node» — предложено, оператор ещё не принял, §14).
// Статусы в шапках панелей: слева — работает сегодня, справа — в спеке, предложено.
// reveal: левая панель сразу; итог слева, правая панель и итог справа — по клику.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
</script>
<template>
  <svg width="908" height="300" viewBox="0 0 908 300" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- сегодня -->
    <rect x="0.75" y="0.75" width="438" height="298" rx="14" class="frame" />
    <text x="18" y="26" class="t-head t-orange">PTY ДЕРЖИТ ДЕМОН</text>
    <rect x="252" y="11" width="170" height="22" rx="11" class="n-lime" />
    <text x="337" y="26" text-anchor="middle" class="t-head t-ink">РАБОТАЕТ СЕГОДНЯ</text>
    <rect x="18" y="48" width="220" height="130" rx="12" class="n" />
    <text x="128" y="74" text-anchor="middle" class="t-big">tb-sessiond</text>
    <rect x="38" y="94" width="180" height="60" rx="10" class="n-purple" />
    <text x="128" y="120" text-anchor="middle" class="t-big">Claude</text>
    <text x="128" y="139" text-anchor="middle" class="t-on">PTY master</text>
    <rect x="288" y="84" width="134" height="60" rx="10" class="n-purple" />
    <text x="355" y="110" text-anchor="middle" class="t-big">Codex</text>
    <text x="355" y="129" text-anchor="middle" class="t-on">app-server</text>
    <line x1="238" y1="114" x2="285" y2="114" class="e" :marker-end="`url(#${id})`" />
    <Step :on="reveal">
    <text x="18" y="204" class="t-cap">Рестарт хоста закрывает PTY:</text>
    <text x="18" y="224" class="t-cap">сессии Claude завершаются и потом</text>
    <text x="18" y="244" class="t-cap">возобновляются по --resume UUID.</text>
    <text x="18" y="270" class="t-cap t-sec">Codex подхватывается</text>
    <text x="18" y="290" class="t-cap t-sec">через thread/resume.</text>
    </Step>
    <!-- цель -->
    <Step :on="reveal">
    <rect x="468.75" y="0.75" width="438" height="298" rx="14" class="frame-hive" />
    <text x="486" y="26" class="t-head t-lime">ДЕРЖАТЕЛЬ НА СЕССИЮ</text>
    <rect x="690" y="11" width="200" height="22" rx="11" class="pill-prop" />
    <text x="790" y="26" text-anchor="middle" class="t-head t-lilac">В СПЕКЕ, ПРЕДЛОЖЕНО</text>
    <rect x="486" y="94" width="130" height="60" rx="10" class="n" />
    <text x="551" y="129" text-anchor="middle" class="t-big">Хост сессий</text>
    <rect x="660" y="48" width="230" height="150" rx="12" class="n-wait" />
    <text x="775" y="70" text-anchor="middle" class="t-sec">pty holder, tmux или ax</text>
    <rect x="680" y="84" width="190" height="44" rx="10" class="n-purple" />
    <text x="775" y="111" text-anchor="middle" class="t-big">Claude</text>
    <rect x="680" y="138" width="190" height="44" rx="10" class="n-purple" />
    <text x="775" y="165" text-anchor="middle" class="t-big">Codex</text>
    <line x1="616" y1="124" x2="657" y2="124" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <Step :on="reveal">
    <text x="486" y="222" class="t-cap">Терминалы живут дольше хоста:</text>
    <text x="486" y="242" class="t-cap">перезапущенный хост их подхватывает.</text>
    <text x="486" y="262" class="t-cap">Человек подключается через держатель.</text>
    <text x="486" y="286" class="t-cap t-sec">create · attach · inject · observe</text>
    </Step>
  </svg>
</template>
<style scoped>
svg .pill-prop { fill: none; stroke: var(--rwb-lilac); stroke-width: 1.5; }
</style>
