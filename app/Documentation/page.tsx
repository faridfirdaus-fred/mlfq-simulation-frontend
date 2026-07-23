import Link from "next/link";
import Documentation from "@/components/Documentation";
import {
  DocHeader,
  DocSection,
  Callout,
  DocCardGrid,
  DocCard,
} from "@/components/docs-ui";
import {
  Info,
  Rocket,
  Layers,
  Repeat,
  MousePointerClick,
  Cog,
  Wrench,
  LifeBuoy,
} from "lucide-react";

export const metadata = {
  title: "Documentation — MLFQ Simulator",
  description: "Learn how the Multi-Level Feedback Queue scheduler works and how to use the simulator.",
};

export default function DocumentationPage() {
  return (
    <Documentation>
      <DocHeader
        eyebrow="Documentation"
        title="MLFQ Simulator"
        lead="An interactive tool for exploring the Multi-Level Feedback Queue CPU scheduling algorithm. Build a workload, run it, and watch how the scheduler decides what runs next."
      />

      <DocSection title="What is MLFQ?" icon={<Info />}>
        <p>
          The <strong>Multi-Level Feedback Queue</strong> (MLFQ) is a CPU
          scheduling algorithm that balances two competing goals: fast response
          for short, interactive jobs and good throughput for long, CPU-bound
          ones. It does this without knowing anything about a process in advance
          — it <em>learns</em> from how each process behaves and adjusts its
          priority on the fly.
        </p>
        <p>
          Processes live in a set of queues ordered by priority. A job that uses
          its whole time slice is assumed to be CPU-bound and sinks to a lower
          queue; a job that yields early (often for I/O) stays near the top where
          it gets scheduled quickly.
        </p>
      </DocSection>

      <DocSection title="Key ideas" icon={<Layers />}>
        <DocCardGrid>
          <DocCard
            href="/Documentation/how-it-works"
            title="Multiple priority queues"
            description="Processes are organized into queues, each with its own time quantum."
            icon={<Layers />}
          />
          <DocCard
            href="/Documentation/how-it-works"
            title="Dynamic priority"
            description="A process moves between queues based on how it uses the CPU."
            icon={<Repeat />}
          />
        </DocCardGrid>
        <Callout title="Preventing starvation" icon={<Info />}>
          <p>
            Left alone, long jobs could sink to the bottom and never run again.
            MLFQ counters this with a periodic <strong>priority boost</strong>{" "}
            and <strong>aging</strong>, which promote waiting processes back up.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Getting started" icon={<Rocket />}>
        <ol>
          <li>Open the <Link href="/">Simulator</Link> and load a sample workload, or add your own processes.</li>
          <li>
            Give each process an arrival time, CPU burst, optional I/O time, and
            priority.
          </li>
          <li>Tune the scheduler: number of queues, time slice, boost interval, aging threshold.</li>
          <li>Run the simulation and read the timeline, metrics, and replay.</li>
        </ol>
      </DocSection>

      <DocSection title="Explore the docs" icon={<Info />}>
        <DocCardGrid>
          <DocCard
            href="/Documentation/how-to-use"
            title="Using the simulator"
            description="A step-by-step walkthrough of building and running a workload."
            icon={<MousePointerClick />}
          />
          <DocCard
            href="/Documentation/how-it-works"
            title="How it works"
            description="The mechanics of queues, demotion, boosting, and aging."
            icon={<Cog />}
          />
          <DocCard
            href="/Documentation/tools"
            title="Tools & tech"
            description="The stack behind the simulator, front to back."
            icon={<Wrench />}
          />
          <DocCard
            href="/Documentation/contact"
            title="Contact & support"
            description="Get help, report an issue, or reach the team."
            icon={<LifeBuoy />}
          />
        </DocCardGrid>
      </DocSection>
    </Documentation>
  );
}
