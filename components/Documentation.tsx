"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, MousePointerClick, Cog, Wrench, LifeBuoy } from "lucide-react";

const NAV = [
  { title: "Overview", href: "/Documentation", icon: BookOpen },
  { title: "Using the simulator", href: "/Documentation/how-to-use", icon: MousePointerClick },
  { title: "How it works", href: "/Documentation/how-it-works", icon: Cog },
  { title: "Tools & tech", href: "/Documentation/tools", icon: Wrench },
  { title: "Contact & support", href: "/Documentation/contact", icon: LifeBuoy },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ title, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-signal-muted font-medium text-signal"
                : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {title}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Documentation({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <p className="data-label mb-3 px-3">Documentation</p>
            <NavLinks />
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="-mx-4 overflow-x-auto px-4 lg:hidden">
          <div className="flex gap-2 border-b pb-3">
            <MobileNav />
          </div>
        </div>

        <main className="min-w-0 max-w-3xl">{children}</main>
      </div>
    </div>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <>
      {NAV.map(({ title, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-signal/40 bg-signal-muted text-signal"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
            {title}
          </Link>
        );
      })}
    </>
  );
}
