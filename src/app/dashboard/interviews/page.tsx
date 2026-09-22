"use client";

import { CalendarDays } from "lucide-react";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export default function InterviewsPage() {
  return (
    <div className="space-y-5">
      <UpcomingInterviews />
      <PlaceholderPage
        title="Interview calendar"
        description="This section showcases the interview planning surface for CareerOS. Upcoming sessions above are demo data you can expand into a full calendar later."
        icon={CalendarDays}
        highlights={[
          "Round-level prep notes can attach to each interview.",
          "Format and timing are already modeled in the data layer.",
          "Empty states are ready when no interviews are scheduled.",
        ]}
      />
    </div>
  );
}
