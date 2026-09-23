"use client";

import {
  Briefcase,
  ClipboardList,
  FileText,
  Mic2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { CareerInsightItem } from "@/types/career-analytics";

const icons = {
  momentum: Briefcase,
  interview: Mic2,
  followup: ClipboardList,
  prep: Mic2,
  resume: FileText,
};

type CareerInsightsProps = {
  insights: CareerInsightItem[];
};

export function CareerInsights({ insights }: CareerInsightsProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="mb-1 inline-flex items-center gap-2 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
        <Sparkles className="h-3.5 w-3.5" />
        Simulated insights
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Career Insights
      </h3>
      <p className="mt-1 text-sm text-muted">
        Derived from your CareerOS demo activity — not live AI analysis.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {insights.map((insight) => {
          const Icon = icons[insight.icon];
          return (
            <article
              key={insight.id}
              className="rounded-xl border border-border bg-background/40 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    {insight.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {insight.body}
                  </p>
                  {insight.actionHref && insight.actionLabel ? (
                    <Link
                      href={insight.actionHref}
                      className="mt-3 inline-flex text-xs text-accent-bright hover:underline"
                    >
                      {insight.actionLabel} →
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
