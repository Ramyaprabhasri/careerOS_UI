export type InterviewType =
  | "Technical"
  | "Behavioral"
  | "HR"
  | "System Design"
  | "Mixed";

export type InterviewExperienceLevel =
  | "Entry Level"
  | "Junior"
  | "Mid Level"
  | "Senior";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type QuestionCategory =
  | "Technical"
  | "JavaScript"
  | "React"
  | "Next.js"
  | "TypeScript"
  | "HTML/CSS"
  | "APIs"
  | "System Design"
  | "Behavioral"
  | "HR";

export type QuestionBankFilter = "all" | "unanswered" | "practiced" | "saved";

export type PrepPhase =
  | "overview"
  | "practice"
  | "feedback"
  | "mock-setup"
  | "mock-active"
  | "mock-results";

export type InterviewQuestion = {
  id: string;
  prompt: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  interviewTypes: InterviewType[];
  tags: string[];
  hint: string;
  /** Demo suggested answer — labeled as simulated in UI */
  sampleAnswer: string;
};

export type FeedbackBreakdown = {
  technicalAccuracy: number;
  relevance: number;
  structure: number;
  clarity: number;
  completeness: number;
};

export type AnswerFeedback = {
  overall: number;
  breakdown: FeedbackBreakdown;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  isDemo: true;
};

export type PracticedAnswer = {
  questionId: string;
  answer: string;
  feedback: AnswerFeedback;
  practicedAt: string;
};

export type SavedQuestionRecord = {
  questionId: string;
  savedAt: string;
};

export type MockInterviewSession = {
  id: string;
  role: string;
  company?: string;
  interviewType: InterviewType;
  experienceLevel: InterviewExperienceLevel;
  difficulty: QuestionDifficulty;
  questionIds: string[];
  answers: Array<{
    questionId: string;
    answer: string;
    feedback: AnswerFeedback;
  }>;
  startedAt: string;
  completedAt?: string;
  overallScore?: number;
  report?: MockInterviewReport;
};

export type MockInterviewReport = {
  overall: number;
  breakdown: {
    technicalKnowledge: number;
    communication: number;
    problemSolving: number;
    answerStructure: number;
    confidence: number;
  };
  strongAreas: string[];
  focusAreas: string[];
  recommendedPractice: string;
  isDemo: true;
};

export type ReadinessBreakdown = {
  technical: number;
  behavioral: number;
  communication: number;
  roleKnowledge: number;
};

export type PrepStats = {
  interviewsPrepared: number;
  questionsPracticed: number;
  currentStreak: number;
  preparationProgress: number;
  questionsThisWeek: number;
  mockInterviewsCompleted: number;
  technicalCompleted: number;
  behavioralCompleted: number;
};

export type PrepSetup = {
  role: string;
  interviewType: InterviewType;
  experienceLevel: InterviewExperienceLevel;
  company: string;
  jobDescription: string;
};

export type PrepContextPrefill = {
  role?: string;
  company?: string;
  jobDescription?: string;
  source?: "application" | "job" | "resume" | "manual";
};
