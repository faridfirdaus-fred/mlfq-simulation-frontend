"use client";

import React from "react";
import { Process, SimulationMetrics } from "../app/api/utils/types";
import { buildLanes } from "@/lib/timeline";
import { queueColor } from "@/lib/queue";
import { QueueChip } from "@/components/mlfq-ui";

interface StatisticsAnalysisProps {
  processes: Process[];
  metrics?: SimulationMetrics;
  numQueues: number;
}

const pct = (v: number) => `${Math.round(v * 100)}%`;

const StatisticsAnalysis: React.FC<StatisticsAnalysisProps> = ({
  processes,
  numQueues,
}) => {
  const lanes = buildLanes(processes);

  // CPU time spent in each queue, from real execution slices.
  const perQueue = Array.from({ length: Math.max(numQueues, 1) }, () => 0);
  for (const lane of lanes) {
    for (const s of lane.slices) {
      const q = Math.min(perQueue.length - 1, Math.max(0, s.queue));
      perQueue[q] += s.end - s.start;
    }
  }
  const maxQ = Math.max(...perQueue, 1);
  const totalCpu = perQueue.reduce((a, b) => a + b, 0) || 1;

  // Per-process efficiency, preferring backend-computed fields.
  const rows = processes.map((p) => {
    const span = (p.finish_time ?? 0) - (p.arrival_time ?? 0) || 1;
    return {
      pid: p.pid,
      queue: p.queue,
      cpu: p.cpu_efficiency ?? (p.burst_time ?? 0) / span,
      io: p.io_efficiency ?? (p.io_time ?? 0) / span,
      wait: p.waiting_ratio ?? (p.waiting_time ?? 0) / span,
      switches: p.context_switches,
    };
  });

  return (
    <div className="space-y-6">
      {/* CPU time per queue */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          CPU time per queue
        </h3>
        <div className="space-y-2">
          {perQueue.map((time, q) => (
            <div key={q} className="flex items-center gap-3">
              <QueueChip queue={q} className="w-12 justify-center" />
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${(time / maxQ) * 100}%`,
                    background: queueColor(q),
                  }}
                />
              </div>
              <span className="w-24 text-right font-mono text-xs tabular-nums text-muted-foreground">
                {time}u · {pct(time / totalCpu)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-xs text-muted-foreground">
          Where CPU cycles were spent across priority levels. Heavy activity in
          lower queues means CPU-bound jobs were correctly demoted.
        </p>
      </div>

      {/* Per-process efficiency */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Per-process efficiency
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr>
                <th className="data-label text-left">PID</th>
                <th className="data-label text-left">Final queue</th>
                <th className="data-label text-right">CPU</th>
                <th className="data-label text-right">I/O</th>
                <th className="data-label text-right">Waiting</th>
                <th className="data-label text-right">Switches</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.pid}>
                  <td className="py-1 font-mono text-sm font-medium">{r.pid}</td>
                  <td className="py-1">
                    <QueueChip queue={r.queue} />
                  </td>
                  <EffCell value={r.cpu} color="var(--signal)" />
                  <EffCell value={r.io} color="var(--state-finished)" />
                  <EffCell value={r.wait} color="var(--state-blocked)" />
                  <td className="py-1 text-right font-mono text-xs tabular-nums text-muted-foreground">
                    {r.switches ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function EffCell({ value, color }: { value: number; color: string }) {
  const w = Math.max(0, Math.min(1, value)) * 100;
  return (
    <td className="py-1">
      <div className="flex items-center justify-end gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
        </div>
        <span className="w-9 text-right font-mono text-xs tabular-nums text-muted-foreground">
          {pct(value)}
        </span>
      </div>
    </td>
  );
}

export default StatisticsAnalysis;
