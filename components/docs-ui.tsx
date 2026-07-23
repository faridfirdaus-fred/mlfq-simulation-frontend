import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

/* Page title + lead paragraph. */
export function DocHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-8 border-b pb-6">
      {eyebrow && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-signal">
          {eyebrow}
        </p>
      )}
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {lead && (
        <p className="mt-3 max-w-[65ch] text-pretty text-base leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
    </header>
  );
}

/* A titled section with an optional signal-colored icon. */
export function DocSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 scroll-mt-20">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-foreground">
        {icon && (
          <span className="text-signal [&>svg]:size-5" aria-hidden>
            {icon}
          </span>
        )}
        {title}
      </h2>
      <div className="doc">{children}</div>
    </section>
  );
}

/* Bordered note box. No colored side-stripe — full border + tint only. */
export function Callout({
  title,
  icon,
  children,
  tone = "info",
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: "info" | "warning";
}) {
  const color = tone === "warning" ? "var(--warning)" : "var(--signal)";
  return (
    <div
      className="my-5 rounded-lg border p-4"
      style={{
        borderColor: `color-mix(in oklch, ${color} 28%, var(--border))`,
        background: `color-mix(in oklch, ${color} 6%, transparent)`,
      }}
    >
      {title && (
        <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon && (
            <span style={{ color }} className="[&>svg]:size-4" aria-hidden>
              {icon}
            </span>
          )}
          {title}
        </p>
      )}
      <div className="doc [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 text-sm">
        {children}
      </div>
    </div>
  );
}

/* Grid of navigation cards linking to other doc pages / the app. */
export function DocCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
  );
}

export function DocCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-signal/40 hover:bg-accent/30"
    >
      {icon && (
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border bg-background text-signal [&>svg]:size-4">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-signal">
          {title}
          <ArrowRight className="size-3.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  );
}

/* Simple key/value spec row group, e.g. for parameter references. */
export function DocDefList({
  items,
  className,
}: {
  items: { term: string; def: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn("my-5 divide-y rounded-lg border", className)}>
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-[160px_1fr] sm:gap-4">
          <dt className="font-mono text-sm font-medium text-foreground">{it.term}</dt>
          <dd className="text-sm text-muted-foreground">{it.def}</dd>
        </div>
      ))}
    </dl>
  );
}
