"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Video } from "lucide-react";
import Link from "next/link";
import { upcomingInterviews } from "@/data/mock";
import { formatDateTime } from "@/lib/utils";

export function UpcomingInterviews() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Upcoming interviews
          </h3>
          <p className="mt-1 text-sm text-muted">
            Your next conversations on the calendar
          </p>
        </div>
        <Link
          href="/dashboard/interviews"
          className="group inline-flex items-center gap-1 text-xs tracking-[0.12em] text-accent uppercase"
        >
          View calendar
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>

      {upcomingInterviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center">
          <CalendarDays className="mx-auto h-5 w-5 text-muted-soft" />
          <p className="mt-3 text-sm text-muted">
            No interviews scheduled. Keep applying — your next conversation will
            land here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {upcomingInterviews.map((interview) => (
            <li
              key={interview.id}
              className="rounded-2xl border border-border bg-background/40 p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xs font-semibold text-accent">
                  {interview.company.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    {interview.company}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{interview.role}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateTime(interview.dateTime)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {interview.format === "Video" ? (
                        <Video className="h-3.5 w-3.5" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                      {interview.round} · {interview.format}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
