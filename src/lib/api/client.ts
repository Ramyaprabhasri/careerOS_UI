import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
} from "@/types/dashboard";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type DataResponse<T> = { data: T };

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "same-origin",
  });

  if (!response.ok) {
    let code = "INTERNAL_SERVER_ERROR";
    let message = "Request failed";
    let details: Record<string, string[]> | undefined;

    try {
      const body = (await response.json()) as ApiErrorBody;
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
      details = body.error?.details;
    } catch {
      // ignore non-JSON error bodies
    }

    throw new ApiClientError(response.status, code, message, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getApplications(params?: {
  status?: ApplicationStatus;
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.q) search.set("q", params.q);
  const query = search.toString();
  return request<DataResponse<Application[]>>(
    `/api/applications${query ? `?${query}` : ""}`,
  );
}

export async function getApplication(id: string) {
  return request<DataResponse<Application>>(`/api/applications/${id}`);
}

export async function createApplication(input: ApplicationInput) {
  return request<DataResponse<Application>>("/api/applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateApplication(
  id: string,
  input: Partial<Application>,
) {
  return request<DataResponse<Application>>(`/api/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteApplication(id: string) {
  return request<DataResponse<{ id: string }>>(`/api/applications/${id}`, {
    method: "DELETE",
  });
}
