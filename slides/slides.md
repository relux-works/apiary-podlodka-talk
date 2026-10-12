---
routerMode: hash
theme: ../themes/rwb-tech
title: 'От чат-ботов к пасеке'
info: 'Podlodka · Relux Works · Алексей Григорьев и Иван Опарин'
transition: fade
# Slidev preloads slide images by their source path; for ../diagrams/… that
# path 404s in the built deck. The images still load as bundled assets.
preloadImages: false
# v4: corporate logos only on the title slide (see logos below)
themeConfig:
  logo: false
layout: cover
event: 'PODLODKA'
speakers:
  - name: 'Алексей Григорьев'
    role: "Технический руководитель RnD‑разработки (Tech Lead)\nМТС"
  - name: 'Иван Опарин'
    role: "Старший программный инженер\nRWB"
about: 'Вместе представляем проект нашей открытой агентской инфраструктуры Relux Works'
logos:
  - src: /brand/rwb.png
    alt: RWB
    height: 26
  - src: /brand/mts-web-services.png
    alt: 'МТС Web Services'
    height: 40
  - src: /brand/relux-works.svg
    alt: Relux Works
    height: 30
---

# От чат-ботов к пасеке: оркестраторы поверх любых агентских сред

<!--
[Для себя] Название согласовано с организаторами и не меняется (Иван, 10.10). С v6 (12.10) «Relux Works» над названием убрано: «сверху точно лишнее»; три логотипа без подписей (разговор спикеров 12.10).

[Для себя] Логотип МТС Web Services предоставлен Алексеем 12.10. Правила стиля для спикеров из разных компаний — у ведущих.

Представляемся оба: Алексей — технический руководитель RnD-разработки (Tech Lead) в МТС, Иван — старший программный инженер в RWB. Вместе мы делаем открытую агентскую инфраструктуру Relux Works, и сегодня показываем её проект.

[Для себя] Тема — rwb-tech, фиолетово-чёрная палитра; с v4 логотипы RWB, МТС и Relux Works только на этом слайде, остальные нейтральные.
-->

---
src: ./parts/0-opening.md
---

---
src: ./parts/1-epochs.md
---

---
src: ./parts/2-orchestration.md
---

---
src: ./parts/3-coordination.md
---

---
src: ./parts/4-processes.md
---

---
src: ./parts/5-external-agents.md
---

---
src: ./parts/6-where-we-are.md
---

---
src: ./parts/7-backup.md
---
