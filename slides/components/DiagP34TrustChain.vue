<script setup lang="ts">
// Слайд после плана 20, Curator: кому мы доверяем, когда ставим скилл. Новая схема.
// Источники: curator-spec v1.0.0-rc.13 protocol/registry.md §2 (подпись Ed25519 над каноническим JSON, ключи реестра
// закрепляются вне сети), §3 (запись аудита: имя, источник, коммит, content_sha256, статус; совпадение по хэшу
// содержимого), §4 (deny-wins: любой проверенный revoked блокирует), §5 (снапшоты, откат отвергается);
// profiles/manager.md §7 (pin оператора: хэш содержимого, кто, причина; pin не перебивает отзыв), §7.1 (по умолчанию
// аудит advisory, security_posture: hardened — одна настройка); protocol/environments.md §9.1 (установка профиля — аудит
// всегда strict; context-secret-material не снимается pin'ом); curator v0.15.0-rc.2 docs/cli.md (curator audit --publish),
// docs/script-interpreters.md (матрица контролей по ОС); wiki book/ru/06-curator.md (сервис реестра — в реализации,
// релизов нет; установка по подписанной записи и подписанный установщик, #94 — предложено).
// reveal: автор и аудитор (1), реестр (2), Curator и оператор (3), проект и профиль (4), следующий шаг (5), запуск (6).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const BW = 164, GAP = 22
const nx = (i: number) => i * (BW + GAP)
const nodes = [
  { t: 'Автор скилла', a: 'публикует тег', b: 'capabilities', f: 'n', sub: 't-sec', click: 1 },
  { t: 'Аудитор', a: 'curator audit', b: 'запись + sha256', f: 'n', sub: 't-sec', click: 1 },
  { t: 'Реестр', a: 'подпись Ed25519', b: 'журнал без отката', f: 'n-lilac', sub: 't-ink-sec', ink: true, click: 2 },
  { t: 'Curator на машине', a: 'ключи закреплены', b: 'revoked — стоп', f: 'n-purple', sub: 't-on', click: 3 },
  { t: 'Оператор', a: 'pin: хэш + причина', b: 'posture: hardened', f: 'n-lime', sub: 't-ink-sec', ink: true, click: 3 },
]
const users = [
  { x: 400, w: 240, t: 'Проект', a: 'аудит по умолчанию: advisory', b: 'hardened — одна настройка' },
  { x: 656, w: 252, t: 'Профиль агента', a: 'аудит всегда strict', b: 'секрет в контексте — стоп' },
]
</script>
<template>
  <svg width="908" height="254" viewBox="0 0 908 254" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-for="(n, i) in nodes" :key="n.t" v-click="reveal ? n.click : false">
      <line v-if="i > 0 && i < 4" :x1="nx(i) - GAP" :x2="nx(i) - 3" y1="37" y2="37" class="e" :marker-end="`url(#${id})`" />
      <line v-if="i === 4" :x1="nx(4)" :x2="nx(4) - GAP + 3" y1="37" y2="37" class="e" :marker-end="`url(#${id})`" />
      <rect :x="nx(i)" y="0" :width="BW" height="74" rx="10" :class="n.f" />
      <text :x="nx(i) + BW / 2" y="24" text-anchor="middle" class="t-big" :class="n.ink ? 't-ink' : ''">{{ n.t }}</text>
      <text :x="nx(i) + BW / 2" y="45" text-anchor="middle" :class="n.sub">{{ n.a }}</text>
      <text :x="nx(i) + BW / 2" y="63" text-anchor="middle" :class="n.sub">{{ n.b }}</text>
      <template v-if="i === 2">
        <text :x="nx(2)" y="96" class="t-cap t-sec">сервис: в работе,</text>
        <text :x="nx(2)" y="113" class="t-cap t-sec">без релиза</text>
      </template>
    </g>
    <!-- кто ставит -->
    <g v-click="reveal ? 4 : false">
      <path d="M630,74 C630,96 520,94 520,113" class="e" :marker-end="`url(#${id})`" />
      <path d="M660,74 C660,96 782,94 782,113" class="e" :marker-end="`url(#${id})`" />
      <g v-for="u in users" :key="u.t">
        <rect :x="u.x" y="116" :width="u.w" height="70" rx="10" class="n" />
        <text :x="u.x + 16" y="138" class="t-big">{{ u.t }}</text>
        <text :x="u.x + 16" y="158" class="t-sec">{{ u.a }}</text>
        <text :x="u.x + 16" y="176" class="t-sec">{{ u.b }}</text>
      </g>
    </g>
    <!-- следующий шаг -->
    <g v-click="reveal ? 5 : false">
      <rect x="0" y="116" width="356" height="70" rx="10" class="n-wait" />
      <text x="16" y="138" class="t-big">Дальше: установка по записи</text>
      <text x="16" y="158" class="t-sec">без долгого локального аудита</text>
      <text x="16" y="176" class="t-sec">и подписанный установщик</text>
    </g>
    <!-- запуск -->
    <g v-click="reveal ? 6 : false">
      <rect x="0" y="202" width="908" height="50" rx="10" class="n-wait" />
      <text x="16" y="222" class="t-cap">При запуске: без script-worker-v1 права команды — только декларация.</text>
      <text x="16" y="242" class="t-cap t-sec">С ним на Linux — Landlock, cgroup и netns; на macOS — только завершение процессов и лимиты.</text>
    </g>
  </svg>
</template>
