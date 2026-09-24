import { requireUser } from "@/lib/auth/session";
import { jsonData, toErrorResponse } from "@/lib/api/errors";
import { listSavedJobs } from "@/lib/jobs/service";

export async function GET() {
  try {
    const { user } = await requireUser();
    const data = await listSavedJobs(user.id);
    return jsonData(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
