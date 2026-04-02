import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toSpacesSearchParams } from "@/lib/discovery/query-state";
import type { ApiResponse, SpacesMeta, SpacesQueryParams } from "@/types/api";
import type { Space } from "@/types/entities";

export interface SpacesListResponse {
  items: Space[];
  meta: SpacesMeta;
}

interface SpacesApiSuccessPayload {
  success: true;
  data: Space[];
  meta: SpacesMeta;
}

function mapApiSuccess(payload: SpacesApiSuccessPayload): SpacesListResponse {
  return {
    items: payload.data,
    meta: payload.meta,
  };
}

export function spacesQueryKey(query: SpacesQueryParams) {
  return ["spaces", query] as const;
}

export async function fetchSpaces(
  query: SpacesQueryParams,
  baseUrl = "",
): Promise<SpacesListResponse> {
  const searchParams = toSpacesSearchParams(query);
  const queryString = searchParams.toString();
  const path = queryString
    ? `${API_ENDPOINTS.SPACES}?${queryString}`
    : API_ENDPOINTS.SPACES;
  const url = baseUrl ? `${baseUrl}${path}` : path;
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch spaces (${response.status})`);
  }

  const payload = (await response.json()) as ApiResponse<Space[]>;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return mapApiSuccess(payload as SpacesApiSuccessPayload);
}
