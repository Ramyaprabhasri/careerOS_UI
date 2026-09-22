"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const meta: Record<
  string,
  { breadcrumb: string; title: string; description: string }
> = {
  "/dashboard": {
    breadcrumb: "Workspace / Overview",
    title: "Career overview",
    description: "Your career journey, all in one place.",
  },
  "/dashboard/applications": {
    breadcrumb: "Workspace / Applications",
    title: "Applications board",
    description: "Kanban tracking from wishlist to offer.",
  },
  "/dashboard/interviews": {
    breadcrumb: "Workspace / Interviews",
    title: "Interviews",
    description: "Prepare for conversations that move your career forward.",
  },
  "/dashboard/ai-insights": {
    breadcrumb: "Workspace / AI Insights",
    title: "AI Insights",
    description: "Demo guidance patterned on your application activity.",
  },
  "/dashboard/resume-studio": {
    breadcrumb: "Workspace / Resume Studio",
    title: "Resume Studio",
    description: "Shape role-specific narratives for your next application.",
  },
  "/dashboard/skills": {
    breadcrumb: "Workspace / Skills & Growth",
    title: "Skills & Growth",
    description: "Map strengths to the roles you are pursuing.",
  },
  "/dashboard/analytics": {
    breadcrumb: "Workspace / Analytics",
    title: "Analytics",
    description: "Understand trends across your search activity.",
  },
  "/dashboard/settings": {
    breadcrumb: "Workspace / Settings",
    title: "Settings",
    description: "Workspace preferences for this portfolio demo.",
  },
};

export function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const page = meta[pathname] ?? {
    breadcrumb: "Workspace",
    title: "CareerOS",
    description: "AI-powered career workspace",
  };

  return (
    <DashboardShell
      breadcrumb={page.breadcrumb}
      title={page.title}
      description={page.description}
    >
      {children}
    </DashboardShell>
  );
}
