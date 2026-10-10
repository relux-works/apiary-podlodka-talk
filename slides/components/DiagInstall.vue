<script setup lang="ts">
// Запасной слайд «Установка и первый улей» (план, слайд 32). Сценическая версия curator-keeper installation-and-first-run.puml;
// содержание сверено с keeper.md DRAFT v0.5.1 §6.1–§6.4, §10.6, §11.3, §15.1 и curator-spec #92–#94.
// Карточка «Телефон» — веха KP2 (§15.1), поэтому пунктиром с пометкой. «Пакеты только из реестра Curator» — §6.1 (решено);
// установка по подписанной записи аудита — предложенный быстрый путь (#94), на карточку не вынесен: сегодняшний аудит Curator
// по умолчанию только предупреждает (curator-spec profiles/manager.md §7.1).
defineProps<{ reveal?: boolean }>()
const steps = [
  { h: 'Установщик', t: 'подпись проверена; git и Go — системные или свои, не в PATH' },
  { h: 'Curator', t: 'ставит профиль главного оркестратора одной командой curator profile install' },
  { h: 'Пакеты', t: 'только из реестра Curator; команды собираются из исходников' },
  { h: 'Инициализация', t: 'корневой репозиторий человека, без upstream; доска, первый коммит' },
  { h: 'Движок', t: 'железо тянет — локальная модель; нет — уже залогиненная среда', cls: 'lilac' },
  { h: 'Телефон', t: 'вторая веха: QR-код в терминале, ключи обменяны и закреплены', cls: 'later' },
  { h: 'Первый процесс', t: 'главный оркестратор предлагает процесс, человек подтверждает, оркестратор процесса стартует' },
  { h: 'Вход', t: 'агент входа поднимает главный оркестратор при каждом входе', cls: 'purple' },
]
</script>
<template>
  <div class="cards cols-4 dg-install">
    <template v-if="reveal"><div v-for="(s, i) in steps" :key="s.h" v-click class="card num" :class="s.cls" :data-num="i + 1"><h2>{{ s.h }}</h2><p>{{ s.t }}</p></div></template>
    <template v-else><div v-for="(s, i) in steps" :key="s.h" class="card num" :class="s.cls" :data-num="i + 1"><h2>{{ s.h }}</h2><p>{{ s.t }}</p></div></template>
  </div>
</template>
<style scoped>
.dg-install .card { font-size: 15px; padding: 14px 16px 34px 16px; }
.dg-install .card h2 { font-size: 17px; margin-bottom: 6px; }
.dg-install .card.num::after { font-size: 16px; bottom: 8px; }
.dg-install .card.later { background: transparent; border: 1.5px dashed var(--rwb-dim); }
.dg-install .card.later h2 { color: var(--rwb-sec); }
</style>
