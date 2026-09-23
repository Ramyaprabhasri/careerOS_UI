"use client";

import { motion } from "framer-motion";
import { Mic2, Sparkles } from "lucide-react";
import type { PrepStats } from "@/types/interview-prep";

type PrepHeaderProps = {
  stats: PrepStats;
  onStartMock: () => void;
};

export function PrepHeader({ stats, onStartMock }: PrepHeaderProps) {
  const metrics = [
    { label: "Interviews Prepared", value: String(stats.interviewsPrepared) },
    { label: "Questions Practiced", value: String(stats.questionsPracticed) },
    { label: "Current Streak", value: `${stats.currentStreak}d` },
    { label: "Preparation Progress", value: `${stats.preparationProgress}%` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Demo interview prep
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Interview Preparation
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Practice with purpose. Prepare for the conversations that matter.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartMock}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
        >
          <Mic2 className="h-4 w-4" />
          Start Mock Interview
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border bg-surface/80 px-4 py-3"
          >
            <p className="text-[10px] tracking-[0.14em] text-muted-soft uppercase">
              {metric.label}
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-foreground">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
