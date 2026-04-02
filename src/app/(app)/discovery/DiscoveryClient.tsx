"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchSpaces, spacesQueryKey } from "@/lib/api/spaces";
import {
  parseSpacesQueryFromSearchParams,
  toSpacesSearchParams,
} from "@/lib/discovery/query-state";
import { useSavedSpacesStore } from "@/store/saved-spaces-store";
import type { SpacesQueryParams } from "@/types/api";
import { ActiveFilterChips } from "./_components/ActiveFilterChips";
import { DiscoveryPagination } from "./_components/DiscoveryPagination";
import { DiscoverySkeletonGrid } from "./_components/DiscoverySkeletonGrid";
import { DiscoveryToolbar } from "./_components/DiscoveryToolbar";
import { FiltersModal } from "./_components/FiltersModal";
import { SpacesGrid } from "./_components/SpacesGrid";
import { type FilterSectionKey } from "./_components/filterSections";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialQuery.q);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] =
    useState<FilterSectionKey>("category");
  const savedSpaceIds = useSavedSpacesStore((state) => state.savedSpaceIds);
  const toggleSavedSpace = useSavedSpacesStore((state) => state.toggleSavedSpace);
  const savedIds = useMemo(() => new Set(savedSpaceIds), [savedSpaceIds]);

  const urlQuery = useMemo(
    () => parseSpacesQueryFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const updateQuery = useCallback(
    (recipe: (current: SpacesQueryParams) => SpacesQueryParams) => {
      const next = recipe(urlQuery);
      const params = toSpacesSearchParams(next);
      const queryString = params.toString();
      const href = queryString ? `/discovery?${queryString}` : "/discovery";
      router.replace(href, { scroll: false });
    },
    [router, urlQuery]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== urlQuery.q) {
        updateQuery((current) => ({
          ...current,
          q: trimmed,
          page: 1,
        }));
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput, updateQuery, urlQuery.q]);

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

  const hasActiveFilters = useMemo(() => {
    return (
      urlQuery.q.length > 0 ||
      urlQuery.categories.length > 0 ||
      urlQuery.cities.length > 0 ||
      urlQuery.amenities.length > 0 ||
      urlQuery.minPrice !== null ||
      urlQuery.maxPrice !== null ||
      urlQuery.minCapacity !== null ||
      urlQuery.maxCapacity !== null ||
      urlQuery.minRating !== null ||
      urlQuery.availabilityDate.length > 0
    );
  }, [urlQuery]);

  const activeFilterCount = useMemo(() => {
    return (
      urlQuery.categories.length +
      urlQuery.cities.length +
      urlQuery.amenities.length +
      (urlQuery.minPrice !== null ? 1 : 0) +
      (urlQuery.maxPrice !== null ? 1 : 0) +
      (urlQuery.minCapacity !== null ? 1 : 0) +
      (urlQuery.maxCapacity !== null ? 1 : 0) +
      (urlQuery.minRating !== null ? 1 : 0) +
      (urlQuery.availabilityDate.length > 0 ? 1 : 0)
    );
  }, [urlQuery]);

  function toggleMultiSelect(
    key: "categories" | "cities" | "amenities",
    value: string
  ) {
    updateQuery((current) => {
      const currentSet = new Set(current[key]);
      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }

      return {
        ...current,
        [key]: [...currentSet].toSorted(),
        page: 1,
      };
    });
  }

  function onClearAllFilters() {
    setSearchInput("");
    router.replace("/discovery", { scroll: false });
  }

  const activeChips = [
    ...urlQuery.categories.map((value) => ({
      key: `category-${value}`,
      label: `Category: ${value}`,
      onRemove: () =>
        updateQuery((current) => ({
          ...current,
          categories: current.categories.filter((item) => item !== value),
          page: 1,
        })),
    })),
    ...urlQuery.cities.map((value) => ({
      key: `city-${value}`,
      label: `City: ${value}`,
      onRemove: () =>
        updateQuery((current) => ({
          ...current,
          cities: current.cities.filter((item) => item !== value),
          page: 1,
        })),
    })),
    ...urlQuery.amenities.map((value) => ({
      key: `amenity-${value}`,
      label: `Amenity: ${value}`,
      onRemove: () =>
        updateQuery((current) => ({
          ...current,
          amenities: current.amenities.filter((item) => item !== value),
          page: 1,
        })),
    })),
  ];

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
                  checked={urlQuery.categories.includes(category)}
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
                  checked={urlQuery.cities.includes(city)}
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
                    checked={urlQuery.amenities.includes(amenity)}
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
                value={urlQuery.minPrice ?? ""}
                min={meta?.available.minPrice ?? 0}
                max={meta?.available.maxPrice ?? 10000}
                placeholder={`Min (${meta?.available.minPrice ?? 0})`}
                onChange={(event) =>
                  updateQuery((current) => ({
                    ...current,
                    minPrice: event.target.value ? Number(event.target.value) : null,
                    page: 1,
                  }))
                }
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                value={urlQuery.maxPrice ?? ""}
                min={meta?.available.minPrice ?? 0}
                max={meta?.available.maxPrice ?? 10000}
                placeholder={`Max (${meta?.available.maxPrice ?? 0})`}
                onChange={(event) =>
                  updateQuery((current) => ({
                    ...current,
                    maxPrice: event.target.value ? Number(event.target.value) : null,
                    page: 1,
                  }))
                }
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
                value={urlQuery.minCapacity ?? ""}
                min={meta?.available.minCapacity ?? 0}
                max={meta?.available.maxCapacity ?? 500}
                placeholder="Min"
                onChange={(event) =>
                  updateQuery((current) => ({
                    ...current,
                    minCapacity: event.target.value ? Number(event.target.value) : null,
                    page: 1,
                  }))
                }
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                value={urlQuery.maxCapacity ?? ""}
                min={meta?.available.minCapacity ?? 0}
                max={meta?.available.maxCapacity ?? 500}
                placeholder="Max"
                onChange={(event) =>
                  updateQuery((current) => ({
                    ...current,
                    maxCapacity: event.target.value ? Number(event.target.value) : null,
                    page: 1,
                  }))
                }
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
              value={urlQuery.minRating ?? ""}
              onChange={(event) =>
                updateQuery((current) => ({
                  ...current,
                  minRating: event.target.value ? Number(event.target.value) : null,
                  page: 1,
                }))
              }
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
              value={urlQuery.availabilityDate}
              onChange={(event) =>
                updateQuery((current) => ({
                  ...current,
                  availabilityDate: event.target.value,
                  page: 1,
                }))
              }
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
        onOpenFilters={() => setIsFiltersModalOpen(true)}
      />

      {hasActiveFilters ? (
        <ActiveFilterChips
          searchQuery={urlQuery.q}
          chips={activeChips}
          onRemoveSearch={() => {
            setSearchInput("");
            updateQuery((current) => ({ ...current, q: "", page: 1 }));
          }}
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
        onClose={() => setIsFiltersModalOpen(false)}
        onClearAll={onClearAllFilters}
        renderSectionContent={renderFilterSectionContent}
      />
    </div>
  );
}
