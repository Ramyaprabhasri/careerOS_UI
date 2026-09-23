import {
  EMPTY_PREP_STATE,
  generateDemoFeedback,
  generateMockReport,
  getQuestionById,
  loadPrepState,
  savePrepState,
  updateStreak,
  type PrepPersistedState,
} from "@/lib/interview-prep";
import type {
  AnswerFeedback,
  MockInterviewReport,
  PracticedAnswer,
} from "@/types/interview-prep";

type Listener = () => void;

let memory: PrepPersistedState | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getPrepSnapshot(): PrepPersistedState {
  if (memory === null) {
    memory = typeof window === "undefined" ? EMPTY_PREP_STATE : loadPrepState();
  }
  return memory;
}

export function getPrepServerSnapshot(): PrepPersistedState {
  return EMPTY_PREP_STATE;
}

export function subscribePrep(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setPrepState(next: PrepPersistedState) {
  memory = next;
  savePrepState(next);
  emit();
}

export function updatePrepState(
  updater: (current: PrepPersistedState) => PrepPersistedState,
) {
  setPrepState(updater(getPrepSnapshot()));
}

export function recordPractice(
  questionId: string,
  answer: string,
  feedback: AnswerFeedback,
) {
  const practicedAt = new Date().toISOString();
  updatePrepState((current) => {
    const nextPracticed: PracticedAnswer[] = [
      { questionId, answer, feedback, practicedAt },
      ...current.practiced.filter((item) => item.questionId !== questionId),
    ];
    return updateStreak(
      { ...current, practiced: nextPracticed },
      practicedAt,
    );
  });
}

export function toggleSavedQuestion(questionId: string) {
  const current = getPrepSnapshot();
  const exists = current.saved.some((item) => item.questionId === questionId);
  if (exists) {
    updatePrepState((state) => ({
      ...state,
      saved: state.saved.filter((item) => item.questionId !== questionId),
    }));
    return false;
  }
  updatePrepState((state) => ({
    ...state,
    saved: [
      { questionId, savedAt: new Date().toISOString().slice(0, 10) },
      ...state.saved,
    ],
  }));
  return true;
}

export function removeSavedQuestion(questionId: string) {
  updatePrepState((state) => ({
    ...state,
    saved: state.saved.filter((item) => item.questionId !== questionId),
  }));
}

export function recordMockInterview(input: {
  id: string;
  role: string;
  company?: string;
  interviewType: PrepPersistedState["mockHistory"][number]["interviewType"];
  answers: Array<{ questionId: string; answer: string; feedback: AnswerFeedback }>;
}) {
  const completedAt = new Date().toISOString();
  const withCategories = input.answers.map((item) => ({
    feedback: item.feedback,
    category: getQuestionById(item.questionId)?.category ?? "Technical",
  }));
  const report = generateMockReport(withCategories);
  updatePrepState((current) =>
    updateStreak(
      {
        ...current,
        practiced: [
          ...input.answers.map((item) => ({
            questionId: item.questionId,
            answer: item.answer,
            feedback: item.feedback,
            practicedAt: completedAt,
          })),
          ...current.practiced,
        ],
        mockHistory: [
          {
            id: input.id,
            role: input.role,
            company: input.company,
            interviewType: input.interviewType,
            overallScore: report.overall,
            completedAt,
            report,
          },
          ...current.mockHistory,
        ],
      },
      completedAt,
    ),
  );
  return report;
}

export function createFeedback(questionId: string, answer: string) {
  const question = getQuestionById(questionId);
  if (!question) {
    const fallback: AnswerFeedback = {
      overall: 6,
      breakdown: {
        technicalAccuracy: 6,
        relevance: 6,
        structure: 6,
        clarity: 6,
        completeness: 6,
      },
      strengths: ["You submitted an answer."],
      improvements: ["Pick a question from the bank and try again."],
      suggestedAnswer: "",
      isDemo: true,
    };
    return fallback;
  }
  return generateDemoFeedback(question, answer);
}

export type { MockInterviewReport };
