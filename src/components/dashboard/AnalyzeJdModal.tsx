"use client";

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { useDashboard } from "./DashboardProvider";
import { Modal } from "./Modal";

type AnalyzeJdModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AnalyzeJdModal({ open, onClose }: AnalyzeJdModalProps) {
  const { pushToast } = useDashboard();
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const jd = String(form.get("jd") ?? "").trim();

    if (jd.length < 40) {
      setError("Paste a job description with at least 40 characters.");
      setResult(null);
      return;
    }

    setError("");
    const keywords = [
      "TypeScript",
      "React",
      "design systems",
      "system design",
      "collaboration",
    ].filter((keyword) => jd.toLowerCase().includes(keyword.toLowerCase()));

    const summary =
      keywords.length > 0
        ? `This role emphasizes ${keywords.join(", ")}. Highlight matching projects and quantify impact in your application narrative.`
        : "This role favors product-minded builders. Emphasize cross-functional collaboration, craft quality, and measurable outcomes in your materials.";

    setResult(summary);
    pushToast({
      title: "JD analyzed",
      description: "Demo insight generated from your pasted description.",
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setResult(null);
        setError("");
        onClose();
      }}
      title="Analyze a job description"
      description="Paste a JD to generate a demo readiness insight for this portfolio project."
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.12em] text-muted uppercase">
            Job description
          </label>
          <textarea
            name="jd"
            rows={8}
            placeholder="Paste the job description here..."
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
          {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
        </div>

        {result ? (
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-accent-bright">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs tracking-[0.14em] uppercase">Demo insight</p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{result}</p>
          </div>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            Close
          </button>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e] transition-transform hover:-translate-y-0.5"
          >
            Analyze JD
          </button>
        </div>
      </form>
    </Modal>
  );
}
