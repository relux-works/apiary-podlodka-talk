<script setup lang="ts">
// v4, слайд 37: семантика пакетного менеджера. Сжатие слайдов «Скилл с командой», «Установка — это цепочка проверок»
// и «Кому мы доверяем» (их схемы DiagP34SkillAnatomy, DiagP34InstallGates, DiagP34TrustChain — в запасе).
// Источники: curator README (Skillfile.json и Skillfile.lock.json «like package-lock.json»; «Declarative configuration
// produces reproducible installations»); curator-spec v1.0.0-rc.13 protocol/core.md §7 (одно имя — один коммит), §8 (sha256);
// profiles/manager.md §2 («Package code MUST NOT execute during any phase»), §7 (канарейка, детекторы, «optionally invokes
// a configured backend» — анализ моделью), §7.1 (по умолчанию advisory); protocol/registry.md §3–§4 (подписанные записи,
// отзыв блокирует). Статус строк — в заметках слайда: LLM-бэкенд в коде Curator пока не подключён, сервис реестра без релиза.
// reveal: строка за строкой.
defineProps<{ reveal?: boolean }>()
const rows = [
  { npm: 'зависимости', t: 'Разрешение зависимостей: одно имя — один коммит' },
  { npm: 'npm audit', t: 'Аудит до установки: статический и LLM' },
  { npm: 'registry', t: 'Реестр проверенных скиллов, отзыв блокирует' },
  { npm: 'package-lock.json', t: 'Skillfile.lock.json: коммит и хэш каждого' },
  { npm: 'npm ci', t: 'Та же установка на любой машине' },
]
</script>
<template>
  <svg width="908" height="296" viewBox="0 0 908 296" aria-hidden="true">
    <text x="0" y="14" class="t-head t-sec">КАК В NPM</text>
    <text x="236" y="14" class="t-head t-lilac">SKILLFILE.JSON → CURATOR</text>
    <Step v-for="(r, i) in rows" :key="r.npm" :on="reveal">
      <text x="0" :y="55 + i * 54" class="t-sec">{{ r.npm }}</text>
      <rect x="236" :y="28 + i * 54" width="672" height="44" rx="10" :class="i === 4 ? 'n-purple' : 'n'" />
      <text x="256" :y="56 + i * 54" class="t-lab">{{ r.t }}</text>
    </Step>
  </svg>
</template>
