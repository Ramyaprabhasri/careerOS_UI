"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createApplication as createApplicationRequest,
  deleteApplication as deleteApplicationRequest,
  getApplications,
  updateApplication as updateApplicationRequest,
} from "@/lib/api/client";
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

function useMockApplications() {
  return process.env.NEXT_PUBLIC_USE_MOCK_APPLICATIONS === "true";
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
  const useMock = useMockApplications();
  const [applications, setApplications] = useState<Application[]>(() =>
    useMock ? initialApplications : [],
  );
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

  useEffect(() => {
    if (useMock) return;

    let cancelled = false;

    void (async () => {
      try {
        const { data } = await getApplications();
        if (!cancelled) {
          setApplications(data);
        }
      } catch {
        if (!cancelled) {
          pushToast({
            title: "Couldn't load applications",
            description: "Refresh the page to try again.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useMock, pushToast]);

  const addApplication = useCallback(
    (input: ApplicationInput) => {
      if (useMock) {
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
          description: `${input.role} at ${input.company}. Open Applications to track it.`,
        });
        return;
      }

      void (async () => {
        try {
          const { data } = await createApplicationRequest(input);
          setApplications((current) => [data, ...current]);
          pushToast({
            title: "Application added",
            description: `${input.role} at ${input.company}. Open Applications to track it.`,
          });
        } catch {
          pushToast({
            title: "Couldn't save application",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const updateApplication = useCallback(
    (id: string, patch: Partial<Application>) => {
      if (useMock) {
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
        return;
      }

      void (async () => {
        try {
          const { data } = await updateApplicationRequest(id, patch);
          setApplications((current) =>
            current.map((app) => (app.id === id ? data : app)),
          );
          pushToast({
            title: "Application updated",
            description: "Changes saved to your board.",
          });
        } catch {
          pushToast({
            title: "Couldn't update application",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      if (useMock) {
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
        return;
      }

      void (async () => {
        try {
          const { data } = await updateApplicationRequest(id, { status });
          setApplications((current) =>
            current.map((app) => (app.id === id ? data : app)),
          );
          pushToast({
            title: "Moved on the board",
            description: `Status set to ${status === "Saved" ? "Wishlist" : status}`,
          });
        } catch {
          pushToast({
            title: "Couldn't update status",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const deleteApplication = useCallback(
    (id: string) => {
      if (useMock) {
        setApplications((current) => current.filter((app) => app.id !== id));
        pushToast({
          title: "Application removed",
          description: "The card was deleted from your board.",
        });
        return;
      }

      void (async () => {
        try {
          await deleteApplicationRequest(id);
          setApplications((current) => current.filter((app) => app.id !== id));
          pushToast({
            title: "Application removed",
            description: "The card was deleted from your board.",
          });
        } catch {
          pushToast({
            title: "Couldn't delete application",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const deleteApplications = useCallback(
    (ids: string[]) => {
      if (useMock) {
        const idSet = new Set(ids);
        setApplications((current) =>
          current.filter((app) => !idSet.has(app.id)),
        );
        pushToast({
          title: "Applications deleted",
          description: `${ids.length} application${ids.length === 1 ? "" : "s"} removed.`,
        });
        return;
      }

      void (async () => {
        try {
          await Promise.all(ids.map((id) => deleteApplicationRequest(id)));
          const idSet = new Set(ids);
          setApplications((current) =>
            current.filter((app) => !idSet.has(app.id)),
          );
          pushToast({
            title: "Applications deleted",
            description: `${ids.length} application${ids.length === 1 ? "" : "s"} removed.`,
          });
        } catch {
          pushToast({
            title: "Couldn't delete applications",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const updateNotes = useCallback(
    (id: string, notes: string) => {
      if (useMock) {
        setApplications((current) =>
          current.map((app) =>
            app.id === id ? { ...app, notes, updatedAt: todayIso() } : app,
          ),
        );
        return;
      }

      void (async () => {
        try {
          const { data } = await updateApplicationRequest(id, { notes });
          setApplications((current) =>
            current.map((app) => (app.id === id ? data : app)),
          );
        } catch {
          pushToast({
            title: "Couldn't save notes",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const updateTimeline = useCallback(
    (id: string, timeline: TimelineEvent[]) => {
      if (useMock) {
        setApplications((current) =>
          current.map((app) =>
            app.id === id ? { ...app, timeline, updatedAt: todayIso() } : app,
          ),
        );
        return;
      }

      void (async () => {
        try {
          const { data } = await updateApplicationRequest(id, { timeline });
          setApplications((current) =>
            current.map((app) => (app.id === id ? data : app)),
          );
        } catch {
          pushToast({
            title: "Couldn't update timeline",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const bulkUpdateStatus = useCallback(
    (ids: string[], status: ApplicationStatus) => {
      if (useMock) {
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
        return;
      }

      void (async () => {
        try {
          const results = await Promise.all(
            ids.map((id) => updateApplicationRequest(id, { status })),
          );
          const byId = new Map(results.map((result) => [result.data.id, result.data]));
          setApplications((current) =>
            current.map((app) => byId.get(app.id) ?? app),
          );
          pushToast({
            title: "Status updated",
            description: `${ids.length} application${ids.length === 1 ? "" : "s"} moved.`,
          });
        } catch {
          pushToast({
            title: "Couldn't update status",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const bulkUpdatePriority = useCallback(
    (ids: string[], priority: Priority) => {
      if (useMock) {
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
        return;
      }

      void (async () => {
        try {
          const results = await Promise.all(
            ids.map((id) => updateApplicationRequest(id, { priority })),
          );
          const byId = new Map(results.map((result) => [result.data.id, result.data]));
          setApplications((current) =>
            current.map((app) => byId.get(app.id) ?? app),
          );
          pushToast({
            title: "Priority updated",
            description: `Set to ${priority} for ${ids.length} application${ids.length === 1 ? "" : "s"}.`,
          });
        } catch {
          pushToast({
            title: "Couldn't update priority",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
  );

  const bulkAddTag = useCallback(
    (ids: string[], tag: string) => {
      const cleaned = tag.trim();
      if (!cleaned) return;

      if (useMock) {
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
        return;
      }

      void (async () => {
        try {
          const targets = applications.filter((app) => ids.includes(app.id));
          const results = await Promise.all(
            targets.map((app) =>
              updateApplicationRequest(app.id, {
                tags: app.tags.includes(cleaned)
                  ? app.tags
                  : [...app.tags, cleaned],
              }),
            ),
          );
          const byId = new Map(results.map((result) => [result.data.id, result.data]));
          setApplications((current) =>
            current.map((app) => byId.get(app.id) ?? app),
          );
          pushToast({
            title: "Tag added",
            description: `“${cleaned}” applied to ${ids.length} application${ids.length === 1 ? "" : "s"}.`,
          });
        } catch {
          pushToast({
            title: "Couldn't add tag",
            description: "Try again.",
          });
        }
      })();
    },
    [applications, pushToast, useMock],
  );

  const bulkScheduleFollowUp = useCallback(
    (ids: string[], date: string) => {
      if (useMock) {
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
        return;
      }

      void (async () => {
        try {
          const results = await Promise.all(
            ids.map((id) =>
              updateApplicationRequest(id, { followUpDate: date }),
            ),
          );
          const byId = new Map(results.map((result) => [result.data.id, result.data]));
          setApplications((current) =>
            current.map((app) => byId.get(app.id) ?? app),
          );
          pushToast({
            title: "Follow-up scheduled",
            description: `${ids.length} application${ids.length === 1 ? "" : "s"} updated.`,
          });
        } catch {
          pushToast({
            title: "Couldn't schedule follow-up",
            description: "Try again.",
          });
        }
      })();
    },
    [pushToast, useMock],
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
