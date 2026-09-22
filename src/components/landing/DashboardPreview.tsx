"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    label: "Applications",
    value: "24",
    delta: "+3 this week",
    spark: "M2 18 C8 16, 12 8, 18 10 C24 12, 28 6, 34 8 C40 10, 44 4, 50 6",
  },
  {
    label: "Interviews",
    value: "6",
    delta: "2 scheduled",
    spark: "M2 14 C10 16, 14 10, 20 12 C26 14, 30 8, 36 9 C42 10, 46 6, 50 7",
  },
  {
    label: "Offers",
    value: "1",
    delta: "Pending reply",
    spark: "M2 16 C12 15, 18 12, 24 13 C32 14, 38 8, 50 5",
  },
];

const recentApps = [
  {
    company: "Northwind Labs",
    role: "Product Designer",
    status: "Interview",
    tone: "accent" as const,
  },
  {
    company: "Atlas Systems",
    role: "Frontend Engineer",
    status: "Applied",
    tone: "neutral" as const,
  },
  {
    company: "Lumen Studio",
    role: "Design Systems",
    status: "Offer",
    tone: "success" as const,
  },
  {
    company: "Cascade AI",
    role: "UX Researcher",
    status: "Screening",
    tone: "neutral" as const,
  },
];

const sidebarItems = [
  { label: "Overview", active: true },
  { label: "Applications", active: false },
  { label: "Insights", active: false },
  { label: "Portfolio", active: false },
  { label: "Settings", active: false },
];

const chartPoints =
  "M0,78 C40,72 70,58 110,62 C150,66 180,40 220,36 C260,32 300,48 340,28 C380,12 420,22 460,18 L460,100 L0,100 Z";

const chartLine =
  "M0,78 C40,72 70,58 110,62 C150,66 180,40 220,36 C260,32 300,48 340,28 C380,12 420,22 460,18";

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "accent" | "neutral" | "success";
}) {
  const styles = {
    accent: "bg-accent-dim text-accent-bright border-accent/25",
    neutral: "bg-white/[0.04] text-muted border-border",
    success: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${styles[tone]}`}
    >
      {label}
    </span>
  );
}

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.05, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full w-full"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,var(--accent-glow),transparent_65%)] opacity-70 blur-2xl"
      />

      <div className="relative flex h-[min(62vh,560px)] w-full max-w-[860px] overflow-hidden rounded-[1.35rem] border border-border bg-background-elevated shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)] md:h-[min(78vh,720px)] md:max-w-none">
        {/* Sidebar */}
        <aside className="hidden w-[168px] shrink-0 flex-col border-r border-border bg-[#0b0c10] p-4 sm:flex">
          <div className="mb-8 flex items-center gap-2 px-2 pt-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15 text-[10px] font-bold tracking-tight text-accent">
              CO
            </span>
            <span className="font-display text-[11px] font-semibold tracking-[0.16em] text-foreground">
              CAREEROS
            </span>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-lg px-3 py-2 text-[12px] tracking-wide transition-colors ${
                  item.active
                    ? "bg-accent/15 text-accent-bright"
                    : "text-muted hover:bg-white/[0.03] hover:text-foreground"
                }`}
              >
                {item.label}
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-border bg-surface/60 p-3">
            <p className="text-[10px] tracking-[0.14em] text-muted-soft uppercase">
              Focus
            </p>
            <p className="mt-1 text-[12px] text-foreground/90">Q2 applications</p>
          </div>
        </aside>

        {/* Main panel */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-muted-soft uppercase">
                Workspace
              </p>
              <h2 className="mt-0.5 font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
                Career overview
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-border px-3 py-1 text-[10px] tracking-[0.14em] text-muted uppercase sm:inline">
                Demo data
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-dim px-2.5 py-1 text-[10px] font-medium tracking-wide text-accent-bright">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Live
              </span>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-hidden p-4 sm:p-5">
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {metrics.map((metric, index) => (
                <motion.article
                  key={metric.label}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="rounded-2xl border border-border bg-surface/80 p-3 sm:p-3.5"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] tracking-[0.12em] text-muted uppercase">
                      {metric.label}
                    </p>
                    <svg
                      viewBox="0 0 52 22"
                      className="h-5 w-10 text-accent/80"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d={metric.spark}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-soft sm:text-[11px]">
                    {metric.delta}
                  </p>
                </motion.article>
              ))}
            </div>

            {/* Chart + list */}
            <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.35fr_1fr]">
              <motion.article
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="rounded-2xl border border-border bg-surface/80 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
                      Application activity
                    </p>
                    <p className="mt-0.5 text-sm text-foreground/90">
                      Last 12 weeks
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-soft">+18%</span>
                </div>
                <div className="relative h-[140px] w-full sm:h-[160px]">
                  <svg
                    viewBox="0 0 460 100"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient
                        id="activityFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--accent)"
                          stopOpacity="0.28"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--accent)"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path d={chartPoints} fill="url(#activityFill)" />
                    <path
                      d={chartLine}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.article>

              <motion.article
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="rounded-2xl border border-border bg-surface/80 p-4"
              >
                <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
                  Recent applications
                </p>
                <ul className="mt-3 space-y-2.5">
                  {recentApps.map((app) => (
                    <li
                      key={`${app.company}-${app.role}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-1 py-1.5 transition-colors hover:border-border hover:bg-white/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-foreground">
                          {app.company}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                          {app.role}
                        </p>
                      </div>
                      <StatusPill label={app.status} tone={app.tone} />
                    </li>
                  ))}
                </ul>
              </motion.article>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
