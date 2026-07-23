"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Process, SimulationConfig } from "../app/api/utils/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Panel } from "@/components/mlfq-ui";
import { eventTimes, snapshotAt } from "@/lib/timeline";
import { queueColor, queueTint } from "@/lib/queue";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Cpu,
  MonitorPlay,
} from "lucide-react";

interface ProcessMonitorProps {
  processes: Process[] | null;
  totalSimulationTime: number | null;
  activeConfig?: SimulationConfig | null;
}

const STEP_MS = 700;

const ProcessMonitor: React.FC<ProcessMonitorProps> = ({
  processes,
  totalSimulationTime,
  activeConfig,
}) => {
  const numQueues = activeConfig?.num_queues ?? 4;
  const total = totalSimulationTime ?? 0;

  const events = useMemo(
    () => (processes ? eventTimes(processes, total) : [0]),
    [processes, total]
  );

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clampedIndex = Math.min(index, events.length - 1);
  const t = events[clampedIndex] ?? 0;
  const atEnd = clampedIndex >= events.length - 1;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [processes]);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i >= events.length - 1 ? i : i + 1));
    }, STEP_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, events.length]);

  useEffect(() => {
    if (atEnd) setPlaying(false);
  }, [atEnd]);

  const snapshot = useMemo(
    () => (processes ? snapshotAt(processes, t) : []),
    [processes, t]
  );

  if (!processes || processes.length === 0 || !totalSimulationTime) {
    return null;
  }

  const running = snapshot.find((s) => s.state === "running");
  const finished = snapshot.filter((s) => s.state === "finished");
  const readyByQueue: Record<number, string[]> = {};
  for (let q = 0; q < numQueues; q++) readyByQueue[q] = [];
  snapshot
    .filter((s) => s.state === "ready")
    .forEach((s) => {
      const q = Math.min(numQueues - 1, Math.max(0, s.queue));
      readyByQueue[q].push(s.pid);
    });

  const togglePlay = () => {
    if (atEnd) setIndex(0);
    setPlaying((p) => !p);
  };

  return (
    <Panel
      title="Execution replay"
      icon={<MonitorPlay />}
      meta={
        <span>
          t=<span className="text-foreground">{t}</span> / {total}
        </span>
      }
      bodyClassName="space-y-4"
    >
      {/* Transport controls */}
      <div className="flex flex-col gap-3 rounded-lg border bg-panel/60 p-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPlaying(false);
              setIndex(0);
            }}
            disabled={clampedIndex === 0}
            aria-label="Reset"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPlaying(false);
              setIndex((i) => Math.max(0, i - 1));
            }}
            disabled={clampedIndex === 0}
            aria-label="Previous event"
          >
            <SkipBack className="size-4" />
          </Button>
          <Button size="icon" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPlaying(false);
              setIndex((i) => Math.min(events.length - 1, i + 1));
            }}
            disabled={atEnd}
            aria-label="Next event"
          >
            <SkipForward className="size-4" />
          </Button>
        </div>
        <div className="flex-1 px-1">
          <Slider
            min={0}
            max={Math.max(events.length - 1, 0)}
            step={1}
            value={[clampedIndex]}
            onValueChange={(v) => {
              setPlaying(false);
              setIndex(v[0]);
            }}
          />
        </div>
        <span className="shrink-0 text-center font-mono text-xs text-muted-foreground">
          event {clampedIndex + 1}/{events.length}
        </span>
      </div>

      {/* CPU */}
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Cpu className="size-4 text-signal" />
          CPU
        </span>
        {running ? (
          <span
            className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-sm font-semibold"
            style={{
              color: queueColor(running.queue),
              borderColor: `color-mix(in oklch, ${queueColor(running.queue)} 45%, transparent)`,
              background: queueTint(running.queue, 0.14),
            }}
          >
            <span
              className="size-1.5 animate-pulse rounded-full"
              style={{ background: queueColor(running.queue) }}
            />
            {running.pid}
            <span className="font-normal text-muted-foreground">· Q{running.queue}</span>
          </span>
        ) : (
          <span className="font-mono text-sm text-muted-foreground">idle</span>
        )}
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {finished.length}/{processes.length} finished
        </span>
      </div>

      {/* Ready queues */}
      <div className="space-y-1.5">
        {Array.from({ length: numQueues }, (_, q) => (
          <div
            key={q}
            className="flex items-center gap-3 rounded-lg border px-3 py-2"
            style={{
              borderColor: `color-mix(in oklch, ${queueColor(q)} 22%, var(--border))`,
              background: queueTint(q, 0.05),
            }}
          >
            <span
              className="flex w-14 shrink-0 items-center gap-1.5 font-mono text-xs font-medium"
              style={{ color: queueColor(q) }}
            >
              <span className="size-2 rounded-[2px]" style={{ background: queueColor(q) }} />
              Q{q}
            </span>
            <div className="flex min-h-6 flex-1 flex-wrap items-center gap-1.5">
              {readyByQueue[q].length > 0 ? (
                readyByQueue[q].map((pid) => (
                  <span
                    key={pid}
                    className="rounded-md border px-1.5 py-0.5 font-mono text-xs font-medium"
                    style={{
                      color: queueColor(q),
                      borderColor: `color-mix(in oklch, ${queueColor(q)} 40%, transparent)`,
                      background: queueTint(q, 0.12),
                    }}
                  >
                    {pid}
                  </span>
                ))
              ) : (
                <span className="font-mono text-xs text-muted-foreground/60">empty</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Step through time to watch processes enter, run on the CPU, and move
        between queues. The running job holds the CPU; everything else waits in
        its current priority queue.
      </p>
    </Panel>
  );
};

export default ProcessMonitor;
