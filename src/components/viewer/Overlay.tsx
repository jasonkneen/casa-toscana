import type { ReactNode } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Box, Camera, CloudFog, Download, Footprints, Grid3x3, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type ViewId = "front" | "left" | "right" | "rear" | "three" | "bird" | "street" | "d18" | "d25" | "d9" | "d32" | "d4" | "demo";

export const VIEWS: { id: ViewId; label: string; pos: [number, number, number]; look: [number, number, number] }[] = [
  { id: "street", label: "Street", pos: [6, 9.5, 28], look: [0, 6, 2] },
  { id: "three", label: "3/4", pos: [16.8, 10.8, 18.2], look: [0, 7.8, 0] },
  { id: "front", label: "Front", pos: [0, 8.8, 24], look: [0, 7.2, 0] },
  { id: "demo", label: "Parts", pos: [32, 2.2, 17], look: [46, 1.7, 17] },
  { id: "d18", label: "18", pos: [0, 1.65, 7.4], look: [0, 1.45, 4.7] },
  { id: "d25", label: "25", pos: [-10.45, 1.55, 7.0], look: [-10.45, 1.4, 4.35] },
  { id: "d9", label: "9", pos: [11.2, 1.55, 6.8], look: [11.2, 1.4, 3.95] },
  { id: "d32", label: "32", pos: [-4.2, 1.5, -11.5], look: [-4.2, 1.35, -15.0] },
  { id: "d4", label: "4", pos: [6.8, 1.55, -11.2], look: [6.8, 1.4, -14.5] },
  { id: "left", label: "Left", pos: [-24, 8.8, 0], look: [0, 7.2, 0] },
  { id: "right", label: "Right", pos: [24, 8.8, 0], look: [0, 7.2, 0] },
  { id: "rear", label: "Rear", pos: [0, 8.8, -24], look: [0, 7.2, 0] },
  { id: "bird", label: "Roof", pos: [0.2, 38, 0.2], look: [0, 8, 0] },
];

type Props = {
  view: ViewId;
  onView: (id: ViewId) => void;
  auto: boolean;
  onAuto: (v: boolean) => void;
  walk: boolean;
  onWalk: (v: boolean) => void;
  wire: boolean;
  onWire: (v: boolean) => void;
  hour: number;
  onHour: (v: number) => void;
  frost: number;
  onFrost: (v: number) => void;
  tris: number;
  calls: number;
  onExport: () => void;
};

export function Overlay({
  view,
  onView,
  auto,
  onAuto,
  walk,
  onWalk,
  wire,
  onWire,
  hour,
  onHour,
  frost,
  onFrost,
  tris,
  calls,
  onExport,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-fg">
      <header className="pointer-events-auto flex items-start justify-between gap-4 p-4 sm:p-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
            Game-ready asset
          </p>
          <h1 className="font-display mt-1 text-3xl leading-none font-medium tracking-tight sm:text-4xl">
            Borgo Toscano
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            A Florentine street — the palazzetto from the elevations, and four
            kin built with the same walls, storeys, and coppi.
          </p>
        </div>
        <AuthChip />
      </header>

      <aside className="pointer-events-auto absolute top-28 right-4 hidden w-56 flex-col gap-3 sm:top-6 sm:right-6 md:flex">
        <Panel>
          <Row label="Triangles" value={tris ? tris.toLocaleString() : "—"} />
          <Row label="Draw calls" value={calls ? String(calls) : "—"} />
          <Row label="Units" value="1 u = 1 m" />
          <Row label="Houses" value="5 kin" />
        </Panel>
        <Panel>
          <label className="flex items-center justify-between text-xs text-muted">
            Time of day
            <span className="font-mono text-fg">{String(Math.round(hour)).padStart(2, "0")}:00</span>
          </label>
          <input
            type="range"
            min={5}
            max={20}
            step={0.1}
            value={hour}
            onChange={(e) => onHour(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
          <p className="mt-1 text-[10px] text-muted">
            {hour >= 17 || hour < 8 ? "Lamps on" : "Daylight"}
          </p>
          <label className="mt-3 flex items-center justify-between text-xs text-muted">
            Window frost
            <span className="font-mono text-fg">{Math.round(frost * 100)}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={frost}
            onChange={(e) => onFrost(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
        </Panel>
      </aside>

      <div className="pointer-events-auto absolute right-4 bottom-28 flex flex-col gap-2 md:right-6 md:bottom-8">
        <IconBtn active={auto} onClick={() => onAuto(!auto)} label="Auto orbit">
          <RotateCcw className="size-4" />
        </IconBtn>
        <IconBtn active={walk} onClick={() => onWalk(!walk)} label="Walk around">
          <Footprints className="size-4" />
        </IconBtn>
        <IconBtn active={wire} onClick={() => onWire(!wire)} label="Wireframe">
          <Grid3x3 className="size-4" />
        </IconBtn>
        <IconBtn
          active={frost > 0.15}
          onClick={() => onFrost(frost > 0.15 ? 0 : 0.55)}
          label="Frosted glass"
        >
          <CloudFog className="size-4" />
        </IconBtn>
        <IconBtn onClick={onExport} label="Download GLB">
          <Download className="size-4" />
        </IconBtn>
      </div>

      <nav className="pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(100%-1.5rem,40rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-md border border-line bg-surface/85 p-1.5 backdrop-blur-md">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onView(v.id)}
            className={
              "flex min-h-11 min-w-14 flex-1 items-center justify-center gap-1.5 rounded-sm px-3 text-xs font-medium transition-colors " +
              (view === v.id
                ? "bg-accent text-accent-fg"
                : "text-muted hover:bg-surface-2 hover:text-fg")
            }
          >
            {v.id === "three" ? <Camera className="size-3.5" /> : <Box className="size-3.5" />}
            {v.label}
          </button>
        ))}
      </nav>

      {walk ? (
        <p className="pointer-events-none absolute bottom-20 left-1/2 hidden -translate-x-1/2 font-mono text-[11px] tracking-wide text-muted md:block">
          Click to look · WASD move · Shift sprint · Esc release
        </p>
      ) : null}
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface/80 p-3 backdrop-blur-md">{children}</div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5 text-xs">
      <span className="text-muted">{label}</span>
      <span className="font-mono tabular-nums text-fg">{value}</span>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  active,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={
        "grid size-11 place-items-center rounded-sm border border-line backdrop-blur-md transition-colors " +
        (active ? "bg-accent text-accent-fg" : "bg-surface/80 text-fg hover:bg-surface-2")
      }
    >
      {children}
    </button>
  );
}

function AuthChip() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-surface-2" />;
  }
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <Link
          to="/login"
          className="rounded-sm border border-line bg-surface/80 px-3 py-2 text-xs font-medium text-fg backdrop-blur-md hover:bg-surface-2"
        >
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <span className="hidden max-w-[10rem] truncate text-xs text-muted sm:inline">
          {user?.displayName}
        </span>
        <UserButton />
      </SignedIn>
    </div>
  );
}
