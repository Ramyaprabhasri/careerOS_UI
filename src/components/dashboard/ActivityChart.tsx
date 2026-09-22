"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { activityByRange } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { ChartRange } from "@/types/dashboard";

const ranges: { id: ChartRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "12w", label: "12 weeks" },
];

export function ActivityChart() {
  const [range, setRange] = useState<ChartRange>("12w");
  const data = useMemo(() => activityByRange[range], [range]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Application activity
          </h3>
          <p className="mt-1 text-sm text-muted">
            Applications submitted over the selected period
          </p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-background/60 p-1">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                range === item.id
                  ? "bg-accent/15 text-accent-bright"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#55E6CE" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#55E6CE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#252830"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#858894", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#858894", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ stroke: "#55E6CE", strokeOpacity: 0.25 }}
              contentStyle={{
                background: "#111318",
                border: "1px solid #252830",
                borderRadius: 12,
                color: "#F5F5F5",
                fontSize: 12,
              }}
              labelStyle={{ color: "#858894" }}
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#55E6CE"
              strokeWidth={2}
              fill="url(#activityFill)"
              activeDot={{ r: 4, fill: "#55E6CE", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
