<script setup lang="ts">
// Слайд 38, безопасность роя. Видение. Новая схема части 6.
// Источники: пост §6 (односторонний канал, ревью как безопасность, приёмы распределённых баз);
// call-digest-2026-09-keeper-concept §3.1 (односторонний канал к дикой пчеле);
// waggle DRAFT v5.2 §5 (ключ исполнителя не подпишет coord/cmd), §7 (эшелонированная защита от инъекций:
// типизированные тела, инспекторы, карантин по умолчанию для внешних отправителей), §11–12 (аренды, кворум);
// apiary-docs v3.2.0, статья §13 (независимость: домен владельца, семейство модели, тулчейн) и §16:
// P = q^k, q = p + (1 − p)(1 − d); при p = 0,1 и d = 0,7 — 0,37 / 0,14 / 0,05 для k = 1, 2, 3.
// Статья прямо называет это иллюстрацией того, что d влияет сильнее p, а не оценкой безопасности.
import { useId } from 'vue'
const id = useId()
const reviewers = [['Ревьюер · Claude', 'владелец X'], ['Ревьюер · GPT', 'владелец Y'], ['Ревьюер · Qwen', 'владелец Z']]
const odds = [['1 ревьюер', '0,37'], ['2 ревьюера', '0,14'], ['3 ревьюера', '0,05']]
</script>
<template>
  <svg width="908" height="336" viewBox="0 0 908 336" aria-hidden="true">
    <defs>
      <marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="id + 'l'" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <!-- односторонний канал -->
    <rect x="0" y="20" width="176" height="54" rx="10" class="n-purple" />
    <text x="88" y="42" text-anchor="middle" class="t-big">Оркестратор</text>
    <text x="88" y="61" text-anchor="middle" class="t-on">доверенный</text>
    <line x1="176" y1="38" x2="249" y2="38" class="e" :marker-end="`url(#${id})`" />
    <text x="184" y="30" class="t-cap t-sec">задание</text>
    <rect x="252.75" y="20.75" width="176" height="54" rx="10" class="n-wait" />
    <text x="341" y="42" text-anchor="middle" class="t-big">Дикая пчела</text>
    <text x="341" y="61" text-anchor="middle" class="t-sec">недоверенная</text>
    <line x1="252" y1="60" x2="180" y2="60" class="e-dash" />
    <text x="207" y="65" class="t-cap t-orange">✕</text>
    <text x="0" y="98" class="t-cap t-orange">указаний назад нет:</text>
    <text x="0" y="116" class="t-cap t-sec">вывод может нести инъекцию</text>
    <!-- работа читается как данные -->
    <line x1="341" y1="76" x2="341" y2="129" class="e-dash" :marker-end="`url(#${id})`" />
    <rect x="252" y="132" width="176" height="72" rx="10" class="n" />
    <text x="340" y="155" text-anchor="middle" class="t-big">Работа = данные</text>
    <text x="340" y="174" text-anchor="middle" class="t-sec">инспекторы</text>
    <text x="340" y="192" text-anchor="middle" class="t-sec">карантин</text>
    <!-- независимые ревьюеры -->
    <g v-for="(r, i) in reviewers" :key="r[0]">
      <rect x="494" :y="20 + i * 66" width="196" height="54" rx="10" class="n-lilac" />
      <text x="592" :y="42 + i * 66" text-anchor="middle" class="t-big t-ink">{{ r[0] }}</text>
      <text x="592" :y="61 + i * 66" text-anchor="middle" class="t-ink-sec">{{ r[1] }}</text>
      <path :d="`M428,168 C462,168 460,${47 + i * 66} 491,${47 + i * 66}`" class="e" :marker-end="`url(#${id})`" />
      <path :d="`M690,${47 + i * 66} C716,${47 + i * 66} 718,113 737,113`" class="e-lime" :marker-end="`url(#${id}l)`" />
    </g>
    <rect x="740" y="86" width="168" height="54" rx="10" class="n-lime" />
    <text x="824" y="108" text-anchor="middle" class="t-big t-ink">Интеграция</text>
    <text x="824" y="127" text-anchor="middle" class="t-ink-sec">никто не вернул</text>
    <!-- приёмы распределённых баз -->
    <rect x="0.75" y="226.75" width="428" height="108" rx="12" class="n-wait" />
    <text x="16" y="250" class="t-head t-sec">ПРИЁМЫ РАСПРЕДЕЛЁННЫХ БАЗ</text>
    <text x="16" y="274" class="t-cap">аренды с поколением и токеном</text>
    <text x="16" y="296" class="t-cap">эпохи отсекают устаревшего участника</text>
    <text x="16" y="318" class="t-cap">кворум: решение несёт подписи поддержавших</text>
    <!-- иллюстрация из статьи -->
    <rect x="478.75" y="226.75" width="428.5" height="108" rx="12" class="frame" />
    <text x="494" y="250" class="t-head t-sec">ШАНС, ЧТО ПОДСАЖЕННЫЙ ДЕФЕКТ ПРОЙДЁТ</text>
    <g v-for="(o, i) in odds" :key="o[0]">
      <text :x="494 + i * 140" y="286" class="odds t-lilac">{{ o[1] }}</text>
      <text :x="494 + i * 140" y="304" class="t-cap t-sec">{{ o[0] }}</text>
    </g>
    <text x="494" y="326" class="t-cap t-sec">10 % пчёл злонамеренны, честный ловит 70 %</text>
  </svg>
</template>
<style scoped>
.odds { font-family: var(--rwb-sans); font-size: 28px; font-weight: 500; }
</style>
