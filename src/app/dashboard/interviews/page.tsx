"use client";

import { Suspense } from "react";
import { InterviewPrepPage } from "@/components/dashboard/interview-prep/InterviewPrepPage";

export default function InterviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-2xl border border-border bg-surface/50" />
          <div className="h-48 rounded-2xl border border-border bg-surface/50" />
        </div>
      }
    >
      <InterviewPrepPage />
    </Suspense>
  );
}
