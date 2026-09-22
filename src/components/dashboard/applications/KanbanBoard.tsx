"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ApplicationCard, ApplicationCardView } from "./ApplicationCard";
import { KanbanColumn } from "./KanbanColumn";
import { BOARD_COLUMNS } from "@/lib/applications";
import type { Application, ApplicationStatus } from "@/types/dashboard";

type KanbanBoardProps = {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onOpen: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  onAdd: (status: ApplicationStatus) => void;
};

function useHasMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

export function KanbanBoard({
  applications,
  onStatusChange,
  onOpen,
  onEdit,
  onDelete,
  onAdd,
}: KanbanBoardProps) {
  const mounted = useHasMounted();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const grouped = useMemo(() => {
    const map = Object.fromEntries(
      BOARD_COLUMNS.map((column) => [column.id, [] as Application[]]),
    ) as Record<ApplicationStatus, Application[]>;

    for (const app of applications) {
      map[app.status]?.push(app);
    }
    return map;
  }, [applications]);

  const activeApp = applications.find((app) => app.id === activeId) ?? null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const appId = String(active.id);
    const overId = String(over.id);

    const overIsColumn = BOARD_COLUMNS.some((column) => column.id === overId);
    const targetStatus = overIsColumn
      ? (overId as ApplicationStatus)
      : applications.find((app) => app.id === overId)?.status;

    if (!targetStatus) return;

    const current = applications.find((app) => app.id === appId);
    if (!current || current.status === targetStatus) return;

    onStatusChange(appId, targetStatus);
  };

  // Avoid SSR/hydration mismatches from dnd-kit generated aria IDs.
  if (!mounted) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2" aria-busy="true">
        {BOARD_COLUMNS.map((column) => (
          <section
            key={column.id}
            className="flex h-full min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border border-border bg-surface/50"
          >
            <header className="flex items-center justify-between gap-2 border-b border-border px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${column.accent}`} />
                <h3 className="text-sm font-medium text-foreground">
                  {column.label}
                </h3>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                  {grouped[column.id].length}
                </span>
              </div>
            </header>
            <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5">
              {grouped[column.id].map((application) => (
                <ApplicationCardView
                  key={application.id}
                  application={application}
                  onOpen={onOpen}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      id="careeros-kanban"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {BOARD_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            label={column.label}
            accent={column.accent}
            emptyTitle={column.emptyTitle}
            emptyDescription={column.emptyDescription}
            applications={grouped[column.id]}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdd={onAdd}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp ? (
          <div className="w-[264px]">
            <ApplicationCard
              application={activeApp}
              onOpen={() => undefined}
              onEdit={() => undefined}
              onDelete={() => undefined}
              isDraggingOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
