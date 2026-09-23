"use client";

import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";
import type { ResumeAnalysis } from "@/types/resume-analyzer";

type AnalysisHistoryProps = {
  analyses: ResumeAnalysis[];
  onView: (analysis: ResumeAnalysis) => void;
  onReanalyze: (analysis: ResumeAnalysis) => void;
  onDelete: (id: string) => void;
};

export function AnalysisHistory({
  analyses,
  onView,
  onReanalyze,
  onDelete,
}: AnalysisHistoryProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return analyses;
    return analyses.filter((item) => {
      const haystack =
        `${item.resume.name} ${item.targetRole} ${item.company ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [analyses, query]);

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Previous Analyses
          </h3>
          <p className="mt-1 text-sm text-muted">
            Demo history stored locally in this browser.
          </p>
        </div>
        <label className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-soft" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resume or role"
            className="w-full rounded-full border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-soft focus:border-accent/40"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm text-muted">No previous analyses yet.</p>
          <p className="mt-1 text-xs text-muted-soft">
            Run your first demo analysis to populate this list.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/50 text-[10px] tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Resume</th>
                  <th className="px-4 py-3 font-medium">Target Role</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Match</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-4 py-3.5 text-foreground">
                      {item.resume.name}
                    </td>
                    <td className="px-4 py-3.5 text-muted">{item.targetRole}</td>
                    <td className="px-4 py-3.5 text-muted">
                      {item.company ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-accent-bright">
                      {item.overallScore}
                    </td>
                    <td className="px-4 py-3.5 text-muted">
                      {item.jobMatch ? `${item.jobMatch.score}%` : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-muted-soft">
                      {formatDate(item.createdAt.slice(0, 10))}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="text-xs text-accent hover:opacity-80"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => onReanalyze(item)}
                          className="text-xs text-muted hover:text-foreground"
                        >
                          Re-analyze
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="text-xs text-rose-300 hover:opacity-80"
                          aria-label="Delete analysis"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-background/40 p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {item.resume.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {item.targetRole}
                  {item.company ? ` · ${item.company}` : ""}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-soft">
                  <span>Score {item.overallScore}</span>
                  <span>{formatDate(item.createdAt.slice(0, 10))}</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    className="text-xs text-accent"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onReanalyze(item)}
                    className="text-xs text-muted"
                  >
                    Re-analyze
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="text-xs text-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
