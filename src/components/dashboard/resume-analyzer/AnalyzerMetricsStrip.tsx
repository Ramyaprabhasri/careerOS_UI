"use client";

import { motion } from "framer-motion";
import type { AnalyzerMetrics } from "@/types/resume-analyzer";

export function AnalyzerMetricsStrip({ metrics }: { metrics: AnalyzerMetrics }) {
  const items = [
    { label: "Resumes Analyzed", value: String(metrics.resumesAnalyzed) },
    {
      label: "Average Resume Score",
      value: metrics.resumesAnalyzed ? `${metrics.averageScore}` : "—",
    },
    {
      label: "Analyses This Month",
      value: String(metrics.analysesThisMonth),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted"
        >
          <span className="text-muted-soft">{item.label}</span>
          <span className="ml-2 font-medium text-foreground">{item.value}</span>
        </div>
      ))}
    </motion.div>
  );
}
