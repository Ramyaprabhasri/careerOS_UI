import { requireUser } from "@/lib/auth/session";
import { jsonData, toErrorResponse, validationErrorFromZod } from "@/lib/api/errors";
import {
  deleteApplication,
  getApplication,
  updateApplication,
} from "@/lib/applications/service";
import { updateApplicationSchema } from "@/lib/applications/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { user } = await requireUser();
    const { id } = await context.params;
    const data = await getApplication(user.id, id);
    return jsonData(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { user } = await requireUser();
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateApplicationSchema.safeParse(body);

    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error);
    }

    const data = await updateApplication(user.id, id, parsed.data);
    return jsonData(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { user } = await requireUser();
    const { id } = await context.params;
    const data = await deleteApplication(user.id, id);
    return jsonData(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
