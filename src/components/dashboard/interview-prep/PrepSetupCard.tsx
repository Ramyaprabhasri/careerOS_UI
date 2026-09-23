"use client";

import { EXPERIENCE_LEVELS, INTERVIEW_TYPES } from "@/data/interview-questions";
import { cn } from "@/lib/utils";
import type {
  InterviewExperienceLevel,
  InterviewType,
  PrepSetup,
} from "@/types/interview-prep";

type PrepSetupCardProps = {
  setup: PrepSetup;
  onChange: (next: PrepSetup) => void;
  onStart: () => void;
  resumeSkills: string[];
};

export function PrepSetupCard({
  setup,
  onChange,
  onStart,
  resumeSkills,
}: PrepSetupCardProps) {
  const canStart = setup.role.trim().length > 0;

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
        What are you preparing for?
      </h3>
      <p className="mt-1 text-sm text-muted">
        Set context once, then practice targeted demo questions.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
            Target role
          </span>
          <input
            value={setup.role}
            onChange={(event) =>
              onChange({ ...setup, role: event.target.value })
            }
            placeholder="Frontend Developer, React Developer…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Interview type
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {INTERVIEW_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...setup, interviewType: type as InterviewType })}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  setup.interviewType === type
                    ? "border-accent/40 bg-accent/15 text-accent-bright"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Experience level
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  onChange({
                    ...setup,
                    experienceLevel: level as InterviewExperienceLevel,
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  setup.experienceLevel === level
                    ? "border-accent/40 bg-accent/15 text-accent-bright"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
            Target company (optional)
          </span>
          <input
            value={setup.company}
            onChange={(event) =>
              onChange({ ...setup, company: event.target.value })
            }
            placeholder="Stripe, Notion…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
            Job description (optional)
          </span>
          <textarea
            value={setup.jobDescription}
            onChange={(event) =>
              onChange({ ...setup, jobDescription: event.target.value })
            }
            rows={4}
            placeholder="Paste a job description from Job Discovery for more relevant demo questions…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>

        {resumeSkills.length > 0 ? (
          <div>
            <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
              Resume context (from analyzer)
            </p>
            <div className="flex flex-wrap gap-2">
              {resumeSkills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] text-accent-bright"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          disabled={!canStart}
          onClick={onStart}
          className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
        >
          Start Preparation →
        </button>
      </div>
    </section>
  );
}
