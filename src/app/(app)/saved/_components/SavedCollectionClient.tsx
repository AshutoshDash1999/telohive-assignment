"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { fetchSpaces } from "@/lib/api/spaces";
import { DEFAULT_SPACES_QUERY } from "@/lib/discovery/query-state";
import { useSavedSpacesStore } from "@/store/saved-spaces-store";
import type { Space } from "@/types/entities";
import { SavedEmptyState } from "./SavedEmptyState";
import { SavedSpacesGrid } from "./SavedSpacesGrid";
import { SavedToolbar } from "./SavedToolbar";

const SAVED_SPACES_QUERY_BASE = {
  ...DEFAULT_SPACES_QUERY,
  sort: "newest" as const,
  pageSize: 100,
};

function bySavedOrder(a: Space, b: Space, orderMap: Map<number, number>) {
  return (orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER);
}

async function fetchAllSpacesForSaved() {
  const firstPage = await fetchSpaces({
    ...SAVED_SPACES_QUERY_BASE,
    page: 1,
  });

  const pages: Space[][] = [firstPage.items];
  const { totalPages } = firstPage.meta;

  if (totalPages > 1) {
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        fetchSpaces({
          ...SAVED_SPACES_QUERY_BASE,
          page: index + 2,
        })
      )
    );
    pages.push(...remainingPages.map((page) => page.items));
  }

  return pages.flat();
}

export function SavedCollectionClient() {
  const savedSpaceIds = useSavedSpacesStore((state) => state.savedSpaceIds);
  const removeSavedSpace = useSavedSpacesStore((state) => state.removeSavedSpace);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const spacesQuery = useQuery({
    queryKey: ["spaces", "saved-all"],
    queryFn: fetchAllSpacesForSaved,
  });

  const allSpaces = spacesQuery.data;
  const savedOrderMap = useMemo(
    () => new Map(savedSpaceIds.map((id, index) => [id, index])),
    [savedSpaceIds]
  );

  const savedSpaces = useMemo(() => {
    if (savedOrderMap.size === 0) {
      return [];
    }

    const spaces = allSpaces ?? [];

    return spaces
      .filter((space) => savedOrderMap.has(space.id))
      .toSorted((a, b) => bySavedOrder(a, b, savedOrderMap));
  }, [allSpaces, savedOrderMap]);

  const categoryOptions = useMemo(() => {
    return [...new Set(savedSpaces.map((space) => space.category))].toSorted();
  }, [savedSpaces]);

  const cityOptions = useMemo(() => {
    return [...new Set(savedSpaces.map((space) => space.city))].toSorted();
  }, [savedSpaces]);

  const visibleSavedSpaces = useMemo(() => {
    const lowerSearch = searchValue.trim().toLowerCase();

    return savedSpaces.filter((space) => {
      const matchesSearch =
        lowerSearch.length === 0 ||
        space.name.toLowerCase().includes(lowerSearch) ||
        space.city.toLowerCase().includes(lowerSearch) ||
        space.description.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        selectedCategory.length === 0 || space.category === selectedCategory;
      const matchesCity = selectedCity.length === 0 || space.city === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [savedSpaces, searchValue, selectedCategory, selectedCity]);

  if (spacesQuery.isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        Loading saved spaces...
      </div>
    );
  }

  if (spacesQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load spaces.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-5">
      <SavedToolbar
        searchValue={searchValue}
        selectedCategory={selectedCategory}
        selectedCity={selectedCity}
        categories={categoryOptions}
        cities={cityOptions}
        resultsCount={visibleSavedSpaces.length}
        totalSavedCount={savedSpaces.length}
        onSearchChange={setSearchValue}
        onCategoryChange={setSelectedCategory}
        onCityChange={setSelectedCity}
        onClearFilters={() => {
          setSearchValue("");
          setSelectedCategory("");
          setSelectedCity("");
        }}
      />

      {visibleSavedSpaces.length > 0 ? (
        <SavedSpacesGrid spaces={visibleSavedSpaces} onRemove={removeSavedSpace} />
      ) : (
        <SavedEmptyState hasSavedSpaces={savedSpaces.length > 0} />
      )}
    </div>
  );
}
