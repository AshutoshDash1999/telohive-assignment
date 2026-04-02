import { NextResponse } from "next/server";

import type { ApiResponse } from "@/types/api";

export function apiSuccess<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>
) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };

  return NextResponse.json(body, { status });
}

export function apiError(
  code: string,
  message: string,
  status = 500,
  details?: unknown
) {
  const body: ApiResponse<never> = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };

  return NextResponse.json(body, { status });
}
