"use client";

import { Bell, Search } from "lucide-react";
import { DEMO_USER } from "@/data/mock";

type TopHeaderProps = {
  breadcrumb: string;
  title: string;
  description: string;
};

export function TopHeader({ breadcrumb, title, description }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5">
        <div className="pl-12 lg:pl-0">
          <p className="text-[10px] font-medium tracking-[0.22em] text-muted-soft uppercase">
            {breadcrumb}
          </p>
          <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="relative flex min-w-[180px] flex-1 items-center sm:max-w-xs sm:flex-none">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-soft" />
            <input
              type="search"
              placeholder="Search workspace..."
              className="w-full rounded-full border border-border bg-surface px-9 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-soft focus:border-accent/40 focus:shadow-[0_0_0_3px_rgba(85,230,206,0.12)]"
            />
          </label>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-border-strong hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <span className="rounded-full border border-border px-3 py-2 text-[10px] tracking-[0.16em] text-muted uppercase">
            Demo Data
          </span>

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
            {DEMO_USER.initials}
          </span>
        </div>
      </div>
    </header>
  );
}
