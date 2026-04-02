import { BOOKING_STATUSES, type BookingStatus } from "@/types/entities";

export interface BookingStatusOption {
  value: BookingStatus;
  label: string;
}

export const BOOKING_STATUS_OPTIONS: BookingStatusOption[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

export function isBookingStatus(value: string): value is BookingStatus {
  return BOOKING_STATUSES.some((status) => status === value);
}
