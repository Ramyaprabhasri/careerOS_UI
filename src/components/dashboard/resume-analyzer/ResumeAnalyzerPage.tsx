"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnalyzerHeader } from "./AnalyzerHeader";
import { AnalyzerMetricsStrip } from "./AnalyzerMetricsStrip";
import { AnalysisHistory } from "./AnalysisHistory";
import { AnalysisLoading } from "./AnalysisLoading";
import { AnalysisResults } from "./AnalysisResults";
import { ResumeUploadZone } from "./ResumeUploadZone";
import { TargetJobForm } from "./TargetJobForm";
import { useDashboard } from "../DashboardProvider";
import {
  getResumeAnalysesServerSnapshot,
  getResumeAnalysesSnapshot,
  subscribeResumeAnalyses,
  updateResumeAnalyses,
} from "@/lib/resume-analysis-store";
import { buildDemoAnalysis, computeAnalyzerMetrics } from "@/lib/resume-analyzer";
import type {
  AnalysisPhase,
  ResumeAnalysis,
  UploadedResumeMeta,
} from "@/types/resume-analyzer";

export function ResumeAnalyzerPage() {
  const { pushToast } = useDashboard();
  const analyses = useSyncExternalStore(
    subscribeResumeAnalyses,
    getResumeAnalysesSnapshot,
    getResumeAnalysesServerSnapshot,
  );

  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [resume, setResume] = useState<UploadedResumeMeta | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const analysisTimer = useRef<number | null>(null);
  const fileUrlRef = useRef<string | null>(null);

  useEffect(() => {
    fileUrlRef.current = fileUrl;
  }, [fileUrl]);

  useEffect(() => {
    return () => {
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
      if (analysisTimer.current) window.clearTimeout(analysisTimer.current);
    };
  }, []);

  const metrics = useMemo(
    () => computeAnalyzerMetrics(analyses),
    [analyses],
  );

  const resetComposer = useCallback(() => {
    if (analysisTimer.current) {
      window.clearTimeout(analysisTimer.current);
      analysisTimer.current = null;
    }
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = null;
    }
    setResume(null);
    setFileUrl(null);
    setUploadProgress(null);
    setUploadError(null);
    setJobTitle("");
    setCompany("");
    setJobDescription("");
    setJobUrl("");
    setActiveAnalysis(null);
    setErrorMessage(null);
    setPhase("idle");
  }, []);

  const handleFileAccepted = (
    _nextFile: File,
    meta: UploadedResumeMeta,
    url: string,
  ) => {
    if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
    setUploadError(null);
    setResume(meta);
    setFileUrl(url);
    fileUrlRef.current = url;
    setUploadProgress(0);
    setPhase("uploading");

    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 20;
      setUploadProgress(Math.min(progress, 100));
      if (progress >= 100) {
        window.clearInterval(timer);
        setPhase("ready");
        pushToast({
          title: "Resume ready",
          description: meta.name,
        });
      }
    }, 120);
  };

  const handleRemoveResume = () => {
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = null;
    }
    setResume(null);
    setFileUrl(null);
    setUploadProgress(null);
    setPhase("idle");
  };

  const runAnalysis = () => {
    if (!resume) return;
    setErrorMessage(null);
    setPhase("analyzing");

    analysisTimer.current = window.setTimeout(() => {
      try {
        if (Math.random() < 0.08) {
          throw new Error("Demo analysis failed. Please try again.");
        }

        const result = buildDemoAnalysis({
          resume,
          targetRole: jobTitle || "General career review",
          company,
          jobDescription,
          jobUrl,
        });

        updateResumeAnalyses((current) => [result, ...current]);
        setActiveAnalysis(result);
        setPhase("results");
        pushToast({
          title: "Demo analysis complete",
          description: "Results are simulated for this portfolio project.",
        });
      } catch (error) {
        setPhase("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong during analysis.",
        );
      }
    }, 4200);
  };

  const handleReanalyze = (analysis: ResumeAnalysis) => {
    setActiveAnalysis(null);
    setResume(analysis.resume);
    setJobTitle(
      analysis.targetRole === "General career review"
        ? ""
        : analysis.targetRole,
    );
    setCompany(analysis.company ?? "");
    setJobDescription(analysis.jobDescription ?? "");
    setJobUrl(analysis.jobUrl ?? "");
    setFileUrl(null);
    fileUrlRef.current = null;
    setUploadProgress(100);
    setPhase("ready");
    pushToast({
      title: "Ready to re-analyze",
      description: "Update the job details if needed, then run analysis again.",
    });
  };

  const handleDownload = () => {
    if (fileUrl && resume) {
      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = resume.name;
      anchor.click();
      return;
    }
    pushToast({
      title: "Original file unavailable",
      description:
        "This demo history entry no longer has the uploaded binary in memory.",
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      pushToast({
        title: "Copied",
        description: "Suggested rewrite copied to clipboard.",
      });
    } catch {
      pushToast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
      });
    }
  };

  const showComposer =
    phase === "idle" ||
    phase === "uploading" ||
    phase === "ready" ||
    phase === "error";

  return (
    <div className="space-y-5 lg:space-y-6">
      <AnalyzerHeader
        onNewAnalysis={resetComposer}
        showNewAnalysis={phase === "results" || phase === "analyzing"}
      />
      <AnalyzerMetricsStrip metrics={metrics} />

      {showComposer ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ResumeUploadZone
            resume={resume}
            fileUrl={fileUrl}
            uploadProgress={uploadProgress}
            onFileAccepted={handleFileAccepted}
            onRemove={handleRemoveResume}
            error={uploadError}
          />
          <TargetJobForm
            jobTitle={jobTitle}
            company={company}
            jobDescription={jobDescription}
            jobUrl={jobUrl}
            canAnalyze={Boolean(resume) && phase !== "uploading"}
            analyzing={false}
            onChange={(field, value) => {
              if (field === "jobTitle") setJobTitle(value);
              if (field === "company") setCompany(value);
              if (field === "jobDescription") setJobDescription(value);
              if (field === "jobUrl") setJobUrl(value);
            }}
            onAnalyze={runAnalysis}
          />
        </div>
      ) : null}

      {phase === "analyzing" ? (
        <AnalysisLoading
          hasJobDescription={Boolean(jobDescription.trim())}
          onCancel={() => {
            if (analysisTimer.current) {
              window.clearTimeout(analysisTimer.current);
              analysisTimer.current = null;
            }
            setPhase(resume ? "ready" : "idle");
          }}
        />
      ) : null}

      {phase === "error" ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 px-5 py-6">
          <p className="font-display text-lg font-semibold text-foreground">
            Analysis failed
          </p>
          <p className="mt-2 text-sm text-muted">
            {errorMessage ?? "Unable to complete the demo analysis."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runAnalysis}
              disabled={!resume}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e] disabled:opacity-40"
            >
              Retry analysis
            </button>
            <button
              type="button"
              onClick={resetComposer}
              className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
            >
              Start over
            </button>
          </div>
        </div>
      ) : null}

      {phase === "results" && activeAnalysis ? (
        <AnalysisResults
          analysis={activeAnalysis}
          fileUrl={fileUrl}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      ) : null}

      <AnalysisHistory
        analyses={analyses}
        onView={(analysis) => {
          setActiveAnalysis(analysis);
          setResume(analysis.resume);
          setPhase("results");
          setFileUrl(null);
          fileUrlRef.current = null;
        }}
        onReanalyze={handleReanalyze}
        onDelete={(id) => {
          updateResumeAnalyses((current) =>
            current.filter((item) => item.id !== id),
          );
          if (activeAnalysis?.id === id) {
            setActiveAnalysis(null);
            setPhase(resume ? "ready" : "idle");
          }
          pushToast({
            title: "Analysis deleted",
            description: "Removed from local demo history.",
          });
        }}
      />
    </div>
  );
}
