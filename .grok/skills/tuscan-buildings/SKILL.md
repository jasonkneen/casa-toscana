---
name: tuscan-buildings
description: >
  Build game-ready Tuscan / Florentine townhouses in Three.js — walls, storeys,
  openings, quoins, hip roofs, interiors, and whole streets. Use whenever the
  task is an Italian palazzetto, casa a schiera, borgo, piazza, or any building
  that must look constructed rather than kitbashed. Captures the Casa Toscana
  campaign: elevations → meter-scale mesh → material splits → quoins → windows
  → rooms → night lamps → frost → a street of kin.
metadata:
  short-description: "Tuscan townhouses: walls, storeys, openings, roofs, streets"
  user-invocable: true
---

# Tuscan buildings

These houses are **constructed**, not decorated boxes. Every opening belongs to
a room, every shutter can close, every quoin stops at a window, every roof
tile is a coppo ~40 cm long. If it could not be built in Prato or a Florentine
contrada, do not ship it.

## When to use

- Any Tuscan / Umbrian / Florentine house, palazzetto, or street
- Elevations-to-mesh (orthographic FRONT / LEFT / RIGHT / REAR)
- Game-ready merged BufferGeometry assets (meters = world units)
- Interiors seen through glass (interior-mapping, not a second scene)

Read `references/construction.md` for the hard rules,
`references/street.md` for placing more than one house, and
`references/street-furniture.md` for piano-terra doors, barred windows,
dado, and the Lucca/Prato photo language.

---

## 1. Massing (do this first)

| Storeys | Typical W × D | Eave | Notes |
|---|---|---|---|
| 2 + attic | 6–8 × 7–8 m | ~6.5–7.5 m | Casa bassa, often a shop on the street |
| 3 | 7–9 × 8–9 m | ~9.5–10.5 m | Most common terrace house |
| 4 | 10–12 × 9–10 m | ~13–14 m | Palazzetto / casa signorile |

- **Street is +Z.** Left = −X, right = +X, garden = −Z.
- Wall thickness **0.32–0.38 m**. Never paper-thin.
- Floor-to-floor **3.2–3.5 m**. Piano nobile (floor 1) can be taller.
- Ground floor sits on a **stone plinth** (~0.5 m). Small windows on piano
  terra have **high sills (~1.7 m)** — privacy, not cellar slits.

Floor band array, 4-storey reference:

```
FLOOR_Y = [0, 3.48, 6.72, 9.98, 13.35]  // last = eave
```

Do not invent a fifth storey to "look grand." Four is already a palazzetto.

## 2. Walls and materials

Street and piano nobile are **stucco** (warm ochre / cream / dusty rose).
Garden and service sides are often **exposed brick**. A side wall is
**split**: stucco toward +Z, brick toward −Z, meeting at a real edge
(no coplanar overlay — overlays z-fight and bury windows).

Back wall: brick on the service bay only (≈ 1/3 of the width), stucco on
the rest. **Never** slap a proud brick slab over window openings.

String courses (pietra serena) mark every floor. They wrap all four faces.
Quoins (bugnato) climb every corner:

- Alternate long / short (0.40 / 0.28 m)
- Each stone sits **on its face**, inset toward the middle of that face
- Side stones slide out so their ends are **flush** with the front/back faces
- **Skip any quoin that intersects a window or shutter swing**
- Bricks/quoins can never overlap a shutter — the shutter could not close

## 3. Openings

Kinds that actually exist on these houses:

| Kind | Where | Notes |
|---|---|---|
| `arch-door` | Street centre, piano terra | Rusticated stone, walnut panels, fanlight |
| `plank-arch` | Smaller casa | Green vertical boards in a rusticated arch |
| `herringbone` | Carriage / grand street door | Chevron green boards |
| `carriage` | Shop / garage | Wide green planks, no arch |
| `rect-door` | Garden / side service | Kitchen yard or dining garden |
| `barred` | Piano terra | High sill, **dense rusted grid**, stucco rebate |
| `small` | Piano terra or attic | Same high sill on the ground |
| `rect-shutter` | Floors 1–3 | Tuscan casement + green open shutters |
| `arch-balcony` | Street centre, piano nobile / attic | French window, iron balcony |
| `rect-balcony` | Garden or side | Same, rectangular |
| `louver` | Bagno / stair | Closed shutters, no interior |

Rules we learned the hard way:

- Every balcony has a door or french window. No orphan railings.
- Side walls need a **full stack** on the street half (all storeys), not
  just ground + one.
- Shutters sit **proud** of the brick (lz ≈ 0.20 m) on a plaster reveal.
  Same green wood everywhere — never mix a second shutter material.
- Frames are walnut, 4-pane casement, stone surround + sill + optional lintel.
- Doors are wood. You do not see through them.
- Quoins and shutters must not occupy the same bay. Reserve the bay
  (window + shutter swing) and skip stones that hit it.

## 4. Roof

Hip roof, terracotta **coppi + tegole**, tiles **~40 cm** (uvPerMeter ≈ 0.36
on a 4–5-tile sheet). Colour is **dusty brown-orange with lime bloom**,
never cherry red — do not multiply the albedo by a red tint.

- Eave overhang 0.40–0.50 m, timber soffit
- No ridge beams sticking out (no `addOrientedCap` hacks)
- Chimneys sit **on** the slope (`roofHeightAt`), brick stack + stone cap +
  two terracotta pots
- Downspouts at the corners, not mid-window

## 5. Rooms (the house is a plan, not wallpaper)

Adjacent windows that would be the same room **share one interior**.
One stairwell, back-centre, every floor — not a stair in every bay.

| Floor | Street | Garden L | Garden R | Centre back |
|---|---|---|---|---|
| 0 | parlours + androne | kitchen + service door | dining + garden door | stair / hall |
| 1 | salon (whole front) | dining | sitting + balcony | stair |
| 2 | master / study | bedroom | bedroom (louver = bagno) | stair |
| 3 | bedrooms + study | bedroom | bedroom | stair |

Night: crush photographic sunlight in the interior maps, leave a warm lamp
pool. Daylight interiors must not glow when the street is dark.
Frost is **on the glass** (roughness + opacity + milk), not a 2-pixel blur
behind a clear pane.

Shader interiors live on a portal plane just outside the glass. If the
shader fails to compile, every window goes black — never ship two `main()`.

## 6. A street of kin

Do not clone the hero. Vary:

- Storey count (2 / 3 / 4)
- Bay count (2 or 3)
- Width (6.4–11 m) and depth (7–9.5 m)
- Stucco tint (ochre, cream, dusty rose, greige)
- Brick fraction on the garden side
- Shop door vs domestic androne
- Chimney count

Keep **one construction language**: same quoins, same green shutters, same
coppi, same plinth, same high piano-terra sills. Kin, not a theme park.

Place them with **~1.2–1.8 m alleys**, street +Z, a cobble piazza, cypress
at the corners. Houses across the street rotate Y = π.

## 7. Performance / game-ready

- Merge by material (≤ 10 draw calls per house)
- Meter scale, origin at plan centre, feet on y = 0
- `GEOM_REV` (or plan hash) in `useMemo` so HMR rebuilds
- No reverse-Z (breaks sky). Use wall insets + polygonOffset
- Export GLB from the house root, not the whole piazza

## Finish checklist

- [ ] Street face is stucco; garden/service is brick; split is an edge
- [ ] Every balcony has an opening; every shutter can close
- [ ] Quoins flush, inset, never over a window
- [ ] Small ground windows have high sills
- [ ] Side street stacks run all storeys
- [ ] One stair, rooms shared by neighbouring windows
- [ ] Roof tiles large, dusty terracotta, hips clean
- [ ] Night interiors are lamp-lit, not sunny
- [ ] Neighbours are kin, not copies
