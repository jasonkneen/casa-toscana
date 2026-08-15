import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-xqRxgdDK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AssetViewer = (0, import_react.lazy)(() => import("./AssetViewer-BGteP2gc.mjs"));
function Home() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "h-dvh overflow-hidden bg-bg text-fg",
		children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boot, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetViewer, {})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boot, {})
	});
}
function Boot() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-dvh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.22em] text-accent uppercase",
				children: "Loading asset"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-2 text-3xl",
				children: "Casa Toscana"
			})]
		})
	});
}
//#endregion
export { Home as component };
