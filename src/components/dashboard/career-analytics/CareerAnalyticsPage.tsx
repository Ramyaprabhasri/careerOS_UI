"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/dashboard/Modal";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { AnalyticsHeader } from "@/components/dashboard/career-analytics/AnalyticsHeader";
import { AnalyticsKpiRow } from "@/components/dashboard/career-analytics/AnalyticsKpiRow";
import { ApplicationActivityChart } from "@/components/dashboard/career-analytics/ApplicationActivityChart";
import { ApplicationFunnel } from "@/components/dashboard/career-analytics/ApplicationFunnel";
import {
  CareerGoalsCard,
  EditGoalsForm,
} from "@/components/dashboard/career-analytics/CareerGoalsCard";
import { CareerInsights } from "@/components/dashboard/career-analytics/CareerInsights";
import { ConversionAnalysis } from "@/components/dashboard/career-analytics/ConversionAnalysis";
import { RecentActivityFeed } from "@/components/dashboard/career-analytics/RecentActivityFeed";
import { RoleAnalysis } from "@/components/dashboard/career-analytics/RoleAnalysis";
import { SourceChannels } from "@/components/dashboard/career-analytics/SourceChannels";
import { StatusDistribution } from "@/components/dashboard/career-analytics/StatusDistribution";
import { WeeklyActivity } from "@/components/dashboard/career-analytics/WeeklyActivity";
import { computeAnalytics } from "@/lib/career-analytics";
import {
  getGoalsServerSnapshot,
  getGoalsSnapshot,
  setCareerGoals,
  subscribeGoals,
} from "@/lib/career-goals-store";
import {
  getPrepServerSnapshot,
  getPrepSnapshot,
  subscribePrep,
} from "@/lib/interview-prep-store";
import {
  getResumeAnalysesServerSnapshot,
  getResumeAnalysesSnapshot,
  subscribeResumeAnalyses,
} from "@/lib/resume-analysis-store";
import type {
  ActivityGranularity,
  AnalyticsDateRange,
  CareerGoals,
} from "@/types/career-analytics";
import type { ApplicationStatus } from "@/types/dashboard";

export function CareerAnalyticsPage() {
  const router = useRouter();
  const { applications, pushToast } = useDashboard();
  const goals = useSyncExternalStore(
    subscribeGoals,
    getGoalsSnapshot,
    getGoalsServerSnapshot,
  );
  const prep = useSyncExternalStore(
    subscribePrep,
    getPrepSnapshot,
    getPrepServerSnapshot,
  );
  const analyses = useSyncExternalStore(
    subscribeResumeAnalyses,
    getResumeAnalysesSnapshot,
    getResumeAnalysesServerSnapshot,
  );

  const [range, setRange] = useState<AnalyticsDateRange>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [granularity, setGranularity] =
    useState<ActivityGranularity>("weekly");
  const [exportOpen, setExportOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [draftGoals, setDraftGoals] = useState<CareerGoals>(goals);

  const analytics = useMemo(
    () =>
      computeAnalytics({
        applications,
        analyses,
        prep,
        goals,
        range,
        customRange:
          range === "custom" && customFrom && customTo
            ? { from: customFrom, to: customTo }
            : undefined,
        granularity,
      }),
    [
      applications,
      analyses,
      prep,
      goals,
      range,
      customFrom,
      customTo,
      granularity,
    ],
  );

  const openApplications = (status?: ApplicationStatus) => {
    if (status) {
      router.push(`/dashboard/applications?status=${encodeURIComponent(status)}`);
    } else {
      router.push("/dashboard/applications");
    }
  };

  if (!analytics.hasApplications) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader
          range={range}
          customFrom={customFrom}
          customTo={customTo}
          onRangeChange={setRange}
          onCustomFrom={setCustomFrom}
          onCustomTo={setCustomTo}
          onExport={() => setExportOpen(true)}
        />
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            Your analytics will appear here
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Start tracking applications to understand your job-search progress.
          </p>
          <Link
            href="/dashboard/applications"
            className="mt-6 inline-flex rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e]"
          >
            Add Application
          </Link>
        </div>
        <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        range={range}
        customFrom={customFrom}
        customTo={customTo}
        onRangeChange={setRange}
        onCustomFrom={setCustomFrom}
        onCustomTo={setCustomTo}
        onExport={() => setExportOpen(true)}
      />

      <p className="text-xs text-muted-soft">
        Metrics are calculated from your CareerOS demo data for the selected
        range.
      </p>

      <AnalyticsKpiRow kpis={analytics.kpis} />

      <div className="grid gap-5 xl:grid-cols-2">
        <ApplicationFunnel
          stages={analytics.funnel}
          onStageClick={(status) => openApplications(status)}
        />
        <ConversionAnalysis metrics={analytics.conversions} />
      </div>

      <ApplicationActivityChart
        data={analytics.activity}
        granularity={granularity}
        onGranularityChange={setGranularity}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <StatusDistribution
          slices={analytics.statusDistribution}
          onSelect={(status) => openApplications(status)}
        />
        <RoleAnalysis roles={analytics.roles} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SourceChannels sources={analytics.sources} />
        <WeeklyActivity days={analytics.weeklyActivity} />
      </div>

      <CareerInsights insights={analytics.insights} />

      <div className="grid gap-5 xl:grid-cols-2">
        <CareerGoalsCard
          progress={analytics.goalsProgress}
          onEdit={() => {
            setDraftGoals(goals);
            setGoalsOpen(true);
          }}
        />
        <RecentActivityFeed items={analytics.recentActivity} />
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />

      <Modal
        open={goalsOpen}
        onClose={() => setGoalsOpen(false)}
        title="Edit Career Goals"
        description="Targets persist in this browser until a backend is connected."
      >
        <EditGoalsForm
          goals={draftGoals}
          onChange={setDraftGoals}
          onCancel={() => setGoalsOpen(false)}
          onSave={() => {
            setCareerGoals(draftGoals);
            setGoalsOpen(false);
            pushToast({
              title: "Goals updated",
              description: "Your targets are saved locally.",
            });
          }}
        />
      </Modal>
    </div>
  );
}

function ExportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Report"
      description="Export actions are structured for backend integration. Downloads are not simulated."
    >
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-between rounded-xl border border-border bg-surface/60 px-4 py-3 text-left text-sm text-muted opacity-70"
        >
          <span>Export CSV</span>
          <span className="text-[10px] tracking-[0.14em] uppercase">
            Coming soon
          </span>
        </button>
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-between rounded-xl border border-border bg-surface/60 px-4 py-3 text-left text-sm text-muted opacity-70"
        >
          <span>Export PDF</span>
          <span className="text-[10px] tracking-[0.14em] uppercase">
            Coming soon
          </span>
        </button>
        <p className="text-xs text-muted-soft">
          When a reporting API is connected, these actions will generate real
          downloads from your analytics bundle.
        </p>
      </div>
    </Modal>
  );
}
