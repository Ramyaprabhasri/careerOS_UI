import {
  loadSavedJobsFromStorage,
  loadViewedJobsFromStorage,
  saveSavedJobsToStorage,
  saveViewedJobsToStorage,
} from "@/lib/job-discovery";
import type { SavedJobRecord } from "@/types/job-discovery";

type Listener = () => void;

/** Stable empty snapshots — React requires getServerSnapshot to return cached values. */
const EMPTY_SAVED_JOBS: SavedJobRecord[] = [];
const EMPTY_VIEWED_JOBS: string[] = [];

let savedMemory: SavedJobRecord[] | null = null;
let viewedMemory: string[] | null = null;

const savedListeners = new Set<Listener>();
const viewedListeners = new Set<Listener>();

function emit(listeners: Set<Listener>) {
  listeners.forEach((listener) => listener());
}

export function getSavedJobsSnapshot(): SavedJobRecord[] {
  if (savedMemory === null) {
    savedMemory =
      typeof window === "undefined"
        ? EMPTY_SAVED_JOBS
        : loadSavedJobsFromStorage();
  }
  return savedMemory;
}

export function getSavedJobsServerSnapshot(): SavedJobRecord[] {
  return EMPTY_SAVED_JOBS;
}

export function subscribeSavedJobs(listener: Listener) {
  savedListeners.add(listener);
  return () => savedListeners.delete(listener);
}

export function setSavedJobs(next: SavedJobRecord[]) {
  savedMemory = next;
  saveSavedJobsToStorage(next);
  emit(savedListeners);
}

export function toggleSavedJob(jobId: string) {
  const current = getSavedJobsSnapshot();
  const exists = current.some((record) => record.jobId === jobId);
  if (exists) {
    setSavedJobs(current.filter((record) => record.jobId !== jobId));
    return false;
  }
  setSavedJobs([
    { jobId, savedAt: new Date().toISOString().slice(0, 10) },
    ...current,
  ]);
  return true;
}

export function removeSavedJob(jobId: string) {
  setSavedJobs(getSavedJobsSnapshot().filter((record) => record.jobId !== jobId));
}

export function getViewedJobsSnapshot(): string[] {
  if (viewedMemory === null) {
    viewedMemory =
      typeof window === "undefined"
        ? EMPTY_VIEWED_JOBS
        : loadViewedJobsFromStorage();
  }
  return viewedMemory;
}

export function getViewedJobsServerSnapshot(): string[] {
  return EMPTY_VIEWED_JOBS;
}

export function subscribeViewedJobs(listener: Listener) {
  viewedListeners.add(listener);
  return () => viewedListeners.delete(listener);
}

export function setViewedJobs(next: string[]) {
  viewedMemory = next;
  saveViewedJobsToStorage(next);
  emit(viewedListeners);
}

export function markJobViewed(jobId: string) {
  const current = getViewedJobsSnapshot().filter((id) => id !== jobId);
  setViewedJobs([jobId, ...current].slice(0, 12));
}
