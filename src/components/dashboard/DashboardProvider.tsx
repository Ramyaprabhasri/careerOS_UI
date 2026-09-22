"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultTimeline } from "@/lib/applications";
import { createId } from "@/lib/utils";
import { initialApplications } from "@/data/mock";
import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
  Priority,
  TimelineEvent,
  ToastMessage,
} from "@/types/dashboard";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

type DashboardContextValue = {
  applications: Application[];
  toasts: ToastMessage[];
  addApplication: (input: ApplicationInput) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  deleteApplications: (ids: string[]) => void;
  updateNotes: (id: string, notes: string) => void;
  updateTimeline: (id: string, timeline: TimelineEvent[]) => void;
  bulkUpdateStatus: (ids: string[], status: ApplicationStatus) => void;
  bulkUpdatePriority: (ids: string[], priority: Priority) => void;
  bulkAddTag: (ids: string[], tag: string) => void;
  bulkScheduleFollowUp: (ids: string[], date: string) => void;
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = createId("toast");
      setToasts((current) => [...current, { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const addApplication = useCallback(
    (input: ApplicationInput) => {
      const status = input.status;
      const stamp = todayIso();
      const next: Application = {
        id: createId("app"),
        dateApplied: input.dateApplied ?? stamp,
        matchScore: input.matchScore ?? 80,
        company: input.company,
        role: input.role,
        location: input.location,
        status,
        notes: input.notes,
        salaryRange: input.salaryRange,
        source: input.source ?? "Manual",
        jobUrl: input.jobUrl,
        workMode: input.workMode,
        employmentType: input.employmentType,
        priority: input.priority,
        resumeUsed: input.resumeUsed,
        followUpDate: input.followUpDate,
        updatedAt: stamp,
        tags: [],
        timeline: defaultTimeline(status),
      };
      setApplications((current) => [next, ...current]);
      pushToast({
        title: "Application added",
        description: `${input.role} at ${input.company}`,
      });
    },
    [pushToast],
  );

  const updateApplication = useCallback(
    (id: string, patch: Partial<Application>) => {
      setApplications((current) =>
        current.map((app) =>
          app.id === id
            ? { ...app, ...patch, updatedAt: todayIso() }
            : app,
        ),
      );
      pushToast({
        title: "Application updated",
        description: "Changes saved to your board.",
      });
    },
    [pushToast],
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setApplications((current) =>
        current.map((app) =>
          app.id === id
            ? {
                ...app,
                status,
                timeline: defaultTimeline(status),
                updatedAt: todayIso(),
              }
            : app,
        ),
      );
      pushToast({
        title: "Moved on the board",
        description: `Status set to ${status === "Saved" ? "Wishlist" : status}`,
      });
    },
    [pushToast],
  );

  const deleteApplication = useCallback(
    (id: string) => {
      setApplications((current) => current.filter((app) => app.id !== id));
      pushToast({
        title: "Application removed",
        description: "The card was deleted from your board.",
      });
    },
    [pushToast],
  );

  const deleteApplications = useCallback(
    (ids: string[]) => {
      const idSet = new Set(ids);
      setApplications((current) => current.filter((app) => !idSet.has(app.id)));
      pushToast({
        title: "Applications deleted",
        description: `${ids.length} application${ids.length === 1 ? "" : "s"} removed.`,
      });
    },
    [pushToast],
  );

  const updateNotes = useCallback((id: string, notes: string) => {
    setApplications((current) =>
      current.map((app) =>
        app.id === id ? { ...app, notes, updatedAt: todayIso() } : app,
      ),
    );
  }, []);

  const updateTimeline = useCallback((id: string, timeline: TimelineEvent[]) => {
    setApplications((current) =>
      current.map((app) =>
        app.id === id ? { ...app, timeline, updatedAt: todayIso() } : app,
      ),
    );
  }, []);

  const bulkUpdateStatus = useCallback(
    (ids: string[], status: ApplicationStatus) => {
      const idSet = new Set(ids);
      setApplications((current) =>
        current.map((app) =>
          idSet.has(app.id)
            ? {
                ...app,
                status,
                timeline: defaultTimeline(status),
                updatedAt: todayIso(),
              }
            : app,
        ),
      );
      pushToast({
        title: "Status updated",
        description: `${ids.length} application${ids.length === 1 ? "" : "s"} moved.`,
      });
    },
    [pushToast],
  );

  const bulkUpdatePriority = useCallback(
    (ids: string[], priority: Priority) => {
      const idSet = new Set(ids);
      setApplications((current) =>
        current.map((app) =>
          idSet.has(app.id)
            ? { ...app, priority, updatedAt: todayIso() }
            : app,
        ),
      );
      pushToast({
        title: "Priority updated",
        description: `Set to ${priority} for ${ids.length} application${ids.length === 1 ? "" : "s"}.`,
      });
    },
    [pushToast],
  );

  const bulkAddTag = useCallback(
    (ids: string[], tag: string) => {
      const cleaned = tag.trim();
      if (!cleaned) return;
      const idSet = new Set(ids);
      setApplications((current) =>
        current.map((app) =>
          idSet.has(app.id)
            ? {
                ...app,
                tags: app.tags.includes(cleaned)
                  ? app.tags
                  : [...app.tags, cleaned],
                updatedAt: todayIso(),
              }
            : app,
        ),
      );
      pushToast({
        title: "Tag added",
        description: `“${cleaned}” applied to ${ids.length} application${ids.length === 1 ? "" : "s"}.`,
      });
    },
    [pushToast],
  );

  const bulkScheduleFollowUp = useCallback(
    (ids: string[], date: string) => {
      const idSet = new Set(ids);
      setApplications((current) =>
        current.map((app) =>
          idSet.has(app.id)
            ? { ...app, followUpDate: date, updatedAt: todayIso() }
            : app,
        ),
      );
      pushToast({
        title: "Follow-up scheduled",
        description: `${ids.length} application${ids.length === 1 ? "" : "s"} updated.`,
      });
    },
    [pushToast],
  );

  const value = useMemo(
    () => ({
      applications,
      toasts,
      addApplication,
      updateApplication,
      updateApplicationStatus,
      deleteApplication,
      deleteApplications,
      updateNotes,
      updateTimeline,
      bulkUpdateStatus,
      bulkUpdatePriority,
      bulkAddTag,
      bulkScheduleFollowUp,
      pushToast,
      dismissToast,
    }),
    [
      applications,
      toasts,
      addApplication,
      updateApplication,
      updateApplicationStatus,
      deleteApplication,
      deleteApplications,
      updateNotes,
      updateTimeline,
      bulkUpdateStatus,
      bulkUpdatePriority,
      bulkAddTag,
      bulkScheduleFollowUp,
      pushToast,
      dismissToast,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
