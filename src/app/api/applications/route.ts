import { requireUser } from "@/lib/auth/session";
import { jsonData, toErrorResponse, validationErrorFromZod } from "@/lib/api/errors";
import {
  createApplication,
  listApplications,
} from "@/lib/applications/service";
import {
  createApplicationSchema,
  listApplicationsQuerySchema,
} from "@/lib/applications/validators";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const parsedQuery = listApplicationsQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });

    if (!parsedQuery.success) {
      throw validationErrorFromZod(parsedQuery.error);
    }

    const data = await listApplications(user.id, parsedQuery.data);
    return jsonData(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser();
    const body = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error);
    }

    const data = await createApplication(user.id, parsed.data);
    return jsonData(data, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
