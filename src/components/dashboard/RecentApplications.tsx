"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/dashboard";

const filters: Array<"All" | ApplicationStatus> = [
  "All",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Saved",
];

type RecentApplicationsProps = {
  applications: Application[];
  onSelect: (application: Application) => void;
  limit?: number;
  showViewAll?: boolean;
};

export function RecentApplications({
  applications,
  onSelect,
  limit = 6,
  showViewAll = true,
}: RecentApplicationsProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ApplicationStatus>("All");

  const filtered = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesStatus = status === "All" || app.status === status;
        const haystack = `${app.company} ${app.role}`.toLowerCase();
        const matchesQuery = haystack.includes(query.toLowerCase().trim());
        return matchesStatus && matchesQuery;
      })
      .slice(0, limit);
  }, [applications, limit, query, status]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Recent applications
          </h3>
          <p className="mt-1 text-sm text-muted">
            Search, filter, and open any opportunity
          </p>
        </div>
        {showViewAll ? (
          <Link
            href="/dashboard/applications"
            className="group inline-flex items-center gap-1 text-xs tracking-[0.12em] text-accent uppercase"
          >
            View all
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        ) : null}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-soft" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company or role"
            className="w-full rounded-full border border-border bg-background/60 py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                status === item
                  ? "border-accent/30 bg-accent/15 text-accent-bright"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm text-muted">No applications match this filter.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/50 text-[10px] tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Date applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Match</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelect(app)}
                    className="cursor-pointer border-t border-border transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3.5 font-medium text-foreground">
                      {app.company}
                    </td>
                    <td className="px-4 py-3.5 text-muted">{app.role}</td>
                    <td className="px-4 py-3.5 text-muted">
                      {formatDate(app.dateApplied)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3.5 text-accent-bright">
                      {app.matchScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => onSelect(app)}
                className="w-full rounded-2xl border border-border bg-background/40 p-4 text-left transition-colors hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{app.company}</p>
                    <p className="mt-0.5 text-sm text-muted">{app.role}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-soft">
                  <span>{formatDate(app.dateApplied)}</span>
                  <span className="text-accent-bright">{app.matchScore}% match</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
