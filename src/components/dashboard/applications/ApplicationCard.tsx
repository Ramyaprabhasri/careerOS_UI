"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../StatusBadge";
import { companyInitials } from "@/lib/applications";
import { cn, formatDate } from "@/lib/utils";
import type { Application, Priority } from "@/types/dashboard";

const priorityStyles: Record<Priority, string> = {
  High: "text-accent-bright",
  Medium: "text-muted",
  Low: "text-muted-soft",
};

type ApplicationCardProps = {
  application: Application;
  onOpen: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  isDraggingOverlay?: boolean;
};

export function ApplicationCard({
  application,
  onOpen,
  onEdit,
  onDelete,
  isDraggingOverlay = false,
}: ApplicationCardProps) {
  if (isDraggingOverlay) {
    return (
      <ApplicationCardView
        application={application}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        elevated
      />
    );
  }

  return (
    <SortableApplicationCard
      application={application}
      onOpen={onOpen}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

function SortableApplicationCard({
  application,
  onOpen,
  onEdit,
  onDelete,
}: Omit<ApplicationCardProps, "isDraggingOverlay">) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: { status: application.status },
  });

  return (
    <ApplicationCardView
      application={application}
      onOpen={onOpen}
      onEdit={onEdit}
      onDelete={onDelete}
      setNodeRef={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      dragHandleProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
    />
  );
}

type ViewProps = {
  application: Application;
  onOpen: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  elevated?: boolean;
};

function ApplicationCardView({
  application,
  onOpen,
  onEdit,
  onDelete,
  setNodeRef,
  style,
  dragHandleProps,
  isDragging = false,
  elevated = false,
}: ViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-2xl border border-border bg-background-elevated p-3.5 transition-[box-shadow,border-color,transform] duration-200",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.9)]",
        (isDragging || elevated) &&
          "border-accent/30 shadow-[0_20px_50px_-24px_rgba(85,230,206,0.35)]",
        isDragging && "opacity-40",
      )}
    >
      <div
        className={cn(dragHandleProps ? "cursor-grab active:cursor-grabbing" : "")}
        {...dragHandleProps}
      >
        <button
          type="button"
          onClick={() => onOpen(application)}
          className="w-full text-left"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-[11px] font-semibold text-accent">
              {companyInitials(application.company)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {application.company}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-muted">
                    {application.role}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <p className="mt-3 text-[11px] text-muted-soft">
                {application.location} · {application.workMode}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[11px] text-muted">
                  Applied {formatDate(application.dateApplied)}
                </p>
                <p
                  className={cn(
                    "text-[10px] font-medium tracking-wide",
                    priorityStyles[application.priority],
                  )}
                >
                  {application.priority} priority
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="pointer-events-none absolute top-2.5 right-2.5 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="relative">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="rounded-lg border border-border bg-surface p-1.5 text-muted transition-colors hover:text-foreground"
            aria-label="Card actions"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          {menuOpen ? (
            <div className="absolute top-8 right-0 z-20 w-36 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-white/[0.03]"
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuOpen(false);
                  onEdit(application);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-rose-300 hover:bg-white/[0.03]"
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuOpen(false);
                  onDelete(application);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { ApplicationCardView };
