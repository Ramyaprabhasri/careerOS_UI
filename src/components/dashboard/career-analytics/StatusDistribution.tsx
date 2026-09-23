"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusSlice } from "@/types/career-analytics";
import type { ApplicationStatus } from "@/types/dashboard";

const COLORS = [
  "#6B7280",
  "#94A3B8",
  "#38BDF8",
  "#55E6CE",
  "#A7F3D0",
  "#FB7185",
];

type StatusDistributionProps = {
  slices: StatusSlice[];
  onSelect: (status: ApplicationStatus) => void;
};

export function StatusDistribution({
  slices,
  onSelect,
}: StatusDistributionProps) {
  const data = slices.filter((slice) => slice.count > 0);
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Application Status
      </h3>
      <p className="mt-1 text-sm text-muted">
        Distribution across your pipeline. Click a label to open Applications.
      </p>

      {total === 0 ? (
        <p className="mt-8 text-sm text-muted">Not enough data yet.</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-[200px] w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={COLORS[index % COLORS.length]}
                      className="cursor-pointer outline-none"
                      onClick={() => onSelect(entry.status)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#12141A",
                    border: "1px solid #2A2E3A",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full space-y-2">
            {slices.map((slice, index) => (
              <li key={slice.status}>
                <button
                  type="button"
                  onClick={() => onSelect(slice.status)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: COLORS[index % COLORS.length] }}
                    />
                    {slice.label}
                  </span>
                  <span>
                    {slice.count} · {slice.percent}%
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
