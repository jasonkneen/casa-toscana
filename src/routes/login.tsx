import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Casa Toscana</p>
        <h1 className="font-display mt-2 text-3xl font-medium tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Save the palazzo to your account when you export.</p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-sm border border-line bg-surface-2 px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-accent hover:text-accent-fg"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-5 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Back to the asset
        </Link>
      </div>
    </main>
  );
}
