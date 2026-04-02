"use client";

import type { SpacesQueryParams } from "@/types/api";

interface DiscoveryToolbarProps {
  searchInput: string;
  activeFilterCount: number;
  sort: SpacesQueryParams["sort"];
  isFetching: boolean;
  showingFrom: number;
  showingTo: number;
  totalMatching: number;
  totalAll: number;
  onSearchInputChange: (value: string) => void;
  onClearSearchInput: () => void;
  onSortChange: (sort: SpacesQueryParams["sort"]) => void;
  onOpenFilters: () => void;
}

export function DiscoveryToolbar({
  searchInput,
  activeFilterCount,
  sort,
  isFetching,
  showingFrom,
  showingTo,
  totalMatching,
  totalAll,
  onSearchInputChange,
  onClearSearchInput,
  onSortChange,
  onOpenFilters,
}: DiscoveryToolbarProps) {
  return (
    <div
      className="rounded-xl border border-zinc-200 bg-white p-4"
      data-testid="discovery-toolbar"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <input
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Search by name, location, or description"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 pr-20 text-sm outline-none transition ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
            data-testid="discovery-search-input"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={onClearSearchInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-zinc-600 transition hover:bg-zinc-100"
              data-testid="discovery-clear-search-button"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SpacesQueryParams["sort"])}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            data-testid="discovery-sort-select"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Rating</option>
            <option value="capacity_desc">Capacity</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          data-testid="discovery-open-filters-button"
        >
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-600">
        {isFetching ? "Updating results..." : null} Showing {showingFrom}-{showingTo} of{" "}
        {totalMatching} matching spaces ({totalAll} total spaces)
      </p>
    </div>
  );
}
