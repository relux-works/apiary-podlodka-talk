<script setup lang="ts">
// Plan v4 slide 28: the launch policy is configured at runtime. New stage diagram (v4, 29.09).
// Sources: plan/deck-v4-brief.md §3 «Routing, NEW emphasis» (budgets, subscriptions and limits, overnight local-model
// windows, free promo weeks); wiki book/ru/04-modeli-i-dengi.md (models.toml: [allow] models and billing, [windows]
// "local/qwen3.6-27b" = "22:00-07:00"; narrowing applies at once, widening waits for confirmation — decided; commands
// not written yet); curator-model-router spec/model-routing.md §1 (admission today: provider limits, schedule windows)
// and R2 (the router picks only among admitted candidates). The promo week is the speakers' example, not a spec item.
// reveal: the four inputs one by one (1–4), the policy (5), the outcomes (6).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const inputs = [
  { y: 0, h: 'Бюджет', s: 'сколько можно потратить' },
  { y: 76, h: 'Подписки и лимиты', s: 'что осталось на неделе' },
  { y: 152, h: 'Ночное окно', s: 'локальная модель 22:00–07:00' },
  { y: 228, h: 'Промо-неделя', s: 'новая модель бесплатно' },
]
</script>
<template>
  <svg width="908" height="290" viewBox="0 0 908 290" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <Step v-for="i in inputs" :key="i.y" :on="reveal">
      <rect x="0" :y="i.y" width="260" height="60" rx="10" class="n" />
      <text x="18" :y="i.y + 25" class="t-big">{{ i.h }}</text>
      <text x="18" :y="i.y + 46" class="t-sec">{{ i.s }}</text>
    </Step>
    <Step :on="reveal">
      <path d="M260,30 C300,30 296,120 327,126" class="e" :marker-end="`url(#${id})`" />
      <path d="M260,106 C292,106 296,134 327,138" class="e" :marker-end="`url(#${id})`" />
      <path d="M260,182 C292,182 296,154 327,150" class="e" :marker-end="`url(#${id})`" />
      <path d="M260,258 C300,258 296,168 327,162" class="e" :marker-end="`url(#${id})`" />
      <rect x="330" y="92" width="236" height="104" rx="12" class="n-purple" />
      <text x="448" y="132" text-anchor="middle" class="t-lab">Политика запуска</text>
      <text x="448" y="156" text-anchor="middle" class="t-on">правится на ходу,</text>
      <text x="448" y="176" text-anchor="middle" class="t-on">без релиза</text>
    </Step>
    <Step :on="reveal">
      <path d="M566,126 C600,126 598,86 625,86" class="e" :marker-end="`url(#${id})`" />
      <path d="M566,162 C600,162 598,202 625,202" class="e" :marker-end="`url(#${id})`" />
      <rect x="628" y="56" width="280" height="60" rx="10" class="n-lilac" />
      <text x="768" y="81" text-anchor="middle" class="t-big t-ink">Трудное — сильной модели</text>
      <text x="768" y="101" text-anchor="middle" class="t-ink-sec">в пределах лимитов</text>
      <rect x="628" y="172" width="280" height="60" rx="10" class="n" />
      <text x="768" y="197" text-anchor="middle" class="t-big">Мелочь — дешёвой</text>
      <text x="768" y="217" text-anchor="middle" class="t-sec">или локальной ночью</text>
    </Step>
  </svg>
</template>
