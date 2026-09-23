"use client";

import { Download, Sparkles } from "lucide-react";
import { rangeLabel } from "@/lib/career-analytics";
import { cn } from "@/lib/utils";
import type { AnalyticsDateRange } from "@/types/career-analytics";

const ranges: AnalyticsDateRange[] = ["7d", "30d", "90d", "year", "custom"];

type AnalyticsHeaderProps = {
  range: AnalyticsDateRange;
  customFrom: string;
  customTo: string;
  onRangeChange: (range: AnalyticsDateRange) => void;
  onCustomFrom: (value: string) => void;
  onCustomTo: (value: string) => void;
  onExport: () => void;
};

export function AnalyticsHeader({
  range,
  customFrom,
  customTo,
  onRangeChange,
  onCustomFrom,
  onCustomTo,
  onExport,
}: AnalyticsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Demo analytics
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Career Analytics
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Turn your job search activity into insights you can act on.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-1 rounded-full border border-border bg-background/60 p-1">
            {ranges.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onRangeChange(item)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition-colors",
                  range === item
                    ? "bg-accent/15 text-accent-bright"
                    : "text-muted hover:text-foreground",
                )}
              >
                {rangeLabel(item)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {range === "custom" ? (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-surface/60 p-3">
          <label className="text-xs text-muted">
            From
            <input
              type="date"
              value={customFrom}
              onChange={(event) => onCustomFrom(event.target.value)}
              className="mt-1 block rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-accent/40"
            />
          </label>
          <label className="text-xs text-muted">
            To
            <input
              type="date"
              value={customTo}
              onChange={(event) => onCustomTo(event.target.value)}
              className="mt-1 block rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-accent/40"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
