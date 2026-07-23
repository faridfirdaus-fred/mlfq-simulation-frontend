/**
 * Turns the backend's execution_history / queue_history into render-ready
 * models for the Gantt timeline and the playback monitor. All MLFQ meaning
 * (which queue a slice ran in, who is on the CPU at time t) lives here.
 */

import type { Process } from "@/app/api/utils/types";

export interface Slice {
  start: number;
  end: number;
  queue: number;
}

export interface Lane {
  pid: string;
  slices: Slice[];
  arrival: number;
  finish: number;
}

/** Queue a process is in at time t (step function from queue_history). */
export function queueAt(
  history: [number, number][] | undefined,
  t: number,
  fallback = 0
): number {
  if (!history || history.length === 0) return fallback;
  let q = history[0][1];
  for (const [time, queue] of history) {
    if (time <= t) q = queue;
    else break;
  }
  return q;
}

/** One lane per process, each execution slice tagged with the queue it ran in. */
export function buildLanes(processes: Process[]): Lane[] {
  return processes.map((p) => {
    const history = p.execution_history ?? [];
    const slices: Slice[] = history.map(([start, end]) => ({
      start,
      end,
      queue: queueAt(p.queue_history, start, p.priority ?? p.queue ?? 0),
    }));
    return {
      pid: p.pid,
      slices,
      arrival: p.arrival_time ?? 0,
      finish: p.finish_time ?? (slices.at(-1)?.end ?? 0),
    };
  });
}

/** Sorted, de-duplicated event times across all slices, arrivals and finishes. */
export function eventTimes(processes: Process[], totalTime: number): number[] {
  const points = new Set<number>([0, totalTime]);
  for (const p of processes) {
    if (typeof p.arrival_time === "number") points.add(p.arrival_time);
    if (typeof p.finish_time === "number") points.add(p.finish_time);
    for (const [s, e] of p.execution_history ?? []) {
      points.add(s);
      points.add(e);
    }
  }
  return Array.from(points)
    .filter((t) => t >= 0 && t <= totalTime)
    .sort((a, b) => a - b);
}

export type ReplayState = "new" | "running" | "ready" | "finished";

export interface ReplaySnapshot {
  pid: string;
  state: ReplayState;
  queue: number;
}

/** State of every process at time t, for the playback monitor. */
export function snapshotAt(processes: Process[], t: number): ReplaySnapshot[] {
  return processes.map((p) => {
    const arrival = p.arrival_time ?? 0;
    const finish = p.finish_time ?? Infinity;
    const queue = queueAt(p.queue_history, t, p.priority ?? p.queue ?? 0);

    if (t < arrival) return { pid: p.pid, state: "new", queue };
    const running = (p.execution_history ?? []).some(
      ([s, e]) => t >= s && t < e
    );
    if (running) return { pid: p.pid, state: "running", queue };
    if (t >= finish) return { pid: p.pid, state: "finished", queue };
    return { pid: p.pid, state: "ready", queue };
  });
}
