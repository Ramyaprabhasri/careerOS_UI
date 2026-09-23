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
  "/dashboard/discover": {
    breadcrumb: "Workspace / Discover",
    title: "Discover Opportunities",
    description: "Find roles that match your skills and career goals.",
  },
  "/dashboard/interviews": {
    breadcrumb: "Workspace / Interviews",
    title: "Interview Preparation",
    description: "Practice with purpose for the conversations that matter.",
  },
  "/dashboard/ai-insights": {
    breadcrumb: "Workspace / AI Insights",
    title: "AI Insights",
    description: "Demo guidance patterned on your application activity.",
  },
  "/dashboard/resume-studio": {
    breadcrumb: "Workspace / Resume Analyzer",
    title: "AI Resume Analyzer",
    description:
      "Understand your resume and get closer to your next opportunity.",
  },
  "/dashboard/skills": {
    breadcrumb: "Workspace / Skills & Growth",
    title: "Skills & Growth",
    description: "Map strengths to the roles you are pursuing.",
  },
  "/dashboard/analytics": {
    breadcrumb: "Workspace / Analytics",
    title: "Career Analytics",
    description: "Turn your job search activity into insights you can act on.",
  },
  "/dashboard/settings": {
    breadcrumb: "Workspace / Settings",
    title: "Profile & Settings",
    description: "Manage your profile, preferences, and CareerOS workspace.",
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
