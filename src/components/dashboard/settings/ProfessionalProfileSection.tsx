"use client";

import { X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ROLE_OPTIONS } from "@/data/profile-seed";
import {
  ChipSelect,
  Field,
  SaveButton,
  SectionShell,
  TextArea,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import type { UserProfile } from "@/types/profile-settings";

type ProfessionalProfileSectionProps = {
  profile: UserProfile;
  onSave: (patch: Partial<UserProfile>) => void;
};

export function ProfessionalProfileSection({
  profile,
  onSave,
}: ProfessionalProfileSectionProps) {
  const [about, setAbout] = useState(profile.about);
  const [currentRole, setCurrentRole] = useState(profile.currentRole);
  const [yearsExperience, setYearsExperience] = useState(
    profile.yearsExperience,
  );
  const [preferredRoles, setPreferredRoles] = useState(profile.preferredRoles);
  const [skills, setSkills] = useState(profile.skills);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleRole = (role: string) => {
    setPreferredRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  };

  const addSkill = () => {
    const next = skillInput.trim();
    if (!next) return;
    if (skills.some((skill) => skill.toLowerCase() === next.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((current) => [...current, next]);
    setSkillInput("");
  };

  const moveSkill = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;
    setSkills((current) => {
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      onSave({
        about: about.trim(),
        currentRole: currentRole.trim(),
        yearsExperience,
        preferredRoles,
        skills,
      });
      setSaving(false);
    }, 350);
  };

  return (
    <SectionShell
      title="Professional Profile"
      description="Summary, roles, and skills you explicitly add — nothing is invented."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextArea
          label="About Me"
          value={about}
          onChange={setAbout}
          rows={5}
          placeholder="A concise professional summary…"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Current Role"
            value={currentRole}
            onChange={(event) => setCurrentRole(event.target.value)}
          />
          <label className="block">
            <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-muted uppercase">
              Years of Experience
            </span>
            <select
              value={yearsExperience}
              onChange={(event) => setYearsExperience(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
            >
              {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Preferred Roles
          </p>
          <ChipSelect
            options={ROLE_OPTIONS}
            selected={preferredRoles}
            onToggle={toggleRole}
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.14em] text-muted uppercase">
            Skills
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-sm text-foreground"
              >
                <button
                  type="button"
                  aria-label={`Move ${skill} earlier`}
                  onClick={() => moveSkill(index, -1)}
                  className="px-0.5 text-muted-soft hover:text-foreground"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${skill} later`}
                  onClick={() => moveSkill(index, 1)}
                  className="px-0.5 text-muted-soft hover:text-foreground"
                >
                  ↓
                </button>
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() =>
                    setSkills((current) =>
                      current.filter((item) => item !== skill),
                    )
                  }
                  className="ml-0.5 text-muted hover:text-rose-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill you actually have"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/40"
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
            >
              Add
            </button>
          </div>
        </div>

        <SaveButton saving={saving} />
      </form>
    </SectionShell>
  );
}
