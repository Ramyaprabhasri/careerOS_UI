"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  highlights?: string[];
};

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  highlights = [
    "Demo data structure is ready for a future API.",
    "Visual language matches the CareerOS overview.",
    "Interactions can expand without redesigning the shell.",
  ],
}: PlaceholderPageProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-surface/80 p-6 sm:p-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {description}
      </p>
      <ul className="mt-6 space-y-2">
        {highlights.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85"
          >
            {item}
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard"
        className="group mt-6 inline-flex items-center gap-1 text-xs tracking-[0.14em] text-accent uppercase"
      >
        Back to overview
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </Link>
    </motion.section>
  );
}
