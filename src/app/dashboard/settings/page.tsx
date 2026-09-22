"use client";

import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Workspace preferences for this CareerOS portfolio demo. Authentication and persistence can be layered in without changing the shell."
      icon={Settings}
      highlights={[
        "Profile and workspace labels are centralized in mock data.",
        "Theme tokens already match the landing page system.",
        "No auth or billing flows are included by design.",
      ]}
    />
  );
}
