"use client";

import { BookingsBulkActions } from "./BookingsBulkActions";
import { BookingsDataTable } from "./BookingsDataTable";
import { BookingsFilters } from "./BookingsFilters";
import { STATUS_OPTIONS, getErrorMessage } from "./bookings-table-utils";
import { useBookingsTable } from "./useBookingsTable";

export function BookingsTableClient() {
  const {
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
    isBulkCancelling,
    isSingleCancelling,
  } = useBookingsTable();

  if (bookingsQuery.isLoading) {
    return (
      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        Loading bookings...
      </div>
    );
  }

  if (bookingsQuery.isError) {
    return (
      <div className="mt-4 space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>Failed to load bookings: {getErrorMessage(bookingsQuery.error)}</p>
        <button
          type="button"
          onClick={() => bookingsQuery.refetch()}
          className="rounded-md border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <BookingsFilters
        searchValue={searchValue}
        startDate={startDate}
        endDate={endDate}
        selectedStatuses={selectedStatuses}
        statusOptions={STATUS_OPTIONS}
        onSearchChange={setSearchValue}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onToggleStatus={toggleStatus}
        onClearFilters={clearFilters}
      />

      <BookingsBulkActions
        selectedCount={selectedVisibleCount}
        filteredCount={filteredBookings.length}
        canExport={visibleBookings.length > 0}
        isCancelling={isBulkCancelling}
        isCancellingSingle={isSingleCancelling}
        onCancelSelected={onCancelSelected}
        onExportCsv={onExportCsv}
      />

      {visibleBookings.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          {filteredBookings.length === 0 && (bookingsQuery.data?.length ?? 0) > 0
            ? "No bookings match your current search and filters."
            : "No booking history available yet."}
        </div>
      ) : (
        <BookingsDataTable
          rows={visibleBookings}
          selectedBookingIdSet={selectedBookingIdSet}
          allFilteredSelected={allFilteredSelected}
          sortField={sortField}
          sortDirection={sortDirection}
          isRowCancelling={isRowCancelling}
          isBulkCancelling={isBulkCancelling}
          onToggleSort={toggleSort}
          onToggleSelectAllFiltered={toggleSelectAllFiltered}
          onToggleRowSelection={toggleRowSelection}
          onCancelOne={onCancelOne}
        />
      )}
    </div>
  );
}
