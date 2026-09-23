import { INTERVIEW_QUESTIONS } from "@/data/interview-questions";
import type {
  AnswerFeedback,
  InterviewExperienceLevel,
  InterviewQuestion,
  InterviewType,
  MockInterviewReport,
  PracticedAnswer,
  PrepSetup,
  PrepStats,
  QuestionCategory,
  QuestionDifficulty,
  ReadinessBreakdown,
  SavedQuestionRecord,
} from "@/types/interview-prep";

export const PREP_STORAGE_KEY = "careeros-interview-prep";

export type PrepPersistedState = {
  practiced: PracticedAnswer[];
  saved: SavedQuestionRecord[];
  mockHistory: Array<{
    id: string;
    role: string;
    company?: string;
    interviewType: InterviewType;
    overallScore: number;
    completedAt: string;
    report: MockInterviewReport;
  }>;
  lastPracticeDate?: string;
  streak: number;
};

export const EMPTY_PREP_STATE: PrepPersistedState = {
  practiced: [],
  saved: [],
  mockHistory: [],
  streak: 0,
};

export function loadPrepState(): PrepPersistedState {
  if (typeof window === "undefined") return EMPTY_PREP_STATE;
  try {
    const raw = window.localStorage.getItem(PREP_STORAGE_KEY);
    if (!raw) return EMPTY_PREP_STATE;
    const parsed = JSON.parse(raw) as PrepPersistedState;
    return {
      practiced: Array.isArray(parsed.practiced) ? parsed.practiced : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      mockHistory: Array.isArray(parsed.mockHistory) ? parsed.mockHistory : [],
      lastPracticeDate: parsed.lastPracticeDate,
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
    };
  } catch {
    return EMPTY_PREP_STATE;
  }
}

export function savePrepState(state: PrepPersistedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREP_STORAGE_KEY, JSON.stringify(state));
}

function hashScore(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % (max - min + 1));
}

export function generateDemoFeedback(
  question: InterviewQuestion,
  answer: string,
): AnswerFeedback {
  const length = answer.trim().length;
  const base = length < 40 ? 5.5 : length < 120 ? 7.2 : length < 280 ? 8.1 : 8.6;
  const variance = hashScore(question.id + answer.slice(0, 24), -6, 6) / 10;
  const overall = Math.min(9.5, Math.max(4.5, Number((base + variance).toFixed(1))));

  const clamp = (n: number) => Math.min(10, Math.max(4, Number(n.toFixed(1))));

  return {
    overall,
    breakdown: {
      technicalAccuracy: clamp(overall + hashScore(question.id, -8, 6) / 10),
      relevance: clamp(overall + (length > 80 ? 0.3 : -0.4)),
      structure: clamp(overall + (answer.includes("\n") ? 0.4 : -0.2)),
      clarity: clamp(overall + hashScore(answer, -5, 5) / 10),
      completeness: clamp(overall + (length > 160 ? 0.5 : -0.5)),
    },
    strengths: [
      length > 60
        ? "You covered a concrete approach rather than only high-level theory."
        : "You addressed the prompt directly.",
      question.category === "Behavioral" || question.category === "HR"
        ? "Your framing is easy to follow for a conversational interview setting."
        : "You referenced practical engineering considerations.",
      "You stayed mostly aligned with the question category.",
    ].slice(0, 3),
    improvements: [
      length < 100
        ? "Expand with a brief example or tradeoff to show depth."
        : "Tighten the opening so your strongest point lands first.",
      "Call out how you would validate the result (metrics, tests, or feedback).",
      question.difficulty === "Hard"
        ? "Surface constraints and edge cases more explicitly."
        : "Mention one alternative approach and why you did not choose it.",
    ].slice(0, 3),
    suggestedAnswer: question.sampleAnswer,
    isDemo: true,
  };
}

export function generateMockReport(
  answers: Array<{ feedback: AnswerFeedback; category: QuestionCategory }>,
): MockInterviewReport {
  if (answers.length === 0) {
    return {
      overall: 0,
      breakdown: {
        technicalKnowledge: 0,
        communication: 0,
        problemSolving: 0,
        answerStructure: 0,
        confidence: 0,
      },
      strongAreas: [],
      focusAreas: ["Complete at least one answer to receive a demo report."],
      recommendedPractice: "Practice 5 questions from the question bank.",
      isDemo: true,
    };
  }

  const avg =
    answers.reduce((sum, item) => sum + item.feedback.overall, 0) /
    answers.length;
  const overall = Math.round(avg * 10);

  const technical = answers.filter((a) =>
    ["Technical", "JavaScript", "React", "Next.js", "TypeScript", "APIs", "HTML/CSS"].includes(
      a.category,
    ),
  );
  const behavioral = answers.filter((a) =>
    ["Behavioral", "HR"].includes(a.category),
  );

  return {
    overall,
    breakdown: {
      technicalKnowledge: Math.round(
        (technical.length
          ? technical.reduce((s, a) => s + a.feedback.breakdown.technicalAccuracy, 0) /
            technical.length
          : avg) * 10,
      ),
      communication: Math.round(avg * 10 - 2 + hashScore("comm", 0, 4)),
      problemSolving: Math.round(avg * 10 + hashScore("solve", -3, 3)),
      answerStructure: Math.round(
        (answers.reduce((s, a) => s + a.feedback.breakdown.structure, 0) /
          answers.length) *
          10,
      ),
      confidence: Math.round(avg * 10 + hashScore("conf", -4, 2)),
    },
    strongAreas: [
      technical.length >= behavioral.length
        ? "Technical explanations with practical framing"
        : "Clear conversational structure on behavioral prompts",
      "Consistent relevance to the question asked",
      answers.some((a) => a.feedback.overall >= 8.5)
        ? "Several high-clarity responses"
        : "Steady baseline across the session",
    ],
    focusAreas: [
      "Lead with the conclusion, then support with evidence",
      behavioral.length < 2
        ? "Practice more behavioral storytelling with STAR"
        : "Add measurable outcomes to behavioral answers",
      "Explicitly state tradeoffs on harder technical prompts",
    ],
    recommendedPractice:
      technical.length >= behavioral.length
        ? "Practice 5 more React performance and TypeScript questions."
        : "Practice 5 more behavioral questions with concise STAR stories.",
    isDemo: true,
  };
}

export function selectQuestionsForSession(
  setup: Pick<PrepSetup, "interviewType" | "role" | "jobDescription"> & {
    difficulty?: QuestionDifficulty;
    count?: number;
    resumeSkills?: string[];
  },
): InterviewQuestion[] {
  const count = setup.count ?? 10;
  const difficulty = setup.difficulty;
  const skills = (setup.resumeSkills ?? []).map((s) => s.toLowerCase());
  const roleText = `${setup.role} ${setup.jobDescription}`.toLowerCase();

  const typed = INTERVIEW_QUESTIONS.filter((q) =>
    setup.interviewType === "Mixed"
      ? true
      : q.interviewTypes.includes(setup.interviewType),
  );

  const scored = typed
    .filter((q) => (difficulty ? q.difficulty === difficulty : true))
    .map((q) => {
      let score = 0;
      for (const tag of q.tags) {
        if (skills.some((skill) => skill.includes(tag.toLowerCase()) || tag.toLowerCase().includes(skill))) {
          score += 3;
        }
        if (roleText.includes(tag.toLowerCase())) score += 2;
      }
      if (roleText.includes(q.category.toLowerCase())) score += 2;
      return { q, score };
    })
    .sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));

  const pool = scored.map((item) => item.q);
  const fallback =
    pool.length >= count
      ? pool
      : [
          ...pool,
          ...INTERVIEW_QUESTIONS.filter((q) => !pool.some((p) => p.id === q.id)),
        ];

  return fallback.slice(0, count);
}

export function getQuestionById(id: string) {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id) ?? null;
}

export function computePrepStats(state: PrepPersistedState): PrepStats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const questionsThisWeek = state.practiced.filter(
    (item) => new Date(item.practicedAt).getTime() >= weekAgo,
  ).length;

  const technicalCompleted = state.practiced.filter((item) => {
    const q = getQuestionById(item.questionId);
    return q && !["Behavioral", "HR"].includes(q.category);
  }).length;

  const behavioralCompleted = state.practiced.filter((item) => {
    const q = getQuestionById(item.questionId);
    return q && ["Behavioral", "HR"].includes(q.category);
  }).length;

  const uniqueQuestions = new Set(state.practiced.map((p) => p.questionId)).size;
  const preparationProgress = Math.min(
    100,
    Math.round(
      (uniqueQuestions / Math.max(1, INTERVIEW_QUESTIONS.length)) * 70 +
        state.mockHistory.length * 8,
    ),
  );

  return {
    interviewsPrepared: state.mockHistory.length,
    questionsPracticed: uniqueQuestions,
    currentStreak: state.streak,
    preparationProgress,
    questionsThisWeek,
    mockInterviewsCompleted: state.mockHistory.length,
    technicalCompleted,
    behavioralCompleted,
  };
}

export function computeReadiness(state: PrepPersistedState): {
  score: number;
  breakdown: ReadinessBreakdown;
  insight: string;
} {
  const stats = computePrepStats(state);
  const technical = Math.min(95, 55 + stats.technicalCompleted * 4);
  const behavioral = Math.min(95, 50 + stats.behavioralCompleted * 6);
  const communication = Math.min(
    95,
    58 + Math.round(state.practiced.length * 1.5),
  );
  const roleKnowledge = Math.min(95, 52 + stats.mockInterviewsCompleted * 8);

  const score = Math.round(
    (technical + behavioral + communication + roleKnowledge) / 4,
  );

  const weakest =
    [
      { key: "behavioral", value: behavioral },
      { key: "technical", value: technical },
      { key: "communication", value: communication },
      { key: "role knowledge", value: roleKnowledge },
    ].sort((a, b) => a.value - b.value)[0]?.key ?? "behavioral";

  return {
    score,
    breakdown: { technical, behavioral, communication, roleKnowledge },
    insight: `Your technical preparation is progressing well. Focus next on ${weakest} questions and concise project explanations.`,
  };
}

export function updateStreak(
  state: PrepPersistedState,
  practicedAt: string,
): PrepPersistedState {
  const today = practicedAt.slice(0, 10);
  const last = state.lastPracticeDate?.slice(0, 10);
  if (last === today) return { ...state, lastPracticeDate: today };

  if (!last) {
    return { ...state, lastPracticeDate: today, streak: 1 };
  }

  const lastTime = new Date(last).getTime();
  const todayTime = new Date(today).getTime();
  const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));

  return {
    ...state,
    lastPracticeDate: today,
    streak: diffDays === 1 ? state.streak + 1 : 1,
  };
}

export function difficultyTone(difficulty: QuestionDifficulty) {
  if (difficulty === "Easy") return "text-emerald-300 border-emerald-400/25 bg-emerald-400/10";
  if (difficulty === "Hard") return "text-rose-300 border-rose-400/25 bg-rose-400/10";
  return "text-amber-200 border-amber-300/25 bg-amber-300/10";
}

export function mapExperienceToDifficulty(
  level: InterviewExperienceLevel,
): QuestionDifficulty {
  if (level === "Entry Level" || level === "Junior") return "Easy";
  if (level === "Senior") return "Hard";
  return "Medium";
}
