"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatFileSize } from "@/lib/resume-analyzer";
import { cn } from "@/lib/utils";
import type {
  ResumeAnalysis,
  ResumeRecommendation,
} from "@/types/resume-analyzer";

type AnalysisResultsProps = {
  analysis: ResumeAnalysis;
  fileUrl: string | null;
  onCopy: (text: string) => void;
  onDownload: () => void;
};

export function AnalysisResults({
  analysis,
  fileUrl,
  onCopy,
  onDownload,
}: AnalysisResultsProps) {
  const [activeRecommendation, setActiveRecommendation] =
    useState<ResumeRecommendation | null>(null);

  return (
    <div className="space-y-5">
      <div className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[11px] text-accent-bright">
        Demo results — simulated analysis for portfolio demonstration. Not a
        live AI or validated ATS prediction.
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ScoreOverview analysis={analysis} />
        <ResumePreviewPanel
          analysis={analysis}
          fileUrl={fileUrl}
          onDownload={onDownload}
        />
      </div>

      {analysis.jobMatch ? <JobMatchSection analysis={analysis} /> : null}

      <SkillsSection analysis={analysis} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <StrengthsSection analysis={analysis} />
        <ImprovementsSection
          analysis={analysis}
          onImprove={setActiveRecommendation}
        />
      </div>

      <ImprovementPanel
        recommendation={activeRecommendation}
        onClose={() => setActiveRecommendation(null)}
        onCopy={onCopy}
      />
    </div>
  );
}

function ScoreOverview({ analysis }: { analysis: ResumeAnalysis }) {
  const circumference = 2 * Math.PI * 54;
  const offset =
    circumference - (analysis.overallScore / 100) * circumference;

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-3xl font-semibold text-foreground">
              {analysis.overallScore}
            </p>
            <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
              / 100
            </p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.16em] text-muted uppercase">
            Resume Score
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {analysis.overallScore}/100
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {analysis.summary}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {analysis.categoryScores.map((category) => (
          <div key={category.id}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground">{category.label}</span>
              <span className="text-muted">{category.score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn(
                  "h-full rounded-full",
                  category.score >= 85
                    ? "bg-accent"
                    : category.score >= 75
                      ? "bg-sky-400"
                      : "bg-amber-300/80",
                )}
                style={{ width: `${category.score}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-soft">{category.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function JobMatchSection({ analysis }: { analysis: ResumeAnalysis }) {
  const match = analysis.jobMatch!;
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-muted uppercase">
            Job Match
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
            {match.score}%
          </h3>
          <p className="mt-1 text-sm text-muted">
            Demo match for {analysis.targetRole}
            {analysis.company ? ` · ${analysis.company}` : ""}
          </p>
        </div>
      </div>
      <p className="mt-3 rounded-xl border border-border bg-background/40 px-3 py-2 text-xs text-muted">
        {match.keywordAlignmentNote}
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChipGroup title="Matching skills" items={match.matchingSkills} tone="accent" />
        <ChipGroup
          title="Missing / underrepresented keywords"
          items={match.missingKeywords}
          tone="warn"
        />
        <ChipGroup
          title="Relevant experience themes"
          items={match.relevantExperience}
          tone="neutral"
        />
      </div>
    </section>
  );
}

function SkillsSection({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Skills analysis
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChipGroup
          title="Matched Skills"
          items={analysis.skills.matched}
          tone="accent"
        />
        <ChipGroup
          title="Suggested Keywords"
          items={analysis.skills.suggestedKeywords}
          tone="warn"
        />
        <ChipGroup
          title="Skills to Highlight"
          items={analysis.skills.skillsToHighlight}
          tone="neutral"
        />
      </div>
    </section>
  );
}

function StrengthsSection({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Resume strengths
      </h3>
      <ul className="mt-4 space-y-3">
        {analysis.strengths.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-xl border border-border bg-background/40 p-3.5"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ImprovementsSection({
  analysis,
  onImprove,
}: {
  analysis: ResumeAnalysis;
  onImprove: (item: ResumeRecommendation) => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Areas to improve
      </h3>
      <ul className="mt-4 space-y-3">
        {analysis.recommendations.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-border bg-background/40 p-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{item.issue}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-[10px]",
                  item.priority === "High" &&
                    "border-accent/30 bg-accent/10 text-accent-bright",
                  item.priority === "Medium" &&
                    "border-border text-muted",
                  item.priority === "Low" &&
                    "border-border text-muted-soft",
                )}
              >
                {item.priority}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              <span className="text-foreground/80">Why it matters:</span>{" "}
              {item.whyItMatters}
            </p>
            <p className="mt-1.5 text-xs text-muted">
              <span className="text-foreground/80">Suggested:</span>{" "}
              {item.suggestedImprovement}
            </p>
            <button
              type="button"
              onClick={() => onImprove(item)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent hover:opacity-80"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Improve This Section
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResumePreviewPanel({
  analysis,
  fileUrl,
  onDownload,
}: {
  analysis: ResumeAnalysis;
  fileUrl: string | null;
  onDownload: () => void;
}) {
  const isPdf =
    analysis.resume.type === "application/pdf" ||
    analysis.resume.name.toLowerCase().endsWith(".pdf");

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Resume preview
          </h3>
          <p className="mt-1 text-xs text-muted">{analysis.resume.name}</p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border-strong"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>

      {fileUrl && isPdf ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
          <iframe
            title="Resume preview"
            src={fileUrl}
            className="h-[360px] w-full"
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-background/50 px-4 py-10 text-center">
          <FileText className="mx-auto h-6 w-6 text-muted-soft" />
          <p className="mt-3 text-sm text-foreground">Document summary</p>
          <p className="mt-1 text-xs text-muted">
            {formatFileSize(analysis.resume.size)} ·{" "}
            {analysis.resume.type || "Document"}
          </p>
          <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-muted-soft">
            Inline preview is available for PDFs in supported browsers. DOCX
            files remain downloadable for review.
          </p>
        </div>
      )}
    </section>
  );
}

function ChipGroup({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "warn" | "neutral";
}) {
  const styles = {
    accent: "border-accent/25 bg-accent/10 text-accent-bright",
    warn: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    neutral: "border-border bg-white/[0.03] text-muted",
  };

  return (
    <div>
      <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px]",
              styles[tone],
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImprovementPanel({
  recommendation,
  onClose,
  onCopy,
}: {
  recommendation: ResumeRecommendation | null;
  onClose: () => void;
  onCopy: (text: string) => void;
}) {
  useEffect(() => {
    if (!recommendation) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [recommendation, onClose]);

  return (
    <AnimatePresence>
      {recommendation ? (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-black/55"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-border bg-background-elevated"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-muted uppercase">
                  Suggested rewrite
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                  Improve this section
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border p-2 text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <p className="text-sm text-muted">{recommendation.issue}</p>
              <div className="rounded-xl border border-border bg-surface/70 p-4">
                <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
                  Original
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  {recommendation.originalSnippet}
                </p>
              </div>
              <div className="rounded-xl border border-accent/25 bg-accent/10 p-4">
                <p className="text-[10px] tracking-[0.14em] text-accent-bright uppercase">
                  Suggested rewrite
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {recommendation.suggestedRewrite}
                </p>
              </div>
              <p className="text-xs text-muted-soft">
                Copy the suggestion into your editor manually. CareerOS does not
                overwrite your original resume.
              </p>
            </div>
            <footer className="border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={() => onCopy(recommendation.suggestedRewrite)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#042f2e]"
              >
                <Copy className="h-4 w-4" />
                Copy suggested rewrite
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
