import * as React from "react";
import { cn } from "@/lib/utils";
import { queueColor, queueTint, stateMeta, type ProcessState } from "@/lib/queue";

/* ---------- Queue level chip ---------- */
/* Color encodes priority (Q0 brightest). Always paired with the numeric
   label + a swatch shape so it reads without relying on hue alone. */
export function QueueChip({
  queue,
  className,
}: {
  queue: number;
  className?: string;
}) {
  const color = queueColor(queue);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 font-mono text-xs font-medium tabular-nums",
        className
      )}
      style={{
        color,
        borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
        background: queueTint(queue, 0.1),
      }}
    >
      <span
        aria-hidden
        className="size-2 rounded-[2px]"
        style={{ background: color }}
      />
      Q{queue}
    </span>
  );
}

/* ---------- Process state badge ---------- */
/* Dot + label. Shape/label reinforce color for CVD safety. */
export function StateBadge({
  state,
  className,
}: {
  state: ProcessState | undefined;
  className?: string;
}) {
  const meta = stateMeta(state);
  const isRunning = state === "running";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{
        color: meta.color,
        borderColor: `color-mix(in oklch, ${meta.color} 35%, transparent)`,
        background: `color-mix(in oklch, ${meta.color} 12%, transparent)`,
      }}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", isRunning && "animate-pulse")}
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}

/* ---------- Metric readout ---------- */
/* Mono value + unit, small caption, optional one-line explanation.
   Deliberately not a giant gradient hero card. */
export function MetricStat({
  label,
  value,
  unit,
  hint,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border bg-card p-4",
        className
      )}
    >
      <span className="data-label">{label}</span>
      <span className="flex items-baseline gap-1">
        <span
          className="font-mono text-2xl font-semibold tabular-nums leading-none"
          style={accent ? { color: accent } : undefined}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono text-xs text-muted-foreground">{unit}</span>
        )}
      </span>
      {hint && (
        <span className="text-xs leading-snug text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}

/* ---------- Instrument panel ---------- */
/* Section container with a quiet header row. Replaces the gradient cards. */
export function Panel({
  title,
  icon,
  meta,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b bg-panel px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {icon && (
              <span className="text-signal [&>svg]:size-4" aria-hidden>
                {icon}
              </span>
            )}
            <h2 className="truncate text-sm font-semibold text-foreground">
              {title}
            </h2>
            {meta != null && (
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {meta}
              </span>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
