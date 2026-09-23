"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/dashboard/Modal";
import {
  SaveButton,
  SectionShell,
  ToggleRow,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import type {
  PrivacyPreferences,
  UserProfile,
} from "@/types/profile-settings";

type PrivacySectionProps = {
  profile: UserProfile;
  onSave: (privacy: PrivacyPreferences) => void;
  onExport: () => void;
  onClearLocal: () => void;
};

export function PrivacySection({
  profile,
  onSave,
  onExport,
  onClearLocal,
}: PrivacySectionProps) {
  const [draft, setDraft] = useState(profile.privacy);
  const [saving, setSaving] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      onSave(draft);
      setSaving(false);
    }, 300);
  };

  return (
    <div className="space-y-5">
      <SectionShell
        title="Privacy & Data"
        description="Preferences for how CareerOS may personalize this workspace later."
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <ToggleRow
            label="Profile visibility"
            description="Demo toggle for future public profile sharing."
            checked={draft.profileVisibility}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                profileVisibility: value,
              }))
            }
          />
          <ToggleRow
            label="Personalized recommendations"
            description="Allow preference-aware job and prep suggestions."
            checked={draft.personalizedRecommendations}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                personalizedRecommendations: value,
              }))
            }
          />
          <ToggleRow
            label="Analytics participation"
            description="Include your activity in Career Analytics summaries."
            checked={draft.analyticsParticipation}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                analyticsParticipation: value,
              }))
            }
          />
          <SaveButton saving={saving} label="Save Preferences" />
        </form>
      </SectionShell>

      <SectionShell
        title="Data Management"
        description="Export or clear locally stored CareerOS demo data."
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExport}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            Export My Data
          </button>
          <button
            type="button"
            onClick={() => setClearOpen(true)}
            className="rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-300"
          >
            Clear Local Data
          </button>
        </div>
      </SectionShell>

      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear local data?"
        description="Removes profile, resumes analyses, saved jobs, prep history, and goals from this browser."
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setClearOpen(false)}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setClearOpen(false);
              onClearLocal();
            }}
            className="rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white"
          >
            Clear Data
          </button>
        </div>
      </Modal>
    </div>
  );
}
