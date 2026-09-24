import { requireUser } from "@/lib/auth/session";
import {
  jsonData,
  toErrorResponse,
  validationErrorFromZod,
} from "@/lib/api/errors";
import { saveJob, unsaveJob } from "@/lib/jobs/service";
import { jobIdSchema } from "@/lib/jobs/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { user } = await requireUser();
    const { id } = await context.params;
    const parsedId = jobIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw validationErrorFromZod(parsedId.error);
    }

    const data = await saveJob(user.id, parsedId.data);
    return jsonData(data, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { user } = await requireUser();
    const { id } = await context.params;
    const parsedId = jobIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw validationErrorFromZod(parsedId.error);
    }

    const data = await unsaveJob(user.id, parsedId.data);
    return jsonData(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
