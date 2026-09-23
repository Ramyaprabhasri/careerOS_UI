"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/dashboard/Modal";
import {
  Field,
  SectionShell,
  TextArea,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import { createId } from "@/lib/utils";
import type {
  ProfileExperience,
  UserProfile,
} from "@/types/profile-settings";
import type { EmploymentType } from "@/types/dashboard";

const employmentTypes: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

type ExperienceSectionProps = {
  profile: UserProfile;
  onSave: (experience: ProfileExperience[]) => void;
};

const emptyExperience = (): ProfileExperience => ({
  id: createId("exp"),
  title: "",
  company: "",
  employmentType: "Full-time",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
  technologies: [],
  current: false,
});

export function ExperienceSection({
  profile,
  onSave,
}: ExperienceSectionProps) {
  const [items, setItems] = useState(profile.experience);
  const [editing, setEditing] = useState<ProfileExperience | null>(null);
  const [techInput, setTechInput] = useState("");

  const persist = (next: ProfileExperience[]) => {
    setItems(next);
    onSave(next);
  };

  const saveEditing = () => {
    if (!editing || !editing.title.trim() || !editing.company.trim()) return;
    const exists = items.some((item) => item.id === editing.id);
    const next = exists
      ? items.map((item) => (item.id === editing.id ? editing : item))
      : [editing, ...items];
    persist(next);
    setEditing(null);
    setTechInput("");
  };

  return (
    <SectionShell
      title="Experience"
      description="Timeline of roles you choose to share."
      actions={
        <button
          type="button"
          onClick={() => setEditing(emptyExperience())}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Experience
        </button>
      }
    >
      {items.length === 0 ? (
        <p className="text-sm text-muted">No experience added yet.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-5">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute top-2 -left-[1.4rem] h-2.5 w-2.5 rounded-full border border-accent bg-background" />
              <article className="rounded-xl border border-border bg-background/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted">
                      {item.company} · {item.employmentType}
                    </p>
                    <p className="mt-1 text-xs text-muted-soft">
                      {item.startDate || "—"} —{" "}
                      {item.current ? "Present" : item.endDate || "—"}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    ) : null}
                    {item.technologies.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}
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
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing && items.some((i) => i.id === editing.id) ? "Edit Experience" : "Add Experience"}
        wide
      >
        {editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Job title"
                value={editing.title}
                onChange={(event) =>
                  setEditing({ ...editing, title: event.target.value })
                }
              />
              <Field
                label="Company"
                value={editing.company}
                onChange={(event) =>
                  setEditing({ ...editing, company: event.target.value })
                }
              />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
                Employment type
              </span>
              <select
                value={editing.employmentType}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    employmentType: event.target.value as EmploymentType,
                  })
                }
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Start date"
                type="month"
                value={editing.startDate}
                onChange={(event) =>
                  setEditing({ ...editing, startDate: event.target.value })
                }
              />
              <Field
                label="End date"
                type="month"
                value={editing.endDate}
                disabled={editing.current}
                onChange={(event) =>
                  setEditing({ ...editing, endDate: event.target.value })
                }
              />
              <label className="flex items-end gap-2 pb-2.5 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={Boolean(editing.current)}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      current: event.target.checked,
                      endDate: event.target.checked ? "" : editing.endDate,
                    })
                  }
                />
                Current role
              </label>
            </div>
            <Field
              label="Location"
              value={editing.location}
              onChange={(event) =>
                setEditing({ ...editing, location: event.target.value })
              }
            />
            <TextArea
              label="Description"
              value={editing.description}
              onChange={(value) =>
                setEditing({ ...editing, description: value })
              }
            />
            <div>
              <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
                Technologies
              </p>
              <div className="mb-2 flex flex-wrap gap-2">
                {editing.technologies.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        technologies: editing.technologies.filter(
                          (item) => item !== tech,
                        ),
                      })
                    }
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                  >
                    {tech} ×
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={techInput}
                  onChange={(event) => setTechInput(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent/40"
                  placeholder="Add technology"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = techInput.trim();
                    if (!next) return;
                    setEditing({
                      ...editing,
                      technologies: [...editing.technologies, next],
                    });
                    setTechInput("");
                  }}
                  className="rounded-full border border-border px-3 py-2 text-sm text-muted"
                >
                  Add
                </button>
              </div>
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
                onClick={saveEditing}
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
