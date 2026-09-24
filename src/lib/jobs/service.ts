import { NotFoundError } from "@/lib/api/errors";
import { prisma } from "@/lib/db/prisma";
import {
  mapJob,
  toDateOnly,
  type DbJob,
} from "@/lib/jobs/mappers";
import type { MatchProfileContext } from "@/lib/jobs/match-score";
import type { ListJobsQuery } from "@/lib/jobs/validators";
import type { DemoJob } from "@/types/job-discovery";

function salaryFloor(salaryRange: string | null | undefined): number | null {
  if (!salaryRange) return null;
  const match = salaryRange.replace(/,/g, "").match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

async function loadProfileContext(
  userId: string,
): Promise<MatchProfileContext | null> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { headline: true, location: true },
  });
  if (!profile) return null;
  return {
    headline: profile.headline,
    location: profile.location,
    skills: [],
  };
}

function buildJobWhere(filters: ListJobsQuery) {
  const where: {
    workMode?: ListJobsQuery["workMode"];
    employmentType?: never;
    experienceLevel?: ListJobsQuery["experienceLevel"];
    location?: { contains: string; mode: "insensitive" };
    OR?: Array<Record<string, unknown>>;
    categories?: { has: string };
    postedAt?: { gte: Date };
    AND?: Array<Record<string, unknown>>;
  } = {};

  if (filters.workMode) {
    where.workMode = filters.workMode;
  }

  if (filters.employmentType) {
    const mapped =
      filters.employmentType === "Full-time"
        ? "Full_time"
        : filters.employmentType === "Part-time"
          ? "Part_time"
          : filters.employmentType;
    (where as { employmentType?: string }).employmentType = mapped;
  }

  if (filters.experienceLevel) {
    where.experienceLevel = filters.experienceLevel;
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.category) {
    where.categories = { has: filters.category };
  }

  if (filters.datePosted && filters.datePosted !== "any") {
    const now = new Date();
    const days =
      filters.datePosted === "24h" ? 1 : filters.datePosted === "7d" ? 7 : 30;
    const since = new Date(now);
    since.setUTCDate(since.getUTCDate() - days);
    where.postedAt = { gte: since };
  }

  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { skills: { has: q } },
    ];
  }

  return where;
}

function sortJobs(jobs: DemoJob[], sort: ListJobsQuery["sort"], q?: string) {
  const query = (q ?? "").trim().toLowerCase();
  const copy = [...jobs];

  copy.sort((a, b) => {
    if (sort === "date") {
      return b.postedAt.localeCompare(a.postedAt);
    }
    if (sort === "match") {
      return b.match.score - a.match.score;
    }

    const relevance = (job: DemoJob) => {
      let score = job.match.score;
      if (!query) return score;
      if (job.title.toLowerCase().includes(query)) score += 20;
      if (job.company.toLowerCase().includes(query)) score += 15;
      if (job.skills.some((skill) => skill.toLowerCase().includes(query))) {
        score += 10;
      }
      if (job.categories.some((category) => category.toLowerCase().includes(query))) {
        score += 8;
      }
      return score;
    };

    return relevance(b) - relevance(a);
  });

  return copy;
}

export type JobsListResult = {
  data: DemoJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function listJobs(
  userId: string,
  filters: ListJobsQuery,
): Promise<JobsListResult> {
  const profile = await loadProfileContext(userId);
  const where = buildJobWhere(filters);

  const rows = (await prisma.job.findMany({
    where,
    orderBy: [{ postedAt: "desc" }, { updatedAt: "desc" }],
  })) as DbJob[];

  const savedRows = await prisma.savedJob.findMany({
    where: { userId },
    select: { jobId: true },
  });
  const savedSet = new Set(savedRows.map((row) => row.jobId));

  let mapped = rows.map((job) =>
    mapJob(job, { profile, saved: savedSet.has(job.id) }),
  );

  if (filters.salaryMin != null) {
    mapped = mapped.filter((job) => {
      const floor = salaryFloor(job.salaryRange);
      return floor == null || floor >= filters.salaryMin!;
    });
  }

  mapped = sortJobs(mapped, filters.sort, filters.q);

  const total = mapped.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));
  const page = Math.min(filters.page, totalPages);
  const start = (page - 1) * filters.limit;
  const data = mapped.slice(start, start + filters.limit);

  return {
    data,
    pagination: {
      page,
      limit: filters.limit,
      total,
      totalPages,
    },
  };
}

export async function getJob(
  userId: string,
  jobId: string,
): Promise<DemoJob> {
  const job = (await prisma.job.findUnique({
    where: { id: jobId },
  })) as DbJob | null;

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  const profile = await loadProfileContext(userId);
  const saved = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: { userId, jobId },
    },
    select: { id: true },
  });

  return mapJob(job, { profile, saved: Boolean(saved) });
}

export async function listSavedJobs(userId: string): Promise<DemoJob[]> {
  const profile = await loadProfileContext(userId);
  const rows = await prisma.savedJob.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) =>
    mapJob(row.job as DbJob, {
      profile,
      saved: true,
    }),
  );
}

export async function saveJob(
  userId: string,
  jobId: string,
): Promise<{ saved: true; savedAt: string }> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true },
  });
  if (!job) {
    throw new NotFoundError("Job not found");
  }

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });

  if (existing) {
    return { saved: true, savedAt: toDateOnly(existing.createdAt) };
  }

  const created = await prisma.savedJob.create({
    data: { userId, jobId },
  });

  return { saved: true, savedAt: toDateOnly(created.createdAt) };
}

export async function unsaveJob(
  userId: string,
  jobId: string,
): Promise<{ saved: false }> {
  await prisma.savedJob.deleteMany({
    where: { userId, jobId },
  });
  return { saved: false };
}
