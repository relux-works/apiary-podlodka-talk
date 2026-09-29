<script setup lang="ts">
// Слайд 32, Кипер. Сценическая версия curator-keeper installation-and-first-run.puml (main loop DRAFT v0.2 §6, §10.6, §11.3; curator-spec #92–#94).
defineProps<{ reveal?: boolean }>()
const steps = [
  { h: 'Установщик', t: 'подпись проверена; git и Go — системные или свои, не в PATH' },
  { h: 'Curator', t: 'curator profile install …/curator-playbook-keeper' },
  { h: 'Пакеты', t: 'по подписанным аудитам; команды собираются из исходников' },
  { h: 'keeper init', t: '~/apiary — репозиторий человека, без upstream; доска, первый коммит' },
  { h: 'Движок', t: 'железо тянет — локальная модель; нет — уже залогиненная среда', cls: 'lilac' },
  { h: 'Телефон', t: 'QR-код в терминале, ключи обменяны и закреплены' },
  { h: 'Первый улей', t: 'Кипер предлагает процесс, человек подтверждает, матка стартует' },
  { h: 'keeper up', t: 'агент входа поднимает точку при каждом входе', cls: 'purple' },
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
</style>
