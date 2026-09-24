import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "Saved",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
]);

export const workModeSchema = z.enum(["Remote", "Hybrid", "Onsite"]);

export const employmentTypeSchema = z.enum([
  "Full-time",
  "Contract",
  "Internship",
  "Part-time",
]);

export const prioritySchema = z.enum(["Low", "Medium", "High"]);

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date as YYYY-MM-DD");

const optionalDateOnlySchema = dateOnlySchema.optional().nullable();

const optionalUrlSchema = z
  .union([z.string().url(), z.literal("")])
  .optional()
  .nullable();

export const timelineEventSchema = z.object({
  id: z.string().min(1).optional(),
  label: z.string().trim().min(1).max(200),
  date: optionalDateOnlySchema,
  completed: z.boolean(),
});

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(120),
  status: applicationStatusSchema.default("Applied"),
  matchScore: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(10000).optional().nullable(),
  salaryRange: z.string().max(120).optional().nullable(),
  source: z.string().max(120).optional().nullable(),
  jobUrl: optionalUrlSchema,
  workMode: workModeSchema,
  employmentType: employmentTypeSchema,
  priority: prioritySchema.default("Medium"),
  resumeUsed: z.string().max(200).optional().nullable(),
  followUpDate: optionalDateOnlySchema,
  dateApplied: dateOnlySchema.optional(),
  tags: z.array(z.string().trim().min(1).max(60)).optional(),
  timeline: z.array(timelineEventSchema).optional(),
});

export const updateApplicationSchema = z
  .object({
    company: z.string().trim().min(1).max(120).optional(),
    role: z.string().trim().min(1).max(120).optional(),
    location: z.string().trim().min(1).max(120).optional(),
    status: applicationStatusSchema.optional(),
    matchScore: z.number().int().min(0).max(100).optional(),
    notes: z.string().max(10000).optional().nullable(),
    salaryRange: z.string().max(120).optional().nullable(),
    source: z.string().max(120).optional().nullable(),
    jobUrl: optionalUrlSchema,
    workMode: workModeSchema.optional(),
    employmentType: employmentTypeSchema.optional(),
    priority: prioritySchema.optional(),
    resumeUsed: z.string().max(200).optional().nullable(),
    followUpDate: optionalDateOnlySchema,
    dateApplied: dateOnlySchema.optional(),
    tags: z.array(z.string().trim().min(1).max(60)).optional(),
    timeline: z.array(timelineEventSchema).optional(),
    updatedAt: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

export const listApplicationsQuerySchema = z.object({
  status: applicationStatusSchema.optional(),
  q: z.string().trim().max(200).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
