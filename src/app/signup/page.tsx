import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(94,234,212,0.12),transparent_55%)]"
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-[0.22em] text-foreground uppercase"
          >
            CareerOS
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Start tracking your career progress.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-bright">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
