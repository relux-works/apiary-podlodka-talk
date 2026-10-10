<script setup lang="ts">
// Слайд 18, экономика токенов: роутер и его четыре вопроса. Новая схема. Статус роутера — решено (decided design,
// pre-implementation; техзаписка гл. 04, веха M8 ⟦решено⟧), плашка на рамке роутера, а не на заголовке-проблеме.
// Источники: curator-model-router spec/model-routing.md (DRAFT, decided design, pre-implementation):
// §0 (отдельный проверяемый шаг подготовки запуска, не прокси), R2 (четыре вопроса, четыре владельца;
// оценка не перебивает три других ответа), R7 (режимы off · shadow · recommend · select);
// curator-inference-manager spec/inference-plane.md §5 (движок ready или ensurable, холодный — с ценой старта);
// «Сегодня» — техническая записка гл. 04 (spawn выбирает по реестру, рекомендациям для классов работ и лимитам).
// reveal: задача и «сегодня» (1), четыре вопроса (2–5), исходы (6).
import { useId } from 'vue'
withDefaults(defineProps<{ reveal?: boolean }>(), { reveal: false })
const id = useId()
const gates = [
  { x: 212, q: 'Разрешено?', a: 'политика', b: 'оператор и проект' },
  { x: 388, q: 'Совместимо?', a: 'реестр модуля', b: 'и каталог' },
  { x: 564, q: 'Подходит?', a: 'оценщик роутера', b: 'по доказательствам', fit: true },
  { x: 740, q: 'Доступно сейчас?', a: 'лимиты, движки,', b: 'логин подписки' },
]
</script>
<template>
  <svg width="908" height="290" viewBox="0 0 908 290" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <g v-click="reveal ? 1 : false">
      <rect x="0" y="0" width="172" height="58" rx="10" class="n" />
      <text x="86" y="24" text-anchor="middle" class="t-big">Задача и роль</text>
      <text x="86" y="44" text-anchor="middle" class="t-sec">спека, критерии</text>
      <line x1="172" y1="29" x2="193" y2="29" class="e" :marker-end="`url(#${id})`" />
      <rect x="0" y="80" width="172" height="106" rx="10" class="n-wait" />
      <text x="14" y="104" class="t-big t-lime">Спавн</text>
      <text x="14" y="126" class="t-sec">spawn берёт</text>
      <text x="14" y="144" class="t-sec">реестр, класс</text>
      <text x="14" y="162" class="t-sec">работы и лимиты</text>
      <rect x="196.75" y="0.75" width="710.5" height="185" rx="14" class="frame" />
      <text x="212" y="24" class="t-head t-sec">РОУТЕР · ШАГ ПОДГОТОВКИ ЗАПУСКА, НЕ ПРОКСИ</text>
      <rect x="700" y="9" width="192" height="22" rx="11" class="n-lilac" />
      <text x="796" y="24" text-anchor="middle" class="t-head t-ink">ЧИСТАЯ ФУНКЦИЯ</text>
    </g>
    <g v-for="(g, i) in gates" :key="g.x" v-click="reveal ? i + 2 : false">
      <line v-if="i > 0" :x1="g.x - 20" y1="78" :x2="g.x - 3" y2="78" class="e" :marker-end="`url(#${id})`" />
      <rect :x="g.x" y="38" width="156" height="80" rx="10" :class="g.fit ? 'n-lilac' : 'n'" />
      <text :x="g.x + 78" y="62" text-anchor="middle" class="t-big" :class="g.fit ? 't-ink' : ''">{{ g.q }}</text>
      <text :x="g.x + 78" y="84" text-anchor="middle" :class="g.fit ? 't-ink-sec' : 't-sec'">{{ g.a }}</text>
      <text :x="g.x + 78" y="102" text-anchor="middle" :class="g.fit ? 't-ink-sec' : 't-sec'">{{ g.b }}</text>
      <template v-if="i === 3">
        <text x="212" y="146" class="t-cap">Хорошая оценка никогда не перебивает три других ответа.</text>
        <text x="212" y="168" class="t-cap t-sec">Режимы: off · shadow · recommend · select</text>
      </template>
    </g>
    <g v-click="reveal ? 6 : false">
      <path d="M818,186 C818,206 380,204 380,227" class="e" :marker-end="`url(#${id})`" />
      <line x1="818" y1="186" x2="818" y2="227" class="e" :marker-end="`url(#${id})`" />
      <rect x="212" y="230" width="336" height="58" rx="10" class="n" />
      <text x="380" y="254" text-anchor="middle" class="t-big">Мелочь ночью — локальный движок</text>
      <text x="380" y="274" text-anchor="middle" class="t-sec">холодный тоже в выборе, с ценой старта</text>
      <rect x="572" y="230" width="336" height="58" rx="10" class="n-purple" />
      <text x="740" y="254" text-anchor="middle" class="t-big">Трудное — frontier-модель</text>
      <text x="740" y="274" text-anchor="middle" class="t-on">в пределах подписки и лимитов</text>
    </g>
  </svg>
</template>
