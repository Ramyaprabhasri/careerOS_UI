import { seedResumeAnalyses } from "@/data/resume-analyses";
import {
  loadAnalysesFromStorage,
  saveAnalysesToStorage,
} from "@/lib/resume-analyzer";
import type { ResumeAnalysis } from "@/types/resume-analyzer";

type Listener = () => void;

let memory: ResumeAnalysis[] | null = null;
const listeners = new Set<Listener>();

function readInitial(): ResumeAnalysis[] {
  const stored = loadAnalysesFromStorage();
  return stored.length > 0 ? stored : seedResumeAnalyses;
}

export function getResumeAnalysesSnapshot(): ResumeAnalysis[] {
  if (memory === null) {
    memory = typeof window === "undefined" ? seedResumeAnalyses : readInitial();
  }
  return memory;
}

export function getResumeAnalysesServerSnapshot(): ResumeAnalysis[] {
  return seedResumeAnalyses;
}

export function subscribeResumeAnalyses(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setResumeAnalyses(next: ResumeAnalysis[]) {
  memory = next;
  saveAnalysesToStorage(next);
  listeners.forEach((listener) => listener());
}

export function updateResumeAnalyses(
  updater: (current: ResumeAnalysis[]) => ResumeAnalysis[],
) {
  setResumeAnalyses(updater(getResumeAnalysesSnapshot()));
}
