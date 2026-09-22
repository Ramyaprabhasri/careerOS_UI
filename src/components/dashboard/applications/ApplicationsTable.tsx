"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  CalendarPlus,
  Columns3,
  Eye,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { StatusBadge } from "../StatusBadge";
import { useDashboard } from "../DashboardProvider";
import {
  companyInitials,
  getNextAction,
  STATUS_LABEL,
} from "@/lib/applications";
import { cn, formatDate } from "@/lib/utils";
import type {
  Application,
  ApplicationSort,
  ApplicationStatus,
  Priority,
  TableColumnId,
} from "@/types/dashboard";

const DEFAULT_COLUMNS: TableColumnId[] = [
  "company",
  "status",
  "priority",
  "location",
  "applied",
  "nextAction",
  "updated",
  "actions",
];

const TOGGLEABLE_COLUMNS: Array<{ id: TableColumnId; label: string }> = [
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "location", label: "Location" },
  { id: "applied", label: "Applied" },
  { id: "nextAction", label: "Next Action" },
  { id: "updated", label: "Last Updated" },
];

type ApplicationsTableProps = {
  applications: Application[];
  sort: ApplicationSort;
  onSortChange: (sort: ApplicationSort) => void;
  columns: TableColumnId[];
  onColumnsChange: (columns: TableColumnId[]) => void;
  onOpen: (application: Application) => void;
  onEdit: (application: Application) => void;
  onClearFilters: () => void;
  loading?: boolean;
};

export function ApplicationsTable({
  applications,
  sort,
  onSortChange,
  columns,
  onColumnsChange,
  onOpen,
  onEdit,
  onClearFilters,
  loading = false,
}: ApplicationsTableProps) {
  const {
    updateApplicationStatus,
    updateApplication,
    updateNotes,
    deleteApplication,
    deleteApplications,
    bulkUpdateStatus,
    bulkUpdatePriority,
    bulkAddTag,
    bulkScheduleFollowUp,
    pushToast,
  } = useDashboard();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [bulkMenu, setBulkMenu] = useState<
    null | "status" | "priority" | "tag" | "followup"
  >(null);
  const [tagDraft, setTagDraft] = useState("");
  const [followDraft, setFollowDraft] = useState("");
  const [datasetKey, setDatasetKey] = useState(() =>
    applications.map((app) => app.id).join("|"),
  );

  const nextDatasetKey = applications.map((app) => app.id).join("|");
  if (nextDatasetKey !== datasetKey) {
    setDatasetKey(nextDatasetKey);
    setPage(1);
    setSelectedIds([]);
  }

  const totalPages = Math.max(1, Math.ceil(applications.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return applications.slice(start, start + pageSize);
  }, [applications, currentPage, pageSize]);

  const allOnPageSelected =
    pageItems.length > 0 &&
    pageItems.every((app) => selectedIds.includes(app.id));

  const toggleSort = (column: "company" | "status" | "priority" | "applied" | "updated") => {
    const map: Record<string, { asc: ApplicationSort; desc: ApplicationSort }> =
      {
        company: { asc: "company", desc: "company" },
        status: { asc: "status", desc: "status" },
        priority: { asc: "priority", desc: "priority" },
        applied: { asc: "date-asc", desc: "date-desc" },
        updated: { asc: "updated", desc: "updated" },
      };

    if (column === "applied") {
      onSortChange(sort === "date-desc" ? "date-asc" : "date-desc");
      return;
    }

    if (column === "company") {
      onSortChange(sort === "company" ? "date-desc" : "company");
      return;
    }

    if (column === "priority") {
      onSortChange(sort === "priority" ? "date-desc" : "priority");
      return;
    }

    if (column === "status") {
      onSortChange(sort === "status" ? "date-desc" : "status");
      return;
    }

    onSortChange(sort === "updated" ? "date-desc" : "updated");
    void map;
  };

  const visible = (id: TableColumnId) => columns.includes(id);

  if (loading) {
    return <TableSkeleton columns={columns} />;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-4 py-16 text-center">
        <p className="font-display text-base font-semibold text-foreground">
          No applications found
        </p>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your filters or search for another opportunity.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, applications.length);

  return (
    <div className="relative space-y-3">
      <div className="flex justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setColumnsOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            <Columns3 className="h-3.5 w-3.5" />
            Columns
          </button>
          {columnsOpen ? (
            <div className="absolute top-9 right-0 z-30 w-52 rounded-xl border border-border bg-surface p-2 shadow-xl">
              {TOGGLEABLE_COLUMNS.map((column) => (
                <label
                  key={column.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-white/[0.03]"
                >
                  <input
                    type="checkbox"
                    checked={columns.includes(column.id)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onColumnsChange([...columns, column.id]);
                      } else {
                        onColumnsChange(
                          columns.filter((item) => item !== column.id),
                        );
                      }
                    }}
                    className="accent-[var(--accent)]"
                  />
                  {column.label}
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface/50 md:block">
        <div className="max-h-[min(70vh,820px)] overflow-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-background-elevated/95 backdrop-blur-md">
              <tr className="border-b border-border text-[10px] tracking-[0.14em] text-muted uppercase">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedIds((current) => [
                          ...new Set([
                            ...current,
                            ...pageItems.map((app) => app.id),
                          ]),
                        ]);
                      } else {
                        const pageIds = new Set(pageItems.map((app) => app.id));
                        setSelectedIds((current) =>
                          current.filter((id) => !pageIds.has(id)),
                        );
                      }
                    }}
                    className="accent-[var(--accent)]"
                    aria-label="Select all on page"
                  />
                </th>
                <SortHeader
                  label="Company"
                  active={sort === "company"}
                  direction="asc"
                  onClick={() => toggleSort("company")}
                />
                {visible("status") ? (
                  <SortHeader
                    label="Status"
                    active={sort === "status"}
                    onClick={() => toggleSort("status")}
                  />
                ) : null}
                {visible("priority") ? (
                  <SortHeader
                    label="Priority"
                    active={sort === "priority"}
                    onClick={() => toggleSort("priority")}
                  />
                ) : null}
                {visible("location") ? (
                  <th className="px-3 py-3 font-medium">Location</th>
                ) : null}
                {visible("applied") ? (
                  <SortHeader
                    label="Applied"
                    active={sort === "date-desc" || sort === "date-asc"}
                    direction={sort === "date-asc" ? "asc" : "desc"}
                    onClick={() => toggleSort("applied")}
                  />
                ) : null}
                {visible("nextAction") ? (
                  <th className="px-3 py-3 font-medium">Next Action</th>
                ) : null}
                {visible("updated") ? (
                  <SortHeader
                    label="Last Updated"
                    active={sort === "updated"}
                    onClick={() => toggleSort("updated")}
                  />
                ) : null}
                {visible("actions") ? (
                  <th className="w-12 px-3 py-3 font-medium" />
                ) : null}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((app) => {
                const next = getNextAction(app);
                const selected = selectedIds.includes(app.id);

                return (
                  <tr
                    key={app.id}
                    className={cn(
                      "group border-b border-border transition-colors last:border-b-0",
                      selected
                        ? "bg-accent/[0.05]"
                        : "hover:bg-white/[0.025]",
                    )}
                  >
                    <td className="px-3 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(event) => {
                          event.stopPropagation();
                          setSelectedIds((current) =>
                            event.target.checked
                              ? [...current, app.id]
                              : current.filter((id) => id !== app.id),
                          );
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="accent-[var(--accent)]"
                        aria-label={`Select ${app.company}`}
                      />
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <button
                        type="button"
                        onClick={() => onOpen(app)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-semibold text-accent">
                          {companyInitials(app.company)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {app.company}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {app.role}
                          </span>
                        </span>
                      </button>
                    </td>
                    {visible("status") ? (
                      <td className="px-3 py-3 align-middle">
                        <StatusBadge status={app.status} />
                      </td>
                    ) : null}
                    {visible("priority") ? (
                      <td className="px-3 py-3 align-middle">
                        <PriorityCell priority={app.priority} />
                      </td>
                    ) : null}
                    {visible("location") ? (
                      <td className="px-3 py-3 align-middle text-xs text-muted">
                        {app.location} · {app.workMode}
                      </td>
                    ) : null}
                    {visible("applied") ? (
                      <td className="px-3 py-3 align-middle text-xs text-muted">
                        {formatDate(app.dateApplied)}
                      </td>
                    ) : null}
                    {visible("nextAction") ? (
                      <td className="px-3 py-3 align-middle">
                        <NextActionCell action={next} />
                      </td>
                    ) : null}
                    {visible("updated") ? (
                      <td className="px-3 py-3 align-middle text-xs text-muted-soft">
                        {formatDate(app.updatedAt)}
                      </td>
                    ) : null}
                    {visible("actions") ? (
                      <td className="relative px-3 py-3 align-middle">
                        <RowMenu
                          open={menuId === app.id}
                          onToggle={() =>
                            setMenuId((current) =>
                              current === app.id ? null : app.id,
                            )
                          }
                          onClose={() => setMenuId(null)}
                          onView={() => onOpen(app)}
                          onEdit={() => onEdit(app)}
                          onChangeStatus={(status) =>
                            updateApplicationStatus(app.id, status)
                          }
                          onAddNote={() => {
                            const note = window.prompt(
                              "Add a note",
                              app.notes ?? "",
                            );
                            if (note === null) return;
                            updateNotes(app.id, note);
                            pushToast({
                              title: "Note saved",
                              description: app.company,
                            });
                          }}
                          onSchedule={() => {
                            const date = window.prompt(
                              "Follow-up date (YYYY-MM-DD)",
                              app.followUpDate ??
                                new Date().toISOString().slice(0, 10),
                            );
                            if (!date) return;
                            updateApplication(app.id, { followUpDate: date });
                          }}
                          onDelete={() => deleteApplication(app.id)}
                        />
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {pageItems.map((app) => {
          const next = getNextAction(app);
          return (
            <div
              key={app.id}
              className="rounded-2xl border border-border bg-surface/60 p-3.5"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(app.id)}
                  onChange={(event) => {
                    setSelectedIds((current) =>
                      event.target.checked
                        ? [...current, app.id]
                        : current.filter((id) => id !== app.id),
                    );
                  }}
                  className="mt-1 accent-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => onOpen(app)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-semibold text-accent">
                      {companyInitials(app.company)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {app.company}
                      </p>
                      <p className="truncate text-xs text-muted">{app.role}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={app.status} />
                        <PriorityCell priority={app.priority} />
                      </div>
                      <p className="mt-2 text-[11px] text-muted-soft">
                        {app.location} · {app.workMode}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-muted">
                          Applied {formatDate(app.dateApplied)}
                        </span>
                        <NextActionCell action={next} />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Showing{" "}
          <span className="text-foreground">
            {startIndex}–{endIndex}
          </span>{" "}
          of <span className="text-foreground">{applications.length}</span>{" "}
          applications
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-muted">
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-border bg-background px-2 py-1 text-foreground outline-none"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </label>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(
              Math.max(0, currentPage - 2),
              Math.max(0, currentPage - 2) + 3,
            )
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={cn(
                  "min-w-7 rounded-lg border px-2 py-1 text-xs",
                  pageNumber === currentPage
                    ? "border-accent/30 bg-accent/15 text-accent-bright"
                    : "border-border text-muted hover:text-foreground",
                )}
              >
                {pageNumber}
              </button>
            ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Bulk toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 left-1/2 z-40 flex w-[min(100%-1.5rem,720px)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-2xl border border-border bg-background-elevated/95 px-3 py-2.5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md"
          >
            <p className="mr-1 text-xs text-muted">
              <span className="font-medium text-foreground">
                {selectedIds.length}
              </span>{" "}
              application{selectedIds.length === 1 ? "" : "s"} selected
            </p>
            <BulkMenu
              label="Change Status"
              open={bulkMenu === "status"}
              onToggle={() =>
                setBulkMenu((current) =>
                  current === "status" ? null : "status",
                )
              }
            >
              {(
                [
                  "Saved",
                  "Applied",
                  "Screening",
                  "Interview",
                  "Offer",
                  "Rejected",
                ] as ApplicationStatus[]
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-xs hover:bg-white/[0.03]"
                  onClick={() => {
                    bulkUpdateStatus(selectedIds, status);
                    setSelectedIds([]);
                    setBulkMenu(null);
                  }}
                >
                  {STATUS_LABEL[status]}
                </button>
              ))}
            </BulkMenu>
            <BulkMenu
              label="Change Priority"
              open={bulkMenu === "priority"}
              onToggle={() =>
                setBulkMenu((current) =>
                  current === "priority" ? null : "priority",
                )
              }
            >
              {(["High", "Medium", "Low"] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-xs hover:bg-white/[0.03]"
                  onClick={() => {
                    bulkUpdatePriority(selectedIds, priority);
                    setSelectedIds([]);
                    setBulkMenu(null);
                  }}
                >
                  {priority}
                </button>
              ))}
            </BulkMenu>
            <BulkMenu
              label="Add Tag"
              open={bulkMenu === "tag"}
              onToggle={() =>
                setBulkMenu((current) => (current === "tag" ? null : "tag"))
              }
            >
              <div className="space-y-2 p-2">
                <input
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  placeholder="e.g. Referral"
                  className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none"
                />
                <button
                  type="button"
                  className="w-full rounded-lg bg-accent px-2 py-1.5 text-xs font-semibold text-[#042f2e]"
                  onClick={() => {
                    bulkAddTag(selectedIds, tagDraft);
                    setTagDraft("");
                    setSelectedIds([]);
                    setBulkMenu(null);
                  }}
                >
                  Apply tag
                </button>
              </div>
            </BulkMenu>
            <BulkMenu
              label="Schedule Follow-up"
              open={bulkMenu === "followup"}
              onToggle={() =>
                setBulkMenu((current) =>
                  current === "followup" ? null : "followup",
                )
              }
            >
              <div className="space-y-2 p-2">
                <input
                  type="date"
                  value={followDraft}
                  onChange={(event) => setFollowDraft(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none"
                />
                <button
                  type="button"
                  className="w-full rounded-lg bg-accent px-2 py-1.5 text-xs font-semibold text-[#042f2e]"
                  onClick={() => {
                    if (!followDraft) return;
                    bulkScheduleFollowUp(selectedIds, followDraft);
                    setFollowDraft("");
                    setSelectedIds([]);
                    setBulkMenu(null);
                  }}
                >
                  Schedule
                </button>
              </div>
            </BulkMenu>
            <button
              type="button"
              onClick={() => {
                deleteApplications(selectedIds);
                setSelectedIds([]);
              }}
              className="rounded-full border border-rose-400/20 px-3 py-1.5 text-xs text-rose-300"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="ml-auto text-xs text-muted hover:text-foreground"
            >
              Clear
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SortHeader({
  label,
  active,
  direction = "desc",
  onClick,
}: {
  label: string;
  active?: boolean;
  direction?: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th className="px-3 py-3 font-medium">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
      >
        {label}
        {active ? (
          direction === "asc" ? (
            <ArrowUp className="h-3 w-3 text-accent" />
          ) : (
            <ArrowDown className="h-3 w-3 text-accent" />
          )
        ) : null}
      </button>
    </th>
  );
}

function PriorityCell({ priority }: { priority: Priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          priority === "High" && "bg-accent",
          priority === "Medium" && "bg-foreground/35",
          priority === "Low" && "bg-muted-soft",
        )}
      />
      {priority}
    </span>
  );
}

function NextActionCell({
  action,
}: {
  action: ReturnType<typeof getNextAction>;
}) {
  return (
    <span
      className={cn(
        "text-xs",
        action.kind === "overdue" && "text-rose-300",
        action.kind === "followup" && "text-accent-bright",
        action.kind === "interview" && "text-sky-300",
        action.kind === "none" && "text-muted-soft",
      )}
    >
      {action.label}
    </span>
  );
}

function RowMenu({
  open,
  onToggle,
  onClose,
  onView,
  onEdit,
  onChangeStatus,
  onAddNote,
  onSchedule,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onChangeStatus: (status: ApplicationStatus) => void;
  onAddNote: () => void;
  onSchedule: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className="rounded-lg border border-transparent p-1.5 text-muted opacity-0 transition-all group-hover:opacity-100 hover:border-border hover:text-foreground"
        aria-label="Row actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute top-8 right-0 z-30 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
          <MenuItem
            icon={Eye}
            label="View Details"
            onClick={() => {
              onClose();
              onView();
            }}
          />
          <MenuItem
            icon={Pencil}
            label="Edit"
            onClick={() => {
              onClose();
              onEdit();
            }}
          />
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-foreground hover:bg-white/[0.03]"
            onClick={() => setStatusOpen((value) => !value)}
          >
            Change Status
            <span className="text-muted-soft">›</span>
          </button>
          {statusOpen
            ? (
                [
                  "Saved",
                  "Applied",
                  "Screening",
                  "Interview",
                  "Offer",
                  "Rejected",
                ] as ApplicationStatus[]
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  className="block w-full bg-background/40 px-4 py-1.5 text-left text-[11px] text-muted hover:text-foreground"
                  onClick={() => {
                    onChangeStatus(status);
                    onClose();
                  }}
                >
                  {STATUS_LABEL[status]}
                </button>
              ))
            : null}
          <MenuItem
            icon={NotebookPen}
            label="Add Note"
            onClick={() => {
              onClose();
              onAddNote();
            }}
          />
          <MenuItem
            icon={CalendarPlus}
            label="Schedule Follow-up"
            onClick={() => {
              onClose();
              onSchedule();
            }}
          />
          <MenuItem
            icon={Trash2}
            label="Delete"
            danger
            onClick={() => {
              onClose();
              onDelete();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/[0.03]",
        danger ? "text-rose-300" : "text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function BulkMenu({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-border-strong"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute bottom-10 left-0 z-50 min-w-[160px] overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function TableSkeleton({ columns }: { columns: TableColumnId[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
      <div className="border-b border-border px-4 py-3">
        <div className="h-3 w-40 animate-pulse rounded bg-white/5" />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0"
        >
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-white/5" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
            <div className="h-2.5 w-1/4 animate-pulse rounded bg-white/[0.04]" />
          </div>
          {columns.slice(1, 5).map((column) => (
            <div
              key={column}
              className="hidden h-3 w-16 animate-pulse rounded bg-white/[0.04] lg:block"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { DEFAULT_COLUMNS };
