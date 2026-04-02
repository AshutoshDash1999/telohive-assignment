import { apiError, apiSuccess } from "@/lib/api/response";
import { readDb } from "@/lib/server/mock-db";
import type { BookingStatus } from "@/types/entities";

interface BookingListItem {
  id: number;
  spaceId: number;
  spaceName: string;
  date: string;
  startDate: string;
  endDate: string;
  type: string;
  status: BookingStatus;
  amount: number;
}

function toDisplayDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const start = formatter.format(new Date(startDate));
  const end = formatter.format(new Date(endDate));
  return `${start} - ${end}`;
}

export async function GET() {
  try {
    const db = await readDb();
    const spaceById = new Map(db.spaces.map((space) => [space.id, space]));

    const items: BookingListItem[] = db.bookings
      .map((booking) => {
        const space = spaceById.get(booking.spaceId);
        if (!space) {
          return null;
        }

        return {
          id: booking.id,
          spaceId: booking.spaceId,
          spaceName: space.name,
          date: toDisplayDateRange(booking.startDate, booking.endDate),
          startDate: booking.startDate,
          endDate: booking.endDate,
          type: space.category,
          status: booking.status,
          amount: booking.totalPrice,
        } satisfies BookingListItem;
      })
      .filter((item): item is BookingListItem => item !== null)
      .toSorted((a, b) => b.id - a.id);

    return apiSuccess(items);
  } catch (error) {
    return apiError("BOOKINGS_FETCH_FAILED", "Failed to fetch bookings", 500, error);
  }
}
