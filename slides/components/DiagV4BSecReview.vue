<script setup lang="ts">
// Plan v4 slide 26: security review as dependent tasks on one board. New stage diagram (v4, 29.09).
// Sources: plan/deck-v4-brief.md §3 «Security review as problem → solution → demo 2» (the local uncensored model
// first; Claude refuses a security review with no prior review; then Claude and Codex concurrently; merge; the human
// decides); text/from-buckets-to-apiary.ru.md ch. 3 «Возвращаясь к ревью безопасности»; notes/discussions.ru.md 27.09.
// reveal: step 1 local review (1), Claude and Codex (2), merge (3), human (4).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
</script>
<template>
  <svg width="908" height="272" viewBox="0 0 908 272" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <text x="0" y="14" class="t-head t-sec">ОДНА ДОСКА · ЗАВИСИМЫЕ ЗАДАЧИ</text>
    <rect x="0.75" y="26" width="702" height="244" rx="14" class="frame" />
    <Step :on="reveal">
      <text x="16" y="52" class="t-head t-lilac">ШАГ 1</text>
      <rect x="16" y="84" width="182" height="100" rx="10" class="n-lilac" />
      <text x="107" y="118" text-anchor="middle" class="t-big t-ink">Первичное ревью</text>
      <text x="107" y="140" text-anchor="middle" class="t-ink-sec">локальная модель</text>
      <text x="107" y="160" text-anchor="middle" class="t-ink-sec">без цензуры</text>
    </Step>
    <Step :on="reveal">
      <text x="248" y="52" class="t-head t-lilac">ШАГ 2 · ПАРАЛЛЕЛЬНО</text>
      <path d="M198,118 C224,118 222,95 245,95" class="e" :marker-end="`url(#${id})`" />
      <path d="M198,150 C224,150 222,175 245,175" class="e" :marker-end="`url(#${id})`" />
      <rect x="248" y="66" width="200" height="58" rx="10" class="n" />
      <text x="348" y="90" text-anchor="middle" class="t-big">Ревью Claude</text>
      <text x="348" y="110" text-anchor="middle" class="t-sec">по находкам шага 1</text>
      <rect x="248" y="146" width="200" height="58" rx="10" class="n" />
      <text x="348" y="170" text-anchor="middle" class="t-big">Ревью Codex</text>
      <text x="348" y="190" text-anchor="middle" class="t-sec">своя семья моделей</text>
      <text x="16" y="250" class="t-cap t-orange">Трюк: без первичного ревью Claude от секьюрити-ревью отказывается</text>
    </Step>
    <Step :on="reveal">
      <text x="498" y="52" class="t-head t-lilac">ШАГ 3</text>
      <path d="M448,95 C474,95 472,124 495,124" class="e" :marker-end="`url(#${id})`" />
      <path d="M448,175 C474,175 472,146 495,146" class="e" :marker-end="`url(#${id})`" />
      <rect x="498" y="106" width="188" height="58" rx="10" class="n-purple" />
      <text x="592" y="130" text-anchor="middle" class="t-big">Слияние находок</text>
      <text x="592" y="150" text-anchor="middle" class="t-on">map-reduce</text>
    </Step>
    <Step :on="reveal">
      <line x1="686" y1="135" x2="733" y2="135" class="e" :marker-end="`url(#${id})`" />
      <rect x="736" y="106" width="172" height="58" rx="10" class="n-lime" />
      <text x="822" y="130" text-anchor="middle" class="t-big t-ink">Человек</text>
      <text x="822" y="150" text-anchor="middle" class="t-ink-sec">только решает</text>
    </Step>
  </svg>
</template>
