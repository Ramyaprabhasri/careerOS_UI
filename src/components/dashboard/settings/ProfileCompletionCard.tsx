"use client";

import { computeProfileCompletion } from "@/lib/profile-settings";
import type { SettingsSectionId, UserProfile } from "@/types/profile-settings";

type ProfileCompletionCardProps = {
  profile: UserProfile;
  onNavigate: (section: SettingsSectionId) => void;
};

export function ProfileCompletionCard({
  profile,
  onNavigate,
}: ProfileCompletionCardProps) {
  const { percent, missing } = computeProfileCompletion(profile);

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {percent}% Complete
          </h3>
          <p className="mt-1 text-sm text-muted">
            Finish a few details to strengthen recommendations.
          </p>
        </div>
        {missing[0] ? (
          <button
            type="button"
            onClick={() => onNavigate(missing[0].section)}
            className="rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-[#042f2e]"
          >
            Complete Profile
          </button>
        ) : null}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-accent/70"
          style={{ width: `${percent}%` }}
        />
      </div>
      {missing.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {missing.slice(0, 4).map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate(item.section)}
                className="text-sm text-muted transition-colors hover:text-accent-bright"
              >
                {item.label} →
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-accent-bright">
          Nice work — your demo profile is complete.
        </p>
      )}
    </section>
  );
}
