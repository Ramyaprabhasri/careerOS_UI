"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, ExternalLink, Mic2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge } from "../StatusBadge";
import { useDashboard } from "../DashboardProvider";
import { companyInitials } from "@/lib/applications";
import { cn, createId, formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/dashboard";

const statuses: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

type ApplicationDrawerProps = {
  application: Application | null;
  onClose: () => void;
  onEdit: (application: Application) => void;
};

export function ApplicationDrawer({
  application,
  onClose,
  onEdit,
}: ApplicationDrawerProps) {
  useEffect(() => {
    if (!application) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [application, onClose]);

  return (
    <AnimatePresence>
      {application ? (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Application details"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-border bg-background-elevated shadow-[-24px_0_80px_-40px_rgba(0,0,0,0.8)]"
          >
            <DrawerBody
              key={application.id}
              application={application}
              onClose={onClose}
              onEdit={onEdit}
            />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DrawerBody({
  application,
  onClose,
  onEdit,
}: {
  application: Application;
  onClose: () => void;
  onEdit: (application: Application) => void;
}) {
  const {
    updateApplicationStatus,
    updateNotes,
    updateTimeline,
    updateApplication,
    deleteApplication,
  } = useDashboard();
  const [notes, setNotes] = useState(application.notes ?? "");
  const [followUp, setFollowUp] = useState(application.followUpDate ?? "");

  return (
    <>
      <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-sm font-semibold text-accent">
            {companyInitials(application.company)}
          </span>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
              {application.company}
            </p>
            <p className="mt-0.5 text-sm text-muted">{application.role}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={application.status} />
              <span className="text-xs text-muted-soft">
                {application.priority} priority
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
        <section>
          <h3 className="text-[10px] tracking-[0.16em] text-muted uppercase">
            Job information
          </h3>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Info label="Location" value={application.location} />
            <Info label="Work mode" value={application.workMode} />
            <Info label="Employment type" value={application.employmentType} />
            <Info label="Salary" value={application.salaryRange ?? "—"} />
            <Info label="Applied" value={formatDate(application.dateApplied)} />
            <Info label="Resume" value={application.resumeUsed ?? "—"} />
          </dl>
          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent hover:opacity-80"
            >
              Open job posting
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </section>

        <section>
          <h3 className="text-[10px] tracking-[0.16em] text-muted uppercase">
            Status
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateApplicationStatus(application.id, status)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  application.status === status
                    ? "border-accent/40 bg-accent/15 text-accent-bright"
                    : "border-border text-muted hover:text-foreground",
                )}
              >
                {status === "Saved" ? "Wishlist" : status}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] tracking-[0.16em] text-muted uppercase">
              Application timeline
            </h3>
            <button
              type="button"
              onClick={() => {
                const next = [
                  ...application.timeline,
                  {
                    id: createId("tl"),
                    label: "Custom milestone",
                    completed: false,
                  },
                ];
                updateTimeline(application.id, next);
              }}
              className="text-[11px] text-accent hover:opacity-80"
            >
              + Add event
            </button>
          </div>
          <ol className="space-y-0">
            {application.timeline.map((event, index) => (
              <li key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const next = application.timeline.map((item) =>
                        item.id === event.id
                          ? { ...item, completed: !item.completed }
                          : item,
                      );
                      updateTimeline(application.id, next);
                    }}
                    className={cn(
                      "mt-0.5 h-3 w-3 rounded-full border transition-colors",
                      event.completed
                        ? "border-accent bg-accent"
                        : "border-border bg-transparent",
                    )}
                    aria-label={`Toggle ${event.label}`}
                  />
                  {index < application.timeline.length - 1 ? (
                    <span className="my-1 w-px flex-1 bg-border" />
                  ) : null}
                </div>
                <div className="pb-4">
                  <p
                    className={cn(
                      "text-sm",
                      event.completed ? "text-foreground" : "text-muted",
                    )}
                  >
                    {event.label}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-[10px] tracking-[0.16em] text-muted uppercase">
            Notes
          </h3>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            onBlur={() => updateNotes(application.id, notes)}
            rows={5}
            placeholder="Interview preparation, recruiter conversations, requirements…"
            className="mt-3 w-full rounded-2xl border border-border bg-surface px-3 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface/70 p-4">
          <h3 className="text-[10px] tracking-[0.16em] text-muted uppercase">
            Follow-up
          </h3>
          <p className="mt-2 text-sm text-foreground">
            Next follow-up:{" "}
            <span className="font-medium">
              {application.followUpDate
                ? formatDate(application.followUpDate)
                : "Not scheduled"}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={followUp}
              onChange={(event) => setFollowUp(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent/40"
            />
            <button
              type="button"
              onClick={() => {
                if (!followUp) return;
                updateApplication(application.id, {
                  followUpDate: followUp,
                });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-[#042f2e]"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Schedule Follow-up
            </button>
          </div>
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => {
            deleteApplication(application.id);
            onClose();
          }}
          className="text-sm text-rose-300 hover:opacity-80"
        >
          Delete
        </button>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/interviews?role=${encodeURIComponent(application.role)}&company=${encodeURIComponent(application.company)}&jd=${encodeURIComponent(application.notes ?? "")}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Mic2 className="h-3.5 w-3.5" />
            Prepare for Interview
          </Link>
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
          >
            Edit application
          </button>
        </div>
      </footer>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 px-3 py-2.5">
      <dt className="text-[10px] tracking-[0.12em] text-muted-soft uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
