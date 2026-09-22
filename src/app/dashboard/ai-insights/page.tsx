"use client";

import { Sparkles } from "lucide-react";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { careerInsights } from "@/data/mock";

export default function AiInsightsPage() {
  return (
    <div className="space-y-5">
      <AiInsightCard />
      <PlaceholderPage
        title="Insight library"
        description="CareerOS surfaces demo insights derived from application patterns. These are curated examples for the portfolio — not live model output."
        icon={Sparkles}
        highlights={careerInsights.map(
          (insight) => `${insight.category}: ${insight.summary}`,
        )}
      />
    </div>
  );
}
