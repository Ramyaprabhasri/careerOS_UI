"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/dashboard/Modal";
import {
  Field,
  SectionShell,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import { createId } from "@/lib/utils";
import type { ProfileEducation, UserProfile } from "@/types/profile-settings";

type EducationSectionProps = {
  profile: UserProfile;
  onSave: (education: ProfileEducation[]) => void;
};

const emptyEducation = (): ProfileEducation => ({
  id: createId("edu"),
  degree: "",
  institution: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
});

export function EducationSection({ profile, onSave }: EducationSectionProps) {
  const [items, setItems] = useState(profile.education);
  const [editing, setEditing] = useState<ProfileEducation | null>(null);

  const persist = (next: ProfileEducation[]) => {
    setItems(next);
    onSave(next);
  };

  return (
    <SectionShell
      title="Education"
      description="Keep credentials compact and accurate."
      actions={
        <button
          type="button"
          onClick={() => setEditing(emptyEducation())}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Education
        </button>
      }
    >
      {items.length === 0 ? (
        <p className="text-sm text-muted">No education entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {item.degree}
                  {item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}
                </p>
                <p className="text-sm text-muted">{item.institution}</p>
                <p className="mt-1 text-xs text-muted-soft">
                  {item.startYear || "—"} – {item.endYear || "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    persist(items.filter((entry) => entry.id !== item.id))
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:text-rose-300"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Education"
      >
        {editing ? (
          <div className="space-y-4">
            <Field
              label="Degree"
              value={editing.degree}
              onChange={(event) =>
                setEditing({ ...editing, degree: event.target.value })
              }
            />
            <Field
              label="Institution"
              value={editing.institution}
              onChange={(event) =>
                setEditing({ ...editing, institution: event.target.value })
              }
            />
            <Field
              label="Field of Study"
              value={editing.fieldOfStudy}
              onChange={(event) =>
                setEditing({ ...editing, fieldOfStudy: event.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Start Year"
                value={editing.startYear}
                onChange={(event) =>
                  setEditing({ ...editing, startYear: event.target.value })
                }
              />
              <Field
                label="End Year"
                value={editing.endYear}
                onChange={(event) =>
                  setEditing({ ...editing, endYear: event.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editing.degree.trim() || !editing.institution.trim()) {
                    return;
                  }
                  const exists = items.some((item) => item.id === editing.id);
                  persist(
                    exists
                      ? items.map((item) =>
                          item.id === editing.id ? editing : item,
                        )
                      : [editing, ...items],
                  );
                  setEditing(null);
                }}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e]"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </SectionShell>
  );
}
