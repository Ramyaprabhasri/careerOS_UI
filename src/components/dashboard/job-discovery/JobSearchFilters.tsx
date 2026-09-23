"use client";

import { Search, X } from "lucide-react";
import {
  activeFilterChips,
  DEFAULT_JOB_FILTERS,
} from "@/lib/job-discovery";
import { cn } from "@/lib/utils";
import type {
  DatePostedFilter,
  ExperienceLevel,
  JobFilters,
  JobSort,
} from "@/types/job-discovery";
import type { EmploymentType, WorkMode } from "@/types/dashboard";

type JobSearchFiltersProps = {
  filters: JobFilters;
  onChange: (next: JobFilters) => void;
  onSearch: () => void;
  resultCount: number;
  compact?: boolean;
};

const workModes: Array<WorkMode | "All"> = [
  "All",
  "Remote",
  "Hybrid",
  "Onsite",
];
const experienceLevels: Array<ExperienceLevel | "All"> = [
  "All",
  "Internship",
  "Entry",
  "Mid",
  "Senior",
  "Lead",
];
const employmentTypes: Array<EmploymentType | "All"> = [
  "All",
  "Full-time",
  "Contract",
  "Internship",
  "Part-time",
];
const datePosted: Array<{ value: DatePostedFilter; label: string }> = [
  { value: "any", label: "Any time" },
  { value: "24h", label: "Past 24h" },
  { value: "7d", label: "Past week" },
  { value: "30d", label: "Past month" },
];
const sorts: Array<{ value: JobSort; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "match", label: "Match Score" },
  { value: "date", label: "Date Posted" },
];

export function JobSearchFilters({
  filters,
  onChange,
  onSearch,
  resultCount,
  compact = false,
}: JobSearchFiltersProps) {
  const chips = activeFilterChips(filters);

  const clearChip = (key: (typeof chips)[number]["key"]) => {
    if (key === "salary") {
      onChange({ ...filters, salaryMin: null });
      return;
    }
    onChange({
      ...filters,
      [key]: DEFAULT_JOB_FILTERS[key],
    });
  };

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
            Job title, skill, or company
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-soft" />
            <input
              value={filters.query}
              onChange={(event) =>
                onChange({ ...filters, query: event.target.value })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
              placeholder="e.g. React, Stripe, Frontend Engineer"
              className="w-full rounded-xl border border-border bg-background py-2.5 pr-3 pl-10 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
            />
          </div>
        </label>

        <label className="w-full lg:w-48">
          <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
            Location
          </span>
          <input
            value={filters.location}
            onChange={(event) =>
              onChange({ ...filters, location: event.target.value })
            }
            placeholder="Bengaluru, Remote…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_JOB_FILTERS })}
            className="rounded-full border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 grid gap-3",
          compact
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-5",
        )}
      >
        <Select
          label="Work mode"
          value={filters.workMode}
          options={workModes}
          onChange={(value) =>
            onChange({ ...filters, workMode: value as JobFilters["workMode"] })
          }
        />
        <Select
          label="Experience"
          value={filters.experienceLevel}
          options={experienceLevels}
          onChange={(value) =>
            onChange({
              ...filters,
              experienceLevel: value as JobFilters["experienceLevel"],
            })
          }
        />
        <Select
          label="Employment type"
          value={filters.employmentType}
          options={employmentTypes}
          onChange={(value) =>
            onChange({
              ...filters,
              employmentType: value as JobFilters["employmentType"],
            })
          }
        />
        <Select
          label="Date posted"
          value={filters.datePosted}
          options={datePosted}
          onChange={(value) =>
            onChange({
              ...filters,
              datePosted: value as DatePostedFilter,
            })
          }
        />
        <label>
          <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
            Min salary (numeric)
          </span>
          <input
            type="number"
            min={0}
            value={filters.salaryMin ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                salaryMin: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            placeholder="Optional"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          {resultCount} demo opportunit{resultCount === 1 ? "y" : "ies"}
        </p>
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort by
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({ ...filters, sort: event.target.value as JobSort })
            }
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-accent/40"
          >
            {sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={`${chip.key}-${chip.label}`}
              type="button"
              onClick={() => clearChip(chip.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<string | { value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
      >
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          const optionLabel =
            typeof option === "string" ? option : option.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}
