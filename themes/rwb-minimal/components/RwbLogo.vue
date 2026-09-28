<script setup lang="ts">
import { useThemeLogo } from '../utils/logo'
withDefaults(defineProps<{ height?: number }>(), { height: 28 })
const { src, alt } = useThemeLogo()
</script>
<template><img v-if="src" :src="src" :alt="alt" :style="{ height: height + 'px', width: 'auto', opacity: 0.95 }" /></template>
