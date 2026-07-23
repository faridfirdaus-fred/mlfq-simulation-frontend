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
  Network,
  MonitorSmartphone,
  Server,
  Palette,
  Wrench,
  Info,
  Database,
  ShieldCheck,
  Compass,
  Cog,
  MousePointerClick,
  LifeBuoy,
} from "lucide-react";

export const metadata = {
  title: "Tools & Tech — MLFQ Simulator",
  description:
    "The technology stack behind the MLFQ simulator, from the Next.js frontend to the FastAPI backend.",
};

const frontend = [
  {
    term: "Next.js 15",
    def: "React framework with the App Router; server components render the documentation and the application shell.",
  },
  {
    term: "React 19",
    def: "Component runtime powering the interactive simulator UI.",
  },
  {
    term: "TypeScript",
    def: "Static typing across the entire frontend codebase.",
  },
  {
    term: "Tailwind CSS v4",
    def: "Utility-first styling driven by the design-token theme.",
  },
  {
    term: "shadcn/ui + Radix UI",
    def: "Accessible primitives — dropdowns, tabs, sliders, tooltips, toasts — composed into the component library.",
  },
  {
    term: "lucide-react",
    def: "The icon set used throughout the interface.",
  },
  {
    term: "react-hook-form + zod",
    def: "Form state management with schema validation for the process and scheduler inputs.",
  },
  {
    term: "sonner",
    def: "Toast notifications for run status and error feedback.",
  },
  {
    term: "next-themes",
    def: "Light and dark theme switching, synced to the system preference.",
  },
];

const backend = [
  {
    term: "FastAPI",
    def: "The Python web framework that serves the simulation API.",
  },
  {
    term: "Uvicorn",
    def: "ASGI server that runs the FastAPI application.",
  },
  {
    term: "Pydantic",
    def: "Validates request and response payloads from Python type hints.",
  },
  {
    term: "MLFQ engine",
    def: "The scheduling algorithm, implemented in Python. The frontend posts a workload and configuration; the backend returns the execution timeline and metrics.",
  },
];

const tooling = [
  { term: "Git + GitHub", def: "Version control and collaboration." },
  { term: "ESLint", def: "Linting via eslint-config-next." },
  {
    term: "Turbopack",
    def: "Fast development bundler used by the dev server (next dev --turbopack).",
  },
  { term: "Pytest", def: "Unit tests for the Python backend." },
  { term: "HTTPX", def: "HTTP client used to exercise the API in tests." },
  { term: "VS Code", def: "The primary editor for the project." },
];

export default function ToolsPage() {
  return (
    <Documentation>
      <DocHeader
        eyebrow="Documentation"
        title="Tools & Tech"
        lead="The technology behind the simulator, front to back — the Next.js interface, the FastAPI scheduling service, and the tooling that ties them together."
      />

      <DocSection title="How it fits together" icon={<Network />}>
        <p>
          The simulator is split into two parts. A <strong>Next.js</strong>{" "}
          frontend builds the workload, renders the timeline, charts, and
          metrics, and manages theming. A separate <strong>FastAPI</strong>{" "}
          service written in Python runs the actual Multi-Level Feedback Queue
          computation.
        </p>
        <p>
          When you run a simulation, the frontend sends your process list and
          scheduler configuration to the backend over HTTP. The backend executes
          the schedule and returns the full timeline along with the computed
          metrics, which the frontend then visualizes.
        </p>
        <Callout title="Request flow" icon={<Info />}>
          <p>
            Browser (Next.js UI) → HTTP request with workload and config →
            FastAPI → MLFQ engine → timeline and metrics → back to the UI for
            rendering.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Frontend" icon={<MonitorSmartphone />}>
        <p>
          The interface is a modern React application built on the Next.js App
          Router:
        </p>
        <DocDefList items={frontend} />
      </DocSection>

      <DocSection title="Backend" icon={<Server />}>
        <p>
          A Python service handles every simulation request and the scheduling
          computation behind it:
        </p>
        <DocDefList items={backend} />
        <Callout title="No database" icon={<Database />}>
          <p>
            The backend is stateless. Each run computes the schedule on demand
            from the request payload, so there is nothing to persist between
            simulations — which keeps deployment and operation simple.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Design & styling" icon={<Palette />}>
        <p>
          The visual design favors clarity and ease of use, built entirely on
          the project&apos;s design tokens:
        </p>
        <ul>
          <li>
            <strong>Responsive, mobile-first layout</strong> that adapts to
            every screen size.
          </li>
          <li>
            <strong>Dark and light themes</strong> via next-themes, following
            the system preference by default.
          </li>
          <li>
            <strong>A single-accent visual language</strong> — one signal color
            and a monospace treatment for numbers — built on Tailwind CSS
            tokens.
          </li>
          <li>
            <strong>A minimal, content-first interface</strong> that keeps the
            focus on the data with little visual noise.
          </li>
        </ul>
        <Callout title="Accessibility" icon={<ShieldCheck />}>
          <p>
            Interactive components are built on Radix UI primitives, which
            provide keyboard navigation, focus management, and screen-reader
            support out of the box, so the simulator stays usable for everyone.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Development tooling" icon={<Wrench />}>
        <p>Tools and practices used while building and maintaining the project:</p>
        <DocDefList items={tooling} />
      </DocSection>

      <DocSection title="Keep exploring" icon={<Compass />}>
        <DocCardGrid>
          <DocCard
            href="/Documentation/how-it-works"
            title="How it works"
            description="The mechanics of queues, demotion, boosting, and aging."
            icon={<Cog />}
          />
          <DocCard
            href="/Documentation/how-to-use"
            title="Using the simulator"
            description="A step-by-step walkthrough of building and running a workload."
            icon={<MousePointerClick />}
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
