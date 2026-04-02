"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { fetchSpaces, spacesQueryKey } from "@/lib/api/spaces";
import { useSavedSpacesStore } from "@/store/saved-spaces-store";
import type { SpacesQueryParams } from "@/types/api";
import { ActiveFilterChips } from "./_components/ActiveFilterChips";
import { DiscoveryPagination } from "./_components/DiscoveryPagination";
import { DiscoverySkeletonGrid } from "./_components/DiscoverySkeletonGrid";
import { DiscoveryToolbar } from "./_components/DiscoveryToolbar";
import { FiltersSectionContent } from "./_components/FiltersSectionContent";
import { FiltersModal } from "./_components/FiltersModal";
import { SpacesGrid } from "./_components/SpacesGrid";
import type { FilterSectionKey } from "./_components/filterSections";
import { useDiscoveryFilters } from "./useDiscoveryFilters";

interface DiscoveryClientProps {
  initialQuery: SpacesQueryParams;
}

const EMPTY_STRING_LIST: string[] = [];

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
  const availableCategories = useMemo(
    () => meta?.available.categories ?? EMPTY_STRING_LIST,
    [meta?.available.categories]
  );
  const availableCities = useMemo(
    () => meta?.available.cities ?? EMPTY_STRING_LIST,
    [meta?.available.cities]
  );
  const availableAmenities = useMemo(
    () => meta?.available.amenities ?? EMPTY_STRING_LIST,
    [meta?.available.amenities]
  );

  const totalMatching = meta?.filteredTotal ?? 0;
  const totalAll = meta?.totalAll ?? 0;
  const page = meta?.page ?? urlQuery.page;
  const pageSize = meta?.pageSize ?? urlQuery.pageSize;
  const totalPages = meta?.totalPages ?? 1;
  const showingFrom = spaces.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = spaces.length === 0 ? 0 : showingFrom + spaces.length - 1;
  const renderSectionContent = useCallback(
    (section: FilterSectionKey) => (
      <FiltersSectionContent
        section={section}
        activeFilterValues={activeFilterValues}
        availableCategories={availableCategories}
        availableCities={availableCities}
        availableAmenities={availableAmenities}
        availableMeta={meta?.available}
        onToggleMultiSelect={toggleMultiSelect}
        onSetDraftMinPrice={setDraftMinPrice}
        onSetDraftMaxPrice={setDraftMaxPrice}
        onSetDraftMinCapacity={setDraftMinCapacity}
        onSetDraftMaxCapacity={setDraftMaxCapacity}
        onSetDraftMinRating={setDraftMinRating}
        onSetDraftAvailabilityDate={setDraftAvailabilityDate}
      />
    ),
    [
      activeFilterValues,
      availableAmenities,
      availableCategories,
      availableCities,
      meta?.available,
      setDraftAvailabilityDate,
      setDraftMaxCapacity,
      setDraftMaxPrice,
      setDraftMinCapacity,
      setDraftMinPrice,
      setDraftMinRating,
      toggleMultiSelect,
    ]
  );

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
        renderSectionContent={renderSectionContent}
      />
    </div>
  );
}
