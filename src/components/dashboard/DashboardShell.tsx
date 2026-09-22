"use client";

import { useState, type ReactNode } from "react";
import { DashboardProvider } from "./DashboardProvider";
import { Sidebar } from "./Sidebar";
import { ToastStack } from "./ToastStack";
import { TopHeader } from "./TopHeader";

type DashboardShellProps = {
  breadcrumb: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function DashboardShell({
  breadcrumb,
  title,
  description,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:64px_64px]"
        />

        <Sidebar
          mobileOpen={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
        />

        <div className="relative lg:pl-[248px]">
          <TopHeader
            breadcrumb={breadcrumb}
            title={title}
            description={description}
          />
          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>

        <ToastStack />
      </div>
    </DashboardProvider>
  );
}
