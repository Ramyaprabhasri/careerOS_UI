"use client";

import { SectionShell } from "@/components/dashboard/settings/SettingsFormPrimitives";
import { cn } from "@/lib/utils";
import type { ThemePreference, UserProfile } from "@/types/profile-settings";

const options: Array<{
  id: ThemePreference;
  label: string;
  swatch: string;
}> = [
  {
    id: "light",
    label: "Light",
    swatch: "bg-[#f4f5f7] border-[#e2e5eb]",
  },
  {
    id: "dark",
    label: "Dark",
    swatch: "bg-[#08090b] border-[#252830]",
  },
  {
    id: "system",
    label: "System",
    swatch:
      "bg-[linear-gradient(135deg,#08090b_50%,#f4f5f7_50%)] border-[#323846]",
  },
];

type AppearanceSectionProps = {
  profile: UserProfile;
  onSave: (appearance: ThemePreference) => void;
};

export function AppearanceSection({
  profile,
  onSave,
}: AppearanceSectionProps) {
  return (
    <SectionShell
      title="Appearance"
      description="Reuse CareerOS tokens. Light mode uses the same accent system on a brighter surface."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const active = profile.appearance === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSave(option.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                active
                  ? "border-accent/40 bg-accent/10"
                  : "border-border hover:border-border-strong",
              )}
            >
              <div
                className={cn(
                  "mb-3 h-16 rounded-xl border",
                  option.swatch,
                )}
              />
              <p className="text-sm font-medium text-foreground">
                {option.label}
              </p>
              {active ? (
                <p className="mt-1 text-[11px] text-accent-bright">Selected</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </SectionShell>
  );
}
