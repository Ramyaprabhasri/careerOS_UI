"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { AnalyticsKpi } from "@/types/career-analytics";
import { cn } from "@/lib/utils";

type AnalyticsKpiRowProps = {
  kpis: AnalyticsKpi[];
  loading?: boolean;
};

export function AnalyticsKpiRow({ kpis, loading }: AnalyticsKpiRowProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-[92px] animate-pulse rounded-2xl border border-border bg-surface/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="rounded-2xl border border-border bg-surface/80 px-4 py-3"
        >
          <p className="text-[10px] tracking-[0.14em] text-muted-soft uppercase">
            {kpi.label}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {kpi.value}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
            {kpi.deltaPercent == null ? (
              <span className="text-muted-soft">No prior period</span>
            ) : (
              <>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5",
                    kpi.deltaPercent >= 0 ? "text-emerald-300" : "text-rose-300",
                  )}
                >
                  {kpi.deltaPercent >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.deltaPercent > 0 ? "+" : ""}
                  {kpi.deltaPercent}%
                </span>
                <span className="text-muted-soft">vs previous</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
