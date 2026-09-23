"use client";

import { Copy, RotateCcw } from "lucide-react";
import type { AnswerFeedback } from "@/types/interview-prep";

type AnswerFeedbackPanelProps = {
  feedback: AnswerFeedback;
  loading?: boolean;
  onCopy: () => void;
  onTryAgain: () => void;
  onContinue?: () => void;
  continueLabel?: string;
};

export function AnswerFeedbackPanel({
  feedback,
  loading = false,
  onCopy,
  onTryAgain,
  onContinue,
  continueLabel = "Next Question",
}: AnswerFeedbackPanelProps) {
  if (loading) {
    return (
      <section className="animate-pulse rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
        <div className="h-4 w-32 rounded bg-white/[0.08]" />
        <div className="mt-4 h-10 w-24 rounded bg-white/[0.1]" />
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full rounded bg-white/[0.05]" />
          <div className="h-3 w-5/6 rounded bg-white/[0.05]" />
          <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
        </div>
      </section>
    );
  }

  const breakdown = [
    { label: "Technical Accuracy", value: feedback.breakdown.technicalAccuracy },
    { label: "Relevance", value: feedback.breakdown.relevance },
    { label: "Structure", value: feedback.breakdown.structure },
    { label: "Clarity", value: feedback.breakdown.clarity },
    { label: "Completeness", value: feedback.breakdown.completeness },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <p className="text-[10px] tracking-[0.16em] text-accent-bright uppercase">
        Demo / simulated feedback
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Answer Feedback
          </h3>
          <p className="mt-1 text-sm text-muted">
            Scores are simulated for this portfolio demo — not live AI evaluation.
          </p>
        </div>
        <p className="font-display text-3xl font-semibold text-foreground">
          {feedback.overall}
          <span className="text-base text-muted"> / 10</span>
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-accent/70"
                style={{ width: `${item.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <h4 className="text-xs tracking-[0.14em] text-muted uppercase">
            What you did well
          </h4>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {feedback.strengths.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <h4 className="text-xs tracking-[0.14em] text-muted uppercase">
            What could be improved
          </h4>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {feedback.improvements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
        <h4 className="text-xs tracking-[0.14em] text-muted uppercase">
          Suggested stronger answer
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {feedback.suggestedAnswer}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-muted hover:border-border-strong hover:text-foreground"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy Answer
        </button>
        <button
          type="button"
          onClick={onTryAgain}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-muted hover:border-border-strong hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try Again
        </button>
        {onContinue ? (
          <button
            type="button"
            onClick={onContinue}
            className="ml-auto rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
          >
            {continueLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
