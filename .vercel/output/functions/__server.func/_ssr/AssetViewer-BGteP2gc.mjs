import { o as __toESM } from "../_runtime.mjs";
import { A as Path, F as SRGBColorSpace, H as require_react, L as Shape, M as Quaternion, P as RepeatWrapping, T as Matrix4, V as require_jsx_runtime, _ as Float32BufferAttribute, a as Canvas, c as BoxGeometry, g as ExtrudeGeometry, h as Euler, i as useTexture, l as BufferAttribute, m as CylinderGeometry, n as ContactShadows, o as useFrame, r as OrbitControls, s as useThree, t as Sky, u as BufferGeometry, w as MathUtils, z as Vector3 } from "../_libs/@react-three/drei+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Download, i as Footprints, n as RotateCcw, o as Camera, r as Grid3x3, s as Box } from "../_libs/lucide-react.mjs";
import { r as signOut, t as authClient } from "./client-D9szmb3R.mjs";
import { n as GLTFExporter, t as mergeGeometries } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AssetViewer-BGteP2gc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** World units = meters. Front facade faces +Z. */
var W = 10.8;
var D = 9.4;
var WALL_T = .36;
var EAVE_Y = 13.35;
var ROOF_H = 3.2;
var OVERHANG = .46;
var FLOOR_Y = [
	0,
	3.48,
	6.72,
	9.98,
	13.35
];
var OPENINGS = [
	{
		face: "front",
		along: -3.18,
		floor: 0,
		kind: "barred"
	},
	{
		face: "front",
		along: 0,
		floor: 0,
		kind: "arch-door"
	},
	{
		face: "front",
		along: 3.18,
		floor: 0,
		kind: "small"
	},
	{
		face: "front",
		along: -3.18,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "front",
		along: 0,
		floor: 1,
		kind: "arch-balcony"
	},
	{
		face: "front",
		along: 3.18,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "front",
		along: -3.18,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "front",
		along: 0,
		floor: 2,
		kind: "rect-balcony"
	},
	{
		face: "front",
		along: 3.18,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "front",
		along: -3.18,
		floor: 3,
		kind: "rect-shutter"
	},
	{
		face: "front",
		along: 0,
		floor: 3,
		kind: "arch-balcony"
	},
	{
		face: "front",
		along: 3.18,
		floor: 3,
		kind: "rect-shutter"
	},
	{
		face: "left",
		along: 2.2,
		floor: 0,
		kind: "barred"
	},
	{
		face: "left",
		along: 2.2,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "left",
		along: 2.2,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "left",
		along: 2.2,
		floor: 3,
		kind: "rect-shutter"
	},
	{
		face: "left",
		along: -1.15,
		floor: 0,
		kind: "small"
	},
	{
		face: "left",
		along: -2.75,
		floor: 0,
		kind: "rect-door"
	},
	{
		face: "right",
		along: 2.55,
		floor: 0,
		kind: "barred"
	},
	{
		face: "right",
		along: -1.2,
		floor: 0,
		kind: "barred"
	},
	{
		face: "right",
		along: -3.2,
		floor: 0,
		kind: "barred"
	},
	{
		face: "right",
		along: -1.2,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "right",
		along: -3.2,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "right",
		along: -1.2,
		floor: 2,
		kind: "louver"
	},
	{
		face: "right",
		along: -3.2,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "right",
		along: -1.2,
		floor: 3,
		kind: "rect-shutter"
	},
	{
		face: "right",
		along: -3.2,
		floor: 3,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: 2.85,
		floor: 0,
		kind: "rect-door"
	},
	{
		face: "back",
		along: .35,
		floor: 0,
		kind: "small"
	},
	{
		face: "back",
		along: -2.95,
		floor: 0,
		kind: "barred"
	},
	{
		face: "back",
		along: 3.18,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: 0,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: -3.18,
		floor: 1,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: 3.18,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: 0,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: -3.18,
		floor: 2,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: 3.18,
		floor: 3,
		kind: "small"
	},
	{
		face: "back",
		along: 0,
		floor: 3,
		kind: "rect-shutter"
	},
	{
		face: "back",
		along: -3.18,
		floor: 3,
		kind: "rect-shutter"
	}
];
function specFor(kind, floor) {
	switch (kind) {
		case "rect-shutter": return {
			w: 1.12,
			h: floor === 1 ? 1.92 : 1.72,
			yOff: floor === 0 ? .7 : .68,
			shutter: "open",
			balcony: false,
			arch: false,
			door: false,
			bars: false,
			lintel: floor === 1
		};
		case "arch-balcony": return {
			w: 1.28,
			h: 2.32,
			yOff: .58,
			shutter: "none",
			balcony: true,
			arch: true,
			door: false,
			bars: false,
			lintel: true
		};
		case "rect-balcony": return {
			w: 1.18,
			h: 1.82,
			yOff: .64,
			shutter: "none",
			balcony: true,
			arch: false,
			door: false,
			bars: false,
			lintel: true
		};
		case "arch-door": return {
			w: 1.58,
			h: 2.92,
			yOff: .04,
			shutter: "none",
			balcony: false,
			arch: true,
			door: true,
			bars: false,
			lintel: true
		};
		case "rect-door": return {
			w: 1.02,
			h: 2.28,
			yOff: .04,
			shutter: "none",
			balcony: false,
			arch: false,
			door: true,
			bars: false,
			lintel: true
		};
		case "barred": return {
			w: .86,
			h: .96,
			yOff: .72,
			shutter: "none",
			balcony: false,
			arch: false,
			door: false,
			bars: true,
			lintel: false
		};
		case "small": return {
			w: .78,
			h: .88,
			yOff: .78,
			shutter: "none",
			balcony: false,
			arch: false,
			door: false,
			bars: false,
			lintel: false
		};
		case "louver": return {
			w: 1.12,
			h: 1.72,
			yOff: .68,
			shutter: "closed",
			balcony: false,
			arch: false,
			door: false,
			bars: false,
			lintel: false
		};
	}
}
function emptyBatches() {
	return {
		stucco: [],
		brick: [],
		stone: [],
		roof: [],
		wood: [],
		shutter: [],
		iron: [],
		glass: [],
		interior: [],
		terracotta: []
	};
}
function scaleBoxUVs(g, w, h, d, uvPerMeter) {
	const uv = g.attributes.uv;
	const sizes = [
		[d, h],
		[d, h],
		[w, d],
		[w, d],
		[w, h],
		[w, h]
	];
	for (let f = 0; f < 6; f++) {
		const [fw, fh] = sizes[f];
		for (let i = 0; i < 4; i++) {
			const idx = f * 4 + i;
			uv.setXY(idx, uv.getX(idx) * fw * uvPerMeter, uv.getY(idx) * fh * uvPerMeter);
		}
	}
}
function addBox(batch, w, h, d, x, y, z, ry = 0, uvPerMeter = 1, rx = 0, rz = 0) {
	const g = new BoxGeometry(w, h, d);
	scaleBoxUVs(g, w, h, d, uvPerMeter);
	const m = new Matrix4();
	m.compose(new Vector3(x, y, z), new Quaternion().setFromEuler(new Euler(rx, ry, rz)), new Vector3(1, 1, 1));
	g.applyMatrix4(m);
	batch.push(g);
}
function addCyl(batch, rTop, rBot, h, x, y, z, radial = 10) {
	const g = new CylinderGeometry(rTop, rBot, h, radial);
	g.translate(x, y, z);
	batch.push(g);
}
function faceYaw(face) {
	switch (face) {
		case "front": return 0;
		case "back": return Math.PI;
		case "left": return -Math.PI / 2;
		case "right": return Math.PI / 2;
	}
}
function faceOrigin(face, along, y, outset) {
	switch (face) {
		case "front": return {
			x: along,
			y,
			z: D / 2 + outset
		};
		case "back": return {
			x: along,
			y,
			z: -9.4 / 2 - outset
		};
		case "left": return {
			x: -10.8 / 2 - outset,
			y,
			z: along
		};
		case "right": return {
			x: W / 2 + outset,
			y,
			z: along
		};
	}
}
function offset(ry, lx, lz) {
	const c = Math.cos(ry);
	const s = Math.sin(ry);
	return {
		x: lx * c + lz * s,
		z: -lx * s + lz * c
	};
}
function worldAt(face, along, y, lx, lz) {
	const o = faceOrigin(face, along, y, 0);
	const d = offset(faceYaw(face), lx, lz);
	return {
		x: o.x + d.x,
		y,
		z: o.z + d.z,
		ry: faceYaw(face)
	};
}
function archShape(w, h) {
	const hw = w / 2;
	const r = Math.min(hw, h * .45);
	const s = new Shape();
	s.moveTo(-hw, 0);
	s.lineTo(hw, 0);
	s.lineTo(hw, h - r);
	s.absarc(0, h - r, r, 0, Math.PI, false);
	return s;
}
function archPath(w, h) {
	const hw = w / 2;
	const r = Math.min(hw, h * .45);
	const p = new Path();
	p.moveTo(-hw, 0);
	p.lineTo(hw, 0);
	p.lineTo(hw, h - r);
	p.absarc(0, h - r, r, 0, Math.PI, false);
	return p;
}
function addArchSolid(batch, w, h, depth, x, yBottom, z, ry) {
	const shape = archShape(w, h);
	const g = new ExtrudeGeometry(shape, {
		depth,
		bevelEnabled: false,
		curveSegments: 10
	});
	g.translate(0, 0, -depth / 2);
	const m = new Matrix4();
	m.compose(new Vector3(x, yBottom, z), new Quaternion().setFromEuler(new Euler(0, ry, 0)), new Vector3(1, 1, 1));
	g.applyMatrix4(m);
	batch.push(g);
}
function addArchFrame(batch, w, h, depth, thick, x, yBottom, z, ry) {
	const outer = archShape(w, h);
	outer.holes.push(archPath(w - thick * 2, h - thick));
	const g = new ExtrudeGeometry(outer, {
		depth,
		bevelEnabled: false,
		curveSegments: 10
	});
	g.translate(0, 0, -depth / 2);
	const m = new Matrix4();
	m.compose(new Vector3(x, yBottom, z), new Quaternion().setFromEuler(new Euler(0, ry, 0)), new Vector3(1, 1, 1));
	g.applyMatrix4(m);
	batch.push(g);
}
function roofHeightAt(x, z) {
	const hz = 5.16;
	const nx = Math.max(0, Math.abs(x) - Math.max(.2, 1.4000000000000004 / 2)) / Math.max(.01, 5.16);
	const nz = Math.abs(z) / hz;
	return EAVE_Y + ROOF_H * (1 - Math.min(1, Math.max(nx, nz)));
}
function addWalls(b) {
	const t = WALL_T;
	const h = EAVE_Y;
	const hw = W / 2;
	const hd = D / 2;
	addBox(b.stucco, W, h, t, 0, h / 2, hd - t / 2, 0, .55);
	addBox(b.stucco, W, h, t, 0, h / 2, -4.5200000000000005, 0, .55);
	addBox(b.brick, W * .34, 12.95, .05, hw - W * .17, 6.725, -4.71, 0, .7);
	addBox(b.stucco, t, h, 4.5200000000000005, -5.220000000000001, h / 2, 4.88 / 2, 0, .55);
	addBox(b.brick, t, h, 4.88, -5.220000000000001, h / 2, -4.5200000000000005 / 2, 0, .7);
	addBox(b.brick, t, h, 4.5200000000000005, hw - t / 2, h / 2, 4.88 / 2, 0, .7);
	addBox(b.stucco, t, h, 4.88, hw - t / 2, h / 2, -4.5200000000000005 / 2, 0, .55);
	addBox(b.stone, 10.600000000000001, .12, 9.200000000000001, 0, .04, 0, 0, .4);
	addBox(b.interior, W - t * 2, .08, D - t * 2, 0, 13.29, 0, 0, .2);
}
function addPlinthAndCornices(b) {
	const hw = W / 2;
	const hd = D / 2;
	const band = (y, th, out, depth) => {
		addBox(b.stone, W + out * 2, th, depth, 0, y, hd + out / 2, 0, .55);
		addBox(b.stone, W + out * 2, th, depth, 0, y, -4.7 - out / 2, 0, .55);
		addBox(b.stone, depth, th, D + out * 2, -5.4 - out / 2, y, 0, 0, .55);
		addBox(b.stone, depth, th, D + out * 2, hw + out / 2, y, 0, 0, .55);
	};
	band(.26, .52, .05, .12);
	for (const y of [
		3.48,
		6.72,
		9.98
	]) band(y, .11, .04, .1);
	band(13.27, .2, .12, .22);
	addBox(b.stone, 11.100000000000001, .08, 9.700000000000001, 0, 13.37, 0, 0, .4);
}
function addQuoins(b) {
	const hw = W / 2;
	const hd = D / 2;
	const step = .34;
	let y = .55;
	let i = 0;
	while (y + .16 < 13.2) {
		const hh = i % 2 === 0 ? .3 : .26;
		const ext = i % 2 === 0 ? .42 : .34;
		const corners = [
			[
				-5.4,
				hd,
				1,
				1
			],
			[
				hw,
				hd,
				-1,
				1
			],
			[
				-5.4,
				-4.7,
				1,
				-1
			],
			[
				hw,
				-4.7,
				-1,
				-1
			]
		];
		for (const [cx, cz, sx, sz] of corners) {
			addBox(b.stone, ext, hh, .11, cx + sx * (ext / 2 - .02), y + hh / 2, cz + sz * .05, 0, .7);
			addBox(b.stone, .11, hh, ext, cx + sx * .05, y + hh / 2, cz + sz * (ext / 2 - .02), 0, .7);
		}
		y += step;
		i += 1;
	}
}
function addRoof(b) {
	const hx = 5.86;
	const hz = 5.16;
	const ridge = Math.max(.4, .9000000000000001);
	const y0 = 13.37;
	const y1 = 16.55;
	const fl = new Vector3(-5.86, y0, hz);
	const fr = new Vector3(hx, y0, hz);
	const bl = new Vector3(-5.86, y0, -5.16);
	const br = new Vector3(hx, y0, -5.16);
	const rl = new Vector3(-.9000000000000001, y1, 0);
	const rr = new Vector3(ridge, y1, 0);
	addBox(b.stucco, 10.75, .22, 9.35, 0, 13.25, 0, 0, .5);
	addBox(b.wood, 11.72, .05, OVERHANG * .95, 0, 13.34, 4.9208, 0, .7);
	addBox(b.wood, 11.72, .05, OVERHANG * .95, 0, 13.34, -9.4 / 2 - OVERHANG * .48, 0, .7);
	addBox(b.wood, OVERHANG * .95, .05, 10.32, -10.8 / 2 - OVERHANG * .48, 13.34, 0, 0, .7);
	addBox(b.wood, OVERHANG * .95, .05, 10.32, 5.6208, 13.34, 0, 0, .7);
	const nRidge = 8;
	for (let i = 0; i < nRidge; i++) {
		const x = MathUtils.lerp(-.9000000000000001, ridge, i / Math.max(1, 7));
		addBox(b.terracotta, .26, .08, .22, x, 16.59, 0, 0, 1.2);
	}
	const hips = [
		[rl, fl],
		[rl, bl],
		[rr, fr],
		[rr, br]
	];
	for (const [from, to] of hips) {
		const dir = new Vector3().subVectors(to, from);
		const len = dir.length();
		const mid = new Vector3().addVectors(from, to).multiplyScalar(.5);
		const yaw = Math.atan2(dir.x, dir.z);
		const pitch = -Math.atan2(dir.y, Math.hypot(dir.x, dir.z));
		addBox(b.terracotta, .15, .08, len * .94, mid.x, mid.y + .05, mid.z, yaw, 1.4, pitch);
	}
}
function buildRoofFaces() {
	const hx = 5.86;
	const hz = 5.16;
	const ridge = Math.max(.4, .9000000000000001);
	const y0 = 13.389999999999999;
	const y1 = 16.55;
	const fl = new Vector3(-5.86, y0, hz);
	const fr = new Vector3(hx, y0, hz);
	const bl = new Vector3(-5.86, y0, -5.16);
	const br = new Vector3(hx, y0, -5.16);
	const rl = new Vector3(-.9000000000000001, y1, 0);
	const rr = new Vector3(ridge, y1, 0);
	return [
		[
			fl,
			fr,
			rr,
			rl
		],
		[
			br,
			bl,
			rl,
			rr
		],
		[
			bl,
			fl,
			rl
		],
		[
			fr,
			br,
			rr
		]
	].map((pts) => faceGeometry(pts, 1.9));
}
function faceGeometry(pts, uvPerMeter) {
	const g = new BufferGeometry();
	const a = pts[0];
	const uAxis = new Vector3().subVectors(pts[1], a).normalize();
	const tmp = new Vector3().subVectors(pts[pts.length - 1], a);
	const n = new Vector3().crossVectors(uAxis, tmp).normalize();
	if (n.lengthSq() < .01) n.crossVectors(uAxis, new Vector3(0, 1, 0)).normalize();
	const vAxis = new Vector3().crossVectors(n, uAxis).normalize();
	const positions = [];
	const normals = [];
	const uvs = [];
	const push = (p) => {
		positions.push(p.x, p.y, p.z);
		normals.push(n.x, n.y, n.z);
		const rel = new Vector3().subVectors(p, a);
		uvs.push(rel.dot(uAxis) * uvPerMeter, rel.dot(vAxis) * uvPerMeter);
	};
	if (pts.length === 4) {
		push(pts[0]);
		push(pts[1]);
		push(pts[2]);
		push(pts[0]);
		push(pts[2]);
		push(pts[3]);
	} else {
		push(pts[0]);
		push(pts[1]);
		push(pts[2]);
	}
	g.setAttribute("position", new Float32BufferAttribute(positions, 3));
	g.setAttribute("normal", new Float32BufferAttribute(normals, 3));
	g.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	return g;
}
function addChimneys(b) {
	for (const [x, z, h] of [
		[
			-3.7,
			1.45,
			1.15
		],
		[
			-.95,
			1.7,
			1.05
		],
		[
			3.55,
			1.35,
			1.2
		],
		[
			-3.35,
			-1.55,
			1.1
		],
		[
			.75,
			-1.75,
			1.05
		],
		[
			3.45,
			-1.4,
			1.15
		]
	]) {
		const y0 = roofHeightAt(x, z) - .18;
		addBox(b.brick, .58, h, .46, x, y0 + h / 2, z, 0, .9);
		addBox(b.stone, .66, .07, .54, x, y0 + h + .04, z, 0, .6);
		addCyl(b.terracotta, .11, .13, .28, x - .12, y0 + h + .22, z, 8);
		addCyl(b.terracotta, .1, .12, .24, x + .13, y0 + h + .2, z + .02, 8);
	}
}
function addDownspouts(b) {
	for (const r of [
		{
			face: "left",
			along: .15
		},
		{
			face: "right",
			along: .2
		},
		{
			face: "front",
			along: -5.15
		},
		{
			face: "front",
			along: 5.15
		}
	]) {
		const p = worldAt(r.face, r.along, EAVE_Y / 2, 0, .05);
		addBox(b.iron, .055, 13.049999999999999, .055, p.x, 13.2 / 2, p.z);
		const head = worldAt(r.face, r.along, 13.2, 0, .12);
		addBox(b.iron, .16, .08, .22, head.x, head.y, head.z, head.ry);
	}
}
function addBalcony(b, face, along, ySlab, width) {
	const depth = .62;
	const p = worldAt(face, along, ySlab, 0, depth / 2);
	addBox(b.stone, width, .09, depth, p.x, ySlab, p.z, p.ry, .7);
	const railH = .9;
	const bars = Math.max(7, Math.round(width / .13));
	for (let i = 0; i < bars; i++) {
		const lx = (i / (bars - 1) - .5) * (width - .1);
		const q = worldAt(face, along, ySlab + railH / 2, lx, .57);
		addBox(b.iron, .022, railH, .022, q.x, q.y, q.z);
	}
	const top = worldAt(face, along, ySlab + railH, 0, .57);
	addBox(b.iron, width - .06, .03, .03, top.x, top.y, top.z, top.ry);
	const bot = worldAt(face, along, ySlab + .12, 0, .57);
	addBox(b.iron, width - .06, .018, .018, bot.x, bot.y, bot.z, bot.ry);
	for (const side of [-1, 1]) {
		const s = worldAt(face, along, ySlab + railH / 2, side * (width / 2 - .04), depth / 2);
		addBox(b.iron, .025, railH, .54, s.x, s.y, s.z, s.ry);
	}
}
function addOpening(b, o) {
	const spec = specFor(o.kind, o.floor);
	const yBottom = FLOOR_Y[o.floor] + spec.yOff;
	const yCenter = yBottom + spec.h / 2;
	const ry = faceYaw(o.face);
	const well = worldAt(o.face, o.along, yCenter, 0, -.08);
	if (spec.arch) addArchSolid(b.interior, spec.w * .9, spec.h * .92, .22, well.x, yBottom + .04, well.z, ry);
	else addBox(b.interior, spec.w * .9, spec.h * .9, .22, well.x, yCenter, well.z, ry);
	const glass = worldAt(o.face, o.along, yCenter, 0, .01);
	if (!spec.door) {
		if (spec.arch) addArchSolid(b.glass, spec.w * .78, spec.h * .82, .03, glass.x, yBottom + .08, glass.z, ry);
		else addBox(b.glass, spec.w * .72, spec.h * .78, .03, glass.x, yCenter + .02, glass.z, ry);
		const mull = worldAt(o.face, o.along, yCenter, 0, .03);
		addBox(b.wood, .045, spec.h * .72, .04, mull.x, mull.y, mull.z, ry);
		const cross = worldAt(o.face, o.along, yCenter + spec.h * .08, 0, .03);
		addBox(b.wood, spec.w * .68, .04, .04, cross.x, cross.y, cross.z, ry);
	}
	const frame = worldAt(o.face, o.along, yBottom, 0, .045);
	if (spec.arch) addArchFrame(b.stone, spec.w + .28, spec.h + .16, .14, .13, frame.x, yBottom - .04, frame.z, ry);
	else {
		const fw = spec.w + .26;
		const fh = spec.h + .22;
		const fc = worldAt(o.face, o.along, yCenter, 0, .05);
		addBox(b.stone, .12, fh, .13, ...xyz(worldAt(o.face, o.along, yCenter, -spec.w / 2 - .06, .05)), ry, .7);
		addBox(b.stone, .12, fh, .13, ...xyz(worldAt(o.face, o.along, yCenter, spec.w / 2 + .06, .05)), ry, .7);
		addBox(b.stone, fw, .12, .16, fc.x, yBottom - .02, fc.z, ry, .7);
		addBox(b.stone, fw, .14, .16, fc.x, yBottom + spec.h + .05, fc.z, ry, .7);
	}
	const sill = worldAt(o.face, o.along, yBottom - .04, 0, .12);
	addBox(b.stone, spec.w + .34, .08, .22, sill.x, sill.y, sill.z, ry, .65);
	if (spec.lintel && !spec.arch) {
		const lin = worldAt(o.face, o.along, yBottom + spec.h + .18, 0, .08);
		addBox(b.stone, spec.w + .5, .12, .18, lin.x, lin.y, lin.z, ry, .6);
		addBox(b.stone, spec.w + .38, .06, .14, lin.x, lin.y + .08, lin.z, ry, .6);
	}
	if (spec.door) {
		const leafMat = o.kind === "arch-door" ? b.wood : b.shutter;
		if (spec.arch) {
			addArchSolid(leafMat, spec.w * .86, spec.h * .9, .07, glass.x, yBottom + .06, glass.z, ry);
			const seam = worldAt(o.face, o.along, yCenter - .1, 0, .06);
			addBox(b.wood, .04, spec.h * .62, .03, seam.x, seam.y, seam.z, ry);
		} else addBox(leafMat, spec.w * .86, spec.h * .9, .07, glass.x, yCenter + .02, glass.z, ry, .8);
		const knob = worldAt(o.face, o.along, yBottom + spec.h * .48, spec.w * .18, .1);
		addCyl(b.iron, .035, .035, .04, knob.x, knob.y, knob.z, 8);
	}
	if (spec.bars) {
		for (let i = 0; i < 4; i++) {
			const lx = (i / 3 - .5) * spec.w * .62;
			const q = worldAt(o.face, o.along, yCenter, lx, .07);
			addBox(b.iron, .022, spec.h * .72, .022, q.x, q.y, q.z);
		}
		for (let i = 0; i < 3; i++) {
			const yy = yBottom + spec.h * (.22 + i * .28);
			const q = worldAt(o.face, o.along, yy, 0, .07);
			addBox(b.iron, spec.w * .68, .018, .018, q.x, q.y, q.z, ry);
		}
	}
	if (spec.shutter !== "none") {
		const sw = spec.w * .5;
		const sh = spec.h * .96;
		if (spec.shutter === "open") for (const side of [-1, 1]) {
			const q = worldAt(o.face, o.along, yCenter, side * (spec.w / 2 + sw / 2 + .04), .07);
			addBox(b.shutter, sw, sh, .045, q.x, q.y, q.z, ry, 1.1);
			addBox(b.wood, sw * .92, .04, .05, q.x, q.y + sh * .42, q.z, ry);
			addBox(b.wood, sw * .92, .04, .05, q.x, q.y - sh * .42, q.z, ry);
			addBox(b.iron, .03, .03, .05, ...xyz(worldAt(o.face, o.along, yCenter + sh * .3, side * (spec.w / 2 + .04), .1)));
		}
		else for (const side of [-1, 1]) {
			const q = worldAt(o.face, o.along, yCenter, side * (sw / 2 + .01), .08);
			addBox(b.shutter, sw, sh, .05, q.x, q.y, q.z, ry, 1.1);
		}
	}
	if (spec.balcony) addBalcony(b, o.face, o.along, yBottom - .12, spec.w + .85);
}
function xyz(p) {
	return [
		p.x,
		p.y,
		p.z
	];
}
function addSideBalconies(b) {
	addBalcony(b, "left", -3.7, FLOOR_Y[2] + .55, 1.05);
	addBalcony(b, "right", 3.7, FLOOR_Y[1] + .55, 1.05);
}
function merge(list) {
	if (list.length === 0) {
		const g = new BoxGeometry(.001, .001, .001);
		g.translate(0, -10, 0);
		return g;
	}
	const prepared = list.map((g) => {
		const n = g.index ? g.toNonIndexed() : g;
		if (!n.getAttribute("uv")) {
			const count = n.getAttribute("position").count;
			n.setAttribute("uv", new BufferAttribute(new Float32Array(count * 2), 2));
		}
		if (!n.getAttribute("normal")) n.computeVertexNormals();
		return n;
	});
	const m = mergeGeometries(prepared, false);
	if (!m) throw new Error("Failed to merge building geometries");
	m.computeVertexNormals();
	return m;
}
function buildCasa() {
	const b = emptyBatches();
	addWalls(b);
	addPlinthAndCornices(b);
	addQuoins(b);
	addRoof(b);
	addChimneys(b);
	addDownspouts(b);
	for (const o of OPENINGS) addOpening(b, o);
	addSideBalconies(b);
	const out = {};
	Object.keys(b).forEach((k) => {
		out[k] = merge(b[k]);
	});
	return out;
}
function disposeCasa(geos) {
	for (const g of Object.values(geos)) g.dispose();
}
var ASSET_META = {
	name: "Casa Toscana",
	units: "meters",
	width: W,
	depth: D,
	height: 16.55,
	floors: 4
};
var MATS = {
	stucco: {
		map: "/textures/stucco.jpg",
		bump: "/textures/stucco_bump.jpg",
		repeat: 1,
		roughness: .9,
		metalness: 0,
		bumpScale: .014
	},
	brick: {
		map: "/textures/brick.jpg",
		bump: "/textures/brick_bump.jpg",
		repeat: 1,
		roughness: .86,
		metalness: 0,
		bumpScale: .02
	},
	stone: {
		map: "/textures/stone.jpg",
		bump: "/textures/stone_bump.jpg",
		repeat: 1,
		roughness: .78,
		metalness: .02,
		bumpScale: .012
	},
	roof: {
		map: "/textures/roof.jpg",
		bump: "/textures/roof_bump.jpg",
		repeat: 1,
		roughness: .7,
		metalness: 0,
		bumpScale: .03,
		color: "#d27a48"
	},
	wood: {
		map: "/textures/wood.jpg",
		bump: "/textures/wood_bump.jpg",
		repeat: 1,
		roughness: .7,
		metalness: 0,
		bumpScale: .01
	},
	shutter: {
		map: "/textures/shutter.jpg",
		bump: "/textures/shutter_bump.jpg",
		repeat: 1,
		roughness: .74,
		metalness: 0,
		bumpScale: .008
	},
	iron: {
		map: "/textures/iron.jpg",
		repeat: 1,
		roughness: .45,
		metalness: .72,
		bumpScale: 0,
		color: "#2a2a28"
	},
	glass: {
		map: "/textures/stucco.jpg",
		repeat: 1,
		roughness: .08,
		metalness: .15,
		bumpScale: 0,
		color: "#9db4c4",
		transparent: true,
		opacity: .38,
		envMapIntensity: 1.2
	},
	interior: {
		map: "/textures/wood.jpg",
		repeat: 1,
		roughness: 1,
		metalness: 0,
		bumpScale: 0,
		color: "#1a1410"
	},
	terracotta: {
		map: "/textures/roof.jpg",
		bump: "/textures/roof_bump.jpg",
		repeat: 1,
		roughness: .68,
		metalness: 0,
		bumpScale: .016,
		color: "#c56a3d"
	}
};
var ORDER = [
	"stucco",
	"brick",
	"stone",
	"roof",
	"wood",
	"shutter",
	"iron",
	"interior",
	"terracotta",
	"glass"
];
function usePreparedTextures() {
	const paths = [
		"/textures/stucco.jpg",
		"/textures/stucco_bump.jpg",
		"/textures/brick.jpg",
		"/textures/brick_bump.jpg",
		"/textures/stone.jpg",
		"/textures/stone_bump.jpg",
		"/textures/roof.jpg",
		"/textures/roof_bump.jpg",
		"/textures/wood.jpg",
		"/textures/wood_bump.jpg",
		"/textures/shutter.jpg",
		"/textures/shutter_bump.jpg",
		"/textures/iron.jpg"
	];
	const maps = useTexture(paths);
	(0, import_react.useLayoutEffect)(() => {
		maps.forEach((t, i) => {
			t.wrapS = t.wrapT = RepeatWrapping;
			t.anisotropy = 8;
			t.needsUpdate = true;
			t.colorSpace = (paths[i].includes("_bump") || paths[i].includes("iron")) && paths[i].includes("_bump") ? "" : SRGBColorSpace;
			if (paths[i].includes("_bump")) t.colorSpace = "";
		});
	}, [maps]);
	return Object.fromEntries(paths.map((p, i) => [p, maps[i]]));
}
function CasaToscana({ wireframe = false }) {
	const textures = usePreparedTextures();
	const geos = (0, import_react.useMemo)(() => buildCasa(), []);
	const roofFaces = (0, import_react.useMemo)(() => buildRoofFaces(), []);
	(0, import_react.useLayoutEffect)(() => {
		return () => {
			disposeCasa(geos);
			for (const g of roofFaces) g.dispose();
		};
	}, [geos, roofFaces]);
	const roofDef = MATS.roof;
	const roofMap = textures[roofDef.map];
	const roofBump = roofDef.bump ? textures[roofDef.bump] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: "CasaToscana",
		userData: ASSET_META,
		children: [ORDER.filter((id) => id !== "roof").map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Part, {
			id,
			geo: geos[id],
			def: MATS[id],
			textures,
			wireframe
		}, id)), roofFaces.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			name: `roof-face-${i}`,
			geometry: g,
			castShadow: true,
			receiveShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: roofMap,
				bumpMap: wireframe ? void 0 : roofBump,
				bumpScale: roofDef.bumpScale,
				color: roofDef.color ?? "#ffffff",
				roughness: roofDef.roughness,
				metalness: 0,
				wireframe,
				side: 2
			})
		}, `roof-${i}`))]
	});
}
function Part({ id, geo, def, textures, wireframe }) {
	const map = textures[def.map];
	const bump = def.bump ? textures[def.bump] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		name: id,
		geometry: geo,
		castShadow: true,
		receiveShadow: true,
		frustumCulled: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			map: id === "glass" || id === "interior" || id === "iron" ? void 0 : map,
			bumpMap: wireframe ? void 0 : bump,
			bumpScale: def.bumpScale,
			color: def.color ?? "#ffffff",
			roughness: def.roughness,
			metalness: def.metalness,
			wireframe,
			transparent: def.transparent,
			opacity: def.opacity ?? 1,
			envMapIntensity: def.envMapIntensity ?? .4,
			side: id === "roof" || id === "wood" ? 2 : 0,
			depthWrite: id !== "glass"
		})
	});
}
function Cypress({ position, height = 7.4 }) {
	const [x, y, z] = position;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			y,
			z
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			position: [
				0,
				.55,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.16,
				.22,
				1.1,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#4a3424",
				roughness: .92
			})]
		}), Array.from({ length: 6 }, (_, i) => {
			const t = i / 5;
			const h = height * .22 * (1 - t * .25);
			const r = .95 * (1 - t * .72);
			const yy = 1.1 + t * (height - 1.4);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					0,
					yy,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					r,
					h,
					9
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: i % 2 ? "#1d3a28" : "#234830",
					roughness: .88
				})]
			}, i);
		})]
	});
}
function Piazza({ sun }) {
	const cobble = useTexture("/textures/cobble.jpg");
	(0, import_react.useLayoutEffect)(() => {
		cobble.wrapS = cobble.wrapT = RepeatWrapping;
		cobble.repeat.set(18, 18);
		cobble.anisotropy = 8;
		cobble.colorSpace = SRGBColorSpace;
	}, [cobble]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: sun,
			turbidity: 5.5,
			rayleigh: 1.15,
			mieCoefficient: .006,
			mieDirectionalG: .82,
			inclination: .47,
			azimuth: .22
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#c5cdd4",
				38,
				95
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#dbe4ee",
			"#8a7a62",
			.55
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .22 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: sun,
			intensity: 2.15,
			color: "#fff1d6",
			"shadow-mapSize": [2048, 2048],
			"shadow-camera-near": 1,
			"shadow-camera-far": 80,
			"shadow-camera-left": -22,
			"shadow-camera-right": 22,
			"shadow-camera-top": 22,
			"shadow-camera-bottom": -22,
			"shadow-bias": -25e-5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-12,
				8,
				-10
			],
			intensity: .28,
			color: "#a8bdd0"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				0,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [48, 64] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: cobble,
				roughness: .92,
				metalness: 0,
				color: "#d4cbb8"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.04,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				48,
				72,
				64
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#6d7a62",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			receiveShadow: true,
			position: [
				0,
				.04,
				7.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				14,
				.08,
				3.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#cfc4ae",
				roughness: .9
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cypress, {
			position: [
				-9.2,
				0,
				6.4
			],
			height: 8.2
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cypress, {
			position: [
				9.4,
				0,
				6.1
			],
			height: 7.6
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cypress, {
			position: [
				-10.4,
				0,
				-4.8
			],
			height: 6.8
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cypress, {
			position: [
				10.6,
				0,
				-5.6
			],
			height: 7.9
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cypress, {
			position: [
				-7.2,
				0,
				-9.5
			],
			height: 6.2
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cypress, {
			position: [
				8.1,
				0,
				-10.2
			],
			height: 6.5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
			position: [
				0,
				.02,
				0
			],
			opacity: .42,
			scale: 36,
			blur: 2.4,
			far: 14,
			color: "#2a241c"
		})
	] });
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
var VIEWS = [
	{
		id: "three",
		label: "3/4",
		pos: [
			16.8,
			10.8,
			18.2
		]
	},
	{
		id: "front",
		label: "Front",
		pos: [
			0,
			8.8,
			24
		]
	},
	{
		id: "left",
		label: "Left",
		pos: [
			-24,
			8.8,
			0
		]
	},
	{
		id: "right",
		label: "Right",
		pos: [
			24,
			8.8,
			0
		]
	},
	{
		id: "rear",
		label: "Rear",
		pos: [
			0,
			8.8,
			-24
		]
	},
	{
		id: "bird",
		label: "Roof",
		pos: [
			.2,
			32,
			.2
		]
	}
];
function Overlay({ view, onView, auto, onAuto, walk, onWalk, wire, onWire, hour, onHour, tris, calls, onExport }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-auto flex items-start justify-between gap-4 p-4 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] tracking-[0.22em] text-accent uppercase",
						children: "Game-ready asset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl leading-none font-medium tracking-tight sm:text-4xl",
						children: "Casa Toscana"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-sm text-sm text-muted",
						children: [
							"Florentine townhouse rebuilt from the four elevations — ",
							ASSET_META.floors,
							" ",
							"storeys, ",
							ASSET_META.width,
							" × ",
							ASSET_META.depth,
							" m, real geometry."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "pointer-events-auto absolute top-28 right-4 hidden w-56 flex-col gap-3 sm:top-6 sm:right-6 md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Triangles",
						value: tris ? tris.toLocaleString() : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Draw calls",
						value: calls ? String(calls) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Units",
						value: "1 u = 1 m"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Height",
						value: `${ASSET_META.height.toFixed(1)} m`
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between text-xs text-muted",
					children: ["Time of day", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-fg",
						children: [String(Math.round(hour)).padStart(2, "0"), ":00"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 5,
					max: 20,
					step: .1,
					value: hour,
					onChange: (e) => onHour(Number(e.target.value)),
					className: "mt-2 w-full accent-accent"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute right-4 bottom-28 flex flex-col gap-2 md:right-6 md:bottom-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						active: auto,
						onClick: () => onAuto(!auto),
						label: "Auto orbit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						active: walk,
						onClick: () => onWalk(!walk),
						label: "Walk around",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						active: wire,
						onClick: () => onWire(!wire),
						label: "Wireframe",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						onClick: onExport,
						label: "Download GLB",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(100%-1.5rem,40rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-md border border-line bg-surface/85 p-1.5 backdrop-blur-md",
				children: VIEWS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onView(v.id),
					className: "flex min-h-11 min-w-14 flex-1 items-center justify-center gap-1.5 rounded-sm px-3 text-xs font-medium transition-colors " + (view === v.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
					children: [v.id === "three" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-3.5" }), v.label]
				}, v.id))
			}),
			walk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-20 left-1/2 hidden -translate-x-1/2 font-mono text-[11px] tracking-wide text-muted md:block",
				children: "Click to look · WASD move · Shift sprint · Esc release"
			}) : null
		]
	});
}
function Panel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-md border border-line bg-surface/80 p-3 backdrop-blur-md",
		children
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 py-0.5 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums text-fg",
			children: value
		})]
	});
}
function IconBtn({ children, onClick, active, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title: label,
		"aria-label": label,
		onClick,
		className: "grid size-11 place-items-center rounded-sm border border-line backdrop-blur-md transition-colors " + (active ? "bg-accent text-accent-fg" : "bg-surface/80 text-fg hover:bg-surface-2"),
		children
	});
}
function AuthChip() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 w-9 animate-pulse rounded-full bg-surface-2" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: "rounded-sm border border-line bg-surface/80 px-3 py-2 text-xs font-medium text-fg backdrop-blur-md hover:bg-surface-2",
			children: "Sign in"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden max-w-[10rem] truncate text-xs text-muted sm:inline",
			children: user?.displayName
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})] })]
	});
}
var EYE = 1.68;
var SPEED = 4.4;
var HALF_W = W / 2 + .7;
var HALF_D = D / 2 + .7;
function WalkController({ enabled }) {
	const { camera, gl } = useThree();
	const keys = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const yaw = (0, import_react.useRef)(0);
	const pitch = (0, import_react.useRef)(-.08);
	const pos = (0, import_react.useRef)(new Vector3(0, EYE, 14));
	const speed = (0, import_react.useRef)(0);
	const locked = (0, import_react.useRef)(false);
	const tmpF = (0, import_react.useRef)(new Vector3());
	const tmpR = (0, import_react.useRef)(new Vector3());
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			keys.current.add(e.code);
		};
		const up = (e) => {
			keys.current.delete(e.code);
		};
		const blur = () => keys.current.clear();
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", blur);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", blur);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!enabled) {
			locked.current = false;
			try {
				document.exitPointerLock();
			} catch {}
			return;
		}
		const el = gl.domElement;
		const onClick = () => {
			if (!enabled) return;
			el.requestPointerLock();
		};
		const onLock = () => {
			locked.current = document.pointerLockElement === el;
		};
		const onMove = (e) => {
			if (!locked.current || !enabled) return;
			yaw.current -= e.movementX * .0022;
			pitch.current -= e.movementY * .0022;
			pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
		};
		el.addEventListener("click", onClick);
		document.addEventListener("pointerlockchange", onLock);
		document.addEventListener("mousemove", onMove);
		return () => {
			el.removeEventListener("click", onClick);
			document.removeEventListener("pointerlockchange", onLock);
			document.removeEventListener("mousemove", onMove);
		};
	}, [enabled, gl]);
	(0, import_react.useEffect)(() => {
		window.__controlsTest = {
			getYaw: () => yaw.current,
			getSpeed: () => speed.current,
			setKeys: (codes) => {
				keys.current.clear();
				for (const c of codes) keys.current.add(c);
			}
		};
		return () => {
			delete window.__controlsTest;
		};
	}, []);
	useFrame((_, dtRaw) => {
		if (!enabled) return;
		const dt = Math.min(dtRaw, .1);
		const forward = tmpF.current;
		forward.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
		const right = tmpR.current;
		right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
		let mx = 0;
		let mz = 0;
		if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) mz += 1;
		if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) mz -= 1;
		if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) mx += 1;
		if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) mx -= 1;
		const len = Math.hypot(mx, mz);
		if (len > 0) {
			mx /= len;
			mz /= len;
		}
		const sprint = keys.current.has("ShiftLeft") || keys.current.has("ShiftRight") ? 1.55 : 1;
		pos.current.addScaledVector(forward, mz * SPEED * sprint * dt);
		pos.current.addScaledVector(right, mx * SPEED * sprint * dt);
		speed.current = Math.hypot(mx, mz) * SPEED * sprint;
		const x = pos.current.x;
		const z = pos.current.z;
		if (Math.abs(x) < HALF_W && Math.abs(z) < HALF_D) {
			if (HALF_W - Math.abs(x) < HALF_D - Math.abs(z)) pos.current.x = Math.sign(x) * HALF_W;
			else pos.current.z = Math.sign(z) * HALF_D;
		}
		pos.current.y = EYE;
		const radius = Math.hypot(pos.current.x, pos.current.z);
		if (radius > 28) {
			pos.current.multiplyScalar(28 / radius);
			pos.current.y = EYE;
		}
		camera.position.copy(pos.current);
		camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
	});
	return null;
}
function sunFromHour(hour) {
	const t = (hour - 6) / 12 * Math.PI;
	const x = Math.cos(t) * 28;
	const y = Math.sin(t) * 22 + 4;
	return [
		x,
		Math.max(3, y),
		12
	];
}
function ViewJumper({ target, walk }) {
	const { camera } = useThree();
	const prev = (0, import_react.useRef)("");
	const key = target.join(",");
	(0, import_react.useLayoutEffect)(() => {
		if (walk) return;
		if (prev.current === key) return;
		prev.current = key;
		camera.position.set(...target);
		camera.lookAt(0, 7.8, 0);
	}, [
		key,
		walk,
		camera,
		target
	]);
	return null;
}
function StatsTap({ onStats }) {
	const { gl } = useThree();
	const acc = (0, import_react.useRef)(0);
	useFrame((_, dt) => {
		acc.current += dt;
		if (acc.current < .4) return;
		acc.current = 0;
		onStats(gl.info.render.triangles, gl.info.render.calls);
	});
	return null;
}
function ExportAnchor({ apiRef }) {
	const { scene } = useThree();
	apiRef.current = () => {
		const root = scene.getObjectByName("CasaToscana");
		if (!root) return;
		new GLTFExporter().parse(root, (result) => {
			const blob = new Blob([result], { type: "model/gltf-binary" });
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = "casa-toscana.glb";
			a.click();
			URL.revokeObjectURL(a.href);
		}, (err) => {
			console.error(err);
		}, { binary: true });
	};
	return null;
}
function AssetViewer() {
	const [view, setView] = (0, import_react.useState)("three");
	const [auto, setAuto] = (0, import_react.useState)(true);
	const [walk, setWalk] = (0, import_react.useState)(false);
	const [wire, setWire] = (0, import_react.useState)(false);
	const [hour, setHour] = (0, import_react.useState)(16.2);
	const [tris, setTris] = (0, import_react.useState)(0);
	const [calls, setCalls] = (0, import_react.useState)(0);
	const exportRef = (0, import_react.useRef)(null);
	const target = (0, import_react.useMemo)(() => VIEWS.find((v) => v.id === view)?.pos ?? VIEWS[0].pos, [view]);
	const sun = (0, import_react.useMemo)(() => sunFromHour(hour), [hour]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			dpr: [1, 1.75],
			camera: {
				position: target,
				fov: 36,
				near: .1,
				far: 160
			},
			gl: {
				antialias: true,
				toneMapping: 4,
				toneMappingExposure: 1.08,
				powerPreference: "high-performance"
			},
			onCreated: ({ gl }) => {
				gl.outputColorSpace = SRGBColorSpace;
				gl.shadowMap.enabled = true;
				gl.shadowMap.type = 1;
			},
			style: { touchAction: "none" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#b7c2cb"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
					fallback: null,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Piazza, { sun }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CasaToscana, { wireframe: wire })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewJumper, {
					target,
					walk
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkController, { enabled: walk }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
					enabled: !walk,
					enableDamping: true,
					dampingFactor: .08,
					autoRotate: auto && !walk,
					autoRotateSpeed: .45,
					minDistance: 8,
					maxDistance: 42,
					minPolarAngle: .18,
					maxPolarAngle: Math.PI / 2 - .04,
					target: [
						0,
						7.8,
						0
					],
					makeDefault: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsTap, { onStats: (t, c) => {
					setTris(t);
					setCalls(c);
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportAnchor, { apiRef: exportRef })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
			view,
			onView: (id) => {
				setWalk(false);
				setAuto(false);
				setView(id);
			},
			auto: auto && !walk,
			onAuto: setAuto,
			walk,
			onWalk: (v) => {
				setWalk(v);
				if (v) setAuto(false);
			},
			wire,
			onWire: setWire,
			hour,
			onHour: setHour,
			tris,
			calls,
			onExport: () => exportRef.current?.()
		})]
	});
}
//#endregion
export { AssetViewer as default };
