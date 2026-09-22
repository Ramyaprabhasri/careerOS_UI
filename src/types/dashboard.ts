export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected";

export type WorkMode = "Remote" | "Hybrid" | "Onsite";

export type EmploymentType =
  | "Full-time"
  | "Contract"
  | "Internship"
  | "Part-time";

export type Priority = "Low" | "Medium" | "High";

export type InterviewFormat = "Video" | "Onsite" | "Phone";

export type TimelineEvent = {
  id: string;
  label: string;
  date?: string;
  completed: boolean;
};

export type Application = {
  id: string;
  company: string;
  role: string;
  location: string;
  dateApplied: string;
  status: ApplicationStatus;
  matchScore: number;
  notes?: string;
  salaryRange?: string;
  source?: string;
  jobUrl?: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  priority: Priority;
  resumeUsed?: string;
  followUpDate?: string;
  updatedAt: string;
  tags: string[];
  timeline: TimelineEvent[];
};

export type ApplicationInput = {
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  matchScore?: number;
  notes?: string;
  salaryRange?: string;
  source?: string;
  jobUrl?: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  priority: Priority;
  resumeUsed?: string;
  followUpDate?: string;
  dateApplied?: string;
};

export type Interview = {
  id: string;
  applicationId: string;
  company: string;
  role: string;
  round: string;
  dateTime: string;
  format: InterviewFormat;
};

export type ActivityPoint = {
  label: string;
  applications: number;
};

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  supporting: string;
  trend: number[];
};

export type PipelineStage = {
  id: ApplicationStatus;
  label: string;
  count: number;
};

export type CareerInsight = {
  id: string;
  title: string;
  summary: string;
  category: string;
};

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
};

export type ChartRange = "7d" | "30d" | "12w";

export type BoardView = "board" | "list" | "calendar";

export type ApplicationSort =
  | "date-desc"
  | "date-asc"
  | "company"
  | "priority"
  | "match"
  | "status"
  | "updated";

export type FollowUpFilter = "All" | "Upcoming" | "Overdue" | "None";

export type TableColumnId =
  | "company"
  | "status"
  | "priority"
  | "location"
  | "applied"
  | "nextAction"
  | "updated"
  | "actions";

export type SavedTableView = {
  id: string;
  name: string;
  filters: {
    status: ApplicationStatus | "All";
    employmentType: EmploymentType | "All";
    location: string;
    workMode: WorkMode | "All";
    priority: Priority | "All";
    dateFrom: string;
    dateTo: string;
    followUp: FollowUpFilter;
  };
  sort: ApplicationSort;
  columns: TableColumnId[];
};
