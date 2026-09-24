import type {
  ApplicationStatus,
  EmploymentType,
  WorkMode,
} from "./dashboard";

export type ExperienceLevel =
  | "Internship"
  | "Entry"
  | "Mid"
  | "Senior"
  | "Lead";

export type DatePostedFilter =
  | "any"
  | "24h"
  | "7d"
  | "30d";

export type JobSort = "relevance" | "match" | "date";

export type JobCategory =
  | "Frontend Development"
  | "React Developer"
  | "Full Stack Development"
  | "UI Engineer"
  | "Next.js Developer";

export type MatchBreakdown = {
  skills: number;
  experience: number;
  roleAlignment: number;
  keywordAlignment: number;
};

export type JobMatchInsight = {
  score: number;
  summary: string;
  breakdown: MatchBreakdown;
  matchingSkills: string[];
  underrepresentedSkills: string[];
  nextSteps: string[];
};

export type DemoJob = {
  id: string;
  company: string;
  title: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  salaryRange?: string;
  experienceLevel: ExperienceLevel;
  experienceLabel: string;
  postedAt: string;
  categories: JobCategory[];
  skills: string[];
  description: string;
  source: string;
  jobUrl: string;
  /** Match insight — deterministic backend score or demo fixture */
  match: JobMatchInsight;
  /** True for local mock fixtures; omitted/false for API jobs */
  isDemo?: boolean;
  /** Present when listing includes the viewer's saved state */
  saved?: boolean;
};

export type SavedJobRecord = {
  jobId: string;
  savedAt: string;
};

export type JobDiscoveryView = "search" | "recommended" | "saved";

export type JobFilters = {
  query: string;
  location: string;
  workMode: WorkMode | "All";
  experienceLevel: ExperienceLevel | "All";
  employmentType: EmploymentType | "All";
  salaryMin: number | null;
  datePosted: DatePostedFilter;
  category: JobCategory | "All";
  sort: JobSort;
};

export type AddJobApplicationPrefill = {
  company: string;
  role: string;
  location: string;
  jobUrl?: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  salaryRange?: string;
  matchScore?: number;
  source?: string;
  notes?: string;
  status?: ApplicationStatus;
};
