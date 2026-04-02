import type { BookingStatus } from "@/types/entities";

export type SortField = "spaceName" | "startDate" | "type" | "status" | "amount";
export type SortDirection = "asc" | "desc";

export interface StatusOption {
  value: BookingStatus;
  label: string;
}
