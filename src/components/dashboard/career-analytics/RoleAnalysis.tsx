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
import type { RoleMetric } from "@/types/career-analytics";

type RoleAnalysisProps = {
  roles: RoleMetric[];
};

export function RoleAnalysis({ roles }: RoleAnalysisProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Applications by Role
      </h3>
      <p className="mt-1 text-sm text-muted">
        Which role titles generate applications, interviews, and offers.
      </p>

      {roles.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Not enough data yet.</p>
      ) : (
        <div className="mt-4 h-[280px] w-full min-w-0 overflow-x-auto">
          <div className="h-full min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roles}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  stroke="#252830"
                  strokeDasharray="3 6"
                  horizontal={false}
                />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#8B90A0", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="role"
                  width={110}
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
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="applications" name="Applications" fill="#55E6CE" radius={[0, 4, 4, 0]} />
                <Bar dataKey="interviews" name="Interviews" fill="#94A3B8" radius={[0, 4, 4, 0]} />
                <Bar dataKey="offers" name="Offers" fill="#F8FAFC" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
