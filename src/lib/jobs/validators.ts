import { z } from "zod";
import {
  employmentTypeSchema,
  workModeSchema,
} from "@/lib/applications/validators";

export const experienceLevelSchema = z.enum([
  "Internship",
  "Entry",
  "Mid",
  "Senior",
  "Lead",
]);

export const jobSortSchema = z.enum(["relevance", "match", "date"]);

export const datePostedSchema = z.enum(["any", "24h", "7d", "30d"]);

export const listJobsQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  location: z.string().trim().max(120).optional(),
  workMode: workModeSchema.optional(),
  employmentType: employmentTypeSchema.optional(),
  experienceLevel: experienceLevelSchema.optional(),
  category: z.string().trim().max(120).optional(),
  salaryMin: z.coerce.number().int().min(0).max(1_000_000).optional(),
  datePosted: datePostedSchema.optional(),
  sort: jobSortSchema.default("relevance"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const jobIdSchema = z.string().trim().min(1).max(120);

export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
