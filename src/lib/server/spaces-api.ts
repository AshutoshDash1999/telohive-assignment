import { headers } from "next/headers";

import { fetchSpaces } from "@/lib/api/spaces";
import type { SpacesQueryParams } from "@/types/api";

async function getBaseUrlFromRequestHeaders() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

export async function fetchSpacesOnServer(query: SpacesQueryParams) {
  const baseUrl = await getBaseUrlFromRequestHeaders();
  return fetchSpaces(query, baseUrl);
}
