# Construction notes (from the Casa Toscana campaign)

## Coordinate system
Front = +Z, left = −X, garden = −Z. `along` on front/back is X; on left/right is Z (positive toward the street).

`worldAt(face, along, y, lx, lz)` — `lz` positive is outward. Never place glass or shutters at lz ≤ 0 on a brick overlay; the overlay will swallow them. Prefer **splitting the wall material** over overlays.

## Quoins
Two stones per corner per course: one on the front/back face, one on the side.
- Front/back stone: long in X, thin in Z, lifted `thick/2+0.012` off the wall.
- Side stone: thin in X, long in Z. X = `cx - sx * lift` (outward). Z length = `ext + flush` so the end is flush with the front stone's face.
- `flush = lift + thick/2`.
- Skip if the stone's along-interval overlaps a reserved window bay (include shutter swing).

## Windows
Stone jambs + sill + lintel. Walnut frame (stiles, rails, centre muntin). Open shutters at `lz = 0.20` on a cream reveal. Bars only on `barred`. Interior portal at `lz ≈ 0.055`, slightly in front of glass.

Ground `barred` / `small`: `yOff ≈ 1.70`, height ≈ 0.9. Upper `rect-shutter`: `yOff ≈ 0.68`, height 1.7–1.9 (taller on piano nobile).

## Roof
Hip from four faces (two quads, two triangles). `uvPerMeter = 0.36` on a sheet that shows 4–5 coppi. Albedo tint `#e8d2b6` or similar — never `#c86a3a`. No ridge caps as separate boxes (they poke out).

## Interiors
One `RoomId` per bay-group. Stair = back-centre stack only. Night: crush luma, add tungsten spot. Frost: glass roughness/opacity + wide blur + milk. Shader must have exactly one `main()`.
