"use client";

import type { ConversionMetrics } from "@/types/career-analytics";

type ConversionAnalysisProps = {
  metrics: ConversionMetrics;
};

export function ConversionAnalysis({ metrics }: ConversionAnalysisProps) {
  const rows = [
    {
      label: "Response Rate",
      value: metrics.responseRate,
      detail: `${metrics.respondedCount} of ${metrics.submittedCount} submitted applications received a response (screening or later).`,
    },
    {
      label: "Interview Conversion",
      value: metrics.interviewConversion,
      detail: `${metrics.interviewConversion}% of your applications have progressed to interviews.`,
    },
    {
      label: "Offer Conversion",
      value: metrics.offerConversion,
      detail: `${metrics.offerCount} offer${metrics.offerCount === 1 ? "" : "s"} from ${metrics.submittedCount} submitted applications in this range.`,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        How Your Applications Are Performing
      </h3>
      <p className="mt-1 text-sm text-muted">
        Conversion rates from your tracked applications — not industry benchmarks.
      </p>

      <div className="mt-5 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-end justify-between gap-3">
              <span className="text-sm text-foreground">{row.label}</span>
              <span className="font-display text-xl font-semibold text-foreground">
                {row.value}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-accent/70"
                style={{ width: `${Math.min(100, row.value)}%` }}
              />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{row.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
