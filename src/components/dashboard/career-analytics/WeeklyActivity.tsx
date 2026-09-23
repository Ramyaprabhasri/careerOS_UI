"use client";

import type { WeekdayActivity } from "@/types/career-analytics";
import { cn } from "@/lib/utils";

type WeeklyActivityProps = {
  days: WeekdayActivity[];
};

export function WeeklyActivity({ days }: WeeklyActivityProps) {
  const max = Math.max(...days.map((day) => day.total), 1);

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Your Activity
      </h3>
      <p className="mt-1 text-sm text-muted">
        Applications, interviews, resume analyses, and practice by weekday.
      </p>

      <div className="mt-5 space-y-3">
        {days.map((day) => {
          const intensity = day.total / max;
          return (
            <div key={day.day} className="flex items-center gap-3">
              <span className="w-8 text-xs text-muted">{day.day}</span>
              <div className="flex flex-1 items-center gap-1">
                {Array.from({ length: Math.max(1, Math.min(8, day.total || 0)) }).map(
                  (_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        day.total === 0
                          ? "bg-white/[0.06]"
                          : intensity > 0.66
                            ? "bg-accent"
                            : intensity > 0.33
                              ? "bg-accent/60"
                              : "bg-accent/35",
                      )}
                    />
                  ),
                )}
                {day.total === 0 ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
                ) : null}
              </div>
              <span className="w-6 text-right text-xs text-muted-soft">
                {day.total}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[11px] text-muted-soft">
        Includes applications, interview updates, resume analyses, and practice
        sessions in range.
      </p>
    </section>
  );
}
