import {
  DEFAULT_GOALS,
  loadGoalsFromStorage,
  saveGoalsToStorage,
} from "@/lib/career-analytics";
import type { CareerGoals } from "@/types/career-analytics";

type Listener = () => void;

let memory: CareerGoals | null = null;
const listeners = new Set<Listener>();

export function getGoalsSnapshot(): CareerGoals {
  if (memory === null) {
    memory =
      typeof window === "undefined" ? DEFAULT_GOALS : loadGoalsFromStorage();
  }
  return memory;
}

export function getGoalsServerSnapshot(): CareerGoals {
  return DEFAULT_GOALS;
}

export function subscribeGoals(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCareerGoals(next: CareerGoals) {
  memory = next;
  saveGoalsToStorage(next);
  listeners.forEach((listener) => listener());
}
