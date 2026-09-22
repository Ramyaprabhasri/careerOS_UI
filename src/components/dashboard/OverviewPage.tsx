"use client";

import { useState } from "react";
import { ActivityChart } from "./ActivityChart";
import { AddApplicationModal } from "./AddApplicationModal";
import { AiInsightCard } from "./AiInsightCard";
import { AnalyzeJdModal } from "./AnalyzeJdModal";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { useDashboard } from "./DashboardProvider";
import { MetricCards } from "./MetricCards";
import { Pipeline } from "./Pipeline";
import { RecentApplications } from "./RecentApplications";
import { UpcomingInterviews } from "./UpcomingInterviews";
import { WelcomeActions } from "./WelcomeActions";
import type { Application } from "@/types/dashboard";

export function OverviewPage() {
  const { applications } = useDashboard();
  const [addOpen, setAddOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  return (
    <div className="space-y-5 lg:space-y-6">
      <WelcomeActions
        onAddApplication={() => setAddOpen(true)}
        onAnalyzeJd={() => setAnalyzeOpen(true)}
      />

      <MetricCards applications={applications} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_0.9fr] xl:gap-6">
        <ActivityChart />
        <UpcomingInterviews />
      </div>

      <Pipeline applications={applications} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.9fr] xl:gap-6">
        <RecentApplications
          applications={applications}
          onSelect={setSelected}
        />
        <AiInsightCard />
      </div>

      <AddApplicationModal open={addOpen} onClose={() => setAddOpen(false)} />
      <AnalyzeJdModal open={analyzeOpen} onClose={() => setAnalyzeOpen(false)} />
      <ApplicationDetailModal
        application={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
