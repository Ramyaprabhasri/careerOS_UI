"use client";

import { BarChart3 } from "lucide-react";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <ActivityChart />
      <PlaceholderPage
        title="Deeper analytics"
        description="Extended cohort and funnel analytics can live here. The activity chart above reuses the same visualization language as Overview."
        icon={BarChart3}
      />
    </div>
  );
}
