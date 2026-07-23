export interface Process {
  pid: string;
  state: "ready" | "running" | "blocked" | "finished";
  queue: number;
  arrival_time?: number;
  burst_time?: number;
  io_time?: number;
  priority?: number;
  waiting_time?: number;
  traditional_waiting_time?: number;
  turnaround_time?: number;
  response_time?: number;
  remaining_time?: number;
  remaining_io_time?: number;
  start_time?: number;
  finish_time?: number;
  first_execution_time?: number | null;
  context_switches?: number;
  cpu_usage_time?: number;
  cpu_efficiency?: number;
  io_efficiency?: number;
  waiting_ratio?: number;
  cpu_bursts_completed?: number;
  io_bursts_completed?: number;

  /** Real CPU execution slices from the backend: [start, end] pairs. */
  execution_history?: [number, number][];
  /** Queue transitions over time from the backend: [time, queue] pairs. */
  queue_history?: [number, number][];

  /** Legacy object form (unused by current backend, kept for compatibility). */
  execution_log?: {
    start_time: number;
    end_time: number;
    queue: number;
  }[];
}

export interface SimulationConfig {
  num_queues: number;
  time_slice: number;
  boost_interval: number;
  aging_threshold: number;
}

export interface SimulationRequest {
  processes: Process[];
  config: SimulationConfig;
}

export interface SimulationMetrics {
  avg_turnaround_time: number;
  avg_waiting_time: number;
  avg_response_time: number;
  avg_io_time?: number;
  cpu_utilization: number;
  throughput?: number;
  queue_distribution?: Record<string, number>;
  total_cpu_time?: number;
  total_io_time?: number;
  total_waiting_time?: number;
  total_time: number;
}

export interface SimulationResult {
  processes: Process[];
  metrics: SimulationMetrics;
}

export interface BackendResponse {
  results: SimulationResult;
  total_time?: number;
  metrics_description?: Record<string, string>;
}

export interface FrontendResult {
  processes: Process[];
  total_time: number;
  metrics: SimulationMetrics;
}

export interface ErrorResponse {
  detail: string;
}
