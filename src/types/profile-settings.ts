import type { EmploymentType, WorkMode } from "./dashboard";

export type SettingsSectionId =
  | "personal"
  | "professional"
  | "experience"
  | "education"
  | "preferences"
  | "resume"
  | "account"
  | "notifications"
  | "ai"
  | "appearance"
  | "privacy";

export type ExperienceLevelPref = "Entry" | "Junior" | "Mid" | "Senior";

export type ThemePreference = "light" | "dark" | "system";

export type ProfileExperience = {
  id: string;
  title: string;
  company: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  technologies: string[];
  current?: boolean;
};

export type ProfileEducation = {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
};

export type CareerPreferences = {
  preferredRoles: string[];
  preferredLocations: string[];
  workModes: WorkMode[];
  employmentTypes: EmploymentType[];
  experienceLevel: ExperienceLevelPref;
  salaryMin: string;
  salaryMax: string;
  industries: string[];
};

export type NotificationPreferences = {
  interviewReminders: boolean;
  statusChanges: boolean;
  followUpReminders: boolean;
  newJobMatches: boolean;
  savedJobUpdates: boolean;
  preparationReminders: boolean;
  practiceReminders: boolean;
  productUpdates: boolean;
  featureAnnouncements: boolean;
};

export type AiPreferences = {
  jobRecommendations: boolean;
  resumeAnalysis: boolean;
  interviewFeedback: boolean;
  personalizedInsights: boolean;
};

export type PrivacyPreferences = {
  profileVisibility: boolean;
  personalizedRecommendations: boolean;
  analyticsParticipation: boolean;
};

export type ProfileResumeMeta = {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  lastAnalyzedAt?: string;
  resumeScore?: number;
  jobMatchScore?: number | null;
  analysisId?: string;
};

export type UserProfile = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  about: string;
  currentRole: string;
  yearsExperience: string;
  preferredRoles: string[];
  skills: string[];
  experience: ProfileExperience[];
  education: ProfileEducation[];
  careerPreferences: CareerPreferences;
  resume: ProfileResumeMeta | null;
  notifications: NotificationPreferences;
  ai: AiPreferences;
  appearance: ThemePreference;
  privacy: PrivacyPreferences;
  accountCreatedAt: string;
};

export type ProfileCompletionItem = {
  id: string;
  label: string;
  section: SettingsSectionId;
};
