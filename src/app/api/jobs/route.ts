import { requireUser } from "@/lib/auth/session";
import {
  toErrorResponse,
  validationErrorFromZod,
} from "@/lib/api/errors";
import { listJobs } from "@/lib/jobs/service";
import { listJobsQuerySchema } from "@/lib/jobs/validators";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const parsed = listJobsQuerySchema.safeParse({
      q: searchParams.get("q") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      workMode: searchParams.get("workMode") ?? undefined,
      employmentType: searchParams.get("employmentType") ?? undefined,
      experienceLevel: searchParams.get("experienceLevel") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      salaryMin: searchParams.get("salaryMin") ?? undefined,
      datePosted: searchParams.get("datePosted") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error);
    }

    const result = await listJobs(user.id, parsed.data);
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
