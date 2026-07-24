"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Sun, Moon, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Simulator", href: "/" },
  { name: "Documentation", href: "/Documentation" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-sticky w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="MLFQ Simulator — home">
          <span className="grid size-8 place-items-center rounded-md bg-signal text-signal-foreground shadow-sm">
            <Cpu className="size-4" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              
            </span>
            <span className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              Scheduler
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                {item.name}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[11px] h-0.5 rounded-full bg-signal" />
                )}
              </Link>
            );
          })}

          <div className="mx-1 h-5 w-px bg-border" aria-hidden />

          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle color theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
