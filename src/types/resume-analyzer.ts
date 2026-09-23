export type AnalysisPhase =
  | "idle"
  | "uploading"
  | "ready"
  | "analyzing"
  | "results"
  | "error";

export type RecommendationPriority = "High" | "Medium" | "Low";

export type CategoryScore = {
  id: string;
  label: string;
  score: number;
  note: string;
};

export type ResumeRecommendation = {
  id: string;
  issue: string;
  whyItMatters: string;
  suggestedImprovement: string;
  priority: RecommendationPriority;
  originalSnippet: string;
  suggestedRewrite: string;
};

export type ResumeStrength = {
  id: string;
  title: string;
  description: string;
};

export type SkillsBreakdown = {
  matched: string[];
  suggestedKeywords: string[];
  skillsToHighlight: string[];
};

export type JobMatchResult = {
  score: number;
  matchingSkills: string[];
  missingKeywords: string[];
  relevantExperience: string[];
  keywordAlignmentNote: string;
};

export type UploadedResumeMeta = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export type ResumeAnalysis = {
  id: string;
  createdAt: string;
  isDemo: true;
  resume: UploadedResumeMeta;
  targetRole: string;
  company?: string;
  jobDescription?: string;
  jobUrl?: string;
  overallScore: number;
  summary: string;
  categoryScores: CategoryScore[];
  jobMatch: JobMatchResult | null;
  skills: SkillsBreakdown;
  strengths: ResumeStrength[];
  recommendations: ResumeRecommendation[];
};

export type AnalyzerMetrics = {
  resumesAnalyzed: number;
  averageScore: number;
  analysesThisMonth: number;
};
