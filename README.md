# apiary-podlodka-talk

Private working repository for the Podlodka talk by Alexey and Ivan (Relux Works): from chatbots to the Apiary. It is a paired evening talk planned for 90 minutes. The talk and its materials are in Russian; repository docs are in English.

## Status (2026-09-29)

- The plan exists: 41 slides in seven parts, three demos, questions at the speaker switch and at the end, and cut versions for 60 and 45 minutes.
- The slides do not exist yet. They go to `slides/` in the conference's format (a Markdown and Vue hybrid) once the template arrives.
- The first meeting with the Podlodka advisor is on 2026-09-29 at 14:00 MSK. A review follows about a week later; the conference date is still open.

## Speakers

| Part | Speaker |
| --- | --- |
| 1–4: epochs, the board and autonomy, cross-harness, no vendor lock-in (the mechanics) | Alexey |
| 5–6: the Apiary, the distributed Apiary and the swarm | Ivan |
| 7 and questions | both |

## Layout

| Path | What |
| --- | --- |
| [`plan/slides-plan.ru.md`](plan/slides-plan.ru.md) | The working plan: timing, every slide's theses, demos, what to prepare, sources |
| [`open-questions.md`](open-questions.md) | Open questions for the organizers and for us, and what is decided |
| [`meetings/`](meetings/) | Agendas and outcomes of meetings with the organizers |
| [`notes/discussions.ru.md`](notes/discussions.ru.md) | The talk-related parts of our discussions of 27–28 September |
| [`text/`](text/) | The blog post the slides follow, Russian and English |
| [`diagrams/`](diagrams/) | Diagram renders and which slide uses which |
| [`cases/music-video/`](cases/music-video/) | The 19-hour music video expressed as a playbook (slide 28) |
| [`research/video-pipelines-synthesis.md`](research/video-pipelines-synthesis.md) | Published AI video pipelines against the playbook model; demo candidates |

## Sources and freshness

Copied files name their source and commit at the top or in their folder's README:

- the post comes from relux-works/blog at 0070a5f;
- the diagrams and the research synthesis come from relux-works/wiki at a4850ca;
- the music-video case comes from relux-works/curator-playbook at 648dc54.

The specifications are linked from the plan, not copied, with their versions as of 2026-09-29. Refresh a copy from its source rather than editing it here.

## Working agreement

- Both speakers edit with agents on short-lived branches and land through pull requests; commits are signed.
- Russian for talk content, English for repository docs.
- No personal data, credentials or business topics in this repository.

## Tools

No build step yet: everything is Markdown and PNG. When the slides arrive, the slide toolchain's commands, and where its output goes, are added here.
