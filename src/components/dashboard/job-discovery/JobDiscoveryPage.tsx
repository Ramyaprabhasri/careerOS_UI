"use client";

import { useDeferredValue, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApplicationFormModal } from "@/components/dashboard/ApplicationFormModal";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { DiscoveryHeader } from "@/components/dashboard/job-discovery/DiscoveryHeader";
import { JobCard, JobCardSkeleton } from "@/components/dashboard/job-discovery/JobCard";
import { JobCategories } from "@/components/dashboard/job-discovery/JobCategories";
import { JobMatchDrawer } from "@/components/dashboard/job-discovery/JobMatchDrawer";
import { JobSearchFilters } from "@/components/dashboard/job-discovery/JobSearchFilters";
import { RecentlyViewed } from "@/components/dashboard/job-discovery/RecentlyViewed";
import {
  mergeSavedJobs,
  SavedJobsPanel,
} from "@/components/dashboard/job-discovery/SavedJobsPanel";
import { DEMO_JOBS } from "@/data/job-listings";
import {
  DEFAULT_JOB_FILTERS,
  filterAndSortJobs,
  findDuplicateApplication,
  getRecommendedJobs,
} from "@/lib/job-discovery";
import {
  getSavedJobsServerSnapshot,
  getSavedJobsSnapshot,
  getViewedJobsServerSnapshot,
  getViewedJobsSnapshot,
  markJobViewed,
  removeSavedJob,
  subscribeSavedJobs,
  subscribeViewedJobs,
  toggleSavedJob,
} from "@/lib/job-discovery-store";
import {
  getProfileServerSnapshot,
  getProfileSnapshot,
  subscribeProfile,
} from "@/lib/profile-settings-store";
import type { ApplicationInput } from "@/types/dashboard";
import type { DemoJob, JobDiscoveryView, JobFilters } from "@/types/job-discovery";

export function JobDiscoveryPage() {
  const router = useRouter();
  const { applications, pushToast } = useDashboard();
  const savedRecords = useSyncExternalStore(
    subscribeSavedJobs,
    getSavedJobsSnapshot,
    getSavedJobsServerSnapshot,
  );
  const viewedIds = useSyncExternalStore(
    subscribeViewedJobs,
    getViewedJobsSnapshot,
    getViewedJobsServerSnapshot,
  );
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );

  const [view, setView] = useState<JobDiscoveryView>("search");
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_JOB_FILTERS);
  const [draftFilters, setDraftFilters] = useState<JobFilters>(DEFAULT_JOB_FILTERS);
  const [selectedJob, setSelectedJob] = useState<DemoJob | null>(null);
  const [prefill, setPrefill] = useState<Partial<ApplicationInput> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const deferredFilters = useDeferredValue(filters);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const results = filterAndSortJobs(DEMO_JOBS, deferredFilters);
  const prefs = profile.careerPreferences;
  const recommended = [...getRecommendedJobs(12)]
    .sort((a, b) => {
      const score = (job: DemoJob) => {
        let value = job.match.score;
        if (
          prefs.preferredRoles.some(
            (role) =>
              job.title.toLowerCase().includes(role.toLowerCase()) ||
              job.categories.some((category) =>
                category.toLowerCase().includes(role.toLowerCase()),
              ),
          )
        ) {
          value += 6;
        }
        if (prefs.workModes.includes(job.workMode)) value += 3;
        if (
          prefs.preferredLocations.some((location) =>
            job.location.toLowerCase().includes(location.toLowerCase()),
          )
        ) {
          value += 2;
        }
        return value;
      };
      return score(b) - score(a);
    })
    .slice(0, 6);
  const savedJobs = mergeSavedJobs(savedRecords, DEMO_JOBS).map((job) => {
    const duplicate = findDuplicateApplication(applications, {
      company: job.company,
      title: job.title,
      jobUrl: job.jobUrl,
    });
    return {
      ...job,
      applicationStatus: duplicate?.status,
    };
  });
  const recentlyViewed = viewedIds
    .map((id) => DEMO_JOBS.find((job) => job.id === id))
    .filter((job): job is DemoJob => Boolean(job))
    .slice(0, 6);

  const savedSet = new Set(savedRecords.map((record) => record.jobId));

  const openJob = (job: DemoJob) => {
    setSelectedJob(job);
    markJobViewed(job.id);
  };

  const handleToggleSave = (job: DemoJob) => {
    const saved = toggleSavedJob(job.id);
    pushToast({
      title: saved ? "Job saved" : "Removed from saved",
      description: `${job.title} at ${job.company}`,
    });
  };

  const handleAddToApplications = (job: DemoJob) => {
    const duplicate = findDuplicateApplication(applications, {
      company: job.company,
      title: job.title,
      jobUrl: job.jobUrl,
    });
    if (duplicate) {
      pushToast({
        title: "Already on your board",
        description: `${job.title} at ${job.company} is already tracked.`,
      });
      return;
    }

    setPrefill({
      company: job.company,
      role: job.title,
      location: job.location,
      jobUrl: job.jobUrl,
      workMode: job.workMode,
      employmentType: job.employmentType,
      salaryRange: job.salaryRange,
      matchScore: job.match.score,
      source: "Job Discovery (demo)",
      notes: `Demo match insight: ${job.match.summary}`,
      status: "Saved",
      priority: "Medium",
    });
    setModalOpen(true);
  };

  const similarJobs = selectedJob
    ? DEMO_JOBS.filter(
        (job) =>
          job.id !== selectedJob.id &&
          job.categories.some((category) =>
            selectedJob.categories.includes(category),
          ),
      )
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 3)
    : [];

  const alreadyApplied = selectedJob
    ? Boolean(
        findDuplicateApplication(applications, {
          company: selectedJob.company,
          title: selectedJob.title,
          jobUrl: selectedJob.jobUrl,
        }),
      )
    : false;

  const exploreMatches = () => {
    setView("recommended");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applySearch = () => {
    setFilters(draftFilters);
    setView("search");
  };

  return (
    <div className="space-y-8">
      <DiscoveryHeader
        view={view}
        onViewChange={setView}
        onExploreMatches={exploreMatches}
        savedCount={savedRecords.length}
      />

      {view !== "saved" ? (
        <>
          <JobSearchFilters
            filters={draftFilters}
            onChange={(next) => {
              setDraftFilters(next);
              // Live-update category/sort/filters for snappy UX
              setFilters(next);
            }}
            onSearch={applySearch}
            resultCount={results.length}
          />
          <JobCategories
            selected={draftFilters.category}
            onSelect={(category) => {
              const next = { ...draftFilters, category };
              setDraftFilters(next);
              setFilters(next);
              setView("search");
            }}
          />
        </>
      ) : null}

      {view === "search" || view === "recommended" ? (
        <RecentlyViewed jobs={recentlyViewed} onView={openJob} />
      ) : null}

      {view === "recommended" ? (
        <section className="space-y-4">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Matched to Your Profile
            </h3>
            <p className="mt-1 text-sm text-muted">
              Opportunities aligned with your resume and skills. Scores are
              simulated demo insights — not live AI matching.
            </p>
          </div>
          {loading ? (
            <JobGridSkeleton />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recommended.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedSet.has(job.id)}
                  onView={openJob}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {view === "search" ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {draftFilters.category !== "All"
                  ? draftFilters.category
                  : "Search results"}
              </h3>
              <p className="mt-1 text-sm text-muted">
                Demo listings only — not live employer postings.
              </p>
            </div>
          </div>

          {loading ? (
            <JobGridSkeleton />
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
              <p className="font-display text-xl font-semibold text-foreground">
                No matching opportunities found
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Try adjusting your search or filters to discover more roles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDraftFilters({ ...DEFAULT_JOB_FILTERS });
                  setFilters({ ...DEFAULT_JOB_FILTERS });
                }}
                className="mt-6 rounded-full border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedSet.has(job.id)}
                  onView={openJob}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {view === "saved" ? (
        <SavedJobsPanel
          jobs={savedJobs}
          onView={openJob}
          onRemove={(jobId) => {
            removeSavedJob(jobId);
            pushToast({
              title: "Removed from saved",
              description: "You can save it again anytime from discovery.",
            });
          }}
          onMoveToApplications={handleAddToApplications}
          onExplore={() => setView("search")}
        />
      ) : null}

      <JobMatchDrawer
        job={selectedJob}
        saved={selectedJob ? savedSet.has(selectedJob.id) : false}
        alreadyApplied={alreadyApplied}
        similarJobs={similarJobs}
        onClose={() => setSelectedJob(null)}
        onToggleSave={handleToggleSave}
        onAddToApplications={handleAddToApplications}
        onViewSimilar={openJob}
        onPrepareInterview={(job) => {
          const params = new URLSearchParams({
            role: job.title,
            company: job.company,
            jd: job.description,
          });
          router.push(`/dashboard/interviews?${params.toString()}`);
        }}
      />

      <ApplicationFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPrefill(null);
        }}
        initialStatus="Saved"
        defaults={prefill}
      />

      <p className="text-center text-xs text-muted-soft">
        Tip: after adding a role, open{" "}
        <Link
          href="/dashboard/applications"
          className="text-accent-bright hover:underline"
        >
          Applications
        </Link>{" "}
        to track progress on the board and table.
      </p>    </div>
  );
}

function JobGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}
