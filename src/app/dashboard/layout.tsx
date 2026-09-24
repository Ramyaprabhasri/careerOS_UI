import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { requireUser, UnauthorizedError } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CareerOS Dashboard",
  description:
    "Explore the CareerOS career command center — applications, interviews, and demo AI insights.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login?next=/dashboard");
    }
    throw error;
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
