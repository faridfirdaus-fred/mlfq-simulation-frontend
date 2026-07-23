import Link from "next/link";
import Documentation from "@/components/Documentation";
import {
  DocHeader,
  DocSection,
  Callout,
  DocCardGrid,
  DocCard,
  DocDefList,
} from "@/components/docs-ui";
import {
  Plus,
  ListChecks,
  Settings2,
  Play,
  BarChart3,
  MonitorPlay,
  Info,
  Lightbulb,
  Compass,
  BookOpen,
  Cog,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "Using the simulator — MLFQ Simulator",
  description:
    "A step-by-step walkthrough of building a workload, tuning the scheduler, running it, and reading the results.",
};

export default function HowToUsePage() {
  return (
    <Documentation>
      <DocHeader
        eyebrow="Documentation"
        title="Using the simulator"
        lead="A step-by-step walkthrough of building a workload, tuning the scheduler, running it, and reading what the Multi-Level Feedback Queue decided — using the real controls in the app."
      />

      <DocSection title="Add a process" icon={<Plus />}>
        <p>
          Open the <Link href="/">Simulator</Link> and find the{" "}
          <strong>Add process</strong> panel. To create a new process:
        </p>
        <ol>
          <li>
            Give it a <strong>Process ID</strong> — a name that is unique across
            all processes. The field is pre-filled with the next{" "}
            <code>P1</code>, <code>P2</code>, … but you can rename it.
          </li>
          <li>
            Set the numeric parameters: <strong>Arrival</strong>,{" "}
            <strong>CPU burst</strong>, <strong>I/O time</strong>, and{" "}
            <strong>Priority</strong>.
          </li>
          <li>
            Click <strong>Add process</strong> to append it to the workload. The
            button briefly reads <strong>Added</strong> to confirm.
          </li>
        </ol>
        <p>
          Prefer a starting point? Use the <strong>Template</strong> dropdown to
          load values from a <em>Basic</em>, <em>CPU-bound</em>,{" "}
          <em>I/O-bound</em>, or <em>Mixed</em> preset, then adjust from there.
          As you type, the panel tags the process as{" "}
          <strong>CPU-bound</strong> (no I/O), <strong>I/O-bound</strong> (I/O
          time greater than the CPU burst), or <strong>Mixed</strong>.
        </p>
      </DocSection>

      <DocSection title="Process parameters" icon={<ListChecks />}>
        <p>What each field means when you define a process:</p>
        <DocDefList
          items={[
            {
              term: "Process ID",
              def: (
                <>
                  A unique identifier for the process, e.g. <code>P1</code>,{" "}
                  <code>Process_A</code>, or <code>Job3</code>.
                </>
              ),
            },
            {
              term: "Arrival",
              def: (
                <>
                  When the process enters the ready queue, in time units.{" "}
                  <code>0</code> means it is available at the start of the
                  simulation; <code>5</code> means it arrives after 5 time units.
                </>
              ),
            },
            {
              term: "CPU burst",
              def: (
                <>
                  Total CPU time the process needs to finish, in time units.{" "}
                  <code>8</code> means it requires 8 units of CPU to complete.
                </>
              ),
            },
            {
              term: "I/O time",
              def: (
                <>
                  Time the process spends blocked on I/O after its CPU burst.{" "}
                  <code>3</code> means it performs I/O for 3 time units; yielding
                  for I/O keeps a job at high priority.
                </>
              ),
            },
            {
              term: "Priority",
              def: (
                <>
                  The initial priority, which sets the starting queue.{" "}
                  <code>0</code> is the highest priority (top queue); larger
                  values start the process in a lower queue.
                </>
              ),
            },
          ]}
        />
        <Callout title="Tip" icon={<Lightbulb />}>
          <p>
            For a realistic simulation, give each process a different mix of
            arrival, CPU, and I/O values so the workload reflects real system
            conditions rather than a batch of identical jobs.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Configure the scheduler" icon={<Settings2 />}>
        <p>
          The <strong>Scheduler configuration</strong> panel controls how MLFQ
          behaves. Adjust the values, then click{" "}
          <strong>Apply configuration</strong> to use them for the next run.
        </p>
        <DocDefList
          items={[
            {
              term: "Queues",
              def: (
                <>
                  The number of distinct priority levels (1–10). Queue 0 has the
                  highest priority. Default: <code>4</code>.
                </>
              ),
            },
            {
              term: "Time slice",
              def: (
                <>
                  The base quantum given to the highest-priority queue (Q0).
                  Default: <code>2</code>.
                </>
              ),
            },
            {
              term: "Boost interval",
              def: (
                <>
                  After this many time units, every process is moved back to the
                  highest-priority queue to prevent starvation. Default:{" "}
                  <code>100</code>.
                </>
              ),
            },
            {
              term: "Aging threshold",
              def: (
                <>
                  After a process has waited this many time units in a queue, it
                  is promoted to a higher-priority queue. Default: <code>5</code>.
                </>
              ),
            },
          ]}
        />
        <p>
          Each lower queue gets a larger quantum, following{" "}
          <code>q = slice × (level + 1)</code>. The panel visualizes the quantum
          for every queue so you can see the tradeoff: higher-priority queues
          run first but get a shorter slice, so CPU-bound jobs sink and stay out
          of the way. Use the reset control in the panel to return to the
          defaults at any time.
        </p>
        <Callout title="How these interact" icon={<Info />}>
          <p>
            The number of queues, per-queue quantum, boost interval, and aging
            threshold together decide how quickly jobs are demoted and promoted.
            See <Link href="/Documentation/how-it-works">How it works</Link> for the
            full mechanics of demotion, boosting, and aging.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Run the simulation" icon={<Play />}>
        <p>
          With at least one process added, the controls bar shows the current
          status — <strong>No processes</strong>, <strong>Ready to run</strong>,{" "}
          <strong>Simulating…</strong>, or <strong>Completed</strong> — alongside
          the process count. To run it:
        </p>
        <ol>
          <li>
            Click <strong>Run simulation</strong> to execute the whole workload.
            While it computes, the button reads <strong>Running</strong>.
          </li>
          <li>
            After a run, the same button becomes <strong>Run again</strong> so
            you can re-run after tweaking parameters.
          </li>
          <li>
            Use <strong>Clear</strong> to remove all processes and start over.
          </li>
        </ol>
      </DocSection>

      <DocSection title="Read the results" icon={<BarChart3 />}>
        <p>
          Once a run finishes, the <strong>Results</strong> panel summarizes
          performance at the top and offers three detail views below.
        </p>
        <h3>Metrics</h3>
        <DocDefList
          items={[
            {
              term: "Avg turnaround",
              def: "Average of finish minus arrival, per process (time units).",
            },
            {
              term: "Avg waiting",
              def: "Average time processes were ready but not running (time units).",
            },
            {
              term: "Avg response",
              def: "Average time from arrival to a process's first CPU slice (time units).",
            },
            {
              term: "CPU utilization",
              def: "Busy CPU time divided by total time, as a percentage.",
            },
            {
              term: "Throughput",
              def: "Processes finished per time unit.",
            },
          ]}
        />
        <h3>Detail views</h3>
        <ul>
          <li>
            <strong>Timeline</strong> — a Gantt chart where each bar is a CPU
            slice, colored by the queue it ran in. Watch jobs sink to lower
            queues (cooler colors) as they use more CPU; gaps are time spent
            waiting or on I/O.
          </li>
          <li>
            <strong>Processes</strong> — a per-process table with the final
            queue plus start, finish, turnaround, waiting, and response times,
            and the ending state, so you can read completion order at a glance.
          </li>
          <li>
            <strong>Analysis</strong> — CPU time spent in each queue, plus
            per-process efficiency (CPU, I/O, waiting, and context switches).
            Heavy activity in lower queues means CPU-bound jobs were correctly
            demoted.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Replay the execution" icon={<MonitorPlay />}>
        <p>
          The <strong>Execution replay</strong> panel steps through the run one
          event at a time so you can see exactly how processes move between
          queues. Its transport controls let you:
        </p>
        <ul>
          <li>
            <strong>Play / Pause</strong> to advance automatically or hold at a
            moment in time.
          </li>
          <li>
            Step to the <strong>next</strong> or <strong>previous</strong> event,
            or drag the slider to any point in the timeline.
          </li>
          <li>
            <strong>Reset</strong> to jump back to the start.
          </li>
        </ul>
        <p>
          At each step the panel shows the job currently holding the{" "}
          <strong>CPU</strong> (with its queue) or <em>idle</em>, how many
          processes have finished, and the contents of every ready queue from Q0
          downward. Everything not running waits in its current priority queue.
        </p>
      </DocSection>

      <DocSection title="Where to next" icon={<Compass />}>
        <DocCardGrid>
          <DocCard
            href="/"
            title="Open the simulator"
            description="Build a workload and run it now."
            icon={<Play />}
          />
          <DocCard
            href="/Documentation/how-it-works"
            title="How it works"
            description="The mechanics of queues, demotion, boosting, and aging."
            icon={<Cog />}
          />
          <DocCard
            href="/Documentation"
            title="Overview"
            description="What MLFQ is and why it balances response and throughput."
            icon={<BookOpen />}
          />
          <DocCard
            href="/Documentation/tools"
            title="Tools & tech"
            description="The stack behind the simulator, front to back."
            icon={<Wrench />}
          />
        </DocCardGrid>
      </DocSection>
    </Documentation>
  );
}
