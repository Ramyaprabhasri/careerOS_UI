"use client";

import { Eye, Pencil } from "lucide-react";
import {
  computeProfileCompletion,
  initialsFromName,
} from "@/lib/profile-settings";
import type { SettingsSectionId, UserProfile } from "@/types/profile-settings";

type ProfileOverviewProps = {
  profile: UserProfile;
  onEdit: () => void;
  onView: () => void;
  onCompleteItem: (section: SettingsSectionId) => void;
};

export function ProfileOverview({
  profile,
  onEdit,
  onView,
  onCompleteItem,
}: ProfileOverviewProps) {
  const { percent, missing } = computeProfileCompletion(profile);

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-accent/10 text-lg font-semibold text-accent">
            {initialsFromName(profile.fullName)}
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {profile.fullName}
            </h2>
            <p className="mt-1 text-sm text-muted">{profile.headline}</p>
            <p className="mt-2 text-sm text-muted-soft">
              {profile.location || "Location not set"}
              {profile.yearsExperience
                ? ` · ${profile.yearsExperience} years experience`
                : ""}
            </p>
            <p className="mt-1 text-sm text-muted">
              Primary role: {profile.currentRole || "Not set"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e]"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </button>
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            <Eye className="h-3.5 w-3.5" />
            View Profile
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted">Profile completeness</span>
          <span className="font-medium text-foreground">{percent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-accent/70 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        {missing.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {missing.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onCompleteItem(item.section)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-accent-bright">
            Profile looks complete for this demo workspace.
          </p>
        )}
      </div>
    </section>
  );
}
