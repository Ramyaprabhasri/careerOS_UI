"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  ExternalLink,
  Mic2,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { companyInitials } from "@/lib/applications";
import { matchScoreTone } from "@/lib/job-discovery";
import { cn, formatDate } from "@/lib/utils";
import type { DemoJob } from "@/types/job-discovery";

type JobMatchDrawerProps = {
  job: DemoJob | null;
  saved: boolean;
  alreadyApplied: boolean;
  similarJobs: DemoJob[];
  onClose: () => void;
  onToggleSave: (job: DemoJob) => void;
  onAddToApplications: (job: DemoJob) => void;
  onViewSimilar: (job: DemoJob) => void;
  onPrepareInterview: (job: DemoJob) => void;
};

export function JobMatchDrawer({
  job,
  saved,
  alreadyApplied,
  similarJobs,
  onClose,
  onToggleSave,
  onAddToApplications,
  onViewSimilar,
  onPrepareInterview,
}: JobMatchDrawerProps) {
  useEffect(() => {
    if (!job) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [job, onClose]);

  return (
    <AnimatePresence>
      {job ? (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Job match details"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-border bg-background-elevated shadow-[-24px_0_80px_-40px_rgba(0,0,0,0.8)]"
          >
            <DrawerBody
              key={job.id}
              job={job}
              saved={saved}
              alreadyApplied={alreadyApplied}
              similarJobs={similarJobs}
              onClose={onClose}
              onToggleSave={onToggleSave}
              onAddToApplications={onAddToApplications}
              onViewSimilar={onViewSimilar}
              onPrepareInterview={onPrepareInterview}
            />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DrawerBody({
  job,
  saved,
  alreadyApplied,
  similarJobs,
  onClose,
  onToggleSave,
  onAddToApplications,
  onViewSimilar,
  onPrepareInterview,
}: {
  job: DemoJob;
  saved: boolean;
  alreadyApplied: boolean;
  similarJobs: DemoJob[];
  onClose: () => void;
  onToggleSave: (job: DemoJob) => void;
  onAddToApplications: (job: DemoJob) => void;
  onViewSimilar: (job: DemoJob) => void;
  onPrepareInterview: (job: DemoJob) => void;
}) {
  const breakdown = [
    { label: "Skills Match", value: job.match.breakdown.skills },
    { label: "Experience Match", value: job.match.breakdown.experience },
    { label: "Role Alignment", value: job.match.breakdown.roleAlignment },
    {
      label: "Keyword Alignment",
      value: job.match.breakdown.keywordAlignment,
    },
  ];

  return (
    <>
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-xs font-semibold text-accent">
            {companyInitials(job.company)}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.16em] text-muted-soft uppercase">
              Demo listing
            </p>
            <h2 className="truncate font-display text-xl font-semibold tracking-tight text-foreground">
              {job.title}
            </h2>
            <p className="text-sm text-muted">{job.company}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border p-2 text-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section>
          <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
            Job overview
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Meta label="Location" value={job.location} />
            <Meta label="Work mode" value={job.workMode} />
            <Meta label="Employment" value={job.employmentType} />
            <Meta label="Experience" value={job.experienceLabel} />
            <Meta label="Salary" value={job.salaryRange ?? "Not listed"} />
            <Meta label="Posted" value={formatDate(job.postedAt)} />
            <Meta label="Source" value={job.source} />
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {job.description}
          </p>
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-bright hover:underline"
          >
            Original posting (demo link)
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        <section className="rounded-2xl border border-border bg-surface/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-muted-soft uppercase">
                Simulated match
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                Match analysis
              </h3>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-semibold",
                matchScoreTone(job.match.score),
              )}
            >
              {job.match.score}%
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">{job.match.summary}</p>
          <div className="mt-4 space-y-3">
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-accent/70"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
            Matching skills
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.match.matchingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] text-accent-bright"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
            Missing or underrepresented
          </h3>
          <p className="mt-1 text-xs text-muted-soft">
            Keywords absent from a resume do not prove a skill gap.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.match.underrepresentedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
            Recommended next steps
          </h3>
          <ul className="mt-2 space-y-2">
            {job.match.nextSteps.map((step) => (
              <li
                key={step}
                className="rounded-xl border border-border bg-surface/50 px-3 py-2.5 text-sm text-muted"
              >
                {step}
              </li>
            ))}
          </ul>
        </section>

        {similarJobs.length > 0 ? (
          <section>
            <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
              Similar opportunities
            </h3>
            <div className="mt-2 space-y-2">
              {similarJobs.map((similar) => (
                <button
                  key={similar.id}
                  type="button"
                  onClick={() => onViewSimilar(similar)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface/50 px-3 py-2.5 text-left transition-colors hover:border-border-strong"
                >
                  <span>
                    <span className="block text-sm text-foreground">
                      {similar.title}
                    </span>
                    <span className="text-xs text-muted">{similar.company}</span>
                  </span>
                  <span className="text-xs text-accent-bright">
                    {similar.match.score}%
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
        <button
          type="button"
          onClick={() => onToggleSave(job)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4 text-accent-bright" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {saved ? "Saved" : "Save Job"}
        </button>
        <button
          type="button"
          onClick={() => onPrepareInterview(job)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          <Mic2 className="h-4 w-4" />
          Prepare for Interview
        </button>
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          Apply Now
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          type="button"
          disabled={alreadyApplied}
          onClick={() => onAddToApplications(job)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <Briefcase className="h-4 w-4" />
          {alreadyApplied ? "Already on board" : "Add to Applications"}
        </button>
      </div>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 px-3 py-2">
      <dt className="text-[10px] tracking-[0.12em] text-muted-soft uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
