import { DEMO_JOBS } from "@/data/job-listings";
import type { Application } from "@/types/dashboard";
import type {
  DatePostedFilter,
  DemoJob,
  JobFilters,
  JobSort,
  SavedJobRecord,
} from "@/types/job-discovery";

export const JOB_SAVED_STORAGE_KEY = "careeros-saved-jobs";
export const JOB_VIEWED_STORAGE_KEY = "careeros-viewed-jobs";

export const DEFAULT_JOB_FILTERS: JobFilters = {
  query: "",
  location: "",
  workMode: "All",
  experienceLevel: "All",
  employmentType: "All",
  salaryMin: null,
  datePosted: "any",
  category: "All",
  sort: "relevance",
};

function daysSince(iso: string) {
  const posted = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, (now - posted) / (1000 * 60 * 60 * 24));
}

function matchesDatePosted(postedAt: string, filter: DatePostedFilter) {
  if (filter === "any") return true;
  const age = daysSince(postedAt);
  if (filter === "24h") return age <= 1;
  if (filter === "7d") return age <= 7;
  return age <= 30;
}

function parseSalaryFloor(salaryRange?: string): number | null {
  if (!salaryRange) return null;
  const digits = salaryRange.replace(/,/g, "").match(/\d+/g);
  if (!digits?.length) return null;
  return Number(digits[0]);
}

function relevanceScore(job: DemoJob, query: string) {
  if (!query.trim()) return job.match.score;
  const q = query.toLowerCase();
  let score = job.match.score;
  if (job.title.toLowerCase().includes(q)) score += 20;
  if (job.company.toLowerCase().includes(q)) score += 15;
  if (job.skills.some((skill) => skill.toLowerCase().includes(q))) score += 10;
  if (job.categories.some((cat) => cat.toLowerCase().includes(q))) score += 8;
  return score;
}

export function filterAndSortJobs(
  jobs: DemoJob[],
  filters: JobFilters,
): DemoJob[] {
  const query = filters.query.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();

  const filtered = jobs.filter((job) => {
    if (query) {
      const haystack = [
        job.title,
        job.company,
        job.location,
        ...job.skills,
        ...job.categories,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (location && !job.location.toLowerCase().includes(location)) {
      return false;
    }

    if (filters.workMode !== "All" && job.workMode !== filters.workMode) {
      return false;
    }

    if (
      filters.experienceLevel !== "All" &&
      job.experienceLevel !== filters.experienceLevel
    ) {
      return false;
    }

    if (
      filters.employmentType !== "All" &&
      job.employmentType !== filters.employmentType
    ) {
      return false;
    }

    if (filters.category !== "All" && !job.categories.includes(filters.category)) {
      return false;
    }

    if (!matchesDatePosted(job.postedAt, filters.datePosted)) {
      return false;
    }

    if (filters.salaryMin != null) {
      const floor = parseSalaryFloor(job.salaryRange);
      if (floor != null && floor < filters.salaryMin) return false;
    }

    return true;
  });

  return sortJobs(filtered, filters.sort, filters.query);
}

export function sortJobs(jobs: DemoJob[], sort: JobSort, query = "") {
  const copy = [...jobs];
  if (sort === "match") {
    return copy.sort((a, b) => b.match.score - a.match.score);
  }
  if (sort === "date") {
    return copy.sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
  }
  return copy.sort(
    (a, b) => relevanceScore(b, query) - relevanceScore(a, query),
  );
}

export function getRecommendedJobs(limit = 6) {
  return sortJobs(DEMO_JOBS, "match").slice(0, limit);
}

export function getJobsByCategory(category: JobFilters["category"]) {
  if (category === "All") return DEMO_JOBS;
  return DEMO_JOBS.filter((job) => job.categories.includes(category));
}

export function getJobById(id: string) {
  return DEMO_JOBS.find((job) => job.id === id) ?? null;
}

export function findDuplicateApplication(
  applications: Application[],
  job: Pick<DemoJob, "company" | "title" | "jobUrl">,
) {
  const company = job.company.trim().toLowerCase();
  const role = job.title.trim().toLowerCase();
  const url = job.jobUrl?.trim().toLowerCase();

  return (
    applications.find((app) => {
      if (url && app.jobUrl?.trim().toLowerCase() === url) return true;
      return (
        app.company.trim().toLowerCase() === company &&
        app.role.trim().toLowerCase() === role
      );
    }) ?? null
  );
}

export function loadSavedJobsFromStorage(): SavedJobRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOB_SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedJobRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedJobsToStorage(records: SavedJobRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(JOB_SAVED_STORAGE_KEY, JSON.stringify(records));
}

export function loadViewedJobsFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOB_VIEWED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveViewedJobsToStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(JOB_VIEWED_STORAGE_KEY, JSON.stringify(ids));
}

export function matchScoreTone(score: number) {
  if (score >= 85) return "text-emerald-300 border-emerald-400/25 bg-emerald-400/10";
  if (score >= 75) return "text-accent-bright border-accent/25 bg-accent/10";
  if (score >= 65) return "text-amber-200 border-amber-300/25 bg-amber-300/10";
  return "text-muted border-border bg-white/[0.03]";
}

export function activeFilterChips(filters: JobFilters) {
  const chips: Array<{ key: keyof JobFilters | "salary"; label: string }> = [];
  if (filters.query.trim()) {
    chips.push({ key: "query", label: `Search: ${filters.query.trim()}` });
  }
  if (filters.location.trim()) {
    chips.push({ key: "location", label: `Location: ${filters.location.trim()}` });
  }
  if (filters.workMode !== "All") {
    chips.push({ key: "workMode", label: filters.workMode });
  }
  if (filters.experienceLevel !== "All") {
    chips.push({ key: "experienceLevel", label: filters.experienceLevel });
  }
  if (filters.employmentType !== "All") {
    chips.push({ key: "employmentType", label: filters.employmentType });
  }
  if (filters.datePosted !== "any") {
    const labels: Record<DatePostedFilter, string> = {
      any: "Any time",
      "24h": "Past 24 hours",
      "7d": "Past week",
      "30d": "Past month",
    };
    chips.push({ key: "datePosted", label: labels[filters.datePosted] });
  }
  if (filters.salaryMin != null) {
    chips.push({ key: "salary", label: `Min salary: ${filters.salaryMin}+` });
  }
  if (filters.category !== "All") {
    chips.push({ key: "category", label: filters.category });
  }
  return chips;
}
