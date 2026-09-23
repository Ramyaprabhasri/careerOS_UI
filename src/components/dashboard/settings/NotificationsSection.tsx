"use client";

import { useState, type FormEvent } from "react";
import {
  SaveButton,
  SectionShell,
  ToggleRow,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import type {
  NotificationPreferences,
  UserProfile,
} from "@/types/profile-settings";

type NotificationsSectionProps = {
  profile: UserProfile;
  onSave: (notifications: NotificationPreferences) => void;
};

export function NotificationsSection({
  profile,
  onSave,
}: NotificationsSectionProps) {
  const [draft, setDraft] = useState(profile.notifications);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof NotificationPreferences, value: boolean) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

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
      title="Notifications"
      description="Choose which CareerOS reminders you want in this demo workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
            Application Updates
          </p>
          <ToggleRow
            label="Interview reminders"
            checked={draft.interviewReminders}
            onChange={(value) => set("interviewReminders", value)}
          />
          <ToggleRow
            label="Application status changes"
            checked={draft.statusChanges}
            onChange={(value) => set("statusChanges", value)}
          />
          <ToggleRow
            label="Follow-up reminders"
            checked={draft.followUpReminders}
            onChange={(value) => set("followUpReminders", value)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
            Job Discovery
          </p>
          <ToggleRow
            label="New job matches"
            checked={draft.newJobMatches}
            onChange={(value) => set("newJobMatches", value)}
          />
          <ToggleRow
            label="Saved job updates"
            checked={draft.savedJobUpdates}
            onChange={(value) => set("savedJobUpdates", value)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
            Interview Preparation
          </p>
          <ToggleRow
            label="Preparation reminders"
            checked={draft.preparationReminders}
            onChange={(value) => set("preparationReminders", value)}
          />
          <ToggleRow
            label="Practice reminders"
            checked={draft.practiceReminders}
            onChange={(value) => set("practiceReminders", value)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
            Product Updates
          </p>
          <ToggleRow
            label="CareerOS updates"
            checked={draft.productUpdates}
            onChange={(value) => set("productUpdates", value)}
          />
          <ToggleRow
            label="Feature announcements"
            checked={draft.featureAnnouncements}
            onChange={(value) => set("featureAnnouncements", value)}
          />
        </div>
        <SaveButton saving={saving} label="Save Preferences" />
      </form>
    </SectionShell>
  );
}
