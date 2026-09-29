<script setup lang="ts">
// Титул. image — карточка конференции на весь слайд (файл из public/); subline — строка, дорисованная поверх карточки под именем. Без image — текстовый титул темы.
// Один спикер: who + role. Несколько: speakers — [{ name, role }], колонками; \n в role (в двойных кавычках YAML) — перенос, компания отдельной строкой;
// about — строка под спикерами (чей проект, от чьего имени).
import { withBase } from '../utils/base'
withDefaults(defineProps<{ event?: string, who?: string, role?: string | string[], contacts?: string, logo?: boolean, image?: string, subline?: string, motif?: string, speakers?: { name: string, role?: string }[], about?: string }>(), { logo: true })
</script>
<template>
  <div class="slidev-layout rwb-cover" :class="{ 'has-image': !!image }">
    <img v-if="image" class="cover-img" :src="withBase(image)" alt="" />
    <div v-if="image && subline" class="subline">{{ subline }}</div>
    <Tag v-if="event && !image" :text="event" class="absolute left-9 top-8" />
    <slot />
    <div v-if="who" class="who">
      <div class="name">{{ who }}</div>
      <div v-for="(line, i) in (Array.isArray(role) ? role : role ? [role] : [])" :key="i">{{ line }}</div>
    </div>
    <div v-if="speakers && speakers.length" class="speakers">
      <div v-for="s in speakers" :key="s.name" class="sp">
        <div class="name">{{ s.name }}</div>
        <div v-if="s.role" class="role">{{ s.role }}</div>
      </div>
    </div>
    <p v-if="about" class="about">{{ about }}</p>
    <div v-if="contacts" class="contacts" :class="{ 'with-logo': logo !== false && !image }">{{ contacts }}</div>
    <Squares v-if="!image" set="statement" />
    <!-- после лесенки: справа вверху логотип перекрывал квадрат; на текстовом титуле он внизу слева -->
    <RwbLogo v-if="logo !== false && !image" class="rwb-cover-logo" />
  </div>
</template>
