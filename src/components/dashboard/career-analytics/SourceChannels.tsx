"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SourceMetric } from "@/types/career-analytics";

type SourceChannelsProps = {
  sources: SourceMetric[];
};

export function SourceChannels({ sources }: SourceChannelsProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Where Your Opportunities Come From
      </h3>
      <p className="mt-1 text-sm text-muted">
        Based on the source field on your applications.
      </p>

      {sources.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          Source data is unavailable. Add a source when tracking applications.
        </div>
      ) : (
        <div className="mt-4 h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sources} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#252830" strokeDasharray="3 6" vertical={false} />
              <XAxis
                dataKey="source"
                tick={{ fill: "#8B90A0", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#8B90A0", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#12141A",
                  border: "1px solid #2A2E3A",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="applications" name="Applications" fill="#55E6CE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="responses" name="Responses" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="interviews" name="Interviews" fill="#64748B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
