"use client";

import { motion } from "framer-motion";
import { FileSearch, Plus } from "lucide-react";
import { DEMO_USER } from "@/data/mock";
import { getGreeting } from "@/lib/utils";

type WelcomeActionsProps = {
  onAddApplication: () => void;
  onAnalyzeJd: () => void;
};

export function WelcomeActions({
  onAddApplication,
  onAnalyzeJd,
}: WelcomeActionsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface/80 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6"
    >
      <div>
        <p className="text-[11px] tracking-[0.2em] text-muted-soft uppercase">
          Today
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          {getGreeting()}, {DEMO_USER.name}.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Here’s what’s happening with your job search.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onAddApplication}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add application
        </button>
        <button
          type="button"
          onClick={onAnalyzeJd}
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-border-strong hover:bg-white/[0.02]"
        >
          <FileSearch className="h-4 w-4 text-accent" />
          Analyze a job description
        </button>
      </div>
    </motion.section>
  );
}
