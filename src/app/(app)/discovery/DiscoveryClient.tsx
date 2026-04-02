"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fetchSpaces, spacesQueryKey } from "@/lib/api/spaces";
import { useSavedSpacesStore } from "@/store/saved-spaces-store";
import type { SpacesQueryParams } from "@/types/api";
import { ActiveFilterChips } from "./_components/ActiveFilterChips";
import { DiscoveryPagination } from "./_components/DiscoveryPagination";
import { DiscoverySkeletonGrid } from "./_components/DiscoverySkeletonGrid";
import { DiscoveryToolbar } from "./_components/DiscoveryToolbar";
import { FiltersModal } from "./_components/FiltersModal";
import { SpacesGrid } from "./_components/SpacesGrid";
import { type FilterSectionKey } from "./_components/filterSections";
import { useDiscoveryFilters } from "./useDiscoveryFilters";

interface DiscoveryClientProps {
  initialQuery: SpacesQueryParams;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading spaces.";
}

export function DiscoveryClient({ initialQuery }: DiscoveryClientProps) {
  const {
    searchInput,
    setSearchInput,
    urlQuery,
    updateQuery,
    isFiltersModalOpen,
    activeFilterSection,
    setActiveFilterSection,
    activeFilterValues,
    hasActiveFilters,
    activeFilterCount,
    activeChips,
    openFiltersModal,
    closeFiltersModal,
    applyFilters,
    clearAllDraftFilters,
    toggleMultiSelect,
    setDraftMinPrice,
    setDraftMaxPrice,
    setDraftMinCapacity,
    setDraftMaxCapacity,
    setDraftMinRating,
    setDraftAvailabilityDate,
    onRemoveSearch,
  } = useDiscoveryFilters(initialQuery);
  const savedSpaceIds = useSavedSpacesStore((state) => state.savedSpaceIds);
  const toggleSavedSpace = useSavedSpacesStore((state) => state.toggleSavedSpace);
  const savedIds = useMemo(() => new Set(savedSpaceIds), [savedSpaceIds]);

  const spacesQuery = useQuery({
    queryKey: spacesQueryKey(urlQuery),
    queryFn: () => fetchSpaces(urlQuery),
    placeholderData: keepPreviousData,
  });

  const spaces = spacesQuery.data?.items ?? [];
  const meta = spacesQuery.data?.meta;
  const availableCategories = meta?.available.categories ?? [];
  const availableCities = meta?.available.cities ?? [];
  const availableAmenities = meta?.available.amenities ?? [];

  const totalMatching = meta?.filteredTotal ?? 0;
  const totalAll = meta?.totalAll ?? 0;
  const page = meta?.page ?? urlQuery.page;
  const pageSize = meta?.pageSize ?? urlQuery.pageSize;
  const totalPages = meta?.totalPages ?? 1;
  const showingFrom = spaces.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = spaces.length === 0 ? 0 : showingFrom + spaces.length - 1;

  function renderFilterSectionContent(section: FilterSectionKey) {
    switch (section) {
      case "category":
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Category</p>
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={activeFilterValues.categories.includes(category)}
                  onChange={() => toggleMultiSelect("categories", category)}
                />
                {category}
              </label>
            ))}
          </div>
        );
      case "city":
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">City</p>
            {availableCities.map((city) => (
              <label key={city} className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={activeFilterValues.cities.includes(city)}
                  onChange={() => toggleMultiSelect("cities", city)}
                />
                {city}
              </label>
            ))}
          </div>
        );
      case "amenities":
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Amenities</p>
            <div className="grid grid-cols-1 gap-1">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={activeFilterValues.amenities.includes(amenity)}
                    onChange={() => toggleMultiSelect("amenities", amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        );
      case "price":
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Price Range</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="number"
                inputMode="numeric"
                value={activeFilterValues.minPrice ?? ""}
                min={meta?.available.minPrice ?? 0}
                max={meta?.available.maxPrice ?? 10000}
                placeholder={`Min (${meta?.available.minPrice ?? 0})`}
                onChange={(event) => setDraftMinPrice(event.target.value)}
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                value={activeFilterValues.maxPrice ?? ""}
                min={meta?.available.minPrice ?? 0}
                max={meta?.available.maxPrice ?? 10000}
                placeholder={`Max (${meta?.available.maxPrice ?? 0})`}
                onChange={(event) => setDraftMaxPrice(event.target.value)}
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
              />
            </div>
          </div>
        );
      case "capacity":
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Capacity</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="number"
                inputMode="numeric"
                value={activeFilterValues.minCapacity ?? ""}
                min={meta?.available.minCapacity ?? 0}
                max={meta?.available.maxCapacity ?? 500}
                placeholder="Min"
                onChange={(event) => setDraftMinCapacity(event.target.value)}
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                value={activeFilterValues.maxCapacity ?? ""}
                min={meta?.available.minCapacity ?? 0}
                max={meta?.available.maxCapacity ?? 500}
                placeholder="Max"
                onChange={(event) => setDraftMaxCapacity(event.target.value)}
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
              />
            </div>
          </div>
        );
      case "rating":
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Minimum Rating</p>
            <select
              value={activeFilterValues.minRating ?? ""}
              onChange={(event) => setDraftMinRating(event.target.value)}
              className="w-full max-w-xs rounded border border-zinc-300 px-2 py-1 text-sm"
            >
              <option value="">Any rating</option>
              <option value="1">1+ stars</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>
        );
      case "availability":
        return (
          <div className="space-y-2">
            <label
              htmlFor="availabilityDate"
              className="text-xs font-semibold uppercase text-zinc-500"
            >
              Availability Date (optional)
            </label>
            <input
              id="availabilityDate"
              type="date"
              value={activeFilterValues.availabilityDate}
              onChange={(event) => setDraftAvailabilityDate(event.target.value)}
              className="w-full max-w-xs rounded border border-zinc-300 px-2 py-1 text-sm"
            />
            <p className="text-xs text-zinc-500">
              Date is URL-synced and UI-ready, but not applied in mock API filtering yet.
            </p>
          </div>
        );
      default: {
        const exhaustiveCheck: never = section;
        return exhaustiveCheck;
      }
    }
  }

  return (
    <div className="mt-4 space-y-5">
      <DiscoveryToolbar
        searchInput={searchInput}
        activeFilterCount={activeFilterCount}
        sort={urlQuery.sort}
        isFetching={spacesQuery.isFetching}
        showingFrom={showingFrom}
        showingTo={showingTo}
        totalMatching={totalMatching}
        totalAll={totalAll}
        onSearchInputChange={setSearchInput}
        onClearSearchInput={() => setSearchInput("")}
        onSortChange={(sort) =>
          updateQuery((current) => ({
            ...current,
            sort,
            page: 1,
          }))
        }
        onOpenFilters={openFiltersModal}
      />

      {hasActiveFilters ? (
        <ActiveFilterChips
          searchQuery={urlQuery.q}
          chips={activeChips}
          onRemoveSearch={onRemoveSearch}
        />
      ) : null}

      {spacesQuery.isLoading ? (
        <DiscoverySkeletonGrid count={6} />
      ) : null}

      {spacesQuery.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load spaces: {getErrorMessage(spacesQuery.error)}
        </div>
      ) : null}

      {!spacesQuery.isLoading && !spacesQuery.isError && spaces.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          No spaces match your current search and filters.
        </div>
      ) : null}

      {!spacesQuery.isLoading && !spacesQuery.isError && spaces.length > 0 ? (
        <>
          <SpacesGrid
            spaces={spaces}
            savedIds={savedIds}
            onToggleSave={toggleSavedSpace}
          />
          <DiscoveryPagination
            page={page}
            pageSize={urlQuery.pageSize}
            totalPages={totalPages}
            onPageSizeChange={(nextPageSize) =>
              updateQuery((current) => ({
                ...current,
                pageSize: nextPageSize,
                page: 1,
              }))
            }
            onPreviousPage={() =>
              updateQuery((current) => ({
                ...current,
                page: Math.max(1, page - 1),
              }))
            }
            onNextPage={() =>
              updateQuery((current) => ({
                ...current,
                page: Math.min(totalPages, page + 1),
              }))
            }
          />
        </>
      ) : null}

      <FiltersModal
        isOpen={isFiltersModalOpen}
        activeFilterSection={activeFilterSection}
        onSelectSection={setActiveFilterSection}
        onClose={closeFiltersModal}
        onClearAll={clearAllDraftFilters}
        onApply={applyFilters}
        renderSectionContent={renderFilterSectionContent}
      />
    </div>
  );
}
