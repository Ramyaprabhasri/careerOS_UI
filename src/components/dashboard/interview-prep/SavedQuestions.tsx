"use client";

import { Play, Trash2 } from "lucide-react";
import { difficultyTone } from "@/lib/interview-prep";
import { cn, formatDate } from "@/lib/utils";
import type { InterviewQuestion } from "@/types/interview-prep";

type SavedQuestionsProps = {
  items: Array<InterviewQuestion & { savedAt: string }>;
  onPractice: (question: InterviewQuestion) => void;
  onRemove: (questionId: string) => void;
  onBrowse: () => void;
};

export function SavedQuestions({
  items,
  onPractice,
  onRemove,
  onBrowse,
}: SavedQuestionsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Saved Questions
        </h3>
        <p className="mt-1 text-sm text-muted">
          Revisit prompts you want ready before interview day.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            No saved questions yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Save questions you want to revisit during your preparation.
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="mt-5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e]"
          >
            Browse Question Bank
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground">{item.prompt}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-border px-2 py-0.5 text-muted">
                    {item.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5",
                      difficultyTone(item.difficulty),
                    )}
                  >
                    {item.difficulty}
                  </span>
                  <span className="text-muted-soft">
                    Saved {formatDate(item.savedAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPractice(item)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-[#042f2e]"
                >
                  <Play className="h-3.5 w-3.5" />
                  Practice
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:border-rose-400/40 hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
