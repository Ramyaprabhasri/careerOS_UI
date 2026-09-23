"use client";

import { motion } from "framer-motion";
import { FileUp, Sparkles } from "lucide-react";

type AnalyzerHeaderProps = {
  onNewAnalysis: () => void;
  showNewAnalysis?: boolean;
};

export function AnalyzerHeader({
  onNewAnalysis,
  showNewAnalysis = true,
}: AnalyzerHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Demo AI module
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          AI Resume Analyzer
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Understand your resume. Discover your strengths. Get closer to your
          next opportunity.
        </p>
      </div>
      {showNewAnalysis ? (
        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
        >
          <FileUp className="h-4 w-4" />
          New Analysis
        </button>
      ) : null}
    </motion.div>
  );
}
