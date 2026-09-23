"use client";

import type { ReadinessBreakdown } from "@/types/interview-prep";

type ReadinessCardProps = {
  score: number;
  breakdown: ReadinessBreakdown;
  insight: string;
};

export function ReadinessCard({ score, breakdown, insight }: ReadinessCardProps) {
  const items = [
    { label: "Technical", value: breakdown.technical },
    { label: "Behavioral", value: breakdown.behavioral },
    { label: "Communication", value: breakdown.communication },
    { label: "Role Knowledge", value: breakdown.roleKnowledge },
  ];

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center lg:mx-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/[0.06]"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-accent transition-[stroke-dashoffset] duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-3xl font-semibold text-foreground">
              {score}
            </p>
            <p className="text-[10px] tracking-[0.14em] text-muted-soft uppercase">
              / 100
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.16em] text-accent-bright uppercase">
            Simulated readiness
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            Your Interview Readiness
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{insight}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
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
        </div>
      </div>
    </section>
  );
}
