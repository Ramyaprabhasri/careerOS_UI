"use client";

import { TrendingUp } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export default function SkillsPage() {
  return (
    <PlaceholderPage
      title="Skills & Growth"
      description="Map your strengths against the roles you are targeting. The Overview already encodes match scores that can feed this view later."
      icon={TrendingUp}
    />
  );
}
