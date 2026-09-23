import type { UserProfile } from "@/types/profile-settings";

export const ROLE_OPTIONS = [
  "Frontend Developer",
  "React Developer",
  "Software Engineer",
  "UI Engineer",
  "Next.js Developer",
] as const;

export const INDUSTRY_OPTIONS = [
  "SaaS",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "Developer Tools",
  "Design Systems",
] as const;

/**
 * Seed profile for CareerOS demo — mirrors DEMO_USER identity.
 * Skills listed here are explicit demo profile data, not inferred.
 */
export const seedUserProfile: UserProfile = {
  fullName: "Ramyaprabhasri V R",
  headline: "Software Engineer · Frontend Developer",
  email: "ramya@careeros.demo",
  phone: "",
  location: "Chennai",
  portfolioUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  about:
    "Frontend-focused software engineer building polished product interfaces with React, TypeScript, and modern web tooling.",
  currentRole: "Frontend Developer",
  yearsExperience: "2",
  preferredRoles: ["Frontend Developer", "React Developer", "UI Engineer"],
  skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"],
  experience: [
    {
      id: "exp-1",
      title: "Frontend Developer",
      company: "CareerOS Demo Studio",
      employmentType: "Full-time",
      startDate: "2024-06",
      endDate: "",
      location: "Chennai · Hybrid",
      description:
        "Shipped dashboard interfaces, design-system components, and interactive career workflows for internal tools.",
      technologies: ["React", "TypeScript", "Next.js"],
      current: true,
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.E.",
      institution: "Demo University",
      fieldOfStudy: "Computer Science",
      startYear: "2019",
      endYear: "2023",
    },
  ],
  careerPreferences: {
    preferredRoles: ["Frontend Developer", "React Developer", "Next.js Developer"],
    preferredLocations: ["Chennai", "Bengaluru", "Remote"],
    workModes: ["Remote", "Hybrid"],
    employmentTypes: ["Full-time"],
    experienceLevel: "Junior",
    salaryMin: "8",
    salaryMax: "18",
    industries: ["SaaS", "Developer Tools"],
  },
  resume: {
    fileName: "Ramyaprabhasri_Resume.pdf",
    fileType: "PDF",
    uploadedAt: "2026-09-10",
    lastAnalyzedAt: "2026-09-12",
    resumeScore: 82,
    jobMatchScore: 76,
  },
  notifications: {
    interviewReminders: true,
    statusChanges: true,
    followUpReminders: true,
    newJobMatches: true,
    savedJobUpdates: false,
    preparationReminders: true,
    practiceReminders: false,
    productUpdates: true,
    featureAnnouncements: false,
  },
  ai: {
    jobRecommendations: true,
    resumeAnalysis: true,
    interviewFeedback: true,
    personalizedInsights: true,
  },
  appearance: "dark",
  privacy: {
    profileVisibility: false,
    personalizedRecommendations: true,
    analyticsParticipation: true,
  },
  accountCreatedAt: "2026-01-15",
};
