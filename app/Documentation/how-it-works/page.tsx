import Link from "next/link";
import Documentation from "@/components/Documentation";
import {
  DocHeader,
  DocSection,
  Callout,
  DocDefList,
  DocCardGrid,
  DocCard,
} from "@/components/docs-ui";
import {
  Layers,
  Timer,
  ArrowUpDown,
  ArrowUpToLine,
  Hourglass,
  SlidersHorizontal,
  Gauge,
  Cpu,
  Info,
  MousePointerClick,
  Play,
} from "lucide-react";

export const metadata = {
  title: "How it works — MLFQ Simulator",
  description:
    "The mechanics of the Multi-Level Feedback Queue: priority queues, per-queue time quanta, demotion, priority boost, and aging.",
};

export default function HowItWorksPage() {
  return (
    <Documentation>
      <DocHeader
        eyebrow="Documentation"
        title="How it works"
        lead="A look under the hood of the Multi-Level Feedback Queue: how processes are organized into priority queues, how each queue gets its own time quantum, and how the scheduler moves work up and down based on behavior alone."
      />

      <DocSection title="Algorithm overview" icon={<Layers />}>
        <p>
          The <strong>Multi-Level Feedback Queue</strong> (MLFQ) is a CPU
          scheduling algorithm that tries to serve both interactive and batch
          workloads well at the same time. It maintains several queues at
          different priority levels and uses <em>feedback</em> — observed
          behavior — to adjust each process&apos;s priority as it runs.
        </p>
        <Callout title="Why it works without a crystal ball" icon={<Info />}>
          <p>
            MLFQ captures the benefits of <strong>shortest-job-first</strong>{" "}
            and <strong>priority scheduling</strong> without needing any advance
            knowledge of how long a process will run. It infers that knowledge
            from how each process actually uses the CPU.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Multiple priority queues" icon={<Layers />}>
        <p>
          The scheduler keeps a set of queues, each at a distinct priority level.
          Lower queue numbers mean higher priority: <code>Q0</code> is served
          first, and the last queue is served last. A rough division of labor
          across the levels looks like this:
        </p>
        <ul>
          <li>
            <strong>Highest priority (Q0)</strong> — short, interactive
            processes that need fast response.
          </li>
          <li>
            <strong>Middle priority (Q1, Q2)</strong> — mixed workloads that
            alternate between computing and I/O.
          </li>
          <li>
            <strong>Lowest priority (bottom queue)</strong> — long, CPU-bound
            batch processes that value throughput over latency.
          </li>
        </ul>
        <p>
          A process is never pinned to a level. Where it ends up is decided
          entirely by its behavior over time, not by any label set in advance.
        </p>
      </DocSection>

      <DocSection title="Time quantum per queue" icon={<Timer />}>
        <p>
          Every queue has its own time quantum. Higher-priority queues use a{" "}
          <strong>shorter</strong> quantum so interactive jobs get the CPU back
          quickly; lower-priority queues use a <strong>longer</strong> quantum
          so long CPU-bound jobs run in bigger chunks and pay less
          context-switch overhead. The quantum grows with the queue level:
        </p>
        <p>
          <code>quantum = time_slice × (level + 1)</code>
        </p>
        <p>
          With a base <code>time_slice</code> of <code>2</code>, that gives{" "}
          <code>Q0 = 2</code>, <code>Q1 = 4</code>, <code>Q2 = 6</code>,{" "}
          <code>Q3 = 8</code>, and so on down the ramp — a fast top for
          responsiveness and a patient bottom for efficiency.
        </p>
      </DocSection>

      <DocSection title="How processes move between queues" icon={<ArrowUpDown />}>
        <p>
          Feedback is the heart of MLFQ. A process changes priority based on
          whether it consumes its whole quantum or gives up the CPU early:
        </p>
        <ol>
          <li>A new process enters at the highest-priority queue.</li>
          <li>
            If it uses its <strong>entire</strong> time quantum, it is assumed to
            be CPU-bound and is <strong>demoted</strong> one level to a
            lower-priority queue.
          </li>
          <li>
            If it releases the CPU <strong>before</strong> the quantum expires —
            typically to wait on I/O — it <strong>stays</strong> in the same
            queue.
          </li>
        </ol>
        <p>
          Over time this sorts work automatically: CPU-bound processes sink
          toward the bottom, while I/O-bound and interactive processes linger
          near the top where they are scheduled promptly.
        </p>
      </DocSection>

      <DocSection title="Preventing starvation" icon={<ArrowUpToLine />}>
        <p>
          If demotion were the only rule, a long job could sink to the bottom and
          never run again while short jobs keep arriving. MLFQ guards against this
          with two mechanisms:
        </p>
        <ul>
          <li>
            <strong>Priority boost</strong> — at a fixed interval, every process
            is moved back to the highest-priority queue, giving stuck work a
            fresh chance at the CPU.
          </li>
          <li>
            <strong>Aging</strong> — a process that has waited too long in a
            lower queue is individually promoted to a higher-priority queue,
            keeping the scheduler fair.
          </li>
        </ul>
        <Callout title="Fairness guarantee" icon={<Hourglass />}>
          <p>
            Together, boosting and aging ensure that no process waits
            indefinitely, regardless of how many higher-priority jobs are
            competing for the CPU.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Scheduler parameters" icon={<SlidersHorizontal />}>
        <p>
          Four parameters control the scheduler&apos;s behavior. You can tune all
          of them in the <Link href="/">Simulator</Link>:
        </p>
        <DocDefList
          items={[
            {
              term: "num_queues",
              def: (
                <>
                  The number of distinct priority levels in the scheduler.{" "}
                  <code>Q0</code> is the highest priority. Default{" "}
                  <code>4</code>.
                </>
              ),
            },
            {
              term: "time_slice",
              def: (
                <>
                  The base time quantum for the highest-priority queue (
                  <code>Q0</code>). Each lower queue receives{" "}
                  <code>(level + 1) × time_slice</code>. Default <code>2</code>.
                </>
              ),
            },
            {
              term: "boost_interval",
              def: (
                <>
                  After this many time units, all processes are moved back to the
                  highest-priority queue to prevent starvation. Default{" "}
                  <code>100</code>.
                </>
              ),
            },
            {
              term: "aging_threshold",
              def: (
                <>
                  After a process has waited this many time units in a queue, it
                  is promoted to a higher-priority queue. Default <code>5</code>.
                </>
              ),
            },
          ]}
        />
      </DocSection>

      <DocSection title="What the simulator implements" icon={<Cpu />}>
        <p>This build of the simulator provides:</p>
        <ul>
          <li>Real-time visualization of processes moving between queues.</li>
          <li>Interactive creation and management of processes.</li>
          <li>Adjustable MLFQ parameters.</li>
          <li>Performance-metric calculation across the whole run.</li>
        </ul>
      </DocSection>

      <DocSection title="Performance metrics" icon={<Gauge />}>
        <p>
          The simulation tracks several standard scheduling metrics so you can
          compare how different configurations perform:
        </p>
        <DocDefList
          items={[
            {
              term: "Turnaround time",
              def: "Total time from a process's submission to its completion.",
            },
            {
              term: "Waiting time",
              def: "Time a process spends waiting in the queues.",
            },
            {
              term: "Response time",
              def: "Time from submission until the first CPU allocation.",
            },
            {
              term: "CPU utilization",
              def: "Percentage of time the CPU is kept busy.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="Next steps" icon={<Info />}>
        <DocCardGrid>
          <DocCard
            href="/Documentation/how-to-use"
            title="Using the simulator"
            description="A step-by-step walkthrough of building and running a workload."
            icon={<MousePointerClick />}
          />
          <DocCard
            href="/"
            title="Open the Simulator"
            description="Load a sample workload, tune the scheduler, and run it."
            icon={<Play />}
          />
        </DocCardGrid>
      </DocSection>
    </Documentation>
  );
}
