"use client";

import React from "react";
import { Process, SimulationMetrics } from "../app/api/utils/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel, MetricStat, QueueChip, StateBadge } from "@/components/mlfq-ui";
import StatisticsAnalysis from "./StatisticsAnalysis";
import GanttChart from "./GanttChart";
import { Table2, GanttChartSquare, BarChart3 } from "lucide-react";

interface ResultsDisplayProps {
  results: Process[] | null;
  totalTime: number;
  metrics?: SimulationMetrics;
  numQueues: number;
}

const METRICS: {
  key: keyof SimulationMetrics;
  label: string;
  unit?: string;
  hint: string;
  fmt?: (v: number) => string;
}[] = [
  {
    key: "avg_turnaround_time",
    label: "Avg turnaround",
    unit: "units",
    hint: "Finish − arrival, per process",
    fmt: (v) => v.toFixed(2),
  },
  {
    key: "avg_waiting_time",
    label: "Avg waiting",
    unit: "units",
    hint: "Time ready but not running",
    fmt: (v) => v.toFixed(2),
  },
  {
    key: "avg_response_time",
    label: "Avg response",
    unit: "units",
    hint: "Arrival to first CPU slice",
    fmt: (v) => v.toFixed(2),
  },
  {
    key: "cpu_utilization",
    label: "CPU utilization",
    unit: "%",
    hint: "Busy CPU time / total time",
    fmt: (v) => (v <= 1 ? v * 100 : v).toFixed(0),
  },
  {
    key: "throughput",
    label: "Throughput",
    unit: "proc/unit",
    hint: "Processes finished per time unit",
    fmt: (v) => v.toFixed(3),
  },
];

const cell = (v: number | undefined) =>
  v !== undefined ? (
    <span className="font-mono text-sm tabular-nums text-foreground">{v}</span>
  ) : (
    <span className="text-muted-foreground">—</span>
  );

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  totalTime,
  metrics,
  numQueues,
}) => {
  if (!results || results.length === 0) return null;

  const derived: SimulationMetrics = metrics ?? {
    avg_turnaround_time:
      results.reduce((a, p) => a + (p.turnaround_time || 0), 0) / results.length,
    avg_waiting_time:
      results.reduce((a, p) => a + (p.waiting_time || 0), 0) / results.length,
    avg_response_time:
      results.reduce((a, p) => a + (p.response_time || 0), 0) / results.length,
    cpu_utilization: 0,
    total_time: totalTime,
  };

  return (
    <Panel
      title="Results"
      icon={<BarChart3 />}
      meta={`total ${totalTime} units`}
      bodyClassName="space-y-6"
    >
      {/* Metric readouts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((m) => {
          const raw = derived[m.key];
          if (typeof raw !== "number") return null;
          return (
            <MetricStat
              key={m.key}
              label={m.label}
              value={m.fmt ? m.fmt(raw) : raw}
              unit={m.unit}
              hint={m.hint}
            />
          );
        })}
      </div>

      {/* Detail tabs */}
      <Tabs defaultValue="timeline">
        <TabsList className="w-full justify-start gap-1 bg-panel">
          <TabsTrigger value="timeline" className="gap-1.5">
            <GanttChartSquare className="size-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-1.5">
            <Table2 className="size-4" />
            Processes
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1.5">
            <BarChart3 className="size-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="pt-5">
          <GanttChart
            processes={results}
            totalTime={totalTime}
            numQueues={numQueues}
          />
        </TabsContent>

        <TabsContent value="table" className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="data-label">PID</TableHead>
                  <TableHead className="data-label">Queue</TableHead>
                  <TableHead className="data-label text-right">Start</TableHead>
                  <TableHead className="data-label text-right">Finish</TableHead>
                  <TableHead className="data-label text-right">Turnaround</TableHead>
                  <TableHead className="data-label text-right">Waiting</TableHead>
                  <TableHead className="data-label text-right">Response</TableHead>
                  <TableHead className="data-label">State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.pid} className="border-border/60">
                    <TableCell className="font-mono text-sm font-medium">
                      {r.pid}
                    </TableCell>
                    <TableCell>
                      <QueueChip queue={r.queue} />
                    </TableCell>
                    <TableCell className="text-right">{cell(r.start_time)}</TableCell>
                    <TableCell className="text-right">{cell(r.finish_time)}</TableCell>
                    <TableCell className="text-right">{cell(r.turnaround_time)}</TableCell>
                    <TableCell className="text-right">{cell(r.waiting_time)}</TableCell>
                    <TableCell className="text-right">{cell(r.response_time)}</TableCell>
                    <TableCell>
                      <StateBadge state={r.state} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="pt-5">
          <StatisticsAnalysis
            processes={results}
            metrics={metrics}
            numQueues={numQueues}
          />
        </TabsContent>
      </Tabs>
    </Panel>
  );
};

export default ResultsDisplay;
