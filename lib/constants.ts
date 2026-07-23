// API URL configuration
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://mlfq-simulation-backend.onrender.com");

// Default simulator configuration
export const DEFAULT_CONFIG = {
  num_queues: 4,
  time_slice: 2,
  boost_interval: 100,
  aging_threshold: 5,
};

// Configuration constraints and validation rules
export const CONFIG_CONSTRAINTS = {
  num_queues: {
    min: 1,
    max: 10,
    description: "Number of priority levels in the MLFQ",
  },
  time_slice: {
    min: 1,
    max: 20,
    description: "Base time quantum for the highest-priority queue",
  },
  boost_interval: {
    min: 1,
    max: 1000,
    description: "Interval between priority boosts",
  },
  aging_threshold: {
    min: 1,
    max: 100,
    description: "Wait time before a process ages up",
  },
};

// Queue visualization settings
export const QUEUE_COLORS = [
  "#4CAF50", // Queue 0 - Green (highest priority)
  "#2196F3", // Queue 1 - Blue
  "#FF9800", // Queue 2 - Orange
  "#F44336", // Queue 3 - Red
  "#9C27B0", // Queue 4 - Purple
  "#607D8B", // Queue 5 - Blue-gray
  "#795548", // Queue 6 - Brown
  "#009688", // Queue 7 - Teal
  "#FFEB3B", // Queue 8 - Yellow
  "#00BCD4", // Queue 9 - Cyan (lowest priority)
];

// Informative tooltips for configuration parameters
export const CONFIG_TOOLTIPS = {
  num_queues:
    "The number of distinct priority levels in the MLFQ scheduler. Queue 0 has the highest priority.",
  time_slice:
    "The time quantum given to processes in the highest-priority queue (Queue 0). Each lower queue gets (level + 1) × time_slice.",
  boost_interval:
    "After this many time units, every process is moved back to the highest-priority queue to prevent starvation.",
  aging_threshold:
    "After waiting this many time units in a queue, a process is promoted to a higher-priority queue.",
};

// Common explanatory texts
export const MLFQ_CONCEPTS = {
  queueLevels:
    "In MLFQ, processes move between priority queues based on their behavior. I/O-bound processes usually stay in the high-priority queues.",
  timeQuantum:
    "Each queue has a different time quantum. Lower (lower-priority) queues get a larger slice to reduce context-switching overhead for CPU-bound processes.",
  priorityBoost:
    "A priority boost periodically moves every process to the highest-priority queue to prevent starvation.",
  aging:
    "Aging promotes processes that have waited too long in a low-priority queue, keeping scheduling fair.",
};

// Sample process templates for quick setup
export const SAMPLE_PROCESSES = {
  basic: [
    { pid: "P1", arrival_time: 0, burst_time: 5, priority: 0, io_time: 2 },
    { pid: "P2", arrival_time: 1, burst_time: 3, priority: 0, io_time: 0 },
    { pid: "P3", arrival_time: 2, burst_time: 8, priority: 0, io_time: 3 },
  ],
  cpuBound: [
    { pid: "CPU1", arrival_time: 0, burst_time: 20, priority: 0, io_time: 0 },
    { pid: "CPU2", arrival_time: 0, burst_time: 15, priority: 0, io_time: 0 },
  ],
  ioBound: [
    { pid: "IO1", arrival_time: 0, burst_time: 4, priority: 0, io_time: 8 },
    { pid: "IO2", arrival_time: 0, burst_time: 3, priority: 0, io_time: 10 },
  ],
  mixed: [
    { pid: "CPU", arrival_time: 0, burst_time: 12, priority: 0, io_time: 0 },
    { pid: "MIX", arrival_time: 0, burst_time: 6, priority: 0, io_time: 4 },
    { pid: "IO", arrival_time: 0, burst_time: 3, priority: 0, io_time: 9 },
  ],
};