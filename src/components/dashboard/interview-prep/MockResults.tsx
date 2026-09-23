"use client";

import { formatDate } from "@/lib/utils";
import type { MockInterviewReport } from "@/types/interview-prep";

type MockResultsProps = {
  role: string;
  company?: string;
  report: MockInterviewReport;
  onPracticeRecommended: () => void;
  onStartAnother: () => void;
  onBack: () => void;
};

export function MockResults({
  role,
  company,
  report,
  onPracticeRecommended,
  onStartAnother,
  onBack,
}: MockResultsProps) {
  const breakdown = [
    { label: "Technical Knowledge", value: report.breakdown.technicalKnowledge },
    { label: "Communication", value: report.breakdown.communication },
    { label: "Problem Solving", value: report.breakdown.problemSolving },
    { label: "Answer Structure", value: report.breakdown.answerStructure },
    { label: "Confidence", value: report.breakdown.confidence },
  ];

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-8">
        <p className="text-[10px] tracking-[0.16em] text-accent-bright uppercase">
          Demo interview report
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
          Interview Complete
        </h2>
        <p className="mt-1 text-sm text-muted">
          {role}
          {company ? ` · ${company}` : ""} · Simulated performance summary
        </p>

        <p className="mt-6 font-display text-4xl font-semibold text-foreground">
          {report.overall}
          <span className="text-lg text-muted"> / 100</span>
        </p>
        <p className="mt-1 text-sm text-muted">Overall Performance</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-accent/70"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface/80 p-5">
          <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
            Strong areas
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {report.strongAreas.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface/80 p-5">
          <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
            Focus areas
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {report.focusAreas.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/80 p-5">
        <h3 className="text-xs tracking-[0.14em] text-muted uppercase">
          Recommended practice
        </h3>
        <p className="mt-2 text-sm text-muted">{report.recommendedPractice}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPracticeRecommended}
            className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e]"
          >
            Practice Recommended Questions
          </button>
          <button
            type="button"
            onClick={onStartAnother}
            className="rounded-full border border-border px-4 py-2.5 text-sm text-muted hover:text-foreground"
          >
            Start Another Interview
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-border px-4 py-2.5 text-sm text-muted hover:text-foreground"
          >
            Back to Overview
          </button>
        </div>
      </div>
    </section>
  );
}

type MockHistoryProps = {
  history: Array<{
    id: string;
    role: string;
    company?: string;
    interviewType: string;
    overallScore: number;
    completedAt: string;
  }>;
  onStartMock: () => void;
};

export function MockHistory({ history, onStartMock }: MockHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
        <p className="font-display text-lg font-semibold text-foreground">
          Your preparation journey starts here.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Complete a mock interview to see demo performance history.
        </p>
        <button
          type="button"
          onClick={onStartMock}
          className="mt-5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e]"
        >
          Start Mock Interview
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">
        Recent mock interviews
      </h3>
      <ul className="space-y-2">
        {history.slice(0, 5).map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="text-foreground">
                {item.role}
                {item.company ? ` · ${item.company}` : ""}
              </p>
              <p className="text-xs text-muted-soft">
                {item.interviewType} · {formatDate(item.completedAt)}
              </p>
            </div>
            <span className="font-medium text-accent-bright">
              {item.overallScore}/100
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
