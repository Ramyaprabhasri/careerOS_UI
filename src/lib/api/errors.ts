import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/auth/session";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: Record<string, string[]>;

  constructor(
    status: number,
    code: ApiErrorCode,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, "NOT_FOUND", message);
    this.name = "NotFoundError";
  }
}

export function validationErrorFromZod(error: ZodError) {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_form";
    if (!details[key]) {
      details[key] = [];
    }
    details[key].push(issue.message);
  }

  return new ApiError(
    400,
    "VALIDATION_ERROR",
    "Validation failed",
    details,
  );
}

export function toErrorResponse(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHENTICATED" satisfies ApiErrorCode,
          message: error.message || "Authentication required",
        },
      },
      { status: 401 },
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    const apiError = validationErrorFromZod(error);
    return NextResponse.json(
      {
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
        },
      },
      { status: apiError.status },
    );
  }

  console.error("[api]", error instanceof Error ? error.message : "Unknown error");

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR" satisfies ApiErrorCode,
        message: "Something went wrong",
      },
    },
    { status: 500 },
  );
}

export function jsonData<T>(data: T, init?: { status?: number }) {
  return NextResponse.json({ data }, { status: init?.status ?? 200 });
}
