"use client";

import React from "react";
import { Process } from "../app/api/utils/types";
import { buildLanes } from "@/lib/timeline";
import { queueColor } from "@/lib/queue";

interface GanttChartProps {
  processes: Process[];
  totalTime: number;
  numQueues: number;
}

function ticks(total: number): number[] {
  if (total <= 0) return [0];
  const target = 10;
  const raw = total / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = raw / mag <= 1 ? mag : raw / mag <= 2 ? 2 * mag : 5 * mag;
  const out: number[] = [];
  for (let t = 0; t <= total; t += step) out.push(Math.round(t));
  if (out.at(-1) !== total) out.push(total);
  return out;
}

const GanttChart: React.FC<GanttChartProps> = ({
  processes,
  totalTime,
  numQueues,
}) => {
  const lanes = buildLanes(processes);
  const span = Math.max(totalTime, 1);
  const axis = ticks(totalTime);
  const hasSlices = lanes.some((l) => l.slices.length > 0);
  const queuesShown = Array.from({ length: Math.max(numQueues, 1) }, (_, i) => i);

  if (!hasSlices) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No execution timeline was returned for this run.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend: queue = priority ramp */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="data-label">Queue</span>
        {queuesShown.map((q) => (
          <span key={q} className="inline-flex items-center gap-1.5 text-xs">
            <span
              className="size-2.5 rounded-[2px]"
              style={{ background: queueColor(q) }}
            />
            <span className="font-mono text-muted-foreground">
              Q{q}
              {q === 0 ? " · highest" : q === numQueues - 1 ? " · lowest" : ""}
            </span>
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Rows */}
          <div className="relative">
            {/* Vertical gridlines */}
            <div className="pointer-events-none absolute inset-y-0 left-[4.5rem] right-0">
              {axis.map((t) => (
                <span
                  key={t}
                  className="absolute top-0 bottom-6 w-px bg-border/60"
                  style={{ left: `${(t / span) * 100}%` }}
                />
              ))}
            </div>

            <div className="relative space-y-1.5">
              {lanes.map((lane) => (
                <div key={lane.pid} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 truncate text-right font-mono text-xs font-medium text-foreground">
                    {lane.pid}
                  </span>
                  <div className="relative h-7 flex-1 rounded-md bg-muted/40">
                    {lane.slices.map((s, i) => {
                      const left = (s.start / span) * 100;
                      const width = Math.max(
                        ((s.end - s.start) / span) * 100,
                        0.6
                      );
                      const color = queueColor(s.queue);
                      return (
                        <div
                          key={i}
                          className="group absolute inset-y-1 flex items-center justify-center rounded-[3px] transition-[filter] hover:brightness-110"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            background: color,
                            boxShadow: `0 0 0 1px color-mix(in oklch, ${color} 60%, transparent)`,
                          }}
                          title={`${lane.pid} · Q${s.queue} · t=${s.start}–${s.end}`}
                        >
                          {width > 5 && (
                            <span className="pointer-events-none font-mono text-[0.625rem] font-semibold text-black/70">
                              {s.end - s.start}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Time axis */}
            <div className="relative ml-[4.5rem] mt-1 h-5">
              {axis.map((t) => (
                <span
                  key={t}
                  className="absolute top-0 -translate-x-1/2 font-mono text-[0.625rem] text-muted-foreground"
                  style={{ left: `${(t / span) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Each bar is a CPU slice; color shows the queue it ran in. Watch jobs sink
        to lower queues (cooler colors) as they use more CPU. Gaps are time spent
        waiting or on I/O.
      </p>
    </div>
  );
};

export default GanttChart;
