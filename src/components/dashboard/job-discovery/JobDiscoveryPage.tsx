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
  getJobs,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "@/lib/api/client";
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
  setSavedJobs,
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

function useMockJobs() {
  return process.env.NEXT_PUBLIC_USE_MOCK_JOBS === "true";
}

export function JobDiscoveryPage() {
  const router = useRouter();
  const useMock = useMockJobs();
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
  const [jobs, setJobs] = useState<DemoJob[]>(() => (useMock ? DEMO_JOBS : []));
  const [loadError, setLoadError] = useState(false);

  const deferredFilters = useDeferredValue(filters);

  useEffect(() => {
    if (useMock) {
      const timer = window.setTimeout(() => setLoading(false), 450);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const [jobsResponse, savedResponse] = await Promise.all([
          getJobs({ limit: 100, sort: "relevance" }),
          getSavedJobs(),
        ]);
        if (cancelled) return;
        setJobs(jobsResponse.data);
        setSavedJobs(
          savedResponse.data.map((job) => ({
            jobId: job.id,
            savedAt: new Date().toISOString().slice(0, 10),
          })),
        );
      } catch {
        if (!cancelled) {
          setLoadError(true);
          pushToast({
            title: "Couldn't load jobs",
            description: "Refresh the page to try again.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useMock, pushToast]);

  const catalog = useMock ? DEMO_JOBS : jobs;
  const results = filterAndSortJobs(catalog, deferredFilters);
  const prefs = profile.careerPreferences;
  const recommendedBase = useMock
    ? getRecommendedJobs(12)
    : [...catalog].sort((a, b) => b.match.score - a.match.score).slice(0, 12);
  const recommended = [...recommendedBase]
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
  const savedJobs = mergeSavedJobs(savedRecords, catalog).map((job) => {
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
    .map((id) => catalog.find((job) => job.id === id))
    .filter((job): job is DemoJob => Boolean(job))
    .slice(0, 6);

  const savedSet = new Set(savedRecords.map((record) => record.jobId));

  const openJob = (job: DemoJob) => {
    setSelectedJob(job);
    markJobViewed(job.id);
  };

  const handleToggleSave = (job: DemoJob) => {
    if (useMock) {
      const saved = toggleSavedJob(job.id);
      pushToast({
        title: saved ? "Job saved" : "Removed from saved",
        description: `${job.title} at ${job.company}`,
      });
      return;
    }

    const currentlySaved = savedSet.has(job.id);
    void (async () => {
      try {
        if (currentlySaved) {
          await unsaveJob(job.id);
          removeSavedJob(job.id);
          pushToast({
            title: "Removed from saved",
            description: `${job.title} at ${job.company}`,
          });
        } else {
          const { data } = await saveJob(job.id);
          setSavedJobs([
            { jobId: job.id, savedAt: data.savedAt },
            ...getSavedJobsSnapshot().filter((record) => record.jobId !== job.id),
          ]);
          pushToast({
            title: "Job saved",
            description: `${job.title} at ${job.company}`,
          });
        }
      } catch {
        pushToast({
          title: "Couldn't update saved jobs",
          description: "Try again.",
        });
      }
    })();
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
      source: useMock ? "Job Discovery (demo)" : "Job Discovery",
      notes: `${useMock ? "Demo" : "Deterministic"} match insight: ${job.match.summary}`,
      status: "Saved",
      priority: "Medium",
    });
    setModalOpen(true);
  };

  const similarJobs = selectedJob
    ? catalog
        .filter(
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
              {useMock
                ? "Opportunities aligned with your resume and skills. Scores are simulated demo insights — not live AI matching."
                : "Opportunities ranked with a deterministic skill/location fit score — not live AI matching."}
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
                {useMock
                  ? "Demo listings only — not live employer postings."
                  : "Sample development listings from your CareerOS database."}
              </p>
            </div>
          </div>

          {loading ? (
            <JobGridSkeleton />
          ) : loadError ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
              <p className="font-display text-xl font-semibold text-foreground">
                Couldn&apos;t load opportunities
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Check your connection and refresh the page.
              </p>
            </div>
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
            if (useMock) {
              removeSavedJob(jobId);
              pushToast({
                title: "Removed from saved",
                description: "You can save it again anytime from discovery.",
              });
              return;
            }
            void (async () => {
              try {
                await unsaveJob(jobId);
                removeSavedJob(jobId);
                pushToast({
                  title: "Removed from saved",
                  description: "You can save it again anytime from discovery.",
                });
              } catch {
                pushToast({
                  title: "Couldn't remove saved job",
                  description: "Try again.",
                });
              }
            })();
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
      </p>
    </div>
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
