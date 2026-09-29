<script setup lang="ts">
// Status of a claim, as the plan's tone rule requires: what works today and what is vision
// are separated on the slide itself. Inline pill; put it after the title or next to an item.
//   today    — работает сегодня      decided  — решено
//   proposed — в спеке, предложено   vision   — видение       open — открыто
const props = defineProps<{ v: 'today' | 'decided' | 'proposed' | 'vision' | 'open', text?: string }>()
const LABEL = { today: 'работает сегодня', decided: 'решено', proposed: 'в спеке, предложено', vision: 'видение', open: 'открыто' }
</script>
<template><span class="rwb-status" :class="'st-' + props.v">{{ props.text || LABEL[props.v] }}</span></template>
<style>
.slidev-layout .rwb-status { display: inline-block; vertical-align: middle; font-family: var(--rwb-mono); font-size: 13px; font-weight: 400; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1; padding: 6px 10px 5px; border-radius: 999px; margin-left: 12px; white-space: nowrap; }
.slidev-layout .rwb-status.st-today { background: var(--rwb-lime); color: var(--rwb-ink); }
.slidev-layout .rwb-status.st-decided { background: var(--rwb-lilac); color: var(--rwb-ink); }
.slidev-layout .rwb-status.st-proposed { background: transparent; color: var(--rwb-lilac); box-shadow: inset 0 0 0 1.5px var(--rwb-lilac); }
.slidev-layout .rwb-status.st-vision { background: var(--rwb-purple); color: var(--rwb-txt); }
.slidev-layout .rwb-status.st-open { background: transparent; color: var(--rwb-sec); box-shadow: inset 0 0 0 1.5px var(--rwb-dim); }
.slidev-layout .card .rwb-status.st-open { color: var(--rwb-sec-card); box-shadow: inset 0 0 0 1.5px var(--rwb-sec-card); }
</style>
