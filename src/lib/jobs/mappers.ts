import type { EmploymentType, WorkMode } from "@/types/dashboard";
import type {
  DemoJob,
  ExperienceLevel,
  JobCategory,
  JobMatchInsight,
} from "@/types/job-discovery";
import { computeJobMatch, type MatchProfileContext } from "@/lib/jobs/match-score";

type PrismaEmploymentType =
  | "Full_time"
  | "Contract"
  | "Internship"
  | "Part_time";

export type DbJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryRange: string | null;
  workMode: WorkMode;
  employmentType: PrismaEmploymentType;
  experienceLevel: ExperienceLevel;
  experienceLabel: string;
  source: string;
  jobUrl: string;
  postedAt: Date;
  skills: string[];
  categories: string[];
  baseMatchScore: number;
};

export function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
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

export function mapJob(
  job: DbJob,
  options?: {
    profile?: MatchProfileContext | null;
    saved?: boolean;
    matchOverride?: JobMatchInsight;
  },
): DemoJob {
  const match =
    options?.matchOverride ??
    computeJobMatch(
      {
        title: job.title,
        location: job.location,
        workMode: job.workMode,
        skills: job.skills,
        categories: job.categories,
        baseMatchScore: job.baseMatchScore,
      },
      options?.profile,
    );

  return {
    id: job.id,
    company: job.company,
    title: job.title,
    location: job.location,
    workMode: job.workMode,
    employmentType: toFrontendEmploymentType(job.employmentType),
    ...(job.salaryRange ? { salaryRange: job.salaryRange } : {}),
    experienceLevel: job.experienceLevel,
    experienceLabel: job.experienceLabel,
    postedAt: toDateOnly(job.postedAt),
    categories: job.categories as JobCategory[],
    skills: job.skills,
    description: job.description,
    source: job.source,
    jobUrl: job.jobUrl,
    match,
    isDemo: false,
    ...(options?.saved !== undefined ? { saved: options.saved } : {}),
  };
}
