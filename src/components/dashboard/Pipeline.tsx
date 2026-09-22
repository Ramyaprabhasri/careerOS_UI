"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { computePipeline } from "@/lib/utils";
import type { Application } from "@/types/dashboard";

type PipelineProps = {
  applications: Application[];
};

export function Pipeline({ applications }: PipelineProps) {
  const stages = computePipeline(applications);
  const max = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Application pipeline
          </h3>
          <p className="mt-1 text-sm text-muted">
            Where every opportunity sits right now
          </p>
        </div>
        <Link
          href="/dashboard/applications"
          className="group inline-flex items-center gap-1 text-xs tracking-[0.12em] text-accent uppercase transition-opacity hover:opacity-80"
        >
          View all applications
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-border bg-background/50 p-3.5"
          >
            <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
              {stage.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">
              {stage.count}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.count / max) * 100}%` }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
