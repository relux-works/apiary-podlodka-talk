<script setup lang="ts">
// v4, слайд 44: главный оркестратор машины над оркестраторами процессов. Технические термины вместо пасечных
// (Кипер → главный оркестратор, улей → процесс, матка → оркестратор процесса); заменяет DiagOneNode, DiagRouting
// и DiagP5Keeper в основном потоке (те — в запасе).
// Источники: curator-keeper spec/keeper.md DRAFT v0.5.1 §0, §3.1–§3.3 (один на машину; управляет процессами, но не делает их
// работу; один корневой оркестратор на процесс), §7.7 (роль — скилл на любой среде), §8 (маршрутизация), §10.4 (общение через
// waggle); wiki book/ru/08-kiper.md (пример «стоматолог и овсяное молоко»; между процессами — только передача работы);
// curator-playbook spec DRAFT v4.8 §0 (ядро читает процесс в силе), §6.5 (передача между процессами), §8.1 (профили ролей).
// reveal: оркестраторы процессов (1), главный оркестратор и человек (2), общение между процессами (3), основание (4).
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
const procs = [
  { x: 0, t: 'Разработка проекта' },
  { x: 324, t: 'Семейный календарь' },
  { x: 648, t: 'Кафе' },
]
</script>
<template>
  <svg width="908" height="296" viewBox="0 0 908 296" aria-hidden="true">
    <defs>
      <marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="id + 's'" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto"><path d="M8,0 L0,4 L8,8 z" class="m" /></marker>
    </defs>
    <Step :on="reveal">
      <g v-for="p in procs" :key="p.t">
        <rect :x="p.x" y="112" width="260" height="78" rx="12" class="n" />
        <text :x="p.x + 130" y="140" text-anchor="middle" class="t-sec">оркестратор процесса</text>
        <text :x="p.x + 130" y="166" text-anchor="middle" class="t-lab">{{ p.t }}</text>
        <text :x="p.x + 130" y="184" text-anchor="middle" class="t-sec">плейбук и доска</text>
      </g>
    </Step>
    <Step :on="reveal">
      <rect x="0" y="4" width="170" height="54" rx="12" class="n-lime" />
      <text x="85" y="37" text-anchor="middle" class="t-lab t-ink">Человек</text>
      <line x1="170" y1="31" x2="321" y2="31" class="e" :marker-end="`url(#${id})`" />
      <text x="246" y="22" text-anchor="middle" class="t-cap t-sec">просит словами</text>
      <rect x="324" y="0" width="260" height="62" rx="12" class="n-purple" />
      <text x="454" y="27" text-anchor="middle" class="t-lab">Главный оркестратор</text>
      <text x="454" y="49" text-anchor="middle" class="t-on">интерфейс оператора</text>
      <path d="M400,62 C400,90 130,82 130,109" class="e" :marker-end="`url(#${id})`" />
      <line x1="454" y1="62" x2="454" y2="109" class="e" :marker-end="`url(#${id})`" />
      <path d="M508,62 C508,90 778,82 778,109" class="e" :marker-end="`url(#${id})`" />
    </Step>
    <Step :on="reveal">
      <line x1="263" y1="151" x2="321" y2="151" class="e-dash" :marker-start="`url(#${id}s)`" :marker-end="`url(#${id})`" />
      <line x1="587" y1="151" x2="645" y2="151" class="e-dash" :marker-start="`url(#${id}s)`" :marker-end="`url(#${id})`" />
      <text x="454" y="212" text-anchor="middle" class="t-cap t-sec">между процессами — сообщения и передача работы</text>
    </Step>
    <Step :on="reveal">
      <rect x="0" y="230" width="446" height="64" rx="12" class="n-wait" />
      <text x="20" y="256" class="t-head t-lilac">ЯДРО · TASK-BOARD</text>
      <text x="20" y="280" class="t-cap">проверяет каждую задачу по процессу</text>
      <rect x="462" y="230" width="446" height="64" rx="12" class="n-wait" />
      <text x="482" y="256" class="t-head t-lilac">МЕНЕДЖЕР КОНТЕКСТА</text>
      <text x="482" y="280" class="t-cap">каждый запуск — с профилем своей роли</text>
    </Step>
  </svg>
</template>
