"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { fetchBookings, patchBookingStatus, type BookingListItem } from "@/lib/api/bookings";
import {
  parseBookingsQueryFromSearchParams,
  toBookingsSearchParams,
  type BookingsQueryParams,
} from "@/lib/bookings/query-state";
import type { BookingStatus } from "@/types/entities";
import type { SortDirection, SortField } from "./bookings-table-types";
import { applySort, downloadBookingsCsv, matchesDateRange } from "./bookings-table-utils";

export function useBookingsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);

  const urlQuery = useMemo(
    () => parseBookingsQueryFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const searchValue = urlQuery.q;
  const selectedStatuses = urlQuery.statuses;
  const startDate = urlQuery.startDate;
  const endDate = urlQuery.endDate;
  const sortField = urlQuery.sortField as SortField;
  const sortDirection = urlQuery.sortDirection as SortDirection;

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

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(),
  });

  const cancelOneMutation = useMutation({
    mutationFn: (bookingId: number) => patchBookingStatus(bookingId, "cancelled"),
    onSuccess: (updatedBooking) => {
      queryClient.setQueryData<BookingListItem[]>(["bookings"], (current) => {
        if (!current) {
          return current;
        }

        return current.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });
    },
  });

  const cancelManyMutation = useMutation({
    mutationFn: async (bookingIds: number[]) => {
      return Promise.all(
        bookingIds.map((bookingId) => patchBookingStatus(bookingId, "cancelled"))
      );
    },
    onSuccess: (updatedBookings) => {
      const updatedMap = new Map(updatedBookings.map((item) => [item.id, item]));
      queryClient.setQueryData<BookingListItem[]>(["bookings"], (current) => {
        if (!current) {
          return current;
        }

        return current.map((booking) => updatedMap.get(booking.id) ?? booking);
      });
    },
  });

  const filteredBookings = useMemo(() => {
    const items = bookingsQuery.data ?? [];
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
  }, [bookingsQuery.data, searchValue, selectedStatuses, startDate, endDate]);

  const visibleBookings = useMemo(() => {
    return applySort(filteredBookings, sortField, sortDirection);
  }, [filteredBookings, sortField, sortDirection]);

  const filteredBookingIdSet = useMemo(
    () => new Set(filteredBookings.map((booking) => booking.id)),
    [filteredBookings]
  );

  const selectedBookingIdSet = useMemo(
    () => new Set(selectedBookingIds),
    [selectedBookingIds]
  );

  const selectedVisibleBookingIds = useMemo(
    () => selectedBookingIds.filter((id) => filteredBookingIdSet.has(id)),
    [selectedBookingIds, filteredBookingIdSet]
  );

  const selectedVisibleCount = selectedVisibleBookingIds.length;
  const allFilteredSelected =
    filteredBookings.length > 0 &&
    filteredBookings.every((booking) => selectedBookingIdSet.has(booking.id));

  function toggleSort(field: SortField) {
    updateQuery((current) => {
      if (current.sortField !== field) {
        return {
          ...current,
          sortField: field,
          sortDirection: "asc",
        };
      }

      return {
        ...current,
        sortDirection: current.sortDirection === "asc" ? "desc" : "asc",
      };
    });
  }

  function toggleStatus(status: BookingStatus) {
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
  }

  function toggleRowSelection(bookingId: number) {
    setSelectedBookingIds((current) => {
      if (current.includes(bookingId)) {
        return current.filter((id) => id !== bookingId);
      }

      return [...current, bookingId];
    });
  }

  function toggleSelectAllFiltered() {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredBookings.map((booking) => booking.id));
      setSelectedBookingIds((current) => current.filter((id) => !filteredIds.has(id)));
      return;
    }

    const merged = new Set(selectedBookingIds);
    for (const booking of filteredBookings) {
      merged.add(booking.id);
    }
    setSelectedBookingIds([...merged]);
  }

  async function onCancelSelected() {
    const idsToCancel = selectedVisibleBookingIds;
    if (idsToCancel.length === 0) {
      return;
    }

    await cancelManyMutation.mutateAsync(idsToCancel);
    setSelectedBookingIds((current) => current.filter((id) => !idsToCancel.includes(id)));
  }

  function onCancelOne(bookingId: number) {
    cancelOneMutation.mutate(bookingId);
  }

  function onExportCsv() {
    const selectedRows = visibleBookings.filter((booking) =>
      selectedBookingIdSet.has(booking.id)
    );
    const rowsToExport = selectedRows.length > 0 ? selectedRows : visibleBookings;
    downloadBookingsCsv(rowsToExport);
  }

  function clearFilters() {
    updateQuery((current) => ({
      ...current,
      q: "",
      statuses: [],
      startDate: "",
      endDate: "",
    }));
  }

  function isRowCancelling(bookingId: number) {
    return cancelOneMutation.isPending && cancelOneMutation.variables === bookingId;
  }

  return {
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
    sortField,
    sortDirection,
    toggleSort,
    selectedBookingIdSet,
    selectedVisibleCount,
    filteredBookings,
    visibleBookings,
    allFilteredSelected,
    toggleSelectAllFiltered,
    toggleRowSelection,
    onCancelSelected,
    onCancelOne,
    onExportCsv,
    isRowCancelling,
    bookingsQuery,
    isBulkCancelling: cancelManyMutation.isPending,
    isSingleCancelling: cancelOneMutation.isPending,
  };
}
