<script setup lang="ts">
// Слайд 25, процессы как конфигурация. Анатомия Playbook.json и опубликованного плейбука как набора скиллов.
// Источник: curator-playbook spec/process-configuration.md DRAFT v4.8 — §2.1 (два файла), §3 (структура), §4.1–§4.2 (роли, владельцы),
// §6.2 (переходы, limit), §7.3 (параметры), §8.1 (плейбук — набор скиллов), §10 (валидатор); examples/dev-cycle.playbook.json.
// Показано подмножество dev-cycle: роли, типы и воркфлоу dev урезаны до того, что читается со сцены; на схеме это подписано
// «упрощено» (полный воркфлоу open → development → review → accepted → done — на DiagP5Extends).
import { useId } from 'vue'
const id = useId()
</script>
<template>
  <svg width="908" height="286" viewBox="0 0 908 286" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- Playbook.json -->
    <rect x="0.75" y="0.75" width="560" height="284.5" rx="14" class="frame" />
    <text x="16" y="24" class="t-head t-sec">PLAYBOOK.JSON · В КОРНЕ ПРОЕКТА, В GIT</text>
    <!-- роли -->
    <text x="16" y="66" class="t-head t-lilac">РОЛИ</text>
    <rect x="124" y="40" width="136" height="44" rx="10" class="n-lime" />
    <text x="192" y="59" text-anchor="middle" class="t-big t-ink">operator</text>
    <text x="192" y="76" text-anchor="middle" class="t-ink-sec">человек</text>
    <rect x="272" y="40" width="130" height="44" rx="10" class="n" />
    <text x="337" y="59" text-anchor="middle" class="t-big">developer</text>
    <text x="337" y="76" text-anchor="middle" class="t-sec">скилл роли</text>
    <rect x="414" y="40" width="130" height="44" rx="10" class="n" />
    <text x="479" y="59" text-anchor="middle" class="t-big">reviewer</text>
    <text x="479" y="76" text-anchor="middle" class="t-sec">скилл роли</text>
    <!-- типы -->
    <text x="16" y="120" class="t-head t-lilac">ТИПЫ</text>
    <rect x="124" y="98" width="100" height="36" rx="10" class="n" />
    <text x="174" y="121" text-anchor="middle" class="t-big">epic</text>
    <text x="236" y="121" text-anchor="middle" class="t-sec">›</text>
    <rect x="248" y="98" width="100" height="36" rx="10" class="n" />
    <text x="298" y="121" text-anchor="middle" class="t-big">story</text>
    <text x="360" y="121" text-anchor="middle" class="t-sec">›</text>
    <rect x="372" y="98" width="110" height="36" rx="10" class="n" />
    <text x="427" y="121" text-anchor="middle" class="t-big">dev-task</text>
    <text x="494" y="121" class="t-cap t-sec">поля</text>
    <!-- воркфлоу -->
    <text x="16" y="174" class="t-head t-lilac">ВОРКФЛОУ</text>
    <rect x="124" y="148" width="140" height="44" rx="10" class="n" />
    <text x="194" y="167" text-anchor="middle" class="t-big">development</text>
    <text x="194" y="184" text-anchor="middle" class="t-sec">developer</text>
    <rect x="300" y="148" width="120" height="44" rx="10" class="n" />
    <text x="360" y="167" text-anchor="middle" class="t-big">review</text>
    <text x="360" y="184" text-anchor="middle" class="t-sec">reviewer</text>
    <rect x="456" y="148" width="88" height="44" rx="10" class="n-lime" />
    <text x="500" y="175" text-anchor="middle" class="t-big t-ink">done</text>
    <line x1="264" y1="170" x2="297" y2="170" class="e" :marker-end="`url(#${id})`" />
    <line x1="420" y1="170" x2="453" y2="170" class="e" :marker-end="`url(#${id})`" />
    <path d="M340,192 C330,214 214,214 204,195" class="e" :marker-end="`url(#${id})`" />
    <text x="272" y="226" text-anchor="middle" class="t-cap t-sec">доработка · limit $rework_limit</text>
    <text x="544" y="226" text-anchor="end" class="t-cap t-sec">упрощено</text>
    <!-- политика -->
    <text x="16" y="266" class="t-head t-lilac">ПОЛИТИКА</text>
    <rect x="124" y="242" width="80" height="34" rx="10" class="n-wait" />
    <text x="164" y="264" text-anchor="middle">wip</text>
    <rect x="214" y="242" width="100" height="34" rx="10" class="n-wait" />
    <text x="264" y="264" text-anchor="middle">review</text>
    <rect x="324" y="242" width="124" height="34" rx="10" class="n-wait" />
    <text x="386" y="264" text-anchor="middle">delegation</text>
    <rect x="458" y="242" width="86" height="34" rx="10" class="n-wait" />
    <text x="501" y="264" text-anchor="middle">data</text>
    <!-- связь по имени скилла -->
    <line x1="544" y1="62" x2="597" y2="62" class="e" :marker-end="`url(#${id})`" />
    <text x="570" y="52" text-anchor="middle" class="t-cap t-sec">имя</text>
    <!-- опубликованный плейбук -->
    <rect x="600.75" y="0.75" width="306.5" height="284.5" rx="14" class="frame-hive" />
    <text x="616" y="24" class="t-head t-lilac">CURATOR-PLAYBOOK-DEV-CYCLE</text>
    <text x="616" y="44" class="t-cap t-sec">опубликованный плейбук</text>
    <rect x="616" y="58" width="276" height="48" rx="10" class="n-purple" />
    <text x="754" y="79" text-anchor="middle" class="t-big">orchestrator</text>
    <text x="754" y="97" text-anchor="middle" class="t-on">шаблон процесса в data/</text>
    <rect x="616" y="116" width="134" height="40" rx="10" class="n" />
    <text x="683" y="141" text-anchor="middle" class="t-big">developer</text>
    <rect x="758" y="116" width="134" height="40" rx="10" class="n" />
    <text x="825" y="141" text-anchor="middle" class="t-big">reviewer</text>
    <rect x="616" y="164" width="134" height="40" rx="10" class="n" />
    <text x="683" y="189" text-anchor="middle" class="t-big">refuter</text>
    <rect x="758" y="164" width="134" height="40" rx="10" class="n" />
    <text x="825" y="189" text-anchor="middle" class="t-big">researcher</text>
    <text x="616" y="236" class="t-cap">Skillfile.json ставит всё</text>
    <text x="616" y="254" class="t-cap">одним селектором; скилл роли</text>
    <text x="616" y="272" class="t-cap">попадает только в её запуски</text>
  </svg>
</template>
