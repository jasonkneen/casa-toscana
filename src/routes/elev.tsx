import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const ElevViewer = lazy(() => import("@/components/viewer/ElevViewer"));

export const Route = createFileRoute("/elev")({
  ssr: false,
  component: Elev,
  validateSearch: (search: Record<string, unknown>) => ({
    v: (search.v as string) ?? "front",
  }),
});

function Elev() {
  const { v } = Route.useSearch();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <main className="h-dvh overflow-hidden bg-[#e8e8e8]">
      <Suspense fallback={null}>
        <ElevViewer view={v} />
      </Suspense>
    </main>
  );
}
