/**
 * Single source of truth for how queues and process states are rendered.
 * Queue level is encoded as an ordered priority ramp (Q0 = highest priority,
 * brightest). Every surface (table, results, Gantt, playback) reads from here
 * so color always carries the same meaning.
 */

import type { Process } from "@/app/api/utils/types";

/** Number of ramp stops defined in globals.css (--q-0 .. --q-9). */
export const QUEUE_RAMP_STOPS = 10;

/** CSS color for a queue level, clamped to the defined ramp. */
export function queueColor(queue: number): string {
  const q = Math.max(0, Math.min(QUEUE_RAMP_STOPS - 1, Math.round(queue || 0)));
  return `var(--q-${q})`;
}

/** Faint tinted background for a queue chip (color at low alpha). */
export function queueTint(queue: number, alpha = 0.14): string {
  return `color-mix(in oklch, ${queueColor(queue)} ${alpha * 100}%, transparent)`;
}

export type ProcessState = Process["state"];

interface StateMeta {
  label: string;
  /** CSS var for the state's signal color. */
  color: string;
  /** Short glyph used where a shape reinforces color (CVD-safe). */
  glyph: string;
}

export const STATE_META: Record<ProcessState, StateMeta> = {
  ready: { label: "Ready", color: "var(--state-ready)", glyph: "○" },
  running: { label: "Running", color: "var(--state-running)", glyph: "▶" },
  blocked: { label: "Blocked · I/O", color: "var(--state-blocked)", glyph: "◐" },
  finished: { label: "Finished", color: "var(--state-finished)", glyph: "●" },
};

export function stateMeta(state: ProcessState | undefined): StateMeta {
  return state && STATE_META[state]
    ? STATE_META[state]
    : { label: "Unknown", color: "var(--muted-foreground)", glyph: "—" };
}

/** Human label for a queue level, with the priority it represents. */
export function queueLabel(queue: number): string {
  return `Q${queue}`;
}
