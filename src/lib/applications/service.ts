import type { Prisma } from "@prisma/client";
import { defaultTimeline } from "@/lib/applications";
import { NotFoundError } from "@/lib/api/errors";
import { prisma } from "@/lib/db/prisma";
import {
  applicationInclude,
  mapApplication,
  parseDateOnly,
  toPrismaEmploymentType,
  type ApplicationWithRelations,
} from "@/lib/applications/mappers";
import type {
  CreateApplicationInput,
  ListApplicationsQuery,
  UpdateApplicationInput,
} from "@/lib/applications/validators";
import type { Application, ApplicationStatus, TimelineEvent } from "@/types/dashboard";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function uniqueTags(tags: string[] | undefined) {
  if (!tags) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const cleaned = tag.trim();
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    result.push(cleaned);
  }
  return result;
}

function timelineCreateData(events: TimelineEvent[]) {
  return events.map((event, index) => ({
    label: event.label,
    completed: event.completed,
    sortOrder: index,
    ...(event.date ? { date: parseDateOnly(event.date) } : {}),
  }));
}

function normalizeTimelineEvents(
  events: Array<{
    id?: string;
    label: string;
    date?: string | null;
    completed: boolean;
  }>,
): TimelineEvent[] {
  return events.map((event, index) => ({
    id: event.id ?? `tl-${index}`,
    label: event.label,
    ...(event.date ? { date: event.date } : {}),
    completed: event.completed,
  }));
}

async function getOwnedApplication(userId: string, applicationId: string) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: applicationInclude,
  });

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  return application as ApplicationWithRelations;
}

export async function listApplications(
  userId: string,
  filters: ListApplicationsQuery = {},
): Promise<Application[]> {
  const where: {
    userId: string;
    status?: ApplicationStatus;
    OR?: Array<{
      company?: { contains: string; mode: "insensitive" };
      role?: { contains: string; mode: "insensitive" };
      location?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    userId,
    ...(filters.status ? { status: filters.status } : {}),
  };

  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { company: { contains: q, mode: "insensitive" } },
      { role: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const applications = await prisma.application.findMany({
    where,
    include: applicationInclude,
    orderBy: [{ updatedAt: "desc" }, { dateApplied: "desc" }],
  });

  return (applications as ApplicationWithRelations[]).map(mapApplication);
}

export async function getApplication(
  userId: string,
  applicationId: string,
): Promise<Application> {
  const application = await getOwnedApplication(userId, applicationId);
  return mapApplication(application);
}

export async function createApplication(
  userId: string,
  input: CreateApplicationInput,
): Promise<Application> {
  const status = input.status ?? "Applied";
  const dateApplied = parseDateOnly(input.dateApplied ?? todayIso());
  const timeline = normalizeTimelineEvents(
    input.timeline ?? defaultTimeline(status),
  );
  const tags = uniqueTags(input.tags);

  const created = await prisma.application.create({
    data: {
      userId,
      company: input.company,
      role: input.role,
      location: input.location,
      dateApplied,
      status,
      matchScore: input.matchScore ?? 80,
      notes: input.notes ?? null,
      salaryRange: input.salaryRange ?? null,
      source: input.source ?? "Manual",
      jobUrl: input.jobUrl || null,
      workMode: input.workMode,
      employmentType: toPrismaEmploymentType(input.employmentType),
      priority: input.priority ?? "Medium",
      resumeUsed: input.resumeUsed ?? null,
      followUpDate: input.followUpDate
        ? parseDateOnly(input.followUpDate)
        : null,
      tags: {
        create: tags.map((label) => ({ label })),
      },
      timeline: {
        create: timelineCreateData(timeline),
      },
    },
    include: applicationInclude,
  });

  return mapApplication(created as ApplicationWithRelations);
}

export async function updateApplication(
  userId: string,
  applicationId: string,
  input: UpdateApplicationInput,
): Promise<Application> {
  const existing = await getOwnedApplication(userId, applicationId);

  const explicitTimeline = input.timeline !== undefined;
  const statusChanged =
    input.status !== undefined && input.status !== existing.status;
  const regeneratedTimeline =
    statusChanged && !explicitTimeline
      ? defaultTimeline(input.status!)
      : undefined;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (input.tags !== undefined) {
      const tags = uniqueTags(input.tags);
      await tx.applicationTag.deleteMany({ where: { applicationId } });
      if (tags.length > 0) {
        await tx.applicationTag.createMany({
          data: tags.map((label) => ({ applicationId, label })),
        });
      }
    }

    const timelineToWrite = explicitTimeline
      ? normalizeTimelineEvents(input.timeline!)
      : regeneratedTimeline;

    if (timelineToWrite) {
      await tx.applicationTimelineEvent.deleteMany({
        where: { applicationId },
      });
      if (timelineToWrite.length > 0) {
        await tx.applicationTimelineEvent.createMany({
          data: timelineToWrite.map((event, index) => ({
            applicationId,
            label: event.label,
            completed: event.completed,
            sortOrder: index,
            ...(event.date ? { date: parseDateOnly(event.date) } : {}),
          })),
        });
      }
    }

    return tx.application.update({
      where: { id: applicationId },
      data: {
        ...(input.company !== undefined ? { company: input.company } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.dateApplied !== undefined
          ? { dateApplied: parseDateOnly(input.dateApplied) }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.matchScore !== undefined
          ? { matchScore: input.matchScore }
          : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        ...(input.salaryRange !== undefined
          ? { salaryRange: input.salaryRange }
          : {}),
        ...(input.source !== undefined ? { source: input.source } : {}),
        ...(input.jobUrl !== undefined
          ? { jobUrl: input.jobUrl || null }
          : {}),
        ...(input.workMode !== undefined ? { workMode: input.workMode } : {}),
        ...(input.employmentType !== undefined
          ? {
              employmentType: toPrismaEmploymentType(input.employmentType),
            }
          : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.resumeUsed !== undefined
          ? { resumeUsed: input.resumeUsed }
          : {}),
        ...(input.followUpDate !== undefined
          ? {
              followUpDate: input.followUpDate
                ? parseDateOnly(input.followUpDate)
                : null,
            }
          : {}),
      },
      include: applicationInclude,
    });
  });

  return mapApplication(updated as ApplicationWithRelations);
}

export async function deleteApplication(
  userId: string,
  applicationId: string,
): Promise<{ id: string }> {
  const existing = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Application not found");
  }

  await prisma.application.delete({
    where: { id: applicationId },
  });

  return { id: applicationId };
}
