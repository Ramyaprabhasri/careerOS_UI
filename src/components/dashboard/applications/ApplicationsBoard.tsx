"use client";

import { motion } from "framer-motion";
import {
  ArrowUpDown,
  BookmarkPlus,
  CalendarDays,
  Columns3,
  Filter,
  List,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApplicationDrawer } from "./ApplicationDrawer";
import { ApplicationsTable, DEFAULT_COLUMNS } from "./ApplicationsTable";
import { KanbanBoard } from "./KanbanBoard";
import { ApplicationFormModal } from "../ApplicationFormModal";
import { StatusBadge } from "../StatusBadge";
import { useDashboard } from "../DashboardProvider";
import { getNextAction, sortApplications, STATUS_LABEL } from "@/lib/applications";
import { cn, formatDate } from "@/lib/utils";
import type {
  Application,
  ApplicationSort,
  ApplicationStatus,
  BoardView,
  EmploymentType,
  FollowUpFilter,
  Priority,
  SavedTableView,
  TableColumnId,
  WorkMode,
} from "@/types/dashboard";

type Filters = {
  status: ApplicationStatus | "All";
  employmentType: EmploymentType | "All";
  location: string;
  workMode: WorkMode | "All";
  priority: Priority | "All";
  dateFrom: string;
  dateTo: string;
  followUp: FollowUpFilter;
};

const defaultFilters: Filters = {
  status: "All",
  employmentType: "All",
  location: "",
  workMode: "All",
  priority: "All",
  dateFrom: "",
  dateTo: "",
  followUp: "All",
};

const PRESET_VIEWS: SavedTableView[] = [
  {
    id: "all",
    name: "All Applications",
    filters: { ...defaultFilters },
    sort: "date-desc",
    columns: DEFAULT_COLUMNS,
  },
  {
    id: "active",
    name: "Active Applications",
    filters: { ...defaultFilters },
    sort: "date-desc",
    columns: DEFAULT_COLUMNS,
  },
  {
    id: "interviews",
    name: "Interviews",
    filters: { ...defaultFilters, status: "Interview" },
    sort: "updated",
    columns: DEFAULT_COLUMNS,
  },
  {
    id: "high-priority",
    name: "High Priority",
    filters: { ...defaultFilters, priority: "High" },
    sort: "priority",
    columns: DEFAULT_COLUMNS,
  },
  {
    id: "follow-ups",
    name: "Follow-ups",
    filters: { ...defaultFilters, followUp: "Upcoming" },
    sort: "updated",
    columns: DEFAULT_COLUMNS,
  },
];

export function ApplicationsBoard() {
  const searchParams = useSearchParams();
  const { applications, updateApplicationStatus, deleteApplication } =
    useDashboard();

  const statusParam = searchParams.get("status");
  const initialStatus =
    statusParam &&
    ["Saved", "Applied", "Screening", "Interview", "Offer", "Rejected"].includes(
      statusParam,
    )
      ? (statusParam as ApplicationStatus)
      : "All";

  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    status: initialStatus,
  });
  const [statusQueryKey, setStatusQueryKey] = useState(statusParam ?? "");
  if ((statusParam ?? "") !== statusQueryKey) {
    setStatusQueryKey(statusParam ?? "");
    setFilters((current) => ({
      ...current,
      status: initialStatus,
    }));
  }

  const [view, setView] = useState<BoardView>("board");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ApplicationSort>("date-desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<ApplicationStatus>("Applied");
  const [editing, setEditing] = useState<Application | null>(null);
  const [columns, setColumns] = useState<TableColumnId[]>(DEFAULT_COLUMNS);
  const [activeViewId, setActiveViewId] = useState("all");
  const [savedViews, setSavedViews] = useState<SavedTableView[]>([]);
  const [tableLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    const next = applications.filter((app) => {
      const haystack =
        `${app.company} ${app.role} ${app.location}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const matchesStatus =
        filters.status === "All" || app.status === filters.status;
      const matchesType =
        filters.employmentType === "All" ||
        app.employmentType === filters.employmentType;
      const matchesLocation =
        !filters.location.trim() ||
        app.location
          .toLowerCase()
          .includes(filters.location.trim().toLowerCase());
      const matchesMode =
        filters.workMode === "All" || app.workMode === filters.workMode;
      const matchesPriority =
        filters.priority === "All" || app.priority === filters.priority;
      const matchesFrom =
        !filters.dateFrom || app.dateApplied >= filters.dateFrom;
      const matchesTo = !filters.dateTo || app.dateApplied <= filters.dateTo;

      let matchesFollowUp = true;
      if (filters.followUp === "None") {
        matchesFollowUp = !app.followUpDate;
      } else if (filters.followUp === "Upcoming") {
        matchesFollowUp = Boolean(
          app.followUpDate && app.followUpDate >= today,
        );
      } else if (filters.followUp === "Overdue") {
        matchesFollowUp = Boolean(app.followUpDate && app.followUpDate < today);
      }

      // Active Applications preset: exclude Rejected
      const matchesActivePreset =
        activeViewId !== "active" || app.status !== "Rejected";

      return (
        matchesQuery &&
        matchesStatus &&
        matchesType &&
        matchesLocation &&
        matchesMode &&
        matchesPriority &&
        matchesFrom &&
        matchesTo &&
        matchesFollowUp &&
        matchesActivePreset
      );
    });

    return sortApplications(next, sort);
  }, [activeViewId, applications, filters, query, sort, today]);

  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === "Applied").length;
    const interviews = applications.filter(
      (a) => a.status === "Interview",
    ).length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    return { total, applied, interviews, offers, rejected };
  }, [applications]);

  const openAdd = (status: ApplicationStatus = "Applied") => {
    setEditing(null);
    setFormStatus(status);
    setFormOpen(true);
  };

  const openEdit = (application: Application) => {
    setSelected(null);
    setEditing(application);
    setFormStatus(application.status);
    setFormOpen(true);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setQuery("");
    setActiveViewId("all");
  };

  const applyView = (preset: SavedTableView) => {
    setActiveViewId(preset.id);
    setFilters(preset.filters);
    setSort(preset.sort);
    setColumns(preset.columns);
    if (view !== "list") setView("list");
  };

  const saveCurrentView = () => {
    const name = window.prompt("Name this view");
    if (!name?.trim()) return;
    const next: SavedTableView = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      filters: { ...filters },
      sort,
      columns: [...columns],
    };
    setSavedViews((current) => [...current, next]);
    setActiveViewId(next.id);
  };

  const filterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; clear: () => void }> = [];
    if (filters.status !== "All") {
      chips.push({
        key: "status",
        label: `Status: ${STATUS_LABEL[filters.status]}`,
        clear: () => setFilters((current) => ({ ...current, status: "All" })),
      });
    }
    if (filters.priority !== "All") {
      chips.push({
        key: "priority",
        label: `Priority: ${filters.priority}`,
        clear: () => setFilters((current) => ({ ...current, priority: "All" })),
      });
    }
    if (filters.workMode !== "All") {
      chips.push({
        key: "workMode",
        label: `Work Mode: ${filters.workMode}`,
        clear: () => setFilters((current) => ({ ...current, workMode: "All" })),
      });
    }
    if (filters.employmentType !== "All") {
      chips.push({
        key: "type",
        label: `Job Type: ${filters.employmentType}`,
        clear: () =>
          setFilters((current) => ({ ...current, employmentType: "All" })),
      });
    }
    if (filters.location.trim()) {
      chips.push({
        key: "location",
        label: `Location: ${filters.location}`,
        clear: () => setFilters((current) => ({ ...current, location: "" })),
      });
    }
    if (filters.followUp !== "All") {
      chips.push({
        key: "followUp",
        label: `Follow-up: ${filters.followUp}`,
        clear: () =>
          setFilters((current) => ({ ...current, followUp: "All" })),
      });
    }
    if (filters.dateFrom || filters.dateTo) {
      chips.push({
        key: "dates",
        label: `Date: ${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`,
        clear: () =>
          setFilters((current) => ({
            ...current,
            dateFrom: "",
            dateTo: "",
          })),
      });
    }
    return chips;
  }, [filters]);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Applications
          </h2>
          <p className="mt-1 text-sm text-muted">
            Track every opportunity from application to offer.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[180px] flex-1 sm:max-w-xs sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-soft" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, role, location"
              className="w-full rounded-full border border-border bg-surface py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-soft focus:border-accent/40"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
              filtersOpen || filterChips.length > 0
                ? "border-accent/30 bg-accent/10 text-accent-bright"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            <Filter className="h-4 w-4" />
            Filter
            {filterChips.length > 0 ? (
              <span className="rounded-full bg-accent/20 px-1.5 text-[10px]">
                {filterChips.length}
              </span>
            ) : null}
          </button>
          <label className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-muted">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as ApplicationSort)
              }
              className="bg-transparent text-foreground outline-none"
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="company">Company</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="updated">Last updated</option>
              <option value="match">Match score</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => openAdd("Applied")}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { label: "Total", value: stats.total },
          { label: "Applied", value: stats.applied },
          { label: "Interviews", value: stats.interviews },
          { label: "Offers", value: stats.offers },
          { label: "Rejected", value: stats.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted"
          >
            <span className="text-muted-soft">{item.label}</span>
            <span className="ml-2 font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </motion.div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-border bg-surface/60 p-1">
            {(
              [
                { id: "board", label: "Board View", icon: Columns3 },
                { id: "list", label: "Table View", icon: List },
                { id: "calendar", label: "Calendar View", icon: CalendarDays },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors",
                    view === item.id
                      ? "bg-accent/15 text-accent-bright"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {view === "list" ? (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activeViewId}
                onChange={(event) => {
                  const id = event.target.value;
                  const preset =
                    PRESET_VIEWS.find((item) => item.id === id) ??
                    savedViews.find((item) => item.id === id);
                  if (preset) applyView(preset);
                }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground outline-none"
              >
                <optgroup label="Default views">
                  {PRESET_VIEWS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </optgroup>
                {savedViews.length > 0 ? (
                  <optgroup label="Saved views">
                    {savedViews.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
              <button
                type="button"
                onClick={saveCurrentView}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
              >
                <BookmarkPlus className="h-3.5 w-3.5" />
                Save View
              </button>
            </div>
          ) : null}
        </div>

        {filterChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground transition-colors hover:border-border-strong"
              >
                {chip.label}
                <X className="h-3 w-3 text-muted" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] text-muted hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {filtersOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface/70 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  status: value as Filters["status"],
                }))
              }
              options={[
                "All",
                "Saved",
                "Applied",
                "Screening",
                "Interview",
                "Offer",
                "Rejected",
              ]}
              labels={{ Saved: "Wishlist" }}
            />
            <FilterSelect
              label="Priority"
              value={filters.priority}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  priority: value as Filters["priority"],
                }))
              }
              options={["All", "High", "Medium", "Low"]}
            />
            <FilterSelect
              label="Work mode"
              value={filters.workMode}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  workMode: value as Filters["workMode"],
                }))
              }
              options={["All", "Remote", "Hybrid", "Onsite"]}
            />
            <FilterSelect
              label="Job type"
              value={filters.employmentType}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  employmentType: value as Filters["employmentType"],
                }))
              }
              options={[
                "All",
                "Full-time",
                "Contract",
                "Internship",
                "Part-time",
              ]}
            />
            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.12em] text-muted uppercase">
                Location
              </label>
              <input
                value={filters.location}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                placeholder="City or region"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/40"
              />
            </div>
            <FilterSelect
              label="Follow-up status"
              value={filters.followUp}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  followUp: value as FollowUpFilter,
                }))
              }
              options={["All", "Upcoming", "Overdue", "None"]}
            />
            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.12em] text-muted uppercase">
                From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    dateFrom: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-2 py-2 text-sm outline-none focus:border-accent/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.12em] text-muted uppercase">
                To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    dateTo: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-2 py-2 text-sm outline-none focus:border-accent/40"
              />
            </div>
          </motion.div>
        ) : null}
      </div>

      {view === "board" ? (
        <KanbanBoard
          applications={filtered}
          onStatusChange={updateApplicationStatus}
          onOpen={setSelected}
          onEdit={openEdit}
          onDelete={(app) => deleteApplication(app.id)}
          onAdd={openAdd}
        />
      ) : view === "list" ? (
        <ApplicationsTable
          applications={filtered}
          sort={sort}
          onSortChange={setSort}
          columns={columns}
          onColumnsChange={setColumns}
          onOpen={setSelected}
          onEdit={openEdit}
          onClearFilters={clearFilters}
          loading={tableLoading}
        />
      ) : (
        <CalendarView applications={filtered} onOpen={setSelected} />
      )}

      <ApplicationDrawer
        application={
          selected
            ? (applications.find((app) => app.id === selected.id) ?? selected)
            : null
        }
        onClose={() => setSelected(null)}
        onEdit={openEdit}
      />

      <ApplicationFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        initialStatus={formStatus}
        application={editing}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels = {},
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] tracking-[0.12em] text-muted uppercase">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CalendarView({
  applications,
  onOpen,
}: {
  applications: Application[];
  onOpen: (application: Application) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, Application[]>();
    for (const app of applications) {
      const key = app.dateApplied.slice(0, 7);
      const list = map.get(key) ?? [];
      list.push(app);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [applications]);

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-4 py-16 text-center">
        <p className="text-sm text-muted">No applications in this date range.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(([month, apps]) => (
        <section
          key={month}
          className="rounded-2xl border border-border bg-surface/60 p-4"
        >
          <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date(`${month}-01`))}
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => {
              const next = getNextAction(app);
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onOpen(app)}
                  className="rounded-xl border border-border bg-background/50 px-3 py-3 text-left transition-colors hover:border-border-strong"
                >
                  <p className="text-sm font-medium text-foreground">
                    {app.company}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{app.role}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-soft">
                      {formatDate(app.dateApplied)}
                    </span>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-soft">{next.label}</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
