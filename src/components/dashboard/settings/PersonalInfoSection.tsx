"use client";

import { useState, type FormEvent } from "react";
import {
  Field,
  SaveButton,
  SectionShell,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import type { UserProfile } from "@/types/profile-settings";

type PersonalInfoSectionProps = {
  profile: UserProfile;
  onSave: (patch: Partial<UserProfile>) => void;
};

export function PersonalInfoSection({
  profile,
  onSave,
}: PersonalInfoSectionProps) {
  const [draft, setDraft] = useState({
    fullName: profile.fullName,
    headline: profile.headline,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    portfolioUrl: profile.portfolioUrl,
    linkedinUrl: profile.linkedinUrl,
    githubUrl: profile.githubUrl,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!draft.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!draft.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      nextErrors.email = "Enter a valid email.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    window.setTimeout(() => {
      onSave({
        fullName: draft.fullName.trim(),
        headline: draft.headline.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        location: draft.location.trim(),
        portfolioUrl: draft.portfolioUrl.trim(),
        linkedinUrl: draft.linkedinUrl.trim(),
        githubUrl: draft.githubUrl.trim(),
      });
      setSaving(false);
    }, 350);
  };

  return (
    <SectionShell
      title="Personal Information"
      description="Basic identity details used across CareerOS."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full Name"
            value={draft.fullName}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                fullName: event.target.value,
              }))
            }
            error={errors.fullName}
          />
          <Field
            label="Professional Headline"
            value={draft.headline}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                headline: event.target.value,
              }))
            }
            hint="Shown on your profile overview."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            type="email"
            value={draft.email}
            onChange={(event) =>
              setDraft((current) => ({ ...current, email: event.target.value }))
            }
            error={errors.email}
          />
          <Field
            label="Phone"
            value={draft.phone}
            onChange={(event) =>
              setDraft((current) => ({ ...current, phone: event.target.value }))
            }
            hint="Optional — stored locally in this demo."
          />
        </div>
        <Field
          label="Location"
          value={draft.location}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              location: event.target.value,
            }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Portfolio URL"
            value={draft.portfolioUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                portfolioUrl: event.target.value,
              }))
            }
            placeholder="https://"
          />
          <Field
            label="LinkedIn URL"
            value={draft.linkedinUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                linkedinUrl: event.target.value,
              }))
            }
            placeholder="https://"
          />
          <Field
            label="GitHub URL"
            value={draft.githubUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                githubUrl: event.target.value,
              }))
            }
            placeholder="https://"
          />
        </div>
        <div className="pt-2">
          <SaveButton saving={saving} />
        </div>
      </form>
    </SectionShell>
  );
}
