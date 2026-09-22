import type {
  Application,
  ApplicationSort,
  ApplicationStatus,
  Priority,
  TimelineEvent,
  WorkMode,
} from "@/types/dashboard";

export const BOARD_COLUMNS: Array<{
  id: ApplicationStatus;
  label: string;
  emptyTitle: string;
  emptyDescription: string;
  accent: string;
}> = [
  {
    id: "Saved",
    label: "Wishlist",
    emptyTitle: "Nothing here yet.",
    emptyDescription: "Save interesting opportunities and keep them within reach.",
    accent: "bg-muted",
  },
  {
    id: "Applied",
    label: "Applied",
    emptyTitle: "Nothing here yet.",
    emptyDescription: "Submitted applications will appear in this stage.",
    accent: "bg-foreground/50",
  },
  {
    id: "Screening",
    label: "Screening",
    emptyTitle: "Nothing here yet.",
    emptyDescription: "Recruiter screens and early conversations land here.",
    accent: "bg-sky-400",
  },
  {
    id: "Interview",
    label: "Interview",
    emptyTitle: "Nothing here yet.",
    emptyDescription: "Active interview loops will show up in this column.",
    accent: "bg-accent",
  },
  {
    id: "Offer",
    label: "Offer",
    emptyTitle: "Nothing here yet.",
    emptyDescription: "Your next opportunity could land here.",
    accent: "bg-emerald-400",
  },
  {
    id: "Rejected",
    label: "Rejected",
    emptyTitle: "Nothing here yet.",
    emptyDescription: "Closed loops stay archived here for reference.",
    accent: "bg-rose-400",
  },
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  Saved: "Wishlist",
  Applied: "Applied",
  Screening: "Screening",
  Interview: "Interview",
  Offer: "Offer",
  Rejected: "Rejected",
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export const STATUS_ORDER: Record<ApplicationStatus, number> = {
  Saved: 0,
  Applied: 1,
  Screening: 2,
  Interview: 3,
  Offer: 4,
  Rejected: 5,
};

export function companyInitials(company: string) {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function defaultTimeline(status: ApplicationStatus): TimelineEvent[] {
  const stages = [
    "Applied",
    "Recruiter Screening",
    "Technical Interview",
    "HR Interview",
    "Offer",
  ];

  const completedThrough: Record<ApplicationStatus, number> = {
    Saved: -1,
    Applied: 0,
    Screening: 1,
    Interview: 2,
    Offer: 4,
    Rejected: 1,
  };

  const mark = completedThrough[status];

  return stages.map((label, index) => ({
    id: `tl-${index}`,
    label,
    completed: index <= mark,
  }));
}

export function inferWorkMode(location: string): WorkMode {
  const lower = location.toLowerCase();
  if (lower.includes("remote")) return "Remote";
  if (lower.includes("hybrid")) return "Hybrid";
  return "Hybrid";
}

export type NextAction =
  | { kind: "overdue"; label: string; date: string }
  | { kind: "followup"; label: string; date: string }
  | { kind: "interview"; label: string }
  | { kind: "none"; label: string };

export function getNextAction(
  application: Application,
  today = new Date().toISOString().slice(0, 10),
): NextAction {
  if (application.followUpDate) {
    const dateLabel = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(application.followUpDate));

    if (application.followUpDate < today) {
      return {
        kind: "overdue",
        label: `Overdue · ${dateLabel}`,
        date: application.followUpDate,
      };
    }

    return {
      kind: "followup",
      label: `Follow up ${dateLabel}`,
      date: application.followUpDate,
    };
  }

  if (application.status === "Interview") {
    return { kind: "interview", label: "Interview upcoming" };
  }

  return { kind: "none", label: "No action" };
}

export function sortApplications(apps: Application[], sort: ApplicationSort) {
  const copy = [...apps];
  copy.sort((a, b) => {
    switch (sort) {
      case "date-asc":
        return a.dateApplied.localeCompare(b.dateApplied);
      case "company":
        return a.company.localeCompare(b.company);
      case "priority":
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case "match":
        return b.matchScore - a.matchScore;
      case "status":
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      case "updated":
        return b.updatedAt.localeCompare(a.updatedAt);
      case "date-desc":
      default:
        return b.dateApplied.localeCompare(a.dateApplied);
    }
  });
  return copy;
}
