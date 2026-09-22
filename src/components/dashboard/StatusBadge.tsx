import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/dashboard";

const statusStyles: Record<ApplicationStatus, string> = {
  Saved: "border-border bg-white/[0.03] text-muted",
  Applied: "border-border bg-white/[0.04] text-foreground/80",
  Screening: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  Interview: "border-accent/25 bg-accent-dim text-accent-bright",
  Offer: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Rejected: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap",
        statusStyles[status],
        className,
      )}
    >
      {status === "Saved" ? "Wishlist" : status}
    </span>
  );
}
