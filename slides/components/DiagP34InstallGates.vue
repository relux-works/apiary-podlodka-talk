<script setup lang="ts">
// Слайд после плана 20, Curator: установка скилла как цепочка проверок. Новая схема в стиле DiagP12Landing.
// Источники: curator-spec v1.0.0-rc.13 profiles/manager.md §2 (планирование только на чтение, затем одна
// сериализованная публикация; «Package code MUST NOT execute during any phase»), §2.1 (девять фаз по порядку: разрешение
// и проверка снимка, манифест, замыкание, коллизии, system-зависимости, аудит и реестры, и только потом сборка),
// §2.5 (отказ сборки или проверки сохраняет установку байт в байт), §7 (хэш сырого дерева, канарейка, детекторы;
// отзыв блокирует всегда), §7.1 (по умолчанию posture permissive: аудит advisory; hardened — одна настройка);
// protocol/core.md §3 (код пакета не исполняется при разрешении, проверке, аудите и установке), §4, §4.4, §5
// (ровно одно из tag, branch, revision), §7 (одно имя — один коммит, цикл — ошибка), §10 (маркер: коммит и sha256);
// protocol/registry.md §4 (deny-wins: revoked блокирует); curator v0.15.0-rc.2 docs/cli.md (--strict-tags,
// status --check); живая проверка rc.2 в review 29.09 (postinstall из package.json не запустился).
// reveal: первый ряд ворот (1), второй ряд с публикацией и status (2), отказ и инвариант (3); 13.10 — по двое было мелко.
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const BW = 280, GAP = 34, BH = 72, Y2 = 106
const bx = (i: number) => (i % 3) * (BW + GAP)
const by = (i: number) => (i < 3 ? 0 : Y2)
const steps = [
  { t: 'Skillfile.json', a: 'имя, git и tag', b: 'одно из: tag, branch, revision', f: 'n', click: 1 },
  { t: 'Разрешение', a: 'tag → коммит, зависимости', b: 'одно имя — один коммит', f: 'n', click: 1 },
  { t: 'Проверка пакета', a: 'SKILL.md: name = объявленному', b: 'схема, пути, коллизии, git есть', f: 'n', click: 1 },
  { t: 'Аудит', a: 'хэш, канарейка, детекторы', b: 'отзыв в реестре — всегда стоп', f: 'n-orange', click: 2 },
  { t: 'Сборка', a: 'только если есть build', b: 'go-v1: vendored, без сети', f: 'n-wait', click: 2 },
  { t: 'Публикация', a: 'одна транзакция: контекст, шимы', b: 'маркер: коммит и sha256', f: 'n-lime', click: 2 },
]
const light = (f: string) => f === 'n-orange' || f === 'n-lime'
</script>
<template>
  <svg width="908" height="306" viewBox="0 0 908 306" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-for="(s, i) in steps" :key="s.t" v-click="reveal ? s.click : false">
      <line v-if="i % 3 > 0" :x1="bx(i) - GAP" :x2="bx(i) - 3" :y1="by(i) + 36" :y2="by(i) + 36" class="e" :marker-end="`url(#${id})`" />
      <path v-if="i === 3" :d="`M${bx(2) + BW / 2},${BH} V${BH + 17} H${BW / 2} V${Y2 - 3}`" class="e" :marker-end="`url(#${id})`" />
      <rect :x="bx(i)" :y="by(i)" :width="BW" :height="BH" rx="10" :class="s.f" />
      <text :x="bx(i) + 16" :y="by(i) + 25" class="t-big" :class="light(s.f) ? 't-ink' : ''">{{ s.t }}</text>
      <text :x="bx(i) + BW - 16" :y="by(i) + 25" text-anchor="end" :class="light(s.f) ? 't-ink-sec' : 't-sec'">{{ i + 1 }}</text>
      <text :x="bx(i) + 16" :y="by(i) + 46" :class="light(s.f) ? 't-ink-sec' : 't-sec'">{{ s.a }}</text>
      <text :x="bx(i) + 16" :y="by(i) + 64" :class="light(s.f) ? 't-ink-sec' : 't-sec'">{{ s.b }}</text>
    </g>
    <!-- после публикации -->
    <g v-click="reveal ? 2 : false">
      <line :x1="bx(5) + BW / 2" :y1="Y2 + BH" :x2="bx(5) + BW / 2" y2="199" class="e-dash" :marker-end="`url(#${id})`" />
      <rect :x="bx(5)" y="202" :width="BW" height="44" rx="10" class="n" />
      <text :x="bx(5) + 16" y="220">curator status --check</text>
      <text :x="bx(5) + 16" y="237" class="t-sec">ловит дрейф и сдвинутый тег</text>
    </g>
    <!-- отказ и инвариант -->
    <g v-click="reveal ? 3 : false">
      <text x="0" y="224" class="t-cap t-orange">✕ Отказ на любом шаге до публикации — на диске ничего не меняется</text>
      <rect x="0.75" y="256" width="906.5" height="49" rx="12" class="frame-hive" />
      <text x="16" y="277" class="t-big">Код пакета не исполняется ни при разрешении, ни при проверке, ни при аудите, ни при установке</text>
      <text x="16" y="296" class="t-cap t-sec">проверено на v0.15.0-rc.2: postinstall из package.json не запустился</text>
    </g>
  </svg>
</template>
