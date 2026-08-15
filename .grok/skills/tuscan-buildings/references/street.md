# Street / borgo

Place houses on a cobble street along X, fronts on +Z.

```
gap = 1.4
x[i+1] = x[i] + house[i].W/2 + gap + house[i+1].W/2
```

Across the street: `z = -(depthA/2 + streetWidth + depthB/2)`, `yaw = π`.
Street width 7–9 m. Cypress in the alleys and at piazza corners.

Vary storeys, bays, stucco tint, brick fraction, chimney count. Keep shutters
green, quoins pietra serena, coppi dusty terracotta.

Each house is its own group (own merged batches + roof faces + window ports)
so stucco tints stay independent. Do not merge the whole street into one mesh.
