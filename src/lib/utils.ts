import type { Application, ApplicationStatus, PipelineStage } from "@/types/dashboard";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function computePipeline(applications: Application[]): PipelineStage[] {
  const order: ApplicationStatus[] = [
    "Saved",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
  ];

  return order.map((status) => ({
    id: status,
    label: status,
    count: applications.filter((app) => app.status === status).length,
  }));
}

export function computeMetrics(applications: Application[]) {
  const total = applications.length;
  const interviews = applications.filter((a) => a.status === "Interview").length;
  const offers = applications.filter((a) => a.status === "Offer").length;
  const responded = applications.filter((a) =>
    ["Screening", "Interview", "Offer", "Rejected"].includes(a.status),
  ).length;
  const responseRate = total === 0 ? 0 : Math.round((responded / total) * 100);

  return {
    applications: total,
    interviews,
    offers,
    responseRate,
  };
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
