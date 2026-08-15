import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const AssetViewer = lazy(() => import("@/components/viewer/AssetViewer"));

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main className="h-dvh overflow-hidden bg-bg text-fg">
      {ready ? (
        <Suspense fallback={<Boot />}>
          <AssetViewer />
        </Suspense>
      ) : (
        <Boot />
      )}
    </main>
  );
}

function Boot() {
  return (
    <div className="grid h-dvh place-items-center bg-bg">
      <div className="text-center">
        <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
          Loading asset
        </p>
        <p className="font-display mt-2 text-3xl">Casa Toscana</p>
      </div>
    </div>
  );
}
