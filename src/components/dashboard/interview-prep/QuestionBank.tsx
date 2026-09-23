"use client";

import { Bookmark, BookmarkCheck, Play } from "lucide-react";
import { QUESTION_CATEGORIES } from "@/data/interview-questions";
import { difficultyTone } from "@/lib/interview-prep";
import { cn } from "@/lib/utils";
import type {
  InterviewQuestion,
  QuestionBankFilter,
  QuestionCategory,
} from "@/types/interview-prep";

type QuestionBankProps = {
  questions: InterviewQuestion[];
  category: QuestionCategory | "All";
  filter: QuestionBankFilter;
  practicedIds: Set<string>;
  savedIds: Set<string>;
  loading?: boolean;
  onCategoryChange: (category: QuestionCategory | "All") => void;
  onFilterChange: (filter: QuestionBankFilter) => void;
  onPractice: (question: InterviewQuestion) => void;
  onToggleSave: (questionId: string) => void;
};

const filters: Array<{ id: QuestionBankFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "unanswered", label: "Unanswered" },
  { id: "practiced", label: "Practiced" },
  { id: "saved", label: "Saved" },
];

export function QuestionBank({
  questions,
  category,
  filter,
  practicedIds,
  savedIds,
  loading = false,
  onCategoryChange,
  onFilterChange,
  onPractice,
  onToggleSave,
}: QuestionBankProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Question Bank
        </h3>
        <p className="mt-1 text-sm text-muted">
          Browse demo questions by topic. Feedback remains simulated.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange("All")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            category === "All"
              ? "border-accent/40 bg-accent/15 text-accent-bright"
              : "border-border text-muted hover:text-foreground",
          )}
        >
          All topics
        </button>
        {QUESTION_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              category === item
                ? "border-accent/40 bg-accent/15 text-accent-bright"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs tracking-wide",
              filter === item.id
                ? "border-border-strong text-foreground"
                : "border-border text-muted-soft hover:text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl border border-border bg-surface/50"
            />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          No questions match these filters.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {questions.map((question) => {
            const practiced = practicedIds.has(question.id);
            const saved = savedIds.has(question.id);
            return (
              <article
                key={question.id}
                className="flex flex-col rounded-2xl border border-border bg-surface/80 p-4"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                    {question.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      difficultyTone(question.difficulty),
                    )}
                  >
                    {question.difficulty}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-soft">
                    {practiced ? "Practiced" : "Not practiced"}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  {question.prompt}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onPractice(question)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-[#042f2e]"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Practice
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSave(question.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
                      saved
                        ? "border-accent/30 text-accent-bright"
                        : "border-border text-muted hover:text-foreground",
                    )}
                  >
                    {saved ? (
                      <BookmarkCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Bookmark className="h-3.5 w-3.5" />
                    )}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
