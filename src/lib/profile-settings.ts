import { seedUserProfile } from "@/data/profile-seed";
import type {
  ProfileCompletionItem,
  UserProfile,
} from "@/types/profile-settings";

export const PROFILE_STORAGE_KEY = "careeros-user-profile";

export function loadProfileFromStorage(): UserProfile {
  if (typeof window === "undefined") return seedUserProfile;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return seedUserProfile;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      ...seedUserProfile,
      ...parsed,
      preferredRoles: parsed.preferredRoles ?? seedUserProfile.preferredRoles,
      skills: parsed.skills ?? seedUserProfile.skills,
      experience: parsed.experience ?? seedUserProfile.experience,
      education: parsed.education ?? seedUserProfile.education,
      careerPreferences: {
        ...seedUserProfile.careerPreferences,
        ...parsed.careerPreferences,
      },
      notifications: {
        ...seedUserProfile.notifications,
        ...parsed.notifications,
      },
      ai: { ...seedUserProfile.ai, ...parsed.ai },
      privacy: { ...seedUserProfile.privacy, ...parsed.privacy },
      resume: parsed.resume === undefined ? seedUserProfile.resume : parsed.resume,
    };
  } catch {
    return seedUserProfile;
  }
}

export function saveProfileToStorage(profile: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function computeProfileCompletion(profile: UserProfile): {
  percent: number;
  missing: ProfileCompletionItem[];
} {
  const checks: Array<{
    ok: boolean;
    item: ProfileCompletionItem;
  }> = [
    {
      ok: Boolean(profile.fullName.trim()),
      item: { id: "name", label: "Add your full name", section: "personal" },
    },
    {
      ok: Boolean(profile.headline.trim()),
      item: {
        id: "headline",
        label: "Add a professional headline",
        section: "personal",
      },
    },
    {
      ok: Boolean(profile.email.trim()),
      item: { id: "email", label: "Add your email", section: "personal" },
    },
    {
      ok: Boolean(profile.location.trim()),
      item: { id: "location", label: "Add your location", section: "personal" },
    },
    {
      ok: Boolean(profile.portfolioUrl.trim()),
      item: {
        id: "portfolio",
        label: "Add portfolio URL",
        section: "personal",
      },
    },
    {
      ok: Boolean(profile.about.trim() && profile.about.length > 40),
      item: {
        id: "about",
        label: "Write a short About Me summary",
        section: "professional",
      },
    },
    {
      ok: profile.skills.length >= 5,
      item: {
        id: "skills",
        label: "Add one more skill",
        section: "professional",
      },
    },
    {
      ok: profile.experience.length > 0,
      item: {
        id: "experience",
        label: "Add work experience",
        section: "experience",
      },
    },
    {
      ok: profile.education.length > 0,
      item: {
        id: "education",
        label: "Add education",
        section: "education",
      },
    },
    {
      ok: profile.careerPreferences.preferredLocations.length > 0,
      item: {
        id: "locations",
        label: "Add preferred locations",
        section: "preferences",
      },
    },
    {
      ok: Boolean(profile.resume),
      item: {
        id: "resume",
        label: "Upload a resume",
        section: "resume",
      },
    },
  ];

  const missing = checks.filter((check) => !check.ok).map((check) => check.item);
  const percent = Math.round(
    ((checks.length - missing.length) / checks.length) * 100,
  );
  return { percent, missing };
}

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
