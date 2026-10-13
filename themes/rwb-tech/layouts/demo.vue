<script setup lang="ts">
// Бампер перед демо: метка «Демо N», крупный заголовок и подзаголовок из содержимого слайда.
// live — демо внутри слайда (docs/demos.md в деке): метка и заголовок в одну строку, под ними визуализация на всю
// ширину; из квадратов остаётся угловой оранжевый, чтобы не спорить с данными.
defineProps<{ tag?: string, num?: string, live?: boolean }>()
</script>
<template>
  <div class="slidev-layout rwb-demo" :class="{ live }">
    <Squares :set="live ? 'demo-live' : 'demo'" />
    <div v-if="num" class="num">{{ num }}</div>
    <slot />
    <RwbChrome kind="demo" :tag="tag" />
  </div>
</template>
