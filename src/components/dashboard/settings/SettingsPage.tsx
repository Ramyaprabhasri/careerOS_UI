"use client";

import { useSyncExternalStore } from "react";
import { useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { AccountSection } from "@/components/dashboard/settings/AccountSection";
import { AiPreferencesSection } from "@/components/dashboard/settings/AiPreferencesSection";
import { AppearanceSection } from "@/components/dashboard/settings/AppearanceSection";
import { CareerPreferencesSection } from "@/components/dashboard/settings/CareerPreferencesSection";
import { EducationSection } from "@/components/dashboard/settings/EducationSection";
import { ExperienceSection } from "@/components/dashboard/settings/ExperienceSection";
import { NotificationsSection } from "@/components/dashboard/settings/NotificationsSection";
import { PersonalInfoSection } from "@/components/dashboard/settings/PersonalInfoSection";
import { PrivacySection } from "@/components/dashboard/settings/PrivacySection";
import { ProfessionalProfileSection } from "@/components/dashboard/settings/ProfessionalProfileSection";
import { ProfileCompletionCard } from "@/components/dashboard/settings/ProfileCompletionCard";
import { ProfileOverview } from "@/components/dashboard/settings/ProfileOverview";
import { ResumeSection } from "@/components/dashboard/settings/ResumeSection";
import { SettingsNav } from "@/components/dashboard/settings/SettingsNav";
import {
  clearLocalProfileData,
  getProfileServerSnapshot,
  getProfileSnapshot,
  subscribeProfile,
  updateUserProfile,
} from "@/lib/profile-settings-store";
import { setThemePreference } from "@/lib/theme-store";
import type { SettingsSectionId, UserProfile } from "@/types/profile-settings";

export function SettingsPage() {
  const { pushToast } = useDashboard();
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );
  const [section, setSection] = useState<SettingsSectionId>("personal");

  const savePatch = (patch: Partial<UserProfile>, message = "Profile updated successfully") => {
    updateUserProfile((current) => ({ ...current, ...patch }));
    pushToast({ title: message });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
          Profile & Settings
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Your CareerOS profile
        </h2>
        <p className="mt-1 text-sm text-muted">
          Manage who you are, what you want, and how CareerOS personalizes this
          demo workspace.
        </p>
      </div>

      <ProfileOverview
        profile={profile}
        onEdit={() => setSection("personal")}
        onView={() => setSection("professional")}
        onCompleteItem={setSection}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <SettingsNav active={section} onChange={setSection} />
        </aside>

        <div className="min-w-0 space-y-5">
          {section === "personal" ||
          section === "professional" ||
          section === "preferences" ||
          section === "resume" ? (
            <ProfileCompletionCard
              profile={profile}
              onNavigate={setSection}
            />
          ) : null}

          {section === "personal" ? (
            <PersonalInfoSection
              key={`personal-${profile.fullName}-${profile.email}`}
              profile={profile}
              onSave={(patch) => savePatch(patch)}
            />
          ) : null}

          {section === "professional" ? (
            <ProfessionalProfileSection
              key={`pro-${profile.skills.join(",")}`}
              profile={profile}
              onSave={(patch) => savePatch(patch)}
            />
          ) : null}

          {section === "experience" ? (
            <ExperienceSection
              key={`exp-${profile.experience.length}`}
              profile={profile}
              onSave={(experience) =>
                savePatch({ experience }, "Experience updated")
              }
            />
          ) : null}

          {section === "education" ? (
            <EducationSection
              key={`edu-${profile.education.length}`}
              profile={profile}
              onSave={(education) =>
                savePatch({ education }, "Education updated")
              }
            />
          ) : null}

          {section === "preferences" ? (
            <CareerPreferencesSection
              key={`pref-${profile.careerPreferences.preferredRoles.join(",")}`}
              profile={profile}
              onSave={(careerPreferences) =>
                savePatch({ careerPreferences }, "Preferences saved")
              }
            />
          ) : null}

          {section === "resume" ? (
            <ResumeSection
              key={`resume-${profile.resume?.fileName ?? "none"}`}
              profile={profile}
              onSave={(resume) =>
                savePatch(
                  { resume },
                  resume ? "Resume updated" : "Resume removed",
                )
              }
            />
          ) : null}

          {section === "account" ? (
            <AccountSection
              profile={profile}
              onPasswordUpdated={() =>
                pushToast({
                  title: "Password updated",
                  description: "Simulated for this demo workspace.",
                })
              }
              onSignOut={() =>
                pushToast({
                  title: "Signed out",
                  description: "Demo session ended. Local data remains.",
                })
              }
              onDeleteAccount={() => {
                clearLocalProfileData();
                setThemePreference("dark");
                pushToast({
                  title: "Local data cleared",
                  description: "CareerOS demo storage was reset in this browser.",
                });
                setSection("personal");
                window.setTimeout(() => window.location.reload(), 600);
              }}
            />
          ) : null}

          {section === "notifications" ? (
            <NotificationsSection
              key={`notif-${profile.notifications.interviewReminders}`}
              profile={profile}
              onSave={(notifications) =>
                savePatch({ notifications }, "Notification preferences saved")
              }
            />
          ) : null}

          {section === "ai" ? (
            <AiPreferencesSection
              key={`ai-${profile.ai.jobRecommendations}`}
              profile={profile}
              onSave={(ai) => savePatch({ ai }, "AI preferences saved")}
            />
          ) : null}

          {section === "appearance" ? (
            <AppearanceSection
              profile={profile}
              onSave={(appearance) => {
                setThemePreference(appearance);
                savePatch({ appearance }, "Appearance updated");
              }}
            />
          ) : null}

          {section === "privacy" ? (
            <PrivacySection
              key={`privacy-${profile.privacy.analyticsParticipation}`}
              profile={profile}
              onSave={(privacy) =>
                savePatch({ privacy }, "Privacy preferences saved")
              }
              onExport={() => {
                const blob = new Blob([JSON.stringify(profile, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "careeros-profile-export.json";
                anchor.click();
                URL.revokeObjectURL(url);
                pushToast({
                  title: "Export ready",
                  description: "Downloaded your local profile JSON.",
                });
              }}
              onClearLocal={() => {
                clearLocalProfileData();
                setThemePreference("dark");
                pushToast({
                  title: "Local data cleared",
                  description: "Demo storage reset for this browser.",
                });
                setSection("personal");
                window.setTimeout(() => window.location.reload(), 600);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
