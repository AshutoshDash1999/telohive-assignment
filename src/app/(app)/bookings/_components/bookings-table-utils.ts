import { BOOKING_STATUS_OPTIONS } from "@/lib/bookings/status";
import { formatUsdCurrency } from "@/lib/format/currency";
import type { BookingListItem } from "@/types/bookings";
import type { BookingStatus } from "@/types/entities";

import type { SortDirection, SortField, StatusOption } from "./bookings-table-types";

export const STATUS_OPTIONS: StatusOption[] = [...BOOKING_STATUS_OPTIONS];

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading bookings.";
}

export const toCurrency = formatUsdCurrency;

export function toStatusLabel(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

export function getStatusBadgeClass(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-zinc-200 text-zinc-700";
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

export function matchesDateRange(
  item: BookingListItem,
  startDate: string,
  endDate: string
) {
  if (!startDate && !endDate) {
    return true;
  }

  if (startDate && item.startDate < startDate) {
    return false;
  }

  if (endDate && item.startDate > endDate) {
    return false;
  }

  return true;
}

function compareRows(a: BookingListItem, b: BookingListItem, field: SortField) {
  switch (field) {
    case "spaceName":
      return a.spaceName.localeCompare(b.spaceName);
    case "startDate":
      return a.startDate.localeCompare(b.startDate);
    case "type":
      return a.type.localeCompare(b.type);
    case "status":
      return a.status.localeCompare(b.status);
    case "amount":
      return a.amount - b.amount;
    default: {
      const exhaustiveCheck: never = field;
      return exhaustiveCheck;
    }
  }
}

export function applySort(
  items: BookingListItem[],
  field: SortField,
  direction: SortDirection
) {
  const multiplier = direction === "asc" ? 1 : -1;
  return items.toSorted((a, b) => {
    const compared = compareRows(a, b, field);
    if (compared !== 0) {
      return compared * multiplier;
    }
    return (b.id - a.id) * multiplier;
  });
}

function toCsvCell(value: string | number) {
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export function downloadBookingsCsv(rows: BookingListItem[]) {
  const header = ["Space Name", "Date", "Type", "Status", "Amount"];
  const csvRows = [
    header.join(","),
    ...rows.map((row) =>
      [
        toCsvCell(row.spaceName),
        toCsvCell(row.date),
        toCsvCell(row.type),
        toCsvCell(toStatusLabel(row.status)),
        toCsvCell(row.amount),
      ].join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
