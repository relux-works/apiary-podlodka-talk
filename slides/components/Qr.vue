<script setup lang="ts">
// A QR code for a public link on a slide (Ivan, 15.10: «сделай куары»). The matrix is computed from the url itself
// (qrcode, error correction M), so the slide source is the only place the link lives: change the url, the code follows.
// Black modules on a white tile with a two-module quiet zone: phones read it from the hall on the dark theme.
import { computed } from 'vue'
import QRCode from 'qrcode'

const props = withDefaults(defineProps<{ url: string, size?: number }>(), { size: 104 })
const QUIET = 2
const qr = computed(() => {
  const m = QRCode.create(props.url, { errorCorrectionLevel: 'M' }).modules
  let d = ''
  for (let r = 0; r < m.size; r++) for (let c = 0; c < m.size; c++) if (m.get(r, c)) d += `M${c + QUIET},${r + QUIET}h1v1h-1z`
  return { n: m.size + 2 * QUIET, d }
})
</script>

<template>
  <svg class="qr" :width="size" :height="size" :viewBox="`0 0 ${qr.n} ${qr.n}`" shape-rendering="crispEdges" role="img" :aria-label="url">
    <rect class="qr-tile" x="0" y="0" :width="qr.n" :height="qr.n" />
    <path class="qr-dot" :d="qr.d" />
  </svg>
</template>

<style scoped>
.qr { display: block; flex: none; border-radius: 6px; }
.qr-tile { fill: #fff; }
.qr-dot { fill: #000; }
</style>
