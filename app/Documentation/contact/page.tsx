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
  LifeBuoy,
  Github,
  Mail,
  GitBranch,
  Users,
  MessageCircle,
  MessagesSquare,
  AtSign,
  MousePointerClick,
  Cog,
  Wrench,
  Monitor,
  Server,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Contact & Support — MLFQ Simulator",
  description:
    "Get help, report an issue, contribute, or reach the MLFQ Simulator team and community.",
};

export default function ContactPage() {
  return (
    <Documentation>
      <DocHeader
        eyebrow="Contact & support"
        title="Contact & Support"
        lead="Need help with the MLFQ Simulator, want to report a bug, or looking to contribute? Here is how to reach the project and get support."
      />

      <DocSection title="Getting help" icon={<LifeBuoy />}>
        <p>
          If you need help with the MLFQ Simulator, there are several ways to
          get support. Start with the documentation — most questions are
          answered there.
        </p>
        <DocCardGrid>
          <DocCard
            href="/Documentation/how-to-use"
            title="Using the simulator"
            description="Usage instructions and a step-by-step walkthrough."
            icon={<MousePointerClick />}
          />
          <DocCard
            href="/Documentation/how-it-works"
            title="How it works"
            description="MLFQ algorithm details and scheduling mechanics."
            icon={<Cog />}
          />
          <DocCard
            href="/Documentation/tools"
            title="Tools & tech"
            description="Information about the technology stack."
            icon={<Wrench />}
          />
        </DocCardGrid>
      </DocSection>

      <DocSection title="Source code" icon={<Github />}>
        <p>The source code is split across two repositories:</p>
        <DocCardGrid>
          <DocCard
            href="https://github.com/faridfirdaus-fred/mlfq-simulation-frontend"
            title="Frontend repository"
            description="The Next.js app with the user interface and visualization components."
            icon={<Monitor />}
          />
          <DocCard
            href="https://github.com/faridfirdaus-fred/mlfq-simulation-backend"
            title="Backend repository"
            description="The Python FastAPI service that implements the MLFQ algorithm."
            icon={<Server />}
          />
        </DocCardGrid>

        <h3>Reporting an issue</h3>
        <ol>
          <li>
            Check the existing issues to see whether your problem has already
            been reported.
          </li>
          <li>Open a new issue with a clear description of the problem.</li>
          <li>
            Note which repository the issue relates to (frontend or backend).
          </li>
          <li>Include steps to reproduce the problem where applicable.</li>
        </ol>
      </DocSection>

      <DocSection title="Email support" icon={<Mail />}>
        <p>For direct support, you can reach us by email:</p>
        <DocDefList
          items={[
            {
              term: "Technical support",
              def: (
                <a href="mailto:support@mlfq-simulation.com">
                  support@mlfq-simulation.com
                </a>
              ),
            },
            {
              term: "Feature requests",
              def: (
                <a href="mailto:features@mlfq-simulation.com">
                  features@mlfq-simulation.com
                </a>
              ),
            },
          ]}
        />
      </DocSection>

      <DocSection title="Contributing" icon={<GitBranch />}>
        <p>
          We welcome contributions to either the frontend or backend
          repository:
        </p>
        <ol>
          <li>Fork the relevant repository (frontend or backend).</li>
          <li>Create a feature branch.</li>
          <li>Make your changes.</li>
          <li>Submit a pull request.</li>
        </ol>
        <Callout title="Contribution guidelines" icon={<Info />}>
          <p>
            Make sure your code follows our coding standards and includes
            appropriate tests. For larger changes, please open an issue first to
            discuss what you would like to change.
          </p>
        </Callout>
      </DocSection>

      <DocSection title="Community" icon={<Users />}>
        <p>
          Join our community to stay up to date and connect with other users:
        </p>
        <DocCardGrid>
          <DocCard
            href="https://discord.gg/mlfq-simulation"
            title="Discord server"
            description="Join the Discord."
            icon={<MessageCircle />}
          />
          <DocCard
            href="https://twitter.com/mlfq_simulation"
            title="Twitter"
            description="@mlfq_simulation"
            icon={<AtSign />}
          />
          <DocCard
            href="https://github.com/faridfirdaus-fred/mlfq-simulation-frontend/discussions"
            title="GitHub Discussions"
            description="Follow the discussion."
            icon={<MessagesSquare />}
          />
        </DocCardGrid>
      </DocSection>
    </Documentation>
  );
}
