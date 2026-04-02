import { apiError, apiSuccess } from "@/lib/api/response";
import { formatDisplayDateRange } from "@/lib/format/date-range";
import { readDb } from "@/lib/server/mock-db";
import type { BookingListItem } from "@/types/bookings";

// Returns booking rows enriched with space details for table display.
export async function GET() {
  try {
    const db = await readDb();
    const spaceById = new Map(db.spaces.map((space) => [space.id, space]));

    const items = db.bookings
      .reduce<BookingListItem[]>((acc, booking) => {
        const space = spaceById.get(booking.spaceId);
        if (!space) {
          return acc;
        }

        acc.push({
          id: booking.id,
          spaceId: booking.spaceId,
          spaceName: space.name,
          date: formatDisplayDateRange(booking.startDate, booking.endDate),
          startDate: booking.startDate,
          endDate: booking.endDate,
          type: space.category,
          status: booking.status,
          amount: booking.totalPrice,
        });
        return acc;
      }, [])
      .toSorted((a, b) => b.id - a.id);

    return apiSuccess(items);
  } catch (error) {
    return apiError("BOOKINGS_FETCH_FAILED", "Failed to fetch bookings", 500, error);
  }
}
