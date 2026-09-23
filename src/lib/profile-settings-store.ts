import { seedUserProfile } from "@/data/profile-seed";
import {
  loadProfileFromStorage,
  saveProfileToStorage,
} from "@/lib/profile-settings";
import type { UserProfile } from "@/types/profile-settings";

type Listener = () => void;

let memory: UserProfile | null = null;
const listeners = new Set<Listener>();

export function getProfileSnapshot(): UserProfile {
  if (memory === null) {
    memory =
      typeof window === "undefined" ? seedUserProfile : loadProfileFromStorage();
  }
  return memory;
}

export function getProfileServerSnapshot(): UserProfile {
  return seedUserProfile;
}

export function subscribeProfile(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setUserProfile(next: UserProfile) {
  memory = next;
  saveProfileToStorage(next);
  listeners.forEach((listener) => listener());
}

export function updateUserProfile(
  updater: (current: UserProfile) => UserProfile,
) {
  setUserProfile(updater(getProfileSnapshot()));
}

export function clearLocalProfileData() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("careeros-user-profile");
    window.localStorage.removeItem("careeros-resume-analyses");
    window.localStorage.removeItem("careeros-saved-jobs");
    window.localStorage.removeItem("careeros-viewed-jobs");
    window.localStorage.removeItem("careeros-interview-prep");
    window.localStorage.removeItem("careeros-career-goals");
    window.localStorage.removeItem("careeros-theme");
  }
  memory = seedUserProfile;
  listeners.forEach((listener) => listener());
}
