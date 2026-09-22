"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/dashboard";

type KanbanColumnProps = {
  id: ApplicationStatus;
  label: string;
  accent: string;
  emptyTitle: string;
  emptyDescription: string;
  applications: Application[];
  onOpen: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  onAdd: (status: ApplicationStatus) => void;
};

export function KanbanColumn({
  id,
  label,
  accent,
  emptyTitle,
  emptyDescription,
  applications,
  onOpen,
  onEdit,
  onDelete,
  onAdd,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex h-full min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border border-border bg-surface/50 transition-colors",
        isOver && "border-accent/35 bg-accent/[0.04]",
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", accent)} />
          <h3 className="text-sm font-medium text-foreground">{label}</h3>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
            {applications.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(id)}
          className="rounded-lg border border-border p-1.5 text-muted transition-colors hover:border-border-strong hover:text-foreground"
          aria-label={`Add to ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5">
        <SortableContext
          items={applications.map((app) => app.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-3 py-8 text-center">
              <p className="text-sm text-foreground/80">{emptyTitle}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-soft">
                {emptyDescription}
              </p>
            </div>
          ) : (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onOpen={onOpen}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </section>
  );
}
