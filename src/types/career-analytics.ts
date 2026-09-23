import type { ApplicationStatus } from "./dashboard";

export type AnalyticsDateRange =
  | "7d"
  | "30d"
  | "90d"
  | "year"
  | "custom";

export type ActivityGranularity = "daily" | "weekly" | "monthly";

export type AnalyticsKpi = {
  id: string;
  label: string;
  value: string;
  deltaPercent: number | null;
  supporting: string;
};

export type FunnelStage = {
  status: ApplicationStatus | "Applied+";
  label: string;
  count: number;
  conversionFromPrevious: number | null;
};

export type ActivityPoint = {
  label: string;
  key: string;
  applications: number;
  interviews: number;
  offers: number;
};

export type StatusSlice = {
  status: ApplicationStatus;
  label: string;
  count: number;
  percent: number;
};

export type RoleMetric = {
  role: string;
  applications: number;
  interviews: number;
  offers: number;
};

export type SourceMetric = {
  source: string;
  applications: number;
  responses: number;
  interviews: number;
};

export type WeekdayActivity = {
  day: string;
  applications: number;
  interviews: number;
  resumeAnalyses: number;
  practiceSessions: number;
  total: number;
};

export type CareerInsightItem = {
  id: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  icon: "momentum" | "interview" | "followup" | "prep" | "resume";
};

export type CareerGoals = {
  applicationsPerWeek: number;
  interviewsPerMonth: number;
  mockInterviewsPerMonth: number;
  resumeAnalysesPerMonth: number;
};

export type GoalProgress = {
  id: keyof CareerGoals;
  label: string;
  current: number;
  target: number;
  percent: number;
};

export type ActivityFeedItem = {
  id: string;
  description: string;
  timestamp: string;
  href: string;
  kind: "application" | "interview" | "resume" | "job" | "status";
};

export type ConversionMetrics = {
  responseRate: number;
  interviewConversion: number;
  offerConversion: number;
  respondedCount: number;
  interviewCount: number;
  offerCount: number;
  submittedCount: number;
};

export type AnalyticsBundle = {
  kpis: AnalyticsKpi[];
  funnel: FunnelStage[];
  activity: ActivityPoint[];
  conversions: ConversionMetrics;
  statusDistribution: StatusSlice[];
  roles: RoleMetric[];
  sources: SourceMetric[];
  weeklyActivity: WeekdayActivity[];
  insights: CareerInsightItem[];
  goalsProgress: GoalProgress[];
  recentActivity: ActivityFeedItem[];
  filteredApplicationIds: string[];
  hasApplications: boolean;
  isDemo: true;
};
