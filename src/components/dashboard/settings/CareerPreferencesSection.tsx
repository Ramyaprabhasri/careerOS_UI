"use client";

import { useState, type FormEvent } from "react";
import { INDUSTRY_OPTIONS, ROLE_OPTIONS } from "@/data/profile-seed";
import {
  ChipSelect,
  Field,
  SaveButton,
  SectionShell,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import type {
  CareerPreferences,
  ExperienceLevelPref,
  UserProfile,
} from "@/types/profile-settings";
import type { EmploymentType, WorkMode } from "@/types/dashboard";

const workModes: WorkMode[] = ["Remote", "Hybrid", "Onsite"];
const employmentTypes: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
const levels: ExperienceLevelPref[] = ["Entry", "Junior", "Mid", "Senior"];

type CareerPreferencesSectionProps = {
  profile: UserProfile;
  onSave: (preferences: CareerPreferences) => void;
};

export function CareerPreferencesSection({
  profile,
  onSave,
}: CareerPreferencesSectionProps) {
  const [draft, setDraft] = useState(profile.careerPreferences);
  const [locationInput, setLocationInput] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = <T extends string>(list: T[], value: T) =>
    list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      onSave(draft);
      setSaving(false);
    }, 350);
  };

  return (
    <SectionShell
      title="Career Preferences"
      description="Used to personalize Job Discovery recommendations when that layer is connected."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Preferred Roles
          </p>
          <ChipSelect
            options={ROLE_OPTIONS}
            selected={draft.preferredRoles}
            onToggle={(role) =>
              setDraft((current) => ({
                ...current,
                preferredRoles: toggle(current.preferredRoles, role),
              }))
            }
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Preferred Locations
          </p>
          <div className="mb-2 flex flex-wrap gap-2">
            {draft.preferredLocations.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    preferredLocations: current.preferredLocations.filter(
                      (item) => item !== location,
                    ),
                  }))
                }
                className="rounded-full border border-border px-2.5 py-1 text-sm text-muted"
              >
                {location} ×
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
              placeholder="Add a location"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent/40"
            />
            <button
              type="button"
              onClick={() => {
                const next = locationInput.trim();
                if (!next) return;
                setDraft((current) => ({
                  ...current,
                  preferredLocations: current.preferredLocations.includes(next)
                    ? current.preferredLocations
                    : [...current.preferredLocations, next],
                }));
                setLocationInput("");
              }}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Work Mode
          </p>
          <ChipSelect
            options={workModes}
            selected={draft.workModes}
            onToggle={(mode) =>
              setDraft((current) => ({
                ...current,
                workModes: toggle(current.workModes, mode as WorkMode),
              }))
            }
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Employment Type
          </p>
          <ChipSelect
            options={employmentTypes}
            selected={draft.employmentTypes}
            onToggle={(type) =>
              setDraft((current) => ({
                ...current,
                employmentTypes: toggle(
                  current.employmentTypes,
                  type as EmploymentType,
                ),
              }))
            }
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Experience Level
          </p>
          <ChipSelect
            options={levels}
            selected={[draft.experienceLevel]}
            onToggle={(level) =>
              setDraft((current) => ({
                ...current,
                experienceLevel: level as ExperienceLevelPref,
              }))
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Salary Min (LPA / numeric)"
            value={draft.salaryMin}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                salaryMin: event.target.value,
              }))
            }
          />
          <Field
            label="Salary Max"
            value={draft.salaryMax}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                salaryMax: event.target.value,
              }))
            }
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Preferred Industries
          </p>
          <ChipSelect
            options={INDUSTRY_OPTIONS}
            selected={draft.industries}
            onToggle={(industry) =>
              setDraft((current) => ({
                ...current,
                industries: toggle(current.industries, industry),
              }))
            }
          />
        </div>

        <SaveButton saving={saving} label="Save Preferences" />
      </form>
    </SectionShell>
  );
}
