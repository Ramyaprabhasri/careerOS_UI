import { STATUS_LABEL } from "@/lib/applications";
import type { Application, ApplicationStatus } from "@/types/dashboard";
import type { ResumeAnalysis } from "@/types/resume-analyzer";
import type {
  ActivityGranularity,
  ActivityPoint,
  AnalyticsBundle,
  AnalyticsDateRange,
  CareerGoals,
  CareerInsightItem,
  ConversionMetrics,
  FunnelStage,
  GoalProgress,
  RoleMetric,
  SourceMetric,
  StatusSlice,
  WeekdayActivity,
} from "@/types/career-analytics";
import type { PrepPersistedState } from "@/lib/interview-prep";

export const DEFAULT_GOALS: CareerGoals = {
  applicationsPerWeek: 15,
  interviewsPerMonth: 4,
  mockInterviewsPerMonth: 4,
  resumeAnalysesPerMonth: 2,
};

export const GOALS_STORAGE_KEY = "careeros-career-goals";

const RESPONDED: ApplicationStatus[] = [
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

const INTERVIEWED: ApplicationStatus[] = ["Interview", "Offer"];

function parseDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function getRangeBounds(
  range: AnalyticsDateRange,
  custom?: { from: string; to: string },
  now = new Date(),
): { start: Date; end: Date; previousStart: Date; previousEnd: Date } {
  const end = startOfDay(now);
  end.setHours(23, 59, 59, 999);

  let start = startOfDay(now);
  if (range === "7d") start.setDate(start.getDate() - 6);
  else if (range === "30d") start.setDate(start.getDate() - 29);
  else if (range === "90d") start.setDate(start.getDate() - 89);
  else if (range === "year") {
    start = new Date(now.getFullYear(), 0, 1);
  } else if (range === "custom" && custom?.from && custom?.to) {
    start = startOfDay(new Date(custom.from));
    const customEnd = startOfDay(new Date(custom.to));
    customEnd.setHours(23, 59, 59, 999);
    const duration = customEnd.getTime() - start.getTime();
    return {
      start,
      end: customEnd,
      previousEnd: new Date(start.getTime() - 1),
      previousStart: new Date(start.getTime() - 1 - duration),
    };
  } else {
    start.setDate(start.getDate() - 29);
  }

  const duration = end.getTime() - start.getTime();
  return {
    start,
    end,
    previousEnd: new Date(start.getTime() - 1),
    previousStart: new Date(start.getTime() - 1 - duration),
  };
}

function inRange(iso: string, start: Date, end: Date) {
  const date = parseDate(iso);
  if (!date) return false;
  return date >= start && date <= end;
}

function filterApps(apps: Application[], start: Date, end: Date) {
  return apps.filter((app) => inRange(app.dateApplied, start, end));
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function submitted(apps: Application[]) {
  return apps.filter((app) => app.status !== "Saved");
}

function countResponded(apps: Application[]) {
  return apps.filter((app) => RESPONDED.includes(app.status)).length;
}

function countInterviewed(apps: Application[]) {
  return apps.filter((app) => INTERVIEWED.includes(app.status)).length;
}

function countOffers(apps: Application[]) {
  return apps.filter((app) => app.status === "Offer").length;
}

function buildKpis(
  current: Application[],
  previous: Application[],
): AnalyticsBundle["kpis"] {
  const curSubmitted = submitted(current);
  const prevSubmitted = submitted(previous);
  const curApps = curSubmitted.length;
  const prevApps = prevSubmitted.length;
  const curInterviews = countInterviewed(current);
  const prevInterviews = countInterviewed(previous);
  const curResponses = countResponded(current);
  const prevResponses = countResponded(previous);
  const curOffers = countOffers(current);
  const prevOffers = countOffers(previous);

  const responseRate = curApps === 0 ? 0 : Math.round((curResponses / curApps) * 1000) / 10;
  const prevResponseRate =
    prevApps === 0 ? 0 : Math.round((prevResponses / prevApps) * 1000) / 10;
  const interviewRate =
    curApps === 0 ? 0 : Math.round((curInterviews / curApps) * 1000) / 10;
  const prevInterviewRate =
    prevApps === 0 ? 0 : Math.round((prevInterviews / prevApps) * 1000) / 10;

  return [
    {
      id: "applications",
      label: "Applications",
      value: String(curApps),
      deltaPercent: percentChange(curApps, prevApps),
      supporting: "Submitted in selected range",
    },
    {
      id: "interviews",
      label: "Interviews",
      value: String(curInterviews),
      deltaPercent: percentChange(curInterviews, prevInterviews),
      supporting: "Reached interview or offer",
    },
    {
      id: "response",
      label: "Response Rate",
      value: `${responseRate}%`,
      deltaPercent: percentChange(responseRate, prevResponseRate),
      supporting: "Screening or later",
    },
    {
      id: "interview-rate",
      label: "Interview Rate",
      value: `${interviewRate}%`,
      deltaPercent: percentChange(interviewRate, prevInterviewRate),
      supporting: "Of submitted applications",
    },
    {
      id: "offers",
      label: "Offers",
      value: String(curOffers),
      deltaPercent: percentChange(curOffers, prevOffers),
      supporting: "In selected range",
    },
  ];
}

function buildFunnel(apps: Application[]): FunnelStage[] {
  const order: ApplicationStatus[] = [
    "Saved",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
  ];
  const counts = order.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    count: apps.filter((app) => app.status === status).length,
  }));

  return counts.map((stage, index) => {
    const previous = index === 0 ? null : counts[index - 1];
    const conversionFromPrevious =
      previous && previous.count > 0
        ? Math.round((stage.count / previous.count) * 1000) / 10
        : null;
    return { ...stage, conversionFromPrevious };
  });
}

function buildActivity(
  apps: Application[],
  start: Date,
  end: Date,
  granularity: ActivityGranularity,
): ActivityPoint[] {
  const buckets = new Map<string, ActivityPoint>();

  const cursor = startOfDay(start);
  const last = startOfDay(end);

  while (cursor <= last) {
    let key: string;
    let label: string;
    if (granularity === "daily") {
      key = cursor.toISOString().slice(0, 10);
      label = cursor.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      cursor.setDate(cursor.getDate() + 1);
    } else if (granularity === "weekly") {
      const weekStart = new Date(cursor);
      key = weekStart.toISOString().slice(0, 10);
      label = `W ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      cursor.setDate(cursor.getDate() + 7);
    } else {
      key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
      label = cursor.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      cursor.setMonth(cursor.getMonth() + 1);
      cursor.setDate(1);
    }
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label,
        applications: 0,
        interviews: 0,
        offers: 0,
      });
    }
  }

  for (const app of apps) {
    const date = parseDate(app.dateApplied);
    if (!date) continue;
    let key: string;
    if (granularity === "daily") {
      key = date.toISOString().slice(0, 10);
    } else if (granularity === "weekly") {
      const week = startOfDay(date);
      const day = week.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      week.setDate(week.getDate() + diff);
      key = week.toISOString().slice(0, 10);
    } else {
      key = `${date.getFullYear()}-${date.getMonth()}`;
    }
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (app.status !== "Saved") bucket.applications += 1;
    if (INTERVIEWED.includes(app.status)) bucket.interviews += 1;
    if (app.status === "Offer") bucket.offers += 1;
  }

  return Array.from(buckets.values());
}

function buildConversions(apps: Application[]): ConversionMetrics {
  const submittedApps = submitted(apps);
  const submittedCount = submittedApps.length;
  const respondedCount = countResponded(apps);
  const interviewCount = countInterviewed(apps);
  const offerCount = countOffers(apps);

  return {
    responseRate:
      submittedCount === 0
        ? 0
        : Math.round((respondedCount / submittedCount) * 1000) / 10,
    interviewConversion:
      submittedCount === 0
        ? 0
        : Math.round((interviewCount / submittedCount) * 1000) / 10,
    offerConversion:
      submittedCount === 0
        ? 0
        : Math.round((offerCount / submittedCount) * 1000) / 10,
    respondedCount,
    interviewCount,
    offerCount,
    submittedCount,
  };
}

function buildStatus(apps: Application[]): StatusSlice[] {
  const statuses: ApplicationStatus[] = [
    "Saved",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Rejected",
  ];
  const total = apps.length || 1;
  return statuses.map((status) => {
    const count = apps.filter((app) => app.status === status).length;
    return {
      status,
      label: STATUS_LABEL[status],
      count,
      percent: Math.round((count / total) * 1000) / 10,
    };
  });
}

function buildRoles(apps: Application[]): RoleMetric[] {
  const map = new Map<string, RoleMetric>();
  for (const app of apps) {
    const role = app.role.trim() || "Untitled role";
    const current = map.get(role) ?? {
      role,
      applications: 0,
      interviews: 0,
      offers: 0,
    };
    current.applications += 1;
    if (INTERVIEWED.includes(app.status)) current.interviews += 1;
    if (app.status === "Offer") current.offers += 1;
    map.set(role, current);
  }
  return Array.from(map.values())
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 8);
}

function normalizeSource(source?: string) {
  if (!source) return "Other";
  const value = source.trim();
  const lower = value.toLowerCase();
  if (lower.includes("linkedin")) return "LinkedIn";
  if (lower.includes("company") || lower.includes("site") || lower.includes("careers")) {
    return "Company Website";
  }
  if (lower.includes("referral")) return "Referral";
  if (
    lower.includes("wellfound") ||
    lower.includes("indeed") ||
    lower.includes("board") ||
    lower.includes("dribbble")
  ) {
    return "Job Board";
  }
  if (lower.includes("discovery") || lower.includes("manual")) return "Other";
  return value;
}

function buildSources(apps: Application[]): SourceMetric[] {
  const map = new Map<string, SourceMetric>();
  for (const app of apps) {
    const source = normalizeSource(app.source);
    const current = map.get(source) ?? {
      source,
      applications: 0,
      responses: 0,
      interviews: 0,
    };
    current.applications += 1;
    if (RESPONDED.includes(app.status)) current.responses += 1;
    if (INTERVIEWED.includes(app.status)) current.interviews += 1;
    map.set(source, current);
  }
  return Array.from(map.values()).sort(
    (a, b) => b.applications - a.applications,
  );
}

function buildWeeklyActivity(
  apps: Application[],
  analyses: ResumeAnalysis[],
  prep: PrepPersistedState,
  start: Date,
  end: Date,
): WeekdayActivity[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = days.map((day) => ({
    day,
    applications: 0,
    interviews: 0,
    resumeAnalyses: 0,
    practiceSessions: 0,
    total: 0,
  }));

  const bump = (iso: string, field: keyof Omit<WeekdayActivity, "day" | "total">) => {
    const date = parseDate(iso);
    if (!date || date < start || date > end) return;
    const index = (date.getDay() + 6) % 7;
    base[index][field] += 1;
  };

  for (const app of apps) {
    bump(app.dateApplied, "applications");
    if (INTERVIEWED.includes(app.status)) bump(app.updatedAt, "interviews");
  }
  for (const analysis of analyses) {
    bump(analysis.createdAt, "resumeAnalyses");
  }
  for (const practice of prep.practiced) {
    bump(practice.practicedAt, "practiceSessions");
  }
  for (const mock of prep.mockHistory) {
    bump(mock.completedAt, "practiceSessions");
  }

  return base.map((row) => ({
    ...row,
    total:
      row.applications +
      row.interviews +
      row.resumeAnalyses +
      row.practiceSessions,
  }));
}

function buildInsights(
  apps: Application[],
  previous: Application[],
  prep: PrepPersistedState,
  analyses: ResumeAnalysis[],
  start: Date,
  end: Date,
): CareerInsightItem[] {
  const curSubmitted = submitted(apps).length;
  const prevSubmitted = submitted(previous).length;
  const roles = buildRoles(apps);
  const topInterviewRole = [...roles].sort(
    (a, b) => b.interviews - a.interviews,
  )[0];
  const followUps = apps.filter((app) => {
    if (!app.followUpDate) return false;
    const date = parseDate(app.followUpDate);
    return date && date >= start && date <= end;
  }).length;

  const mocksThisPeriod = prep.mockHistory.filter((item) =>
    inRange(item.completedAt, start, end),
  ).length;
  const analysesThisPeriod = analyses.filter((item) =>
    inRange(item.createdAt, start, end),
  ).length;

  const insights: CareerInsightItem[] = [
    {
      id: "momentum",
      title: "Application Momentum",
      body:
        prevSubmitted === 0
          ? `You submitted ${curSubmitted} application${curSubmitted === 1 ? "" : "s"} in this period.`
          : `You submitted ${curSubmitted} applications this period, ${
              curSubmitted >= prevSubmitted ? "up" : "down"
            } from ${prevSubmitted} in the previous period.`,
      actionLabel: "View Applications",
      actionHref: "/dashboard/applications",
      icon: "momentum",
    },
  ];

  if (topInterviewRole && topInterviewRole.interviews > 0) {
    insights.push({
      id: "interview-focus",
      title: "Interview Focus",
      body: `${topInterviewRole.role} roles currently represent the largest share of your interview activity (${topInterviewRole.interviews}).`,
      actionLabel: "Prepare for Interview",
      actionHref: `/dashboard/interviews?role=${encodeURIComponent(topInterviewRole.role)}`,
      icon: "interview",
    });
  }

  insights.push({
    id: "follow-up",
    title: "Follow-up Opportunity",
    body:
      followUps > 0
        ? `You have ${followUps} application${followUps === 1 ? "" : "s"} with follow-up dates in this range.`
        : "No follow-up dates fall in this range. Add follow-ups on applications to surface them here.",
    actionLabel: "View Applications",
    actionHref: "/dashboard/applications",
    icon: "followup",
  });

  insights.push({
    id: "preparation",
    title: "Preparation",
    body: `You completed ${mocksThisPeriod} mock interview${mocksThisPeriod === 1 ? "" : "s"} and ${analysesThisPeriod} resume analysis${analysesThisPeriod === 1 ? "" : "es"} in this period.`,
    actionLabel: analysesThisPeriod === 0 ? "Analyze Resume" : "Open Interview Prep",
    actionHref:
      analysesThisPeriod === 0
        ? "/dashboard/resume-studio"
        : "/dashboard/interviews",
    icon: analysesThisPeriod === 0 ? "resume" : "prep",
  });

  return insights.slice(0, 4);
}

function buildGoalsProgress(
  apps: Application[],
  prep: PrepPersistedState,
  analyses: ResumeAnalysis[],
  goals: CareerGoals,
  now = new Date(),
): GoalProgress[] {
  const weekStart = startOfDay(now);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const appsThisWeek = submitted(apps).filter((app) =>
    inRange(app.dateApplied, weekStart, now),
  ).length;
  const interviewsThisMonth = apps.filter(
    (app) =>
      INTERVIEWED.includes(app.status) &&
      inRange(app.updatedAt, monthStart, now),
  ).length;
  const mocksThisMonth = prep.mockHistory.filter((item) =>
    inRange(item.completedAt, monthStart, now),
  ).length;
  const analysesThisMonth = analyses.filter((item) =>
    inRange(item.createdAt, monthStart, now),
  ).length;

  const rows: Array<{ id: keyof CareerGoals; label: string; current: number; target: number }> = [
    {
      id: "applicationsPerWeek",
      label: "Weekly Application Goal",
      current: appsThisWeek,
      target: goals.applicationsPerWeek,
    },
    {
      id: "interviewsPerMonth",
      label: "Monthly Interview Goal",
      current: interviewsThisMonth,
      target: goals.interviewsPerMonth,
    },
    {
      id: "mockInterviewsPerMonth",
      label: "Monthly Mock Interviews",
      current: mocksThisMonth,
      target: goals.mockInterviewsPerMonth,
    },
    {
      id: "resumeAnalysesPerMonth",
      label: "Monthly Resume Analyses",
      current: analysesThisMonth,
      target: goals.resumeAnalysesPerMonth,
    },
  ];

  return rows.map((row) => ({
    ...row,
    percent:
      row.target <= 0
        ? 0
        : Math.min(100, Math.round((row.current / row.target) * 100)),
  }));
}

function buildRecentActivity(
  apps: Application[],
  prep: PrepPersistedState,
  analyses: ResumeAnalysis[],
) {
  const items: AnalyticsBundle["recentActivity"] = [];

  for (const app of apps.slice(0, 12)) {
    items.push({
      id: `app-${app.id}`,
      description:
        app.status === "Saved"
          ? `Saved ${app.role} at ${app.company}`
          : `Applied to ${app.role} at ${app.company}`,
      timestamp: app.dateApplied,
      href: "/dashboard/applications",
      kind: "application",
    });
    if (INTERVIEWED.includes(app.status)) {
      items.push({
        id: `status-${app.id}`,
        description: `Moved ${app.role} at ${app.company} to ${STATUS_LABEL[app.status]}`,
        timestamp: app.updatedAt,
        href: "/dashboard/applications",
        kind: "status",
      });
    }
  }

  for (const mock of prep.mockHistory.slice(0, 6)) {
    items.push({
      id: `mock-${mock.id}`,
      description: `Completed ${mock.interviewType.toLowerCase()} mock interview for ${mock.role}`,
      timestamp: mock.completedAt,
      href: "/dashboard/interviews",
      kind: "interview",
    });
  }

  for (const analysis of analyses.slice(0, 6)) {
    items.push({
      id: `resume-${analysis.id}`,
      description: `Analyzed resume${analysis.targetRole ? ` for ${analysis.targetRole}` : ""}`,
      timestamp: analysis.createdAt,
      href: "/dashboard/resume-studio",
      kind: "resume",
    });
  }

  return items
    .sort(
      (a, b) =>
        (parseDate(b.timestamp)?.getTime() ?? 0) -
        (parseDate(a.timestamp)?.getTime() ?? 0),
    )
    .slice(0, 10);
}

export function computeAnalytics(input: {
  applications: Application[];
  analyses: ResumeAnalysis[];
  prep: PrepPersistedState;
  goals: CareerGoals;
  range: AnalyticsDateRange;
  customRange?: { from: string; to: string };
  granularity: ActivityGranularity;
}): AnalyticsBundle {
  const bounds = getRangeBounds(input.range, input.customRange);
  const current = filterApps(
    input.applications,
    bounds.start,
    bounds.end,
  );
  const previous = filterApps(
    input.applications,
    bounds.previousStart,
    bounds.previousEnd,
  );

  const sources = buildSources(current);

  return {
    kpis: buildKpis(current, previous),
    funnel: buildFunnel(current),
    activity: buildActivity(current, bounds.start, bounds.end, input.granularity),
    conversions: buildConversions(current),
    statusDistribution: buildStatus(current),
    roles: buildRoles(current),
    sources,
    weeklyActivity: buildWeeklyActivity(
      current,
      input.analyses,
      input.prep,
      bounds.start,
      bounds.end,
    ),
    insights: buildInsights(
      current,
      previous,
      input.prep,
      input.analyses,
      bounds.start,
      bounds.end,
    ),
    goalsProgress: buildGoalsProgress(
      input.applications,
      input.prep,
      input.analyses,
      input.goals,
    ),
    recentActivity: buildRecentActivity(
      current.length > 0 ? current : input.applications,
      input.prep,
      input.analyses,
    ),
    filteredApplicationIds: current.map((app) => app.id),
    hasApplications: input.applications.length > 0,
    isDemo: true,
  };
}

export function loadGoalsFromStorage(): CareerGoals {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  try {
    const raw = window.localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) return DEFAULT_GOALS;
    const parsed = JSON.parse(raw) as Partial<CareerGoals>;
    return {
      applicationsPerWeek:
        parsed.applicationsPerWeek ?? DEFAULT_GOALS.applicationsPerWeek,
      interviewsPerMonth:
        parsed.interviewsPerMonth ?? DEFAULT_GOALS.interviewsPerMonth,
      mockInterviewsPerMonth:
        parsed.mockInterviewsPerMonth ?? DEFAULT_GOALS.mockInterviewsPerMonth,
      resumeAnalysesPerMonth:
        parsed.resumeAnalysesPerMonth ?? DEFAULT_GOALS.resumeAnalysesPerMonth,
    };
  } catch {
    return DEFAULT_GOALS;
  }
}

export function saveGoalsToStorage(goals: CareerGoals) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
}

export function rangeLabel(range: AnalyticsDateRange) {
  switch (range) {
    case "7d":
      return "Last 7 days";
    case "30d":
      return "Last 30 days";
    case "90d":
      return "Last 90 days";
    case "year":
      return "This Year";
    case "custom":
      return "Custom Range";
  }
}
