"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardPreview } from "./DashboardPreview";
import { ScrollIndicator } from "./ScrollIndicator";
import { SiteHeader } from "./SiteHeader";

const headlineLines = ["YOUR CAREER.", "ONE INTELLIGENT", "WORKSPACE."];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate h-[100svh] min-h-[680px] overflow-hidden bg-background"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_12%_88%,rgba(94,234,212,0.16),transparent_55%),radial-gradient(ellipse_55%_45%_at_82%_48%,rgba(94,234,212,0.08),transparent_60%),linear-gradient(180deg,#060607_0%,#08090c_55%,#060607_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <SiteHeader />

      {/* Copy — left editorial column */}
      <div className="relative z-20 flex h-full max-w-[1440px] flex-col justify-start px-6 pt-24 pb-[42%] sm:px-10 sm:pt-28 sm:pb-[38%] md:w-[54%] md:justify-center md:pt-16 md:pb-16 lg:px-14 xl:w-[48%]">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mb-5 text-[11px] font-medium tracking-[0.28em] text-muted uppercase sm:mb-6 sm:text-xs"
        >
          AI-Powered Career Workspace
        </motion.p>

        <h1 className="font-display text-[clamp(2.4rem,6.4vw,5.2rem)] leading-[0.95] font-bold tracking-[-0.035em] text-foreground">
          {headlineLines.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.12 + index * 0.1,
                  ease,
                }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48, ease }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-muted sm:mt-7 sm:text-base"
        >
          Track applications. Understand opportunities. Build your next career
          move.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease }}
          className="mt-8 flex flex-col items-start gap-5 sm:mt-10"
        >
          <Link
            id="explore"
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 rounded-full bg-[linear-gradient(100deg,#99f6e4_0%,#5eead4_42%,#2dd4bf_100%)] px-6 py-3.5 text-[12px] font-semibold tracking-[0.18em] text-[#042f2e] uppercase shadow-[0_0_0_1px_rgba(94,234,212,0.25),0_18px_50px_-12px_rgba(94,234,212,0.55)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(94,234,212,0.35),0_22px_60px_-10px_rgba(94,234,212,0.65)]"
          >
            Explore CareerOS
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#042f2e]/15 text-sm transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </Link>

          <p className="text-[12px] tracking-wide text-muted-soft sm:text-[13px]">
            A portfolio project by{" "}
            <span className="text-muted">Ramyaprabhasri</span>
          </p>
        </motion.div>
      </div>

      {/* Product visual — anchored to right/bottom like the reference */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center md:pointer-events-auto md:inset-x-auto md:top-[18%] md:right-0 md:bottom-[-8%] md:block md:w-[58%] lg:w-[56%] xl:w-[54%]">
        <div className="pointer-events-auto w-[min(100%,420px)] origin-bottom scale-[0.72] opacity-90 sm:scale-[0.82] md:h-full md:w-full md:origin-top-right md:scale-100 md:opacity-100 md:pl-4">
          <div className="md:absolute md:top-0 md:right-[-12%] md:w-[min(100%,880px)] lg:right-[-8%] xl:right-[-4%]">
            <DashboardPreview />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
