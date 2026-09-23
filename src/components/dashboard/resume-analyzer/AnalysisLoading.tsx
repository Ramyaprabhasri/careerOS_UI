"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ANALYSIS_MESSAGES,
  ANALYSIS_STEPS,
} from "@/lib/resume-analyzer";
import { cn } from "@/lib/utils";

type AnalysisLoadingProps = {
  hasJobDescription: boolean;
  onCancel?: () => void;
};

export function AnalysisLoading({
  hasJobDescription,
  onCancel,
}: AnalysisLoadingProps) {
  const steps = hasJobDescription
    ? ANALYSIS_STEPS
    : ANALYSIS_STEPS.filter((step) => step !== "Matching job requirements");

  const [stepIndex, setStepIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, 900);
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % ANALYSIS_MESSAGES.length);
    }, 1600);
    return () => {
      window.clearInterval(stepTimer);
      window.clearInterval(messageTimer);
    };
  }, [steps.length]);

  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface/80 p-6 sm:p-8"
    >
      <p className="text-[10px] tracking-[0.18em] text-accent-bright uppercase">
        Demo analysis in progress
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
        Analyzing your resume
      </h3>
      <p className="mt-2 text-sm text-muted">{ANALYSIS_MESSAGES[messageIndex]}</p>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                index < stepIndex
                  ? "border-accent/40 bg-accent/15 text-accent-bright"
                  : index === stepIndex
                    ? "border-accent/50 text-accent"
                    : "border-border text-muted-soft",
              )}
            >
              {index < stepIndex ? "✓" : index + 1}
            </span>
            <span
              className={cn(
                index <= stepIndex ? "text-foreground" : "text-muted-soft",
              )}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-border bg-background/50"
          />
        ))}
      </div>

      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="mt-6 text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
      ) : null}
    </motion.section>
  );
}
