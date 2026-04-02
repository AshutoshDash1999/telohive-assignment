"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  parseBookingsQueryFromSearchParams,
  toBookingsSearchParams,
  type BookingsQueryParams,
} from "@/lib/bookings/query-state";
import type { BookingStatus } from "@/types/entities";
import type { BookingListItem } from "@/lib/api/bookings";
import { matchesDateRange } from "./bookings-table-utils";

interface UseBookingsFiltersParams {
  bookings: BookingListItem[] | undefined;
}

interface UseBookingsFiltersResult {
  urlQuery: BookingsQueryParams;
  filteredBookings: BookingListItem[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  selectedStatuses: BookingStatus[];
  toggleStatus: (status: BookingStatus) => void;
  clearFilters: () => void;
  updateQuery: (recipe: (current: BookingsQueryParams) => BookingsQueryParams) => void;
}

export function useBookingsFilters({
  bookings,
}: UseBookingsFiltersParams): UseBookingsFiltersResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = useMemo(
    () => parseBookingsQueryFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const updateQuery = useCallback(
    (recipe: (current: BookingsQueryParams) => BookingsQueryParams) => {
      const next = recipe(urlQuery);
      const params = toBookingsSearchParams(next);
      const queryString = params.toString();
      const href = queryString ? `/bookings?${queryString}` : "/bookings";
      router.replace(href, { scroll: false });
    },
    [router, urlQuery]
  );

  const searchValue = urlQuery.q;
  const selectedStatuses = urlQuery.statuses;
  const startDate = urlQuery.startDate;
  const endDate = urlQuery.endDate;

  const filteredBookings = useMemo(() => {
    const items = bookings ?? [];
    const lowerSearch = searchValue.trim().toLowerCase();
    const selectedStatusSet = new Set(selectedStatuses);

    return items.filter((item) => {
      const matchesSearch =
        lowerSearch.length === 0 || item.spaceName.toLowerCase().includes(lowerSearch);
      const matchesStatus =
        selectedStatusSet.size === 0 || selectedStatusSet.has(item.status);
      const matchesDate = matchesDateRange(item, startDate, endDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, endDate, searchValue, selectedStatuses, startDate]);

  const toggleStatus = useCallback(
    (status: BookingStatus) => {
      updateQuery((current) => {
        const statusSet = new Set(current.statuses);
        if (statusSet.has(status)) {
          statusSet.delete(status);
        } else {
          statusSet.add(status);
        }

        return {
          ...current,
          statuses: [...statusSet],
        };
      });
    },
    [updateQuery]
  );

  const clearFilters = useCallback(() => {
    updateQuery((current) => ({
      ...current,
      q: "",
      statuses: [],
      startDate: "",
      endDate: "",
    }));
  }, [updateQuery]);

  return {
    urlQuery,
    filteredBookings,
    searchValue,
    setSearchValue: (value: string) =>
      updateQuery((current) => ({
        ...current,
        q: value,
      })),
    startDate,
    setStartDate: (value: string) =>
      updateQuery((current) => ({
        ...current,
        startDate: value,
      })),
    endDate,
    setEndDate: (value: string) =>
      updateQuery((current) => ({
        ...current,
        endDate: value,
      })),
    selectedStatuses,
    toggleStatus,
    clearFilters,
    updateQuery,
  };
}
