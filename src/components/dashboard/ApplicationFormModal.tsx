"use client";

import {
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useDashboard } from "./DashboardProvider";
import { Modal } from "./Modal";
import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
  EmploymentType,
  Priority,
  WorkMode,
} from "@/types/dashboard";

const statuses: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

const workModes: WorkMode[] = ["Remote", "Hybrid", "Onsite"];
const employmentTypes: EmploymentType[] = [
  "Full-time",
  "Contract",
  "Internship",
  "Part-time",
];
const priorities: Priority[] = ["Low", "Medium", "High"];

type ApplicationFormModalProps = {
  open: boolean;
  onClose: () => void;
  initialStatus?: ApplicationStatus;
  application?: Application | null;
};

export function ApplicationFormModal({
  open,
  onClose,
  initialStatus = "Applied",
  application = null,
}: ApplicationFormModalProps) {
  const { addApplication, updateApplication } = useDashboard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const editing = Boolean(application);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload: ApplicationInput = {
      company: String(form.get("company") ?? "").trim(),
      role: String(form.get("role") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      jobUrl: String(form.get("jobUrl") ?? "").trim() || undefined,
      workMode: String(form.get("workMode") ?? "Remote") as WorkMode,
      employmentType: String(
        form.get("employmentType") ?? "Full-time",
      ) as EmploymentType,
      salaryRange: String(form.get("salaryRange") ?? "").trim() || undefined,
      dateApplied:
        String(form.get("dateApplied") ?? "").trim() ||
        new Date().toISOString().slice(0, 10),
      status: String(form.get("status") ?? initialStatus) as ApplicationStatus,
      priority: String(form.get("priority") ?? "Medium") as Priority,
      resumeUsed: String(form.get("resumeUsed") ?? "").trim() || undefined,
      notes: String(form.get("notes") ?? "").trim() || undefined,
      matchScore: Number(form.get("matchScore") ?? 80),
    };

    const nextErrors: Record<string, string> = {};
    if (!payload.company) nextErrors.company = "Company is required.";
    if (!payload.role) nextErrors.role = "Job title is required.";
    if (!payload.location) nextErrors.location = "Location is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editing && application) {
      updateApplication(application.id, payload);
    } else {
      addApplication(payload);
    }

    event.currentTarget.reset();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={editing ? "Edit application" : "Add application"}
      description={
        editing
          ? "Update the details for this opportunity."
          : "Track a new opportunity on your CareerOS board."
      }
      wide
    >
      <form
        key={application?.id ?? "new-application"}
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Company"
            name="company"
            placeholder="Stripe"
            defaultValue={application?.company}
            error={errors.company}
          />
          <Field
            label="Job title"
            name="role"
            placeholder="Frontend Engineer"
            defaultValue={application?.role}
            error={errors.role}
          />
        </div>

        <Field
          label="Job URL"
          name="jobUrl"
          placeholder="https://"
          defaultValue={application?.jobUrl}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Location"
            name="location"
            placeholder="Bengaluru"
            defaultValue={application?.location}
            error={errors.location}
          />
          <SelectField
            label="Work mode"
            name="workMode"
            defaultValue={application?.workMode ?? "Remote"}
            options={workModes}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Employment type"
            name="employmentType"
            defaultValue={application?.employmentType ?? "Full-time"}
            options={employmentTypes}
          />
          <Field
            label="Salary range"
            name="salaryRange"
            placeholder="$120k–$150k"
            defaultValue={application?.salaryRange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Application date"
            name="dateApplied"
            type="date"
            defaultValue={
              application?.dateApplied ?? new Date().toISOString().slice(0, 10)
            }
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={application?.status ?? initialStatus}
            options={statuses.map((status) => ({
              value: status,
              label: status === "Saved" ? "Wishlist" : status,
            }))}
          />
          <SelectField
            label="Priority"
            name="priority"
            defaultValue={application?.priority ?? "Medium"}
            options={priorities}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Resume used"
            name="resumeUsed"
            placeholder="Frontend Engineer — Core.pdf"
            defaultValue={application?.resumeUsed}
          />
          <Field
            label="Match score"
            name="matchScore"
            type="number"
            min={0}
            max={100}
            defaultValue={application?.matchScore ?? 80}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.12em] text-muted uppercase">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={application?.notes}
            placeholder="Interview prep, recruiter notes, requirements…"
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
          >
            {editing ? "Save changes" : "Add Application"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** @deprecated Prefer ApplicationFormModal — kept for Overview quick-add compatibility */
export function AddApplicationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <ApplicationFormModal open={open} onClose={onClose} />;
}

function Field({
  label,
  name,
  error,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs tracking-[0.12em] text-muted uppercase">
        {label}
      </label>
      <input
        name={name}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs tracking-[0.12em] text-muted uppercase">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function FormSection({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
