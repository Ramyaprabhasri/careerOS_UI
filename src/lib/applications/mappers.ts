import type {
  Application,
  EmploymentType,
  TimelineEvent,
} from "@/types/dashboard";

type PrismaEmploymentType =
  | "Full_time"
  | "Contract"
  | "Internship"
  | "Part_time";

type DbTag = {
  label: string;
};

type DbTimelineEvent = {
  id: string;
  label: string;
  date: Date | null;
  completed: boolean;
  sortOrder: number;
};

export type ApplicationWithRelations = {
  id: string;
  company: string;
  role: string;
  location: string;
  dateApplied: Date;
  status: Application["status"];
  matchScore: number;
  notes: string | null;
  salaryRange: string | null;
  source: string | null;
  jobUrl: string | null;
  workMode: Application["workMode"];
  employmentType: PrismaEmploymentType;
  priority: Application["priority"];
  resumeUsed: string | null;
  followUpDate: Date | null;
  updatedAt: Date;
  tags: DbTag[];
  timeline: DbTimelineEvent[];
};

export const applicationInclude = {
  tags: true,
  timeline: {
    orderBy: { sortOrder: "asc" as const },
  },
} as const;

export function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toPrismaEmploymentType(
  value: EmploymentType,
): PrismaEmploymentType {
  switch (value) {
    case "Full-time":
      return "Full_time";
    case "Part-time":
      return "Part_time";
    default:
      return value;
  }
}

export function toFrontendEmploymentType(
  value: PrismaEmploymentType,
): EmploymentType {
  switch (value) {
    case "Full_time":
      return "Full-time";
    case "Part_time":
      return "Part-time";
    default:
      return value;
  }
}

export function mapTimelineEvent(event: DbTimelineEvent): TimelineEvent {
  return {
    id: event.id,
    label: event.label,
    ...(event.date ? { date: toDateOnly(event.date) } : {}),
    completed: event.completed,
  };
}

export function mapApplication(
  application: ApplicationWithRelations,
): Application {
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    location: application.location,
    dateApplied: toDateOnly(application.dateApplied),
    status: application.status,
    matchScore: application.matchScore,
    ...(application.notes != null ? { notes: application.notes } : {}),
    ...(application.salaryRange != null
      ? { salaryRange: application.salaryRange }
      : {}),
    ...(application.source != null ? { source: application.source } : {}),
    ...(application.jobUrl != null ? { jobUrl: application.jobUrl } : {}),
    workMode: application.workMode,
    employmentType: toFrontendEmploymentType(application.employmentType),
    priority: application.priority,
    ...(application.resumeUsed != null
      ? { resumeUsed: application.resumeUsed }
      : {}),
    ...(application.followUpDate
      ? { followUpDate: toDateOnly(application.followUpDate) }
      : {}),
    updatedAt: toDateOnly(application.updatedAt),
    tags: application.tags.map((tag) => tag.label),
    timeline: [...application.timeline]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapTimelineEvent),
  };
}
