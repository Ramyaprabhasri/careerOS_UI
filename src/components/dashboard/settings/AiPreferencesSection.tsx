"use client";

import { useState, type FormEvent } from "react";
import {
  SaveButton,
  SectionShell,
  ToggleRow,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import type { AiPreferences, UserProfile } from "@/types/profile-settings";

type AiPreferencesSectionProps = {
  profile: UserProfile;
  onSave: (ai: AiPreferences) => void;
};

export function AiPreferencesSection({
  profile,
  onSave,
}: AiPreferencesSectionProps) {
  const [draft, setDraft] = useState(profile.ai);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      onSave(draft);
      setSaving(false);
    }, 300);
  };

  return (
    <SectionShell
      title="AI Preferences"
      description="These preferences control how CareerOS uses your career data to personalize AI-powered features."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <ToggleRow
          label="AI Job Recommendations"
          description="Influence Job Discovery ranking when a recommendation service is connected."
          checked={draft.jobRecommendations}
          onChange={(value) =>
            setDraft((current) => ({ ...current, jobRecommendations: value }))
          }
        />
        <ToggleRow
          label="Resume Analysis"
          description="Allow Resume Analyzer demos to use your primary resume context."
          checked={draft.resumeAnalysis}
          onChange={(value) =>
            setDraft((current) => ({ ...current, resumeAnalysis: value }))
          }
        />
        <ToggleRow
          label="Interview Feedback"
          description="Enable simulated feedback flows in Interview Preparation."
          checked={draft.interviewFeedback}
          onChange={(value) =>
            setDraft((current) => ({ ...current, interviewFeedback: value }))
          }
        />
        <ToggleRow
          label="Personalized Career Insights"
          description="Surface preference-aware insight cards in Analytics."
          checked={draft.personalizedInsights}
          onChange={(value) =>
            setDraft((current) => ({
              ...current,
              personalizedInsights: value,
            }))
          }
        />
        <p className="pt-2 text-xs text-muted-soft">
          CareerOS currently uses demo/local data. These toggles store your
          intent for future backend wiring and do not claim live model training.
        </p>
        <SaveButton saving={saving} label="Save Preferences" />
      </form>
    </SectionShell>
  );
}
