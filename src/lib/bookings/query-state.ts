import { isBookingStatus } from "@/lib/bookings/status";
import type { BookingStatus } from "@/types/entities";

export type BookingsSortField = "spaceName" | "startDate" | "type" | "status" | "amount";
export type BookingsSortDirection = "asc" | "desc";

export interface BookingsQueryParams {
  q: string;
  statuses: BookingStatus[];
  startDate: string;
  endDate: string;
  sortField: BookingsSortField;
  sortDirection: BookingsSortDirection;
}

export const DEFAULT_BOOKINGS_QUERY: BookingsQueryParams = {
  q: "",
  statuses: [],
  startDate: "",
  endDate: "",
  sortField: "startDate",
  sortDirection: "desc",
};

function isValidSortField(value: string): value is BookingsSortField {
  return (
    value === "spaceName" ||
    value === "startDate" ||
    value === "type" ||
    value === "status" ||
    value === "amount"
  );
}

function isValidSortDirection(value: string): value is BookingsSortDirection {
  return value === "asc" || value === "desc";
}

export function parseBookingsQueryFromSearchParams(
  searchParams: URLSearchParams
): BookingsQueryParams {
  const q = searchParams.get("q")?.trim() ?? DEFAULT_BOOKINGS_QUERY.q;
  const startDate =
    searchParams.get("startDate")?.trim() ?? DEFAULT_BOOKINGS_QUERY.startDate;
  const endDate = searchParams.get("endDate")?.trim() ?? DEFAULT_BOOKINGS_QUERY.endDate;
  const statuses = searchParams
    .getAll("status")
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(isBookingStatus);

  const sortFieldCandidate = searchParams.get("sort")?.trim() ?? "";
  const sortDirectionCandidate = searchParams.get("dir")?.trim() ?? "";

  const sortField = isValidSortField(sortFieldCandidate)
    ? sortFieldCandidate
    : DEFAULT_BOOKINGS_QUERY.sortField;
  const sortDirection = isValidSortDirection(sortDirectionCandidate)
    ? sortDirectionCandidate
    : DEFAULT_BOOKINGS_QUERY.sortDirection;

  return {
    q,
    statuses,
    startDate,
    endDate,
    sortField,
    sortDirection,
  };
}

export function toBookingsSearchParams(query: BookingsQueryParams): URLSearchParams {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }

  for (const status of query.statuses) {
    params.append("status", status);
  }

  if (query.startDate) {
    params.set("startDate", query.startDate);
  }

  if (query.endDate) {
    params.set("endDate", query.endDate);
  }

  if (query.sortField !== DEFAULT_BOOKINGS_QUERY.sortField) {
    params.set("sort", query.sortField);
  }

  if (query.sortDirection !== DEFAULT_BOOKINGS_QUERY.sortDirection) {
    params.set("dir", query.sortDirection);
  }

  return params;
}
