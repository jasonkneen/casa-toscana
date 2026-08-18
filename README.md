# Casa Toscana

A procedural 3D Florentine street built entirely in code with React Three Fiber. The scene centres on a Tuscan palazzetto reconstructed from architectural elevations, surrounded by seven "kin" houses assembled from the same kit of walls, storeys, and coppi (terracotta roof tiles) — no imported models, everything is generated geometry.

## Features

- **Borgo Toscano scene** — the main palazzetto plus seven kit-built neighbouring houses around a piazza
- **Camera presets** — street, 3/4, front, side, rear, and rooftop views, plus door-level close-ups
- **Walk mode** — first-person walk controller for exploring the street at ground level
- **Time of day** — sun position and street-lamp intensity driven by an hour slider
- **Wireframe & frost controls** — inspect the geometry or adjust atmosphere
- **GLTF export** — download the scene as a game-ready asset straight from the viewer
- **Live stats** — triangle and draw-call counts in the overlay
- **Elevation viewer** — a separate `/elev` route for comparing against the source elevations

## Stack

- [React](https://react.dev) + TypeScript + [Vite](https://vitejs.dev)
- [Three.js](https://threejs.org) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) and [drei](https://github.com/pmndrs/drei)
- [TanStack Router](https://tanstack.com/router) (file-based routes)
- Tailwind CSS
- [PGlite](https://pglite.dev) with SQL migrations (auth)

## Getting started

```sh
npm install
npm run dev
```

The app serves on port 8080. Other useful scripts:

```sh
npm run build      # production build + run DB migrations
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # node --test over scripts/**/*.test.mjs
```

## Project layout

```
src/
  components/
    building/   # procedural geometry: CasaToscana, TuscanHouse, CoppiRoof, Piazza…
    viewer/     # AssetViewer, Overlay UI, WalkController, ElevViewer
  routes/       # TanStack Router file routes (/, /elev, /login, /api/auth)
  lib/          # auth helpers etc.
migrations/     # SQL migrations
scripts/        # build/migration scripts + tests
```

## License

[MIT](LICENSE)
