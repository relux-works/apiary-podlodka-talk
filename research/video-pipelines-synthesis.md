# Opus 5.5 video pipelines: what they teach the playbook spec

> Copied from the private wiki (relux-works/wiki `research/video-pipelines/synthesis.md`, a4850ca). The four studies it cites (`pdoom.md`, `makevoid.md`, `eidoverse.md`, `catalogs.md`) live next to it there.

2026-09-29. Synthesis of four read-only studies in this folder:
- `pdoom.md`: PDoomVideo and ClaudeAnimationBase, including renderer probes and a full render on the M3 Max;
- `makevoid.md`: the motion-graphics music-video skill;
- `eidoverse.md`: the Deno and WebGPU agent video toolkit, run on the M3 Max;
- `catalogs.md`: three catalogs, about 245 unique prompts.

Baseline: curator-playbook DRAFT v4.6, with `examples/music-video/`, which models a real 19-hour production, and §6.11.1, which adds tool outputs, receipts and assisted tools.

## 1. The one finding that matters most

**Short prompts carry no process; long ones carry four to eight process rules** (median zero under 1,000 characters). Across every archetype the rules are the same:
- plan or storyboard first;
- quote the cost and wait;
- render a sample before the full run;
- inspect and rework until a stated bar;
- measure timing and sync;
- keep locked content locked;
- meet platform specifications;
- respect licences.

The rest of the process sits in installed skills, in the agent's hidden inspect-and-fix loop, and in human rounds disclosed afterwards. That is exactly what a playbook makes explicit, versioned and checkable. It is the strongest argument we have for process configuration, and it came from the wild, not from us.

## 2. Gaps, grouped

Found independently by several studies unless marked.

### A. Artifacts and staleness (pdoom, makevoid, eidoverse, catalogs)

1. **File fields with a content digest.** Outputs are groups of files (video, audit, probes), not scalar fields. An approval must bind the exact content of the file it approved.
2. **Pinned inputs and propagation.** When an accepted upstream element is replaced (a new character version, a changed plate), the spec cannot say that everything made from it is stale.
   - Today blocker events fire only forward, approvals bind only the element's own fields, and reopening is manual, one element at a time.
   - Proposed:
     - an element pins the digests of its inputs;
     - the kernel emits `input.superseded`;
     - an `inputs.fresh` guard;
     - a kernel reopen along the dependency graph;
     - a query that estimates the re-spend before a swap is approved.
3. **Frame-range artifacts** keyed by input digest, so a range re-renders and stale frames are detected. Today "resumable" means "skip existing files". Measured: an encode silently stopped at the first missing frame, and 192 files became a 4 s video.
4. **Tool evidence bound to a revision.** Check sets run in a clean checkout of the exact tree; tools run in the live working tree. Tool invocations should get the same pinned tree. *(pdoom)*
5. **Provenance and licence per asset** (the song behind PDoomVideo has no licence, so a public demo needs another). *(catalogs, eidoverse, pdoom)*
6. **Idempotency by input content** for paid tools, not only by element entry. *(makevoid)*

### B. Long-running and resource-bound tools (pdoom, eidoverse)

1. **Progress, resume and adopting a late result.** A full render took 23 minutes; a timed-out paid job cannot be resumed or its result adopted.
2. **Named machine resources with leases.** One GPU serves renders, analysis and lip-sync; parallel workers on one GPU gave only 1.25×. `policy.wip.per_state` is a stand-in, not a lease.
3. **Quality tiers.** A preview tier is fast and a final tier slow, and the spec should say which evidence each tier may produce. *(eidoverse)*
4. **Sandboxing tools that execute element content.** The renderer runs agent-written code with full permissions. *(eidoverse)*
5. **Tool readiness** (`doctor`) before a state that needs the tool is entered. On the stock renderer this fails outright on macOS. *(eidoverse, pdoom)*

### C. Budgets and parameters (pdoom, catalogs, makevoid)

1. **Parameters as guard thresholds and tool settings** (for example a per-platform duration limit, a sync threshold).
2. **Budgets in units other than money:** tokens and minutes per state, credits and quota per provider, a lifetime budget per video.
3. **Spending grants tied to the plan's content.** A grant approves a plan digest, not only an amount. *(makevoid)*
4. **Waves.** A barrier between batches whose size grows (2 → 4 → 8 → 10), with a review at each barrier. *(makevoid)*

### D. The outside world (catalogs)

1. **Publishing as a privileged act released at an absolute time.** Today `risk` is only `spending` or `halt`, and triggers are only an event or a delay.
2. **External data** with a recorded source and a freshness check.
3. **Variant selection** by metrics that arrive after publishing.
4. **Interactive deliverables:** device checks and playtests.
5. **Intake:** creating elements from outside the board, with a typed brief.

### E. Review quality (pdoom, eidoverse, catalogs)

1. **`vision` and `video-input` needs.** The registry vocabulary lacks them. In eidoverse's first render every engine check passed while the character faced away from the camera; only the contact-sheet review caught it.
2. **Typed, time-coded review fixes** instead of free text.
3. **Seam checks between parallel siblings** (chapter boundaries, transitions).
4. **A typed list of what the agent could not verify.**
5. **Evidence integrity:** a produced artifact must not be able to switch off its own checks. *(eidoverse)*
6. **Per-element file ownership** ("only your chapter file"): a write scope finer than the Story worktree. *(pdoom)*

## 3. Demos, simplest first

None of these runs through the playbook kernel yet: tool-owned states arrive in PC3. Until then the orchestrator runs the commands itself, or, after PC1, a variant built on `dev-cycle` runs the machine checks as local check sets.

| Demo | Runtime | Needs | Why it convinces |
| --- | --- | --- | --- |
| **Singing mascot (eidoverse)** | about 15 s compute | Deno 2.9.5 (Homebrew's 2.6.3 fails), the toolkit checkout; no models, no network | Machine checks are green while the character faces away; only the vision review catches it. That shows why a review state exists. |
| **Pixel loop under CI** | 20–35 min | Node, Chrome, ffmpeg | A published prompt's quality bar becomes machine checks: palette, loop seam, identical frames on re-render. |
| **Showreel bench** | 30–40 min | the same | Three drafts, three blind judges, one human pick, set against 82 public runs of the same prompt. |
| **Data explainer about the board's week** | 25–35 min | the same | Numbers only from data slots, freshness checked, a person listens before acceptance. |
| **lyric-video-lite** | 2–3 h wall-clock | CPU word alignment (5–18 s for a 2:37 song), a licence-clean song | The full music-video shape without paid generators; a schema-valid playbook is embedded in `pdoom.md`. |
| **Mascot lyric video with a v2 swap** | 2–4 h | local tools reused from makevoid (MIT) | Shows upstream invalidation, which the spec cannot express yet: it demonstrates gap A2. |

Practical notes:
- The stock PDoomVideo renderer fails on macOS until `--use-angle=d3d11` is replaced by `metal` or removed, and there is no flag for it.
- Frames are byte-identical only on one GPU backend.
- The executor's restricted `PATH` must reach Node, Chrome and ffmpeg from Homebrew.

## 4. Proposed next steps

1. Put groups A and B into the process-configuration spec as PC3 proposals, A first. Three of four studies found it independently.
2. Add C and E as open items. Record D as the scope of a later "publishing" module rather than the kernel.
3. Add `lyric-video-lite` and the singing-mascot playbook to `examples/` next to `music-video`.
4. For today's talk, use the singing-mascot demo and its "green checks, wrong frame" story; keep the showreel bench for a longer session.
