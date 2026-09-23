"use client";

import { Lightbulb } from "lucide-react";
import { difficultyTone } from "@/lib/interview-prep";
import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "@/types/interview-prep";

type PracticeWorkspaceProps = {
  question: InterviewQuestion;
  index: number;
  total: number;
  answer: string;
  showHint: boolean;
  loading?: boolean;
  onAnswerChange: (value: string) => void;
  onToggleHint: () => void;
  onSkip: () => void;
  onSubmit: () => void;
  onExit: () => void;
  submitLabel?: string;
  timerLabel?: string | null;
};

export function PracticeWorkspace({
  question,
  index,
  total,
  answer,
  showHint,
  loading = false,
  onAnswerChange,
  onToggleHint,
  onSkip,
  onSubmit,
  onExit,
  submitLabel = "Submit Answer",
  timerLabel = null,
}: PracticeWorkspaceProps) {
  const progress = ((index + 1) / total) * 100;

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-muted-soft uppercase">
            Question {index + 1} of {total}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted">
              {question.category}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px]",
                difficultyTone(question.difficulty),
              )}
            >
              {question.difficulty}
            </span>
            {timerLabel ? (
              <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-soft">
                {timerLabel}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Exit
        </button>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-accent/70 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          <div className="h-5 w-3/4 rounded bg-white/[0.08]" />
          <div className="h-5 w-1/2 rounded bg-white/[0.06]" />
          <div className="mt-6 h-40 rounded-xl bg-white/[0.04]" />
        </div>
      ) : (
        <>
          <h3 className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
            {question.prompt}
          </h3>

          {showHint ? (
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/[0.07] px-4 py-3 text-sm text-muted">
              <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-accent-bright uppercase">
                <Lightbulb className="h-3.5 w-3.5" />
                Hint
              </p>
              <p>{question.hint}</p>
            </div>
          ) : null}

          <textarea
            value={answer}
            onChange={(event) => onAnswerChange(event.target.value)}
            rows={8}
            placeholder="Type your answer here…"
            className="mt-5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggleHint}
              className="rounded-full border border-border px-3.5 py-2 text-sm text-muted hover:border-border-strong hover:text-foreground"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="rounded-full border border-border px-3.5 py-2 text-sm text-muted hover:border-border-strong hover:text-foreground"
            >
              Skip
            </button>
            <button
              type="button"
              disabled={answer.trim().length < 8}
              onClick={onSubmit}
              className="ml-auto rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
