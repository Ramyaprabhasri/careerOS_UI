"use client";

import {
  Bell,
  Briefcase,
  FileText,
  GraduationCap,
  Lock,
  Palette,
  Shield,
  Sparkles,
  User,
  UserCog,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SettingsSectionId } from "@/types/profile-settings";

const profileNav: Array<{
  id: SettingsSectionId;
  label: string;
  icon: typeof User;
}> = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "professional", label: "Professional Profile", icon: Briefcase },
  { id: "experience", label: "Skills & Experience", icon: Wand2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "preferences", label: "Career Preferences", icon: UserCog },
  { id: "resume", label: "Resume", icon: FileText },
];

const settingsNav: Array<{
  id: SettingsSectionId;
  label: string;
  icon: typeof User;
}> = [
  { id: "account", label: "Account", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
];

type SettingsNavProps = {
  active: SettingsSectionId;
  onChange: (id: SettingsSectionId) => void;
};

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <>
      <div className="lg:hidden">
        <label className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
          Section
        </label>
        <select
          value={active}
          onChange={(event) =>
            onChange(event.target.value as SettingsSectionId)
          }
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
        >
          <optgroup label="Profile">
            {profileNav.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Settings">
            {settingsNav.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <nav className="hidden space-y-6 lg:block">
        <div>
          <p className="mb-2 px-2 text-[10px] tracking-[0.16em] text-muted-soft uppercase">
            Profile
          </p>
          <div className="space-y-1">
            {profileNav.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={active === item.id}
                onClick={() => onChange(item.id)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 px-2 text-[10px] tracking-[0.16em] text-muted-soft uppercase">
            Settings
          </p>
          <div className="space-y-1">
            {settingsNav.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={active === item.id}
                onClick={() => onChange(item.id)}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { id: string; label: string; icon: typeof User };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
        active
          ? "bg-accent/15 text-accent-bright"
          : "text-muted hover:bg-white/[0.03] hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </button>
  );
}
