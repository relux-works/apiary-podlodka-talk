# Diagrams

PNG renders copied from the private wiki (relux-works/wiki `book/diagrams/`, a4850ca). Change a diagram at its source in the wiki and copy the new render here; do not edit these files.

| File | Slide |
| --- | --- |
| `restart-survival.png`, `reboot-restore.png` | 14, operations |
| `doorbell-delivery.png`, `park-and-resume.png` | 21, launch assembly and the session host |
| `one-node-system.png` | 31, names |
| `request-routing.png`, `installation-and-first-run.png` | 32, the Keeper |
| `delegation-of-human-acts.png`, `process-isolation-on-one-node.png` | 33, trust |
| `communication-layers.png`, `several-nodes.png` | 35, waggle |
| `session-start-today.png`, `one-host-per-node.png`, `emergency-stop.png` | spare, session host |

## Stage versions

These renders are documentation: English, light, dense. The slides use redrawn stage versions instead, one Vue component per diagram in [`../slides/components/`](../slides/components/), all shown in [`../slides/diagrams.md`](../slides/diagrams.md) (`npm run diagrams`).

| Render | Stage version |
| --- | --- |
| `restart-survival.png` | `DiagRestart` |
| `reboot-restore.png` | `DiagReboot` |
| `doorbell-delivery.png` | `DiagDoorbell` |
| `park-and-resume.png` | `DiagPark` |
| `one-node-system.png` | `DiagOneNode` |
| `request-routing.png` | `DiagRouting` |
| `installation-and-first-run.png` | `DiagInstall` |
| `delegation-of-human-acts.png` | `DiagDelegation` |
| `process-isolation-on-one-node.png` | `DiagIsolation` |
| `communication-layers.png` | `DiagCommLayers` |
| `several-nodes.png` | `DiagSeveralNodes` |
| `session-start-today.png` | `DiagSessionStart` |
| `one-host-per-node.png` | `DiagOneHost` |
| `emergency-stop.png` | `DiagEstop` |

Sources of the originals: the wiki's `diagrams/plantuml/` (process isolation, communication layers, delegation) and `curator-keeper/diagrams/plantuml/` (one node, request routing, installation); the rest exist in the wiki only as renders. When an original changes, update its stage version by hand.
