"use client";

import { BookmarkX, Briefcase, Eye } from "lucide-react";
import { companyInitials } from "@/lib/applications";
import { matchScoreTone } from "@/lib/job-discovery";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/dashboard";
import type { DemoJob, SavedJobRecord } from "@/types/job-discovery";

type SavedJobsPanelProps = {
  jobs: Array<DemoJob & { savedAt: string; applicationStatus?: ApplicationStatus }>;
  onView: (job: DemoJob) => void;
  onRemove: (jobId: string) => void;
  onMoveToApplications: (job: DemoJob) => void;
  onExplore: () => void;
};

export function SavedJobsPanel({
  jobs,
  onView,
  onRemove,
  onMoveToApplications,
  onExplore,
}: SavedJobsPanelProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
        <p className="font-display text-xl font-semibold text-foreground">
          Opportunities worth keeping, all in one place.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Save demo roles as you explore. They persist in this browser for your
          CareerOS walkthrough.
        </p>
        <button
          type="button"
          onClick={onExplore}
          className="mt-6 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
        >
          Explore Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-xs font-semibold text-accent">
              {companyInitials(job.company)}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-medium text-foreground">
                {job.title}
              </h3>
              <p className="text-sm text-muted">
                {job.company} · {job.location}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-soft">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5",
                    matchScoreTone(job.match.score),
                  )}
                >
                  {job.match.score}% match
                </span>
                <span>Saved {formatDate(job.savedAt)}</span>
                {job.applicationStatus ? (
                  <span className="rounded-full border border-border px-2 py-0.5 text-muted">
                    On board ·{" "}
                    {job.applicationStatus === "Saved"
                      ? "Wishlist"
                      : job.applicationStatus}
                  </span>
                ) : (
                  <span className="rounded-full border border-border px-2 py-0.5">
                    Not on applications yet
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => onView(job)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-muted hover:border-border-strong hover:text-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
              View Job
            </button>
            <button
              type="button"
              onClick={() => onMoveToApplications(job)}
              disabled={Boolean(job.applicationStatus)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-sm font-semibold text-[#042f2e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Move to Applications
            </button>
            <button
              type="button"
              onClick={() => onRemove(job.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-muted hover:border-rose-400/40 hover:text-rose-300"
            >
              <BookmarkX className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function mergeSavedJobs(
  records: SavedJobRecord[],
  allJobs: DemoJob[],
): Array<DemoJob & { savedAt: string }> {
  return records
    .map((record) => {
      const job = allJobs.find((item) => item.id === record.jobId);
      if (!job) return null;
      return { ...job, savedAt: record.savedAt };
    })
    .filter((job): job is DemoJob & { savedAt: string } => Boolean(job));
}
