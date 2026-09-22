"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_USER } from "@/data/mock";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard/interviews", label: "Interviews", icon: CalendarDays },
  { href: "/dashboard/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/resume-studio", label: "Resume Studio", icon: FileText },
  { href: "/dashboard/skills", label: "Skills & Growth", icon: TrendingUp },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

type SidebarProps = {
  mobileOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-7">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-[11px] font-bold tracking-tight text-accent">
            CO
          </span>
          <div>
            <p className="font-display text-[12px] font-semibold tracking-[0.18em] text-foreground">
              CAREEROS
            </p>
            <p className="text-[10px] tracking-[0.14em] text-muted-soft uppercase">
              Demo workspace
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {mainNav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "text-accent-bright"
                  : "text-muted hover:bg-white/[0.03] hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-accent/15"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-border px-3 pt-4 pb-5">
        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
            pathname.startsWith("/dashboard/settings")
              ? "bg-accent/15 text-accent-bright"
              : "text-muted hover:bg-white/[0.03] hover:text-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
            {DEMO_USER.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {DEMO_USER.fullName}
            </p>
            <p className="truncate text-[11px] text-muted">
              {DEMO_USER.workspace}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-border bg-background-elevated lg:block">
        <NavContent />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(100%,280px)] border-r border-border bg-background-elevated transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <NavContent onNavigate={onClose} />
      </aside>

      <button
        type="button"
        onClick={mobileOpen ? onClose : onOpen}
        className="fixed top-3.5 left-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground lg:hidden"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
    </>
  );
}
