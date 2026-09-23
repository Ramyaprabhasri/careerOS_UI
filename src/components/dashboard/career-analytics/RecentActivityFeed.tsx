"use client";

import {
  Briefcase,
  FileText,
  Mic2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ActivityFeedItem } from "@/types/career-analytics";

const icons = {
  application: Briefcase,
  interview: Mic2,
  resume: FileText,
  job: Briefcase,
  status: RefreshCw,
};

type RecentActivityFeedProps = {
  items: ActivityFeedItem[];
};

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Recent Activity
      </h3>
      <p className="mt-1 text-sm text-muted">
        Latest moves across applications, prep, and resume analysis.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No recent activity yet.</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {items.map((item) => {
            const Icon = icons[item.kind];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background/40 px-3 py-3 transition-colors hover:border-border-strong"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{item.description}</p>
                    <p className="mt-1 text-[11px] text-muted-soft">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
