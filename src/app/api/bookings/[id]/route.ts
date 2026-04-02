import { apiError, apiSuccess } from "@/lib/api/response";
import { isBookingStatus } from "@/lib/bookings/status";
import { formatDisplayDateRange } from "@/lib/format/date-range";
import { readDb, updateDb } from "@/lib/server/mock-db";
import { parseNumericRouteParam } from "@/lib/server/route-params";
import type { BookingStatus } from "@/types/entities";
import type { BookingListItem } from "@/types/bookings";

interface Params {
  params: Promise<{ id: string }>;
}

interface PatchBookingBody {
  status?: BookingStatus;
}

// Updates a booking status by id with strict status validation and returns the mapped row payload.
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const bookingId = parseNumericRouteParam(id);
    if (bookingId === null) {
      return apiError("INVALID_BOOKING_ID", "Booking id must be a number", 400);
    }

    const body = (await request.json()) as PatchBookingBody;
    const status = body.status;
    if (!status || !isBookingStatus(status)) {
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

    const responsePayload: BookingListItem = {
      id: updatedBooking.id,
      spaceId: updatedBooking.spaceId,
      spaceName: space.name,
      date: formatDisplayDateRange(updatedBooking.startDate, updatedBooking.endDate),
      startDate: updatedBooking.startDate,
      endDate: updatedBooking.endDate,
      type: space.category,
      status: updatedBooking.status,
      amount: updatedBooking.totalPrice,
    };

    return apiSuccess(responsePayload);
  } catch (error) {
    return apiError("BOOKING_PATCH_FAILED", "Failed to update booking", 500, error);
  }
}
