"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { careerInsights } from "@/data/mock";

export function AiInsightCard() {
  const insight = careerInsights[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-accent/20 bg-[linear-gradient(160deg,rgba(85,230,206,0.12),rgba(17,19,24,0.95)_45%)] p-5 sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] tracking-[0.16em] text-accent-bright uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Demo AI insight
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {insight.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85">
          {insight.summary}
        </p>
        <Link
          href="/dashboard/ai-insights"
          className="group mt-5 inline-flex items-center gap-1 text-xs tracking-[0.14em] text-accent uppercase"
        >
          Explore AI insights
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>
    </motion.section>
  );
}
