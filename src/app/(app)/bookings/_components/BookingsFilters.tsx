import type { BookingStatus } from "@/types/entities";

import type { StatusOption } from "./bookings-table-types";

interface BookingsFiltersProps {
  searchValue: string;
  startDate: string;
  endDate: string;
  selectedStatuses: BookingStatus[];
  statusOptions: StatusOption[];
  onSearchChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onToggleStatus: (status: BookingStatus) => void;
  onClearFilters: () => void;
}

export function BookingsFilters({
  searchValue,
  startDate,
  endDate,
  selectedStatuses,
  statusOptions,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onToggleStatus,
  onClearFilters,
}: BookingsFiltersProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <label className="space-y-1 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Search Space
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by space name..."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Start Date
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            End Date
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</p>
        {statusOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={selectedStatuses.includes(option.value)}
              onChange={() => onToggleStatus(option.value)}
            />
            {option.label}
          </label>
        ))}
        <button
          type="button"
          onClick={onClearFilters}
          className="ml-auto rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
