"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  parseSpacesQueryFromSearchParams,
  toSpacesSearchParams,
} from "@/lib/discovery/query-state";
import type { SpacesQueryParams } from "@/types/api";
import type { FilterSectionKey } from "./_components/filterSections";

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface UseDiscoveryFiltersResult {
  searchInput: string;
  setSearchInput: (value: string) => void;
  urlQuery: SpacesQueryParams;
  updateQuery: (recipe: (current: SpacesQueryParams) => SpacesQueryParams) => void;
  isFiltersModalOpen: boolean;
  activeFilterSection: FilterSectionKey;
  setActiveFilterSection: (section: FilterSectionKey) => void;
  activeFilterValues: SpacesQueryParams;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  activeChips: ActiveChip[];
  openFiltersModal: () => void;
  closeFiltersModal: () => void;
  applyFilters: () => void;
  clearAllDraftFilters: () => void;
  toggleMultiSelect: (key: "categories" | "cities" | "amenities", value: string) => void;
  setDraftMinPrice: (value: string) => void;
  setDraftMaxPrice: (value: string) => void;
  setDraftMinCapacity: (value: string) => void;
  setDraftMaxCapacity: (value: string) => void;
  setDraftMinRating: (value: string) => void;
  setDraftAvailabilityDate: (value: string) => void;
  onRemoveSearch: () => void;
}

function toNullableNumber(value: string) {
  return value ? Number(value) : null;
}

export function useDiscoveryFilters(initialQuery: SpacesQueryParams): UseDiscoveryFiltersResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialQuery.q);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] =
    useState<FilterSectionKey>("category");
  const [draftFilters, setDraftFilters] = useState<SpacesQueryParams | null>(null);

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

  const activeFilterValues = isFiltersModalOpen && draftFilters ? draftFilters : urlQuery;

  const openFiltersModal = useCallback(() => {
    setDraftFilters(urlQuery);
    setIsFiltersModalOpen(true);
  }, [urlQuery]);

  const closeFiltersModal = useCallback(() => {
    setIsFiltersModalOpen(false);
    setDraftFilters(null);
  }, []);

  const applyFilters = useCallback(() => {
    if (!draftFilters) {
      closeFiltersModal();
      return;
    }

    updateQuery((current) => ({
      ...current,
      categories: draftFilters.categories,
      cities: draftFilters.cities,
      amenities: draftFilters.amenities,
      minPrice: draftFilters.minPrice,
      maxPrice: draftFilters.maxPrice,
      minCapacity: draftFilters.minCapacity,
      maxCapacity: draftFilters.maxCapacity,
      minRating: draftFilters.minRating,
      availabilityDate: draftFilters.availabilityDate,
      page: 1,
    }));
    closeFiltersModal();
  }, [closeFiltersModal, draftFilters, updateQuery]);

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

  const activeChips = useMemo<ActiveChip[]>(() => {
    return [
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
  }, [updateQuery, urlQuery]);

  const toggleMultiSelect = useCallback(
    (key: "categories" | "cities" | "amenities", value: string) => {
      setDraftFilters((current) => {
        if (!current) {
          return current;
        }

        const currentSet = new Set(current[key]);
        if (currentSet.has(value)) {
          currentSet.delete(value);
        } else {
          currentSet.add(value);
        }

        return {
          ...current,
          [key]: [...currentSet].toSorted(),
        };
      });
    },
    []
  );

  const clearAllDraftFilters = useCallback(() => {
    setDraftFilters((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        categories: [],
        cities: [],
        amenities: [],
        minPrice: null,
        maxPrice: null,
        minCapacity: null,
        maxCapacity: null,
        minRating: null,
        availabilityDate: "",
      };
    });
  }, []);

  const setDraftMinPrice = useCallback((value: string) => {
    setDraftFilters((current) =>
      current
        ? {
            ...current,
            minPrice: toNullableNumber(value),
          }
        : current
    );
  }, []);

  const setDraftMaxPrice = useCallback((value: string) => {
    setDraftFilters((current) =>
      current
        ? {
            ...current,
            maxPrice: toNullableNumber(value),
          }
        : current
    );
  }, []);

  const setDraftMinCapacity = useCallback((value: string) => {
    setDraftFilters((current) =>
      current
        ? {
            ...current,
            minCapacity: toNullableNumber(value),
          }
        : current
    );
  }, []);

  const setDraftMaxCapacity = useCallback((value: string) => {
    setDraftFilters((current) =>
      current
        ? {
            ...current,
            maxCapacity: toNullableNumber(value),
          }
        : current
    );
  }, []);

  const setDraftMinRating = useCallback((value: string) => {
    setDraftFilters((current) =>
      current
        ? {
            ...current,
            minRating: toNullableNumber(value),
          }
        : current
    );
  }, []);

  const setDraftAvailabilityDate = useCallback((value: string) => {
    setDraftFilters((current) =>
      current
        ? {
            ...current,
            availabilityDate: value,
          }
        : current
    );
  }, []);

  const onRemoveSearch = useCallback(() => {
    setSearchInput("");
    updateQuery((current) => ({ ...current, q: "", page: 1 }));
  }, [updateQuery]);

  return {
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
  };
}
