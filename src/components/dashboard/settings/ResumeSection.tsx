"use client";

import { Download, Eye, FileUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Modal } from "@/components/dashboard/Modal";
import { SectionShell } from "@/components/dashboard/settings/SettingsFormPrimitives";
import { formatDate } from "@/lib/utils";
import type { ProfileResumeMeta, UserProfile } from "@/types/profile-settings";

type ResumeSectionProps = {
  profile: UserProfile;
  onSave: (resume: ProfileResumeMeta | null) => void;
};

export function ResumeSection({ profile, onSave }: ResumeSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const resume = profile.resume;

  const handleUpload = (file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
    onSave({
      fileName: file.name,
      fileType: ext,
      uploadedAt: new Date().toISOString().slice(0, 10),
      lastAnalyzedAt: undefined,
      resumeScore: undefined,
      jobMatchScore: null,
    });
  };

  return (
    <SectionShell
      title="Resume"
      description="Primary resume for CareerOS. Connects to the AI Resume Analyzer."
      actions={
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
        >
          <FileUp className="h-3.5 w-3.5" />
          Upload New Resume
        </button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(event) => {
          handleUpload(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />

      {!resume ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm text-muted">No resume uploaded yet.</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e]"
          >
            + Upload New Resume
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-medium text-foreground">{resume.fileName}</p>
              <p className="mt-1 text-sm text-muted">
                {resume.fileType} · Uploaded {formatDate(resume.uploadedAt)}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-soft">
                <span>
                  Last analyzed:{" "}
                  {resume.lastAnalyzedAt
                    ? formatDate(resume.lastAnalyzedAt)
                    : "Not analyzed"}
                </span>
                {resume.resumeScore != null ? (
                  <span>Resume score: {resume.resumeScore}/100 (demo)</span>
                ) : null}
                {resume.jobMatchScore != null ? (
                  <span>Job match: {resume.jobMatchScore}% (demo)</span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted"
                onClick={() =>
                  window.alert(
                    "Document preview is not available in this demo. Use Resume Analyzer for analysis.",
                  )
                }
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted"
                onClick={() =>
                  window.alert(
                    "Download is not connected in demo mode. Your local file remains on your device.",
                  )
                }
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted"
              >
                Replace Resume
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>

          {!resume.lastAnalyzedAt ? (
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3">
              <p className="text-sm text-foreground">Analyze this resume</p>
              <p className="mt-1 text-xs text-muted">
                Open the AI Resume Analyzer to generate demo feedback for this
                file.
              </p>
              <Link
                href="/dashboard/resume-studio"
                className="mt-3 inline-flex rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-[#042f2e]"
              >
                Open Resume Analyzer
              </Link>
            </div>
          ) : (
            <Link
              href="/dashboard/resume-studio"
              className="mt-4 inline-flex text-sm text-accent-bright hover:underline"
            >
              View in Resume Analyzer →
            </Link>
          )}
        </div>
      )}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Remove resume?"
        description="This clears the resume metadata from your CareerOS demo profile. It does not delete files from your device."
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(null);
              setConfirmDelete(false);
            }}
            className="rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white"
          >
            Delete Resume
          </button>
        </div>
      </Modal>
    </SectionShell>
  );
}
