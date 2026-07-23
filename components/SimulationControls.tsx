import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Loader2, RotateCcw } from "lucide-react";

interface SimulationControlsProps {
  onStart: () => void;
  onClear: () => void;
  isRunning: boolean;
  processCount: number;
  isSimulated?: boolean;
  disableStart?: boolean;
  disableClear?: boolean;
}

type Status = "empty" | "ready" | "running" | "done";

const STATUS: Record<Status, { label: string; color: string }> = {
  empty: { label: "No processes", color: "var(--muted-foreground)" },
  ready: { label: "Ready to run", color: "var(--state-ready)" },
  running: { label: "Simulating…", color: "var(--state-running)" },
  done: { label: "Completed", color: "var(--state-finished)" },
};

const SimulationControls: React.FC<SimulationControlsProps> = ({
  onStart,
  onClear,
  isRunning,
  processCount,
  isSimulated = false,
  disableStart = false,
  disableClear = false,
}) => {
  const status: Status = isRunning
    ? "running"
    : processCount === 0
    ? "empty"
    : isSimulated
    ? "done"
    : "ready";
  const s = STATUS[status];

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5 px-1">
        <span
          className="size-2 rounded-full"
          style={{
            background: s.color,
            boxShadow: `0 0 0 3px color-mix(in oklch, ${s.color} 18%, transparent)`,
          }}
          aria-hidden
        />
        <span className="text-sm font-medium text-foreground">{s.label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {processCount} {processCount === 1 ? "process" : "processes"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={isRunning || disableClear}
          className="gap-1.5 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Clear
        </Button>
        <Button
          onClick={onStart}
          disabled={isRunning || disableStart}
          className="gap-2 px-5"
        >
          {isRunning ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Running
            </>
          ) : isSimulated ? (
            <>
              <RotateCcw className="size-4" />
              Run again
            </>
          ) : (
            <>
              <Play className="size-4" />
              Run simulation
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimulationControls;
