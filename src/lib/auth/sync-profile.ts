import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/db/prisma";

function deriveFullName(user: SupabaseUser): string {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.fullName === "string" && meta.fullName) ||
    [meta.first_name, meta.last_name].filter((part) => typeof part === "string").join(" ");

  if (fromMeta.trim()) {
    return fromMeta.trim();
  }

  return user.email?.split("@")[0] ?? "";
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

/**
 * Ensures a minimal Prisma Profile exists for the authenticated user.
 * Race-safe when multiple dashboard requests call requireUser() at once.
 */
export async function syncProfile(user: SupabaseUser) {
  const fullName = deriveFullName(user);

  const existing = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    return existing;
  }

  try {
    return await prisma.profile.create({
      data: {
        userId: user.id,
        fullName,
        headline: "",
        location: "",
      },
    });
  } catch (error) {
    // Concurrent create: another request won the race.
    if (isUniqueConstraintError(error)) {
      const raced = await prisma.profile.findUnique({
        where: { userId: user.id },
      });
      if (raced) {
        return raced;
      }
    }
    throw error;
  }
}
