"use client";

import { Suspense } from "react";
import { ApplicationsBoard } from "@/components/dashboard/applications/ApplicationsBoard";

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface/50" />
      }
    >
      <ApplicationsBoard />
    </Suspense>
  );
}
