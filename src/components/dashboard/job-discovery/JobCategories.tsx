"use client";

import { JOB_CATEGORIES } from "@/data/job-listings";
import { cn } from "@/lib/utils";
import type { JobCategory } from "@/types/job-discovery";

type JobCategoriesProps = {
  selected: JobCategory | "All";
  onSelect: (category: JobCategory | "All") => void;
};

export function JobCategories({ selected, onSelect }: JobCategoriesProps) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Browse by focus
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            Compact categories tuned to frontend-leaning demo roles.
          </p>
        </div>
        {selected !== "All" ? (
          <button
            type="button"
            onClick={() => onSelect("All")}
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            Clear category
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {JOB_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              onSelect(selected === category ? "All" : category)
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              selected === category
                ? "border-accent/40 bg-accent/15 text-accent-bright"
                : "border-border text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
