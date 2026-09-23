"use client";

import { motion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import type { JobDiscoveryView } from "@/types/job-discovery";
import { cn } from "@/lib/utils";

const tabs: Array<{ id: JobDiscoveryView; label: string }> = [
  { id: "search", label: "Search Jobs" },
  { id: "recommended", label: "Recommended for You" },
  { id: "saved", label: "Saved Jobs" },
];

type DiscoveryHeaderProps = {
  view: JobDiscoveryView;
  onViewChange: (view: JobDiscoveryView) => void;
  onExploreMatches: () => void;
  savedCount: number;
};

export function DiscoveryHeader({
  view,
  onViewChange,
  onExploreMatches,
  savedCount,
}: DiscoveryHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Demo job discovery
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Discover Opportunities
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Find roles that match your skills, experience, and career goals.
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreMatches}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
        >
          <Compass className="h-4 w-4" />
          Explore Matches
        </button>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-accent/[0.06] px-4 py-3 sm:px-5">
        <p className="text-sm text-foreground">
          Your next opportunity starts here.
          <span className="ml-2 text-muted">
            Listings and match scores below are demo data for portfolio use.
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onViewChange(tab.id)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm transition-colors",
              view === tab.id
                ? "border-accent/40 bg-accent/15 text-accent-bright"
                : "border-border text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.id === "saved" && savedCount > 0 ? (
              <span className="ml-1.5 text-[11px] text-muted-soft">
                {savedCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
