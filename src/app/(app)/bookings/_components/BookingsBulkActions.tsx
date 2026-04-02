interface BookingsBulkActionsProps {
  selectedCount: number;
  filteredCount: number;
  canExport: boolean;
  isCancelling: boolean;
  isCancellingSingle: boolean;
  onCancelSelected: () => void;
  onExportCsv: () => void;
}

export function BookingsBulkActions({
  selectedCount,
  filteredCount,
  canExport,
  isCancelling,
  isCancellingSingle,
  onCancelSelected,
  onExportCsv,
}: BookingsBulkActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
        {selectedCount} of {filteredCount} selected
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCancelSelected}
          disabled={selectedCount === 0 || isCancelling || isCancellingSingle}
          className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCancelling ? "Cancelling..." : "Cancel selected"}
        </button>
        <button
          type="button"
          onClick={onExportCsv}
          disabled={!canExport}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
