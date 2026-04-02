import { apiError, apiSuccess } from "@/lib/api/response";
import { readDb } from "@/lib/server/mock-db";
import { parseNumericRouteParam } from "@/lib/server/route-params";

interface Params {
  params: Promise<{ id: string }>;
}

// Returns one space by id and validates that the path param is numeric.
export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const spaceId = parseNumericRouteParam(id);
    if (spaceId === null) {
      return apiError("INVALID_SPACE_ID", "Space id must be a number", 400);
    }

    const db = await readDb();
    const space = db.spaces.find((item) => item.id === spaceId);

    if (!space) {
      return apiError("SPACE_NOT_FOUND", "Space not found", 404);
    }

    return apiSuccess(space);
  } catch (error) {
    return apiError("SPACE_FETCH_FAILED", "Failed to fetch space", 500, error);
  }
}
