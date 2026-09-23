"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { AnswerFeedbackPanel } from "@/components/dashboard/interview-prep/AnswerFeedbackPanel";
import { MockHistory, MockResults } from "@/components/dashboard/interview-prep/MockResults";
import { PracticeWorkspace } from "@/components/dashboard/interview-prep/PracticeWorkspace";
import { PrepHeader } from "@/components/dashboard/interview-prep/PrepHeader";
import { PrepProgress } from "@/components/dashboard/interview-prep/PrepProgress";
import { PrepSetupCard } from "@/components/dashboard/interview-prep/PrepSetupCard";
import { QuestionBank } from "@/components/dashboard/interview-prep/QuestionBank";
import { ReadinessCard } from "@/components/dashboard/interview-prep/ReadinessCard";
import { SavedQuestions } from "@/components/dashboard/interview-prep/SavedQuestions";
import { INTERVIEW_QUESTIONS } from "@/data/interview-questions";
import {
  computePrepStats,
  computeReadiness,
  getQuestionById,
  mapExperienceToDifficulty,
  selectQuestionsForSession,
} from "@/lib/interview-prep";
import {
  createFeedback,
  getPrepServerSnapshot,
  getPrepSnapshot,
  recordMockInterview,
  recordPractice,
  removeSavedQuestion,
  subscribePrep,
  toggleSavedQuestion,
} from "@/lib/interview-prep-store";
import {
  getResumeAnalysesServerSnapshot,
  getResumeAnalysesSnapshot,
  subscribeResumeAnalyses,
} from "@/lib/resume-analysis-store";
import {
  getProfileServerSnapshot,
  getProfileSnapshot,
  subscribeProfile,
} from "@/lib/profile-settings-store";
import { createId } from "@/lib/utils";
import type {
  AnswerFeedback,
  InterviewQuestion,
  MockInterviewReport,
  PrepPhase,
  PrepSetup,
  QuestionBankFilter,
  QuestionCategory,
  QuestionDifficulty,
} from "@/types/interview-prep";

const DEFAULT_SETUP: PrepSetup = {
  role: "Frontend Developer",
  interviewType: "Technical",
  experienceLevel: "Mid Level",
  company: "",
  jobDescription: "",
};

export function InterviewPrepPage() {
  const searchParams = useSearchParams();
  const { applications, pushToast } = useDashboard();

  const prepState = useSyncExternalStore(
    subscribePrep,
    getPrepSnapshot,
    getPrepServerSnapshot,
  );
  const analyses = useSyncExternalStore(
    subscribeResumeAnalyses,
    getResumeAnalysesSnapshot,
    getResumeAnalysesServerSnapshot,
  );
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );

  const [phase, setPhase] = useState<PrepPhase>("overview");
  const [setup, setSetup] = useState<PrepSetup>(DEFAULT_SETUP);
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>(
    [],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [mockAnswers, setMockAnswers] = useState<
    Array<{ questionId: string; answer: string; feedback: AnswerFeedback }>
  >([]);
  const [mockReport, setMockReport] = useState<MockInterviewReport | null>(null);
  const [mockPaused, setMockPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [sessionMode, setSessionMode] = useState<"practice" | "mock">("practice");
  const [mockMeta, setMockMeta] = useState<{
    role: string;
    company?: string;
    interviewType: PrepSetup["interviewType"];
    difficulty: QuestionDifficulty;
  } | null>(null);
  const [bankCategory, setBankCategory] = useState<QuestionCategory | "All">(
    "All",
  );
  const [bankFilter, setBankFilter] = useState<QuestionBankFilter>("all");
  const [bankLoading, setBankLoading] = useState(true);
  const [prefillKey, setPrefillKey] = useState("");

  const resumeSkills = useMemo(() => {
    const latest = analyses[0];
    const fromAnalyzer = latest
      ? [...latest.skills.matched, ...latest.skills.skillsToHighlight]
      : [];
    return [...profile.skills, ...fromAnalyzer].filter(
      (skill, index, arr) =>
        arr.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) ===
        index,
    );
  }, [analyses, profile.skills]);

  const paramsKey = searchParams.toString();
  if (paramsKey !== prefillKey) {
    setPrefillKey(paramsKey);
    const role = searchParams.get("role");
    const company = searchParams.get("company");
    const jd = searchParams.get("jd");
    const type = searchParams.get("type");
    if (role || company || jd) {
      setSetup((current) => ({
        ...current,
        role: role?.trim() || current.role,
        company: company?.trim() || current.company,
        jobDescription: jd?.trim() || current.jobDescription,
        interviewType:
          type === "Behavioral" ||
          type === "HR" ||
          type === "System Design" ||
          type === "Mixed" ||
          type === "Technical"
            ? type
            : current.interviewType,
      }));
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setBankLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "mock-active" || mockPaused) return;
    const timer = window.setInterval(() => {
      setElapsedSec((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, mockPaused]);

  const scrollToQuestionBank = () => {
    window.setTimeout(() => {
      document.getElementById("question-bank")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };
  const stats = computePrepStats(prepState);
  const readiness = computeReadiness(prepState);
  const practicedIds = new Set(prepState.practiced.map((item) => item.questionId));
  const savedIds = new Set(prepState.saved.map((item) => item.questionId));

  const bankQuestions = INTERVIEW_QUESTIONS.filter((question) => {
    if (bankCategory !== "All" && question.category !== bankCategory) {
      return false;
    }
    if (bankFilter === "practiced") return practicedIds.has(question.id);
    if (bankFilter === "unanswered") return !practicedIds.has(question.id);
    if (bankFilter === "saved") return savedIds.has(question.id);
    return true;
  });

  const savedItems = prepState.saved
    .map((record) => {
      const question = getQuestionById(record.questionId);
      if (!question) return null;
      return { ...question, savedAt: record.savedAt };
    })
    .filter((item): item is InterviewQuestion & { savedAt: string } =>
      Boolean(item),
    );

  const upcomingApps = applications.filter(
    (app) => app.status === "Interview" || Boolean(app.followUpDate),
  );

  const currentQuestion = sessionQuestions[questionIndex] ?? null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const beginSession = (
    questions: InterviewQuestion[],
    nextPhase: PrepPhase,
    mode: "practice" | "mock",
    meta?: typeof mockMeta,
  ) => {
    setQuestionLoading(true);
    setSessionQuestions(questions);
    setQuestionIndex(0);
    setAnswer("");
    setShowHint(false);
    setFeedback(null);
    setMockAnswers([]);
    setMockReport(null);
    setElapsedSec(0);
    setMockPaused(false);
    setSessionMode(mode);
    if (meta) setMockMeta(meta);
    else setMockMeta(null);
    setPhase(nextPhase);
    window.setTimeout(() => setQuestionLoading(false), 500);
  };

  const startPreparation = () => {
    const questions = selectQuestionsForSession({
      ...setup,
      count: 10,
      resumeSkills,
      difficulty: mapExperienceToDifficulty(setup.experienceLevel),
    });
    beginSession(questions, "practice", "practice");
    pushToast({
      title: "Preparation started",
      description: `Demo session for ${setup.role}`,
    });
  };

  const startMockFromSetup = () => {
    setPhase("mock-setup");
  };

  const startMockInterview = () => {
    const difficulty = mapExperienceToDifficulty(setup.experienceLevel);
    const questions = selectQuestionsForSession({
      ...setup,
      count: 5,
      resumeSkills,
      difficulty,
    });
    beginSession(questions, "mock-active", "mock", {
      role: setup.role,
      company: setup.company || undefined,
      interviewType: setup.interviewType,
      difficulty,
    });
  };

  const practiceSingle = (question: InterviewQuestion) => {
    beginSession([question], "practice", "practice");
  };

  const submitAnswer = () => {
    if (!currentQuestion || answer.trim().length < 8) return;
    setFeedbackLoading(true);
    setPhase("feedback");
    window.setTimeout(() => {
      const nextFeedback = createFeedback(currentQuestion.id, answer);
      setFeedback(nextFeedback);
      setFeedbackLoading(false);
      if (sessionMode === "mock") {
        setMockAnswers((current) => [
          ...current.filter((item) => item.questionId !== currentQuestion.id),
          {
            questionId: currentQuestion.id,
            answer,
            feedback: nextFeedback,
          },
        ]);
      } else {
        recordPractice(currentQuestion.id, answer, nextFeedback);
      }
    }, 700);
  };

  const continueAfterFeedback = () => {
    if (sessionMode === "mock") {
      if (questionIndex < sessionQuestions.length - 1) {
        setQuestionIndex((value) => value + 1);
        setAnswer("");
        setShowHint(false);
        setFeedback(null);
        setPhase("mock-active");
        return;
      }
      finishMock();
      return;
    }

    if (questionIndex < sessionQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setAnswer("");
      setShowHint(false);
      setFeedback(null);
      setPhase("practice");
      return;
    }
    setPhase("overview");
    setSessionQuestions([]);
    setFeedback(null);
    pushToast({
      title: "Session complete",
      description: "Progress saved in this browser.",
    });
  };

  const finishMock = () => {
    if (!mockMeta) {
      setPhase("overview");
      return;
    }
    const report = recordMockInterview({
      id: createId("mock"),
      role: mockMeta.role,
      company: mockMeta.company,
      interviewType: mockMeta.interviewType,
      answers: mockAnswers,
    });
    setMockReport(report);
    setPhase("mock-results");
    setMockMeta(null);
    pushToast({
      title: "Mock interview complete",
      description: "Demo report ready to review.",
    });
  };

  const skipQuestion = () => {
    if (questionIndex < sessionQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setAnswer("");
      setShowHint(false);
      setFeedback(null);
      setPhase(sessionMode === "mock" ? "mock-active" : "practice");
      return;
    }
    if (sessionMode === "mock") {
      finishMock();
      return;
    }
    setPhase("overview");
    setSessionQuestions([]);
  };

  const handleToggleSave = (questionId: string) => {
    const saved = toggleSavedQuestion(questionId);
    pushToast({
      title: saved ? "Question saved" : "Removed from saved",
    });
  };

  const copySuggested = async () => {
    if (!feedback?.suggestedAnswer) return;
    try {
      await navigator.clipboard.writeText(feedback.suggestedAnswer);
      pushToast({ title: "Suggested answer copied" });
    } catch {
      pushToast({
        title: "Copy failed",
        description: "Clipboard permission was denied.",
      });
    }
  };

  // Active workspace phases
  if (phase === "practice" || phase === "mock-active") {
    if (!currentQuestion) {
      return (
        <div className="rounded-2xl border border-border bg-surface/80 p-8 text-center">
          <p className="text-sm text-muted">No questions available.</p>
          <button
            type="button"
            onClick={() => setPhase("overview")}
            className="mt-4 rounded-full border border-border px-4 py-2 text-sm"
          >
            Back
          </button>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {phase === "mock-active" ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm">
            <p className="text-muted">
              Mock interview · {setup.interviewType}
              {mockPaused ? " · Paused" : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMockPaused((value) => !value)}
                className="rounded-full border border-border px-3 py-1.5 text-muted hover:text-foreground"
              >
                {mockPaused ? "Resume" : "Pause Interview"}
              </button>
              <button
                type="button"
                onClick={finishMock}
                className="rounded-full border border-border px-3 py-1.5 text-muted hover:text-rose-300"
              >
                End Interview
              </button>
            </div>
          </div>
        ) : null}
        <PracticeWorkspace
          question={currentQuestion}
          index={questionIndex}
          total={sessionQuestions.length}
          answer={answer}
          showHint={showHint}
          loading={questionLoading}
          onAnswerChange={setAnswer}
          onToggleHint={() => setShowHint((value) => !value)}
          onSkip={skipQuestion}
          onSubmit={submitAnswer}
          onExit={() => {
            setPhase("overview");
            setSessionQuestions([]);
            setMockMeta(null);
            setSessionMode("practice");
            setFeedback(null);
          }}
          submitLabel="Submit Answer"
          timerLabel={
            phase === "mock-active" ? formatTimer(elapsedSec) : null
          }
        />
      </div>
    );
  }

  if (phase === "feedback") {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <AnswerFeedbackPanel
          feedback={
            feedback ?? {
              overall: 0,
              breakdown: {
                technicalAccuracy: 0,
                relevance: 0,
                structure: 0,
                clarity: 0,
                completeness: 0,
              },
              strengths: [],
              improvements: [],
              suggestedAnswer: "",
              isDemo: true,
            }
          }
          loading={feedbackLoading}
          onCopy={copySuggested}
          onTryAgain={() => {
            if (currentQuestion) {
              setMockAnswers((current) =>
                current.filter((item) => item.questionId !== currentQuestion.id),
              );
            }
            setFeedback(null);
            setPhase(sessionMode === "mock" ? "mock-active" : "practice");
          }}
          onContinue={continueAfterFeedback}
          continueLabel={
            questionIndex >= sessionQuestions.length - 1
              ? sessionMode === "mock"
                ? "View Results"
                : "Finish"
              : "Next Question"
          }
        />
      </div>
    );
  }

  if (phase === "mock-results" && mockReport) {
    return (
      <MockResults
        role={setup.role}
        company={setup.company || undefined}
        report={mockReport}
        onPracticeRecommended={() => {
          setBankCategory(
            setup.interviewType === "Behavioral" || setup.interviewType === "HR"
              ? "Behavioral"
              : "React",
          );
          setPhase("overview");
          scrollToQuestionBank();
        }}
        onStartAnother={() => setPhase("mock-setup")}
        onBack={() => setPhase("overview")}
      />
    );
  }

  if (phase === "mock-setup") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <PrepSetupCard
          setup={setup}
          onChange={setSetup}
          onStart={startMockInterview}
          resumeSkills={resumeSkills}
        />
        <button
          type="button"
          onClick={() => setPhase("overview")}
          className="text-sm text-muted hover:text-foreground"
        >
          Cancel mock interview
        </button>
      </div>
    );
  }

  // Overview
  return (
    <div className="space-y-8">
      <PrepHeader stats={stats} onStartMock={startMockFromSetup} />
      <ReadinessCard
        score={readiness.score}
        breakdown={readiness.breakdown}
        insight={readiness.insight}
      />

      {upcomingApps.length > 0 ? (
        <section className="rounded-2xl border border-border bg-surface/80 p-5">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Upcoming from Applications
          </h3>
          <p className="mt-1 text-sm text-muted">
            Jump into prep with role and company context prefilled.
          </p>
          <ul className="mt-4 space-y-2">
            {upcomingApps.slice(0, 4).map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-background/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-foreground">
                    {app.role} · {app.company}
                  </p>
                  <p className="text-xs text-muted-soft">
                    {app.status === "Interview" ? "Interview stage" : "Follow-up set"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSetup({
                      ...setup,
                      role: app.role,
                      company: app.company,
                      jobDescription: app.notes ?? "",
                    });
                    pushToast({
                      title: "Context loaded",
                      description: `${app.role} at ${app.company}`,
                    });
                  }}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
                >
                  Prepare for Interview
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PrepSetupCard
        setup={setup}
        onChange={setSetup}
        onStart={startPreparation}
        resumeSkills={resumeSkills}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <PrepProgress stats={stats} />
        <MockHistory
          history={prepState.mockHistory}
          onStartMock={startMockFromSetup}
        />
      </div>

      <div id="question-bank">
        <QuestionBank
          questions={bankQuestions}
          category={bankCategory}
          filter={bankFilter}
          practicedIds={practicedIds}
          savedIds={savedIds}
          loading={bankLoading}
          onCategoryChange={setBankCategory}
          onFilterChange={setBankFilter}
          onPractice={practiceSingle}
          onToggleSave={handleToggleSave}
        />
      </div>

      <SavedQuestions
        items={savedItems}
        onPractice={practiceSingle}
        onRemove={(id) => {
          removeSavedQuestion(id);
          pushToast({ title: "Removed from saved" });
        }}
        onBrowse={scrollToQuestionBank}
      />
    </div>
  );
}
