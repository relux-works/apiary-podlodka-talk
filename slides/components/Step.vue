<script setup lang="ts">
// One click step inside a stage diagram. <Step :on="reveal"> … </Step> shows its content on
// the next click when `on` is true and renders it plainly otherwise, so a diagram supports
// `reveal` without duplicating its markup. `as="g"` (default) inside SVG, `as="div"` in HTML.
// Steps reveal in document order; write the SVG in reading order.
withDefaults(defineProps<{ on?: boolean, as?: string }>(), { on: false, as: 'g' })
</script>
<template>
  <component :is="as" v-if="on" v-click><slot /></component>
  <component :is="as" v-else><slot /></component>
</template>
