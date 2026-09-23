"use client";

import type { FunnelStage } from "@/types/career-analytics";
import type { ApplicationStatus } from "@/types/dashboard";

type ApplicationFunnelProps = {
  stages: FunnelStage[];
  onStageClick: (status: ApplicationStatus) => void;
};

export function ApplicationFunnel({
  stages,
  onStageClick,
}: ApplicationFunnelProps) {
  const max = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Application Funnel
      </h3>
      <p className="mt-1 text-sm text-muted">
        Stage counts for the selected range. Click a stage to open Applications.
      </p>

      <div className="mt-6 space-y-0">
        {stages.map((stage, index) => (
          <div key={stage.status}>
            {index > 0 ? (
              <div className="flex items-center gap-3 py-2 pl-2 text-xs text-muted-soft">
                <span className="text-muted">↓</span>
                {stage.conversionFromPrevious == null ? (
                  <span>No conversion yet</span>
                ) : (
                  <span>{stage.conversionFromPrevious}% conversion</span>
                )}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => onStageClick(stage.status as ApplicationStatus)}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-background/40 px-4 py-3 text-left transition-colors hover:border-border-strong"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {stage.label}
                  </span>
                  <span className="font-display text-lg font-semibold text-foreground">
                    {stage.count}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-accent/70"
                    style={{ width: `${(stage.count / max) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
