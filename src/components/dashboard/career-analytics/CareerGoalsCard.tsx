"use client";

import type { CareerGoals, GoalProgress } from "@/types/career-analytics";

type CareerGoalsCardProps = {
  progress: GoalProgress[];
  onEdit: () => void;
};

export function CareerGoalsCard({ progress, onEdit }: CareerGoalsCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Career Goals
          </h3>
          <p className="mt-1 text-sm text-muted">
            Track weekly and monthly preparation targets.
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          Edit Goals
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {progress.map((goal) => (
          <div key={goal.id}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-muted">{goal.label}</span>
              <span className="text-foreground">
                {goal.current} / {goal.target}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-accent/70"
                style={{ width: `${goal.percent}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-soft">
              Progress: {goal.percent}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

type EditGoalsFormProps = {
  goals: CareerGoals;
  onChange: (next: CareerGoals) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function EditGoalsForm({
  goals,
  onChange,
  onSave,
  onCancel,
}: EditGoalsFormProps) {
  const fields: Array<{ key: keyof CareerGoals; label: string }> = [
    { key: "applicationsPerWeek", label: "Applications per week" },
    { key: "interviewsPerMonth", label: "Interviews per month" },
    { key: "mockInterviewsPerMonth", label: "Mock interviews per month" },
    { key: "resumeAnalysesPerMonth", label: "Resume analyses per month" },
  ];

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <label key={field.key} className="block text-sm text-muted">
          {field.label}
          <input
            type="number"
            min={0}
            value={goals[field.key]}
            onChange={(event) =>
              onChange({
                ...goals,
                [field.key]: Math.max(0, Number(event.target.value) || 0),
              })
            }
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
          />
        </label>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e]"
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}
