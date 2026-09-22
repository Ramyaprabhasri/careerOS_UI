"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarDays,
  Gift,
  Percent,
} from "lucide-react";
import { computeMetrics } from "@/lib/utils";
import type { Application } from "@/types/dashboard";

type MetricCardsProps = {
  applications: Application[];
};

const icons = [Briefcase, CalendarDays, Gift, Percent];

export function MetricCards({ applications }: MetricCardsProps) {
  const metrics = computeMetrics(applications);

  const cards = [
    {
      label: "Applications",
      value: String(metrics.applications),
      supporting: "+3 this week",
      trend: [4, 8, 6, 10, 9, 12, 11],
    },
    {
      label: "Interviews",
      value: String(metrics.interviews),
      supporting: "2 scheduled",
      trend: [2, 3, 2, 4, 5, 4, 6],
    },
    {
      label: "Offers",
      value: String(metrics.offers),
      supporting: "Pending reply",
      trend: [0, 0, 1, 1, 1, 1, 1],
    },
    {
      label: "Response Rate",
      value: `${metrics.responseRate}%`,
      supporting: "Across active pipeline",
      trend: [18, 20, 19, 22, 24, 23, 25],
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = icons[index];
        return (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.08 + index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-border bg-surface/80 p-4 transition-colors hover:border-border-strong sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
                {card.label}
              </p>
              <span className="rounded-lg bg-accent/10 p-1.5 text-accent">
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
              {card.value}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-xs text-muted-soft">{card.supporting}</p>
              <MiniSpark points={card.trend} />
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}

function MiniSpark({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const width = 56;
  const height = 20;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (point / max) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-5 w-14 text-accent/80"
      fill="none"
      aria-hidden
    >
      <path d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
