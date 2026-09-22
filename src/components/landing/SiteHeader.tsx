"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Case Study", href: "#case-study" },
];

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-0 z-40"
    >
      <nav className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 sm:h-20 sm:px-10 lg:px-14">
        <a
          href="#top"
          className="relative z-10 font-display text-[13px] font-bold tracking-[0.22em] text-foreground transition-opacity hover:opacity-80 sm:text-sm"
        >
          CAREEROS
        </a>

        <div className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium tracking-[0.2em] text-muted uppercase transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="group relative z-10 inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-[11px] font-medium tracking-[0.18em] text-foreground uppercase transition-colors hover:border-foreground/40 hover:bg-white/[0.03] sm:px-5"
        >
          Explore
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </Link>
      </nav>
    </motion.header>
  );
}
