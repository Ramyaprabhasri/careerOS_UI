"use client";

import { StatusBadge } from "./StatusBadge";
import { useDashboard } from "./DashboardProvider";
import { Modal } from "./Modal";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/dashboard";

const statuses: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

type ApplicationDetailModalProps = {
  application: Application | null;
  onClose: () => void;
};

export function ApplicationDetailModal({
  application,
  onClose,
}: ApplicationDetailModalProps) {
  const { updateApplicationStatus } = useDashboard();

  return (
    <Modal
      open={Boolean(application)}
      onClose={onClose}
      title={application?.company ?? "Application"}
      description={application ? `${application.role} · ${application.location}` : undefined}
      wide
    >
      {application ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={application.status} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] tracking-wide text-muted">
              Match {application.matchScore}%
            </span>
            <span className="text-xs text-muted-soft">
              Applied {formatDate(application.dateApplied)}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Info label="Source" value={application.source ?? "—"} />
            <Info label="Salary range" value={application.salaryRange ?? "—"} />
          </dl>

          {application.notes ? (
            <div className="rounded-2xl border border-border bg-surface/70 p-4">
              <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
                Notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {application.notes}
              </p>
            </div>
          ) : null}

          <div>
            <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
              Update status
            </p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateApplicationStatus(application.id, status)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    application.status === status
                      ? "border-accent/40 bg-accent/15 text-accent-bright"
                      : "border-border text-muted hover:border-border-strong hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-4">
      <dt className="text-[10px] tracking-[0.14em] text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
