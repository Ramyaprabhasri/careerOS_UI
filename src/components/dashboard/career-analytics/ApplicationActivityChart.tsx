"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { ActivityGranularity, ActivityPoint } from "@/types/career-analytics";

type ApplicationActivityChartProps = {
  data: ActivityPoint[];
  granularity: ActivityGranularity;
  onGranularityChange: (value: ActivityGranularity) => void;
};

const views: Array<{ id: ActivityGranularity; label: string }> = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

export function ApplicationActivityChart({
  data,
  granularity,
  onGranularityChange,
}: ApplicationActivityChartProps) {
  const hasData = data.some(
    (point) =>
      point.applications > 0 || point.interviews > 0 || point.offers > 0,
  );

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Application Activity
          </h3>
          <p className="mt-1 text-sm text-muted">
            Applications, interviews, and offers over time.
          </p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-background/60 p-1">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => onGranularityChange(view.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                granularity === view.id
                  ? "bg-accent/15 text-accent-bright"
                  : "text-muted hover:text-foreground",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
          Not enough data yet for this range.
        </div>
      ) : (
        <div className="h-[280px] w-full min-w-0 sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="appsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#55E6CE" stopOpacity={0.28} />
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
                tick={{ fill: "#8B90A0", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8B90A0", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#12141A",
                  border: "1px solid #2A2E3A",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#8B90A0" }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#55E6CE"
                fill="url(#appsFill)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="interviews"
                name="Interviews"
                stroke="#94A3B8"
                strokeWidth={1.75}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="offers"
                name="Offers"
                stroke="#F8FAFC"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
