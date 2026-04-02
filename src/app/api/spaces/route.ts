import { apiError, apiSuccess } from "@/lib/api/response";
import { parseSpacesQueryFromSearchParams } from "@/lib/discovery/query-state";
import { readDb } from "@/lib/server/mock-db";
import { querySpaces } from "@/lib/server/spaces-query";

// Returns a paginated, filterable list of spaces with metadata for UI filters and totals.
export async function GET(request: Request) {
  try {
    const db = await readDb();
    const { searchParams } = new URL(request.url);
    const query = parseSpacesQueryFromSearchParams(searchParams);
    const result = querySpaces(db.spaces, query);

    return apiSuccess(result.items, 200, result.meta);
  } catch (error) {
    return apiError("SPACES_FETCH_FAILED", "Failed to fetch spaces", 500, error);
  }
}
