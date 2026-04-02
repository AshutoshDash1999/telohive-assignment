import { apiError, apiSuccess } from "@/lib/api/response";
import { readDb, updateDb } from "@/lib/server/mock-db";
import type { BookingStatus } from "@/types/entities";

interface Params {
  params: Promise<{ id: string }>;
}

interface PatchBookingBody {
  status?: BookingStatus;
}

const VALID_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled"];

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

// Updates a booking status by id with strict status validation and returns the mapped row payload.
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const bookingId = Number(id);
    if (Number.isNaN(bookingId)) {
      return apiError("INVALID_BOOKING_ID", "Booking id must be a number", 400);
    }

    const body = (await request.json()) as PatchBookingBody;
    const status = body.status;
    if (!status || !VALID_STATUSES.includes(status)) {
      return apiError("INVALID_STATUS", "Status must be pending, confirmed, or cancelled", 400);
    }

    const existing = await readDb();
    const original = existing.bookings.find((booking) => booking.id === bookingId);
    if (!original) {
      return apiError("BOOKING_NOT_FOUND", "Booking not found", 404);
    }

    const updatedDb = await updateDb((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      ),
    }));

    const updatedBooking = updatedDb.bookings.find((booking) => booking.id === bookingId);
    const space = updatedDb.spaces.find((item) => item.id === original.spaceId);

    if (!updatedBooking || !space) {
      return apiError("BOOKING_UPDATE_FAILED", "Booking update did not complete", 500);
    }

    return apiSuccess({
      id: updatedBooking.id,
      spaceId: updatedBooking.spaceId,
      spaceName: space.name,
      date: toDisplayDateRange(updatedBooking.startDate, updatedBooking.endDate),
      startDate: updatedBooking.startDate,
      endDate: updatedBooking.endDate,
      type: space.category,
      status: updatedBooking.status,
      amount: updatedBooking.totalPrice,
    });
  } catch (error) {
    return apiError("BOOKING_PATCH_FAILED", "Failed to update booking", 500, error);
  }
}
