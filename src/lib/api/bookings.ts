import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { BookingStatus } from "@/types/entities";
import type { BookingListItem } from "@/types/bookings";

interface BookingListApiSuccessPayload {
  success: true;
  data: BookingListItem[];
}

interface BookingMutationApiSuccessPayload {
  success: true;
  data: BookingListItem;
}

export async function fetchBookings(baseUrl = ""): Promise<BookingListItem[]> {
  const url = baseUrl ? `${baseUrl}${API_ENDPOINTS.BOOKINGS}` : API_ENDPOINTS.BOOKINGS;
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bookings (${response.status})`);
  }

  const payload = (await response.json()) as ApiResponse<BookingListItem[]>;
  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return (payload as BookingListApiSuccessPayload).data;
}

export async function patchBookingStatus(
  bookingId: number,
  status: BookingStatus
): Promise<BookingListItem> {
  const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update booking (${response.status})`);
  }

  const payload = (await response.json()) as ApiResponse<BookingListItem>;
  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return (payload as BookingMutationApiSuccessPayload).data;
}
