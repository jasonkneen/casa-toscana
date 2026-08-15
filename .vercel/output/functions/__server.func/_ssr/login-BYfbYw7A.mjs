import { V as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as GROK_PROVIDERS } from "./router-BeDq6LRq.mjs";
import { n as signIn } from "./client-D9szmb3R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BYfbYw7A.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-lg border border-line bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "Casa Toscana"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl font-medium tracking-tight",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Save the palazzo to your account when you export."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						className: "w-full rounded-sm border border-line bg-surface-2 px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-accent hover:text-accent-fg",
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-5 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
					children: "Back to the asset"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
