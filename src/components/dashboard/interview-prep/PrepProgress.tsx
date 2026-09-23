"use client";

import type { PrepStats } from "@/types/interview-prep";

type PrepProgressProps = {
  stats: PrepStats;
};

export function PrepProgress({ stats }: PrepProgressProps) {
  const rows = [
    {
      label: "Questions practiced this week",
      value: stats.questionsThisWeek,
      max: 20,
    },
    {
      label: "Mock interviews completed",
      value: stats.mockInterviewsCompleted,
      max: 10,
    },
    {
      label: "Technical questions completed",
      value: stats.technicalCompleted,
      max: 20,
    },
    {
      label: "Behavioral questions completed",
      value: stats.behavioralCompleted,
      max: 12,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
        Your Progress
      </h3>
      <p className="mt-1 text-sm text-muted">
        Lightweight prep signals — full analytics live in Career Analytics.
      </p>

      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-muted">{row.label}</span>
              <span className="text-foreground">{row.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-accent/70"
                style={{
                  width: `${Math.min(100, (row.value / row.max) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted">
        Current preparation streak:{" "}
        <span className="text-foreground">{stats.currentStreak} day(s)</span>
      </p>
    </section>
  );
}
