"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { companyInitials } from "@/lib/applications";
import { matchScoreTone } from "@/lib/job-discovery";
import { cn, formatDate } from "@/lib/utils";
import type { DemoJob } from "@/types/job-discovery";

type JobCardProps = {
  job: DemoJob;
  saved: boolean;
  onView: (job: DemoJob) => void;
  onToggleSave: (job: DemoJob) => void;
};

export function JobCard({ job, saved, onView, onToggleSave }: JobCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-5 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-xs font-semibold tracking-wide text-accent">
            {companyInitials(job.company)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{job.company}</p>
            <h3 className="mt-0.5 truncate font-display text-lg font-semibold tracking-tight text-foreground">
              {job.title}
            </h3>
          </div>
        </div>
        <button
          type="button"
          aria-label={saved ? "Unsave job" : "Save job"}
          onClick={() => onToggleSave(job)}
          className={cn(
            "rounded-lg border p-2 transition-colors",
            saved
              ? "border-accent/30 bg-accent/10 text-accent-bright"
              : "border-border text-muted hover:border-border-strong hover:text-foreground",
          )}
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      <p className="mt-3 text-sm text-muted">
        {job.location} · {job.workMode} · {job.employmentType}
      </p>
      <p className="mt-1 text-sm text-muted-soft">
        {job.salaryRange ? `${job.salaryRange} · ` : null}
        {job.experienceLabel} · Posted {formatDate(job.postedAt)}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
            matchScoreTone(job.match.score),
          )}
        >
          {job.match.score}% Match
        </span>
        <span className="rounded-full border border-border px-2 py-1 text-[10px] tracking-[0.12em] text-muted-soft uppercase">
          Demo
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
        {job.match.summary}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <button
          type="button"
          onClick={() => onView(job)}
          className="rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
        >
          View Match
        </button>
        <button
          type="button"
          onClick={() => onToggleSave(job)}
          className="rounded-full border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          {saved ? "Saved" : "Save Job"}
        </button>
      </div>
    </article>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface/60 p-5">
      <div className="flex gap-3">
        <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-white/[0.06]" />
          <div className="h-5 w-40 rounded bg-white/[0.08]" />
        </div>
      </div>
      <div className="mt-4 h-3 w-3/4 rounded bg-white/[0.05]" />
      <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.05]" />
      <div className="mt-5 h-6 w-24 rounded-full bg-white/[0.06]" />
      <div className="mt-4 h-10 w-full rounded bg-white/[0.04]" />
    </div>
  );
}
