"use client";

type TargetJobFormProps = {
  jobTitle: string;
  company: string;
  jobDescription: string;
  jobUrl: string;
  canAnalyze: boolean;
  analyzing: boolean;
  onChange: (field: "jobTitle" | "company" | "jobDescription" | "jobUrl", value: string) => void;
  onAnalyze: () => void;
};

export function TargetJobForm({
  jobTitle,
  company,
  jobDescription,
  jobUrl,
  canAnalyze,
  analyzing,
  onChange,
  onAnalyze,
}: TargetJobFormProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Add your target role
      </h3>
      <p className="mt-1 text-sm text-muted">
        Add a job description to receive a tailored resume match analysis.
      </p>

      <div className="mt-5 space-y-4">
        <Field
          label="Job Title"
          value={jobTitle}
          onChange={(value) => onChange("jobTitle", value)}
          placeholder="Frontend Engineer"
        />
        <Field
          label="Company Name (optional)"
          value={company}
          onChange={(value) => onChange("company", value)}
          placeholder="Atlas Systems"
        />
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.12em] text-muted uppercase">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(event) => onChange("jobDescription", event.target.value)}
            rows={7}
            placeholder="Paste Job Description"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
          <p className="mt-1.5 text-[11px] text-muted-soft">
            Optional — without a JD, CareerOS runs a general demo resume review.
          </p>
        </div>
        <Field
          label="Job URL (optional)"
          value={jobUrl}
          onChange={(value) => onChange("jobUrl", value)}
          placeholder="https://"
        />
      </div>

      <button
        type="button"
        disabled={!canAnalyze || analyzing}
        onClick={onAnalyze}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        Analyze My Resume →
      </button>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs tracking-[0.12em] text-muted uppercase">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
      />
    </div>
  );
}
