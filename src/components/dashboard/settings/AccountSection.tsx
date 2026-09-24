"use client";

import { useState } from "react";
import { Modal } from "@/components/dashboard/Modal";
import {
  Field,
  SectionShell,
} from "@/components/dashboard/settings/SettingsFormPrimitives";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/types/profile-settings";

type AccountSectionProps = {
  profile: UserProfile;
  onPasswordUpdated: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
};

export function AccountSection({
  profile,
  onPasswordUpdated,
  onSignOut,
  onDeleteAccount,
}: AccountSectionProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  return (
    <div className="space-y-5">
      <SectionShell
        title="Account"
        description="Manage your CareerOS account session."
      >
        <div className="space-y-4">
          <Field label="Email" value={profile.email} readOnly />
          <div className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm">
            <p className="text-muted">Password</p>
            <p className="mt-1 text-foreground">••••••••</p>
            <button
              type="button"
              onClick={() => setPasswordOpen(true)}
              className="mt-3 rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
            >
              Change Password
            </button>
          </div>
          <div className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm">
            <p className="text-muted">Connected accounts</p>
            <p className="mt-1 text-foreground">None connected in demo mode</p>
          </div>
          <p className="text-xs text-muted-soft">
            Account created {formatDate(profile.accountCreatedAt)}
          </p>
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            Sign Out
          </button>
        </div>
      </SectionShell>

      <section className="rounded-2xl border border-rose-400/30 bg-rose-500/[0.06] p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Delete Account
        </h3>
        <p className="mt-1 text-sm text-muted">
          Demo only — clears local CareerOS data in this browser. No remote
          account is deleted.
        </p>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="mt-4 rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
        >
          Delete Account
        </button>
      </section>

      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Change Password"
        description="Simulated for this demo. No credentials are stored."
      >
        <div className="space-y-3">
          <Field
            label="Current password"
            type="password"
            value={passwordDraft.current}
            onChange={(event) =>
              setPasswordDraft((current) => ({
                ...current,
                current: event.target.value,
              }))
            }
          />
          <Field
            label="New password"
            type="password"
            value={passwordDraft.next}
            onChange={(event) =>
              setPasswordDraft((current) => ({
                ...current,
                next: event.target.value,
              }))
            }
          />
          <Field
            label="Confirm password"
            type="password"
            value={passwordDraft.confirm}
            onChange={(event) =>
              setPasswordDraft((current) => ({
                ...current,
                confirm: event.target.value,
              }))
            }
            error={passwordError}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPasswordOpen(false)}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (passwordDraft.next.length < 8) {
                  setPasswordError("Use at least 8 characters.");
                  return;
                }
                if (passwordDraft.next !== passwordDraft.confirm) {
                  setPasswordError("Passwords do not match.");
                  return;
                }
                setPasswordError("");
                setPasswordOpen(false);
                setPasswordDraft({ current: "", next: "", confirm: "" });
                onPasswordUpdated();
              }}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e]"
            >
              Update Password
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title="Sign out?"
        description="You will be signed out and returned to the login page."
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setSignOutOpen(false)}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setSignOutOpen(false);
              onSignOut();
            }}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#042f2e]"
          >
            Sign Out
          </button>
        </div>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete demo account data?"
        description="This clears CareerOS localStorage data in this browser. It cannot be undone."
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteOpen(false)}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteOpen(false);
              onDeleteAccount();
            }}
            className="rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white"
          >
            Clear Local Data
          </button>
        </div>
      </Modal>
    </div>
  );
}
