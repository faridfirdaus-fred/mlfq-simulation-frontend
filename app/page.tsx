"use client";

import React, { useState } from "react";
import ProcessForm from "@/components/ProcessForm";
import ConfigForm from "@/components/ConfigForm";
import ProcessTable from "@/components/ProcessTable";
import SimulationControls from "@/components/SimulationControls";
import ResultsDisplay from "@/components/ResultsDisplay";
import ProcessMonitor from "@/components/ProcessMonitor";
import { Process, SimulationConfig, SimulationMetrics } from "./api/utils/types";
import { fetchSimulationResults } from "./api/utils/apiClient";
import { AlertCircle, ArrowRight, Layers } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DEFAULT_CONFIG, SAMPLE_PROCESSES } from "@/lib/constants";
import Link from "next/link";

const SAMPLES: { key: keyof typeof SAMPLE_PROCESSES; label: string; note: string }[] = [
  { key: "basic", label: "Basic", note: "Mixed arrival + I/O" },
  { key: "cpuBound", label: "CPU-bound", note: "Long bursts, no I/O" },
  { key: "ioBound", label: "I/O-bound", note: "Short bursts, heavy I/O" },
  { key: "mixed", label: "Mixed load", note: "CPU + I/O together" },
];

export default function SimulationPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [results, setResults] = useState<Process[] | null>(null);
  const [metrics, setMetrics] = useState<SimulationMetrics | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  const handleAddProcess = (process: Process) => {
    if (processes.some((p) => p.pid === process.pid)) {
      toast.error("Duplicate process ID", {
        description: `"${process.pid}" is already in use. Choose a different ID.`,
      });
      return;
    }
    setProcesses((prev) => [...prev, process]);
    toast.success(`Process ${process.pid} added`);
    setError(null);
    setIsSimulated(false);
  };

  const handleLoadSample = (key: keyof typeof SAMPLE_PROCESSES) => {
    const sample = SAMPLE_PROCESSES[key].map((p) => ({
      ...p,
      state: "ready" as const,
      queue: p.priority ?? 0,
    }));
    setProcesses(sample);
    setResults(null);
    setIsSimulated(false);
    setError(null);
    toast.success(`Loaded ${sample.length} sample processes`);
  };

  const handleUpdateConfig = (newConfig: SimulationConfig) => {
    setConfig(newConfig);
    setError(null);
    setIsSimulated(false);
  };

  const handleRemoveProcess = (pid: string) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
    setIsSimulated(false);
  };

  const handleStartSimulation = async () => {
    if (processes.length === 0) {
      toast.error("Nothing to simulate", {
        description: "Add at least one process before running.",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Running simulation…");
    try {
      const result = await fetchSimulationResults(processes, config);
      setResults(result.processes);
      setMetrics(result.metrics);
      setTotalTime(result.total_time);
      setIsSimulated(true);
      toast.success("Simulation complete", {
        id: toastId,
        description: `Total time: ${result.total_time} units`,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Something went wrong during the simulation";
      setError(errorMsg);
      toast.error("Simulation failed", { id: toastId, description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setProcesses([]);
    setResults(null);
    setMetrics(null);
    setError(null);
    setIsSimulated(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 border-b pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-signal">
            <Layers className="size-3.5" />
            CPU Scheduling
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Multi-Level Feedback Queue
          </h1>
          <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
            Define processes and scheduler parameters, then watch how the MLFQ
            algorithm promotes, demotes, and boosts jobs to decide what runs next.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit gap-2">
          <Link href="/Documentation/how-it-works">
            How it works
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertTitle>Simulation error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Setup */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConfigForm
          onSubmit={handleUpdateConfig}
          defaultValues={DEFAULT_CONFIG}
          isSimulationRunning={isLoading}
        />
        <ProcessForm onSubmit={handleAddProcess} processCount={processes.length} />
      </div>

      {/* Process set or teaching empty state */}
      <div className="mt-6">
        {processes.length > 0 ? (
          <ProcessTable processes={processes} onRemove={handleRemoveProcess} />
        ) : (
          <div className="instrument-grid flex flex-col items-center gap-5 rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
            <div className="grid size-11 place-items-center rounded-lg border bg-background text-signal">
              <Layers className="size-5" />
            </div>
            <div className="max-w-md space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                No processes yet
              </h2>
              <p className="text-sm text-muted-foreground">
                Add a process above, or load a ready-made set to see the scheduler
                in action.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handleLoadSample(s.key)}
                  className="group flex flex-col items-start gap-0.5 rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:border-signal/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-signal">
                    {s.label}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-muted-foreground">
                    {s.note}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6">
        <SimulationControls
          onStart={handleStartSimulation}
          onClear={handleClearAll}
          isRunning={isLoading}
          processCount={processes.length}
          isSimulated={isSimulated}
          disableStart={processes.length === 0}
          disableClear={processes.length === 0}
        />
      </div>

      {/* Results */}
      {isSimulated && results && (
        <div className="mt-10 space-y-10">
          <ResultsDisplay
            results={results}
            totalTime={totalTime}
            metrics={metrics ?? undefined}
            numQueues={config.num_queues}
          />
          <ProcessMonitor
            processes={results}
            totalSimulationTime={totalTime}
            activeConfig={config}
          />
        </div>
      )}
    </main>
  );
}
