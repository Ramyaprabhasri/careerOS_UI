"use client";

import { FileText, Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  ACCEPTED_EXTENSIONS,
  formatFileSize,
  MAX_RESUME_BYTES,
  validateResumeFile,
} from "@/lib/resume-analyzer";
import { cn, createId } from "@/lib/utils";
import type { UploadedResumeMeta } from "@/types/resume-analyzer";

type ResumeUploadZoneProps = {
  resume: UploadedResumeMeta | null;
  fileUrl: string | null;
  uploadProgress: number | null;
  onFileAccepted: (file: File, meta: UploadedResumeMeta, url: string) => void;
  onRemove: () => void;
  error?: string | null;
};

export function ResumeUploadZone({
  resume,
  fileUrl,
  uploadProgress,
  onFileAccepted,
  onRemove,
  error,
}: ResumeUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const validationError = validateResumeFile(file);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      setLocalError(null);
      const url = URL.createObjectURL(file);
      const meta: UploadedResumeMeta = {
        id: createId("resume"),
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
      };
      onFileAccepted(file, meta, url);
    },
    [onFileAccepted],
  );

  return (
    <section className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Start with your resume
      </h3>
      <p className="mt-1 text-sm text-muted">
        Upload a PDF or DOCX to begin a demo analysis.
      </p>

      {!resume ? (
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-12 text-center transition-colors",
            dragging
              ? "border-accent/50 bg-accent/[0.06]"
              : "border-border bg-background/40 hover:border-border-strong",
          )}
        >
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-105">
            <Upload className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-foreground">
            Drag and drop your resume
          </p>
          <p className="mt-1 text-xs text-muted">
            PDF or DOCX · up to {formatFileSize(MAX_RESUME_BYTES)}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
          >
            Browse Files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-background/50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {resume.name}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {formatFileSize(resume.size)}
                {fileUrl ? " · Ready for demo analysis" : ""}
              </p>
              {uploadProgress !== null && uploadProgress < 100 ? (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-rose-300"
              aria-label="Remove resume"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border-strong"
            >
              Replace Resume
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </div>
        </div>
      )}

      {(localError || error) && (
        <p className="mt-3 text-xs text-rose-300">{localError || error}</p>
      )}
    </section>
  );
}
