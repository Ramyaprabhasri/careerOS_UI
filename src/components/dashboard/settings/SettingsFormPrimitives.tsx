"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

export function SectionShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      <input
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
        {...props}
      />
      {hint ? <p className="mt-1 text-[11px] text-muted-soft">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
      />
      {hint ? <p className="mt-1 text-[11px] text-muted-soft">{hint}</p> : null}
    </label>
  );
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export function SaveButton({
  saving,
  label = "Save Changes",
  disabled,
}: {
  saving?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || saving}
      className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {saving ? "Saving…" : label}
    </button>
  );
}

export function ChipSelect({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active
                ? "border-accent/40 bg-accent/15 text-accent-bright"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
