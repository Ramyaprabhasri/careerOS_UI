"use client";

import { formatDate } from "@/lib/utils";
import type { DemoJob } from "@/types/job-discovery";

type RecentlyViewedProps = {
  jobs: DemoJob[];
  onView: (job: DemoJob) => void;
};

export function RecentlyViewed({ jobs, onView }: RecentlyViewedProps) {
  if (jobs.length === 0) return null;

  return (
    <section>
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Recently viewed
      </h3>
      <p className="mt-0.5 text-sm text-muted">
        Pick up where you left off in this demo workspace.
      </p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {jobs.map((job) => (
          <button
            key={job.id}
            type="button"
            onClick={() => onView(job)}
            className="min-w-[220px] rounded-2xl border border-border bg-surface/70 px-4 py-3 text-left transition-colors hover:border-border-strong"
          >
            <p className="truncate text-sm font-medium text-foreground">
              {job.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted">
              {job.company} · {job.match.score}% match
            </p>
            <p className="mt-2 text-[10px] tracking-[0.12em] text-muted-soft uppercase">
              Posted {formatDate(job.postedAt)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
