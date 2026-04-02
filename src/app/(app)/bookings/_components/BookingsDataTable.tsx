import type { BookingListItem } from "@/types/bookings";
import type { BookingStatus } from "@/types/entities";

import type { SortDirection, SortField } from "./bookings-table-types";
import { getStatusBadgeClass, toCurrency, toStatusLabel } from "./bookings-table-utils";

interface BookingsDataTableProps {
  rows: BookingListItem[];
  selectedBookingIdSet: Set<number>;
  allFilteredSelected: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  isRowCancelling: (bookingId: number) => boolean;
  isBulkCancelling: boolean;
  onToggleSort: (field: SortField) => void;
  onToggleSelectAllFiltered: () => void;
  onToggleRowSelection: (bookingId: number) => void;
  onCancelOne: (bookingId: number) => void;
}

function SortLabel({
  field,
  activeField,
  direction,
  label,
}: {
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  label: string;
}) {
  const indicator = activeField === field ? (direction === "asc" ? "↑" : "↓") : "";
  return (
    <>
      {label} {indicator}
    </>
  );
}

function isCancelled(status: BookingStatus) {
  return status === "cancelled";
}

export function BookingsDataTable({
  rows,
  selectedBookingIdSet,
  allFilteredSelected,
  sortField,
  sortDirection,
  isRowCancelling,
  isBulkCancelling,
  onToggleSort,
  onToggleSelectAllFiltered,
  onToggleRowSelection,
  onCancelOne,
}: BookingsDataTableProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
      data-testid="bookings-data-table"
    >
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-zinc-100 text-zinc-700">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={onToggleSelectAllFiltered}
                  aria-label="Select all filtered bookings"
                  data-testid="bookings-select-all-filtered"
                />
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onToggleSort("spaceName")}
                  data-testid="bookings-sort-space-name"
                >
                  <SortLabel
                    field="spaceName"
                    activeField={sortField}
                    direction={sortDirection}
                    label="Space Name"
                  />
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onToggleSort("startDate")}
                  data-testid="bookings-sort-start-date"
                >
                  <SortLabel
                    field="startDate"
                    activeField={sortField}
                    direction={sortDirection}
                    label="Date"
                  />
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onToggleSort("type")}
                  data-testid="bookings-sort-type"
                >
                  <SortLabel
                    field="type"
                    activeField={sortField}
                    direction={sortDirection}
                    label="Type"
                  />
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onToggleSort("status")}
                  data-testid="bookings-sort-status"
                >
                  <SortLabel
                    field="status"
                    activeField={sortField}
                    direction={sortDirection}
                    label="Status"
                  />
                </button>
              </th>
              <th className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => onToggleSort("amount")}
                  data-testid="bookings-sort-amount"
                >
                  <SortLabel
                    field="amount"
                    activeField={sortField}
                    direction={sortDirection}
                    label="Amount"
                  />
                </button>
              </th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((booking) => {
              const isSelected = selectedBookingIdSet.has(booking.id);
              const isCancelling = isRowCancelling(booking.id);
              return (
                <tr key={booking.id} className="border-t border-zinc-200">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleRowSelection(booking.id)}
                      aria-label={`Select booking ${booking.id}`}
                      data-testid={`bookings-row-checkbox-${booking.id}`}
                    />
                  </td>
                  <td className="px-3 py-2 font-medium text-zinc-900">{booking.spaceName}</td>
                  <td className="px-3 py-2 text-zinc-700">{booking.date}</td>
                  <td className="px-3 py-2 text-zinc-700">{booking.type}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(booking.status)}`}
                    >
                      {toStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-zinc-900">
                    {toCurrency(booking.amount)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onCancelOne(booking.id)}
                      disabled={isCancelled(booking.status) || isCancelling || isBulkCancelling}
                      className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                      data-testid={`bookings-cancel-button-${booking.id}`}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
