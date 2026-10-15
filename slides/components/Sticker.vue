<script setup lang="ts">
// A die-cut sticker drawn in code for «Кто мы и зачем рассказываем» (Ivan, 16.10: stickers with Peter Parker and
// Spider-Man on the slide where we say who we are: at work in big tech by day, our own projects after hours).
// No outside images: plain SVG with a white die-cut edge and a soft shadow. The slide sets the place and the tilt.
import { useId } from 'vue'

withDefaults(defineProps<{ kind: 'parker' | 'spider', size?: number }>(), { size: 150 })
const id = useId() // gradients and the clip are per instance: the overview and print modes render a slide twice
const INK = '#1d1d1f'

// Spider-Man: the mask, its web from the nose (spokes, and rings sagging towards the nose) and the lenses
const HEAD = 'M100 10C152 10 186 52 186 104C186 160 146 214 100 220C54 214 14 160 14 104C14 52 48 10 100 10Z'
const EYE = 'M91 124C74 128 44 121 34 99C28 85 32 70 46 68C67 66 87 89 91 124Z'
const WEB = (() => {
  const cx = 100, cy = 126, n = 16
  const pt = (r: number, a: number) => `${+(cx + r * Math.cos(a)).toFixed(1)},${+(cy + r * Math.sin(a)).toFixed(1)}`
  const at = Array.from({ length: n + 1 }, (_, i) => (i / n) * 2 * Math.PI - Math.PI / 2)
  let d = ''
  for (const a of at.slice(0, n)) d += `M${cx},${cy}L${pt(170, a)}`
  for (const r of [20, 40, 62, 86, 112, 140]) for (let i = 0; i < n; i++) d += `M${pt(r, at[i])}Q${pt(r * 0.84, (at[i] + at[i + 1]) / 2)} ${pt(r, at[i + 1])}`
  return d
})()

// Peter Parker: glasses, a blue shirt, and the suit under it with the spider on the chest
const TORSO = 'M26 212C26 190 44 176 78 170L122 170C156 176 174 190 174 212C174 219 169 224 162 224L38 224C31 224 26 219 26 212Z'
const HAIR = 'M52 112C44 60 70 36 104 36C138 36 160 60 150 108C146 92 138 80 120 74C104 70 82 72 66 82C58 88 54 98 52 112Z'
const SKIN = '#f3c9a5', BROWN = '#6b4127', SHIRT = '#7da6dc', RED = '#d8232a'
</script>

<template>
  <svg class="sticker" :class="kind" :width="size" :height="Math.round(size * 244 / 220)" viewBox="-10 -8 220 244" role="img" :aria-label="kind === 'spider' ? 'Человек-паук' : 'Питер Паркер'">
    <template v-if="kind === 'spider'">
      <defs>
        <radialGradient :id="`${id}-red`" cx="42%" cy="34%" r="70%"><stop offset="0" stop-color="#f0473b" /><stop offset="1" stop-color="#b8141c" /></radialGradient>
        <linearGradient :id="`${id}-lens`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" /><stop offset="1" stop-color="#dfe6ee" /></linearGradient>
        <clipPath :id="`${id}-head`"><path :d="HEAD" /></clipPath>
      </defs>
      <path :d="HEAD" fill="#fff" stroke="#fff" stroke-width="16" stroke-linejoin="round" />
      <path :d="HEAD" :fill="`url(#${id}-red)`" :stroke="INK" stroke-width="3" />
      <path :d="WEB" :clip-path="`url(#${id}-head)`" fill="none" :stroke="INK" stroke-width="2" stroke-opacity="0.85" />
      <g :fill="`url(#${id}-lens)`" :stroke="INK" stroke-width="8" stroke-linejoin="round">
        <path :d="EYE" />
        <path :d="EYE" transform="translate(200 0) scale(-1 1)" />
      </g>
    </template>
    <template v-else>
      <g fill="#fff" stroke="#fff" stroke-width="16" stroke-linejoin="round">
        <path :d="TORSO" /><rect x="84" y="140" width="32" height="40" />
        <ellipse cx="54" cy="112" rx="9" ry="13" /><ellipse cx="146" cy="112" rx="9" ry="13" />
        <ellipse cx="100" cy="104" rx="47" ry="56" /><path :d="HAIR" />
      </g>
      <path :d="TORSO" :fill="SHIRT" :stroke="INK" stroke-width="3" stroke-linejoin="round" />
      <path d="M74 172L90 224L110 224L126 172Z" :fill="RED" :stroke="INK" stroke-width="3" stroke-linejoin="round" />
      <g transform="translate(100 197) scale(1.2)" :stroke="INK" stroke-linecap="round" fill="none" stroke-width="2.2">
        <ellipse cx="0" cy="-3" rx="3.2" ry="4" :fill="INK" stroke="none" /><ellipse cx="0" cy="5" rx="4" ry="6" :fill="INK" stroke="none" />
        <path d="M-3 -2L-10 -9L-12 -16M3 -2L10 -9L12 -16M-3 1L-12 -1M3 1L12 -1M-3 5L-11 9L-13 15M3 5L11 9L13 15M-2 8L-7 16L-7 22M2 8L7 16L7 22" />
      </g>
      <path d="M74 170L90 165L86 192ZM126 170L110 165L114 192Z" fill="#eaf1fb" :stroke="INK" stroke-width="3" stroke-linejoin="round" />
      <rect x="86" y="140" width="28" height="34" rx="6" :fill="SKIN" :stroke="INK" stroke-width="3" />
      <ellipse cx="54" cy="112" rx="9" ry="13" :fill="SKIN" :stroke="INK" stroke-width="3" />
      <ellipse cx="146" cy="112" rx="9" ry="13" :fill="SKIN" :stroke="INK" stroke-width="3" />
      <ellipse cx="100" cy="104" rx="47" ry="56" :fill="SKIN" :stroke="INK" stroke-width="3" />
      <path :d="HAIR" :fill="BROWN" :stroke="INK" stroke-width="3" stroke-linejoin="round" />
      <path d="M68 96Q78 90 90 94M110 94Q122 90 132 96" fill="none" :stroke="BROWN" stroke-width="4" stroke-linecap="round" />
      <g fill="rgba(255,255,255,0.28)" :stroke="INK" stroke-width="3.5">
        <rect x="64" y="101" width="32" height="24" rx="8" /><rect x="104" y="101" width="32" height="24" rx="8" />
      </g>
      <path d="M96 111Q100 107 104 111M64 109L55 106M136 109L145 106" fill="none" :stroke="INK" stroke-width="3" stroke-linecap="round" />
      <circle cx="80" cy="113" r="3.6" :fill="INK" /><circle cx="120" cy="113" r="3.6" :fill="INK" />
      <path d="M100 120Q95 130 101 133" fill="none" :stroke="INK" stroke-width="2.5" stroke-linecap="round" />
      <path d="M86 141Q100 151 114 141" fill="none" :stroke="INK" stroke-width="3" stroke-linecap="round" />
    </template>
  </svg>
</template>

<style scoped>
.sticker { display: block; flex: none; overflow: visible; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.4)); }
</style>
