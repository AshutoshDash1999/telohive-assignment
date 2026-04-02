"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { fetchBookings, patchBookingStatus, type BookingListItem } from "@/lib/api/bookings";
import type { SortDirection, SortField } from "./bookings-table-types";
import { applySort, downloadBookingsCsv } from "./bookings-table-utils";
import { useBookingsFilters } from "./useBookingsFilters";

export function useBookingsTable() {
  const queryClient = useQueryClient();
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(),
  });

  const {
    urlQuery,
    filteredBookings,
    searchValue,
    setSearchValue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedStatuses,
    toggleStatus,
    clearFilters,
    updateQuery,
  } = useBookingsFilters({ bookings: bookingsQuery.data });

  const sortField = urlQuery.sortField as SortField;
  const sortDirection = urlQuery.sortDirection as SortDirection;

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

  function isRowCancelling(bookingId: number) {
    return cancelOneMutation.isPending && cancelOneMutation.variables === bookingId;
  }

  return {
    searchValue,
    setSearchValue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
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
