import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { syncProfile } from "@/lib/auth/sync-profile";

/** Inferred from Prisma Client — avoids fragile named exports from @prisma/client. */
type PrismaUser = Awaited<ReturnType<typeof prisma.user.findUniqueOrThrow>>;

export class UnauthorizedError extends Error {
  readonly code = "UNAUTHORIZED" as const;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export type AuthenticatedUser = {
  authUser: SupabaseUser;
  user: PrismaUser;
};

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ensures a Prisma User row exists for the Supabase auth identity.
 * Handles concurrent first-login races on both `id` and `email` uniques.
 */
async function upsertAppUser(authUser: SupabaseUser): Promise<PrismaUser> {
  if (!authUser.email) {
    throw new UnauthorizedError("Authenticated user is missing an email");
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const existingById = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (existingById) {
      const user =
        existingById.email === authUser.email
          ? existingById
          : await prisma.user.update({
              where: { id: authUser.id },
              data: { email: authUser.email },
            });

      await syncProfile(authUser);
      return user;
    }

    try {
      const user = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email,
        },
      });
      await syncProfile(authUser);
      return user;
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }

      // Concurrent insert may not be visible yet, or conflict is on email.
      const byId = await prisma.user.findUnique({
        where: { id: authUser.id },
      });
      if (byId) {
        await syncProfile(authUser);
        return byId;
      }

      const byEmail = await prisma.user.findUnique({
        where: { email: authUser.email },
      });

      if (byEmail?.id === authUser.id) {
        await syncProfile(authUser);
        return byEmail;
      }

      if (byEmail && byEmail.id !== authUser.id) {
        // Stale Prisma row with same email but different auth id.
        await prisma.user.delete({ where: { id: byEmail.id } });
        continue;
      }

      await sleep(25 * (attempt + 1));
    }
  }

  throw new Error("Could not synchronize application user record");
}

export async function getAuthUser(): Promise<SupabaseUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Requires an authenticated Supabase session, upserts Prisma User + Profile,
 * and returns both identities. Safe for protected pages and future API routes.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const authUser = await getAuthUser();

  if (!authUser) {
    throw new UnauthorizedError();
  }

  const user = await upsertAppUser(authUser);

  return { authUser, user };
}
